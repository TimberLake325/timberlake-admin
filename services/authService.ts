"use server";

import bcrypt from 'bcryptjs';
import { dbConnect } from "@/lib/db";
import { Admin, AuditLog } from "@/lib/model";
import { sendEmail } from "./emailService";
import { otpTemplate, securityAlertTemplate, passwordSuccessTemplate } from "@/lib/emailTemplates";
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyToken, TokenPayload } from "@/lib/jwt";
import { cookies, headers } from "next/headers";
import crypto from 'crypto';

const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; 

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, { attempts: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    record.attempts++;
    if (record.attempts > RATE_LIMIT_ATTEMPTS) {
        return false;
    }

    return true;
}

function clearRateLimit(identifier: string) {
    rateLimitStore.delete(identifier);
}

async function auditLog(action: string, adminId: string | null, details: Record<string, any>, success: boolean) {
    try {
        await dbConnect();

        const logEntry = new AuditLog({
            action,
            adminId,
            details,
            success,
            ip: details.ip || 'unknown',
            userAgent: details.userAgent || 'unknown'
        });

        await logEntry.save();

        if (process.env.NODE_ENV !== 'production') {
            
        }
    } catch (error) {
        console.error("Audit log error:", error);
    }
}

export async function login(email: string, pass: string, userAgent?: string) {
    await dbConnect();

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    if (!email || !pass) {
        return { success: false, message: "Email and password are required" };
    }

    email = email.toLowerCase().trim();

    if (!checkRateLimit(email)) {
        await auditLog('LOGIN_ATTEMPT_RATE_LIMITED', null, { email, ip, userAgent }, false);
        return {
            success: false,
            message: "Too many login attempts. Please try again after 15 minutes."
        };
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            await auditLog('LOGIN_FAILED_INVALID_EMAIL', null, { email, ip, userAgent }, false);
            
            await maybeNotifyAdminsOfFailedLogin(email, 'Unknown email', ip);
            return { success: false, message: "Invalid credentials" };
        }

        const isMatch = await bcrypt.compare(pass, admin.password);
        if (!isMatch) {
            await auditLog('LOGIN_FAILED_INVALID_PASSWORD', admin._id.toString(), { email, ip, userAgent }, false);
            await maybeNotifyAdminsOfFailedLogin(email, 'Invalid password', ip);
            return { success: false, message: "Invalid credentials" };
        }

        const payload: TokenPayload = {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name
        };
        const accessToken = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);

        admin.refreshToken = refreshToken;
        admin.lastLoginAttempt = new Date();
        await admin.save();

        clearRateLimit(email);

        const cookieStore = await cookies();

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 
        });

        await auditLog('LOGIN_SUCCESS', admin._id.toString(), { email, userAgent }, true);

        return {
            success: true,
            message: "Logged in successfully",
            data: { id: admin._id.toString(), name: admin.name, email: admin.email }
        };
    } catch (error) {
        console.error("Login error:", error);
        await auditLog('LOGIN_ERROR', null, { email, error: String(error) }, false);
        return { success: false, message: "Server error during login" };
    }
}

export async function refreshAccessToken() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            return { success: false, message: "Refresh token not found" };
        }

        const payload = await verifyRefreshToken(refreshToken);
        if (!payload) {
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            return { success: false, message: "Invalid refresh token" };
        }

        await dbConnect();
        const admin = await Admin.findById(payload.id);
        if (!admin || admin.refreshToken !== refreshToken) {
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            return { success: false, message: "Refresh token revoked" };
        }

        const newAccessToken = await signAccessToken({
            id: payload.id,
            email: payload.email,
            name: payload.name
        });

        cookieStore.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60
        });

        await auditLog('TOKEN_REFRESHED', payload.id, {}, true);

        return { success: true, message: "Token refreshed successfully" };
    } catch (error) {
        console.error("Token refresh error:", error);
        return { success: false, message: "Failed to refresh token" };
    }
}

export async function logout(adminId?: string) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (refreshToken) {
            try {
                await dbConnect();
                const admin = await Admin.findById(adminId);
                if (admin) {
                    admin.refreshToken = undefined;
                    await admin.save();
                }
            } catch (error) {
                console.error("Error revoking refresh token:", error);
            }
        }

        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        if (adminId) {
            await auditLog('LOGOUT', adminId, {}, true);
        }

        return { success: true, message: "Logged out successfully" };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, message: "Logout failed" };
    }
}

async function maybeNotifyAdminsOfFailedLogin(attemptedEmail: string, reason: string, ip: string) {
    try {
        await dbConnect();

        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        const failureCount = await AuditLog.countDocuments({
            action: { $in: ['LOGIN_FAILED_INVALID_EMAIL', 'LOGIN_FAILED_INVALID_PASSWORD'] },
            $or: [{ 'details.email': attemptedEmail }, { ip }],
            timestamp: { $gt: thirtyMinsAgo }
        });

        if (failureCount >= 1) {
            const admins = await Admin.find({});
            const timestamp = new Date().toLocaleString();

            for (const admin of admins) {
                await sendEmail({
                    to: admin.email,
                    subject: "Security Alert: Failed Login Attempt",
                    html: securityAlertTemplate(admin.name, attemptedEmail, timestamp)
                });
            }
        }
    } catch (error) {
        console.error("Failed to process security alert throttling:", error);
    }
}

export async function requestOTP(email: string) {
    await dbConnect();

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    if (!email) {
        return { success: false, message: "Email is required" };
    }

    email = email.toLowerCase().trim();

    if (!checkRateLimit(`otp_${email}`)) {
        await auditLog('OTP_REQUEST_RATE_LIMITED', null, { email }, false);
        return { success: false, message: "Too many OTP requests. Please try again after 15 minutes." };
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            
            await auditLog('OTP_REQUEST_INVALID_EMAIL', null, { email }, false);
            return { success: true, message: "If the email exists, OTP has been sent" };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

        admin.otp = otp;
        admin.otpExpiry = otpExpiry;
        await admin.save();

        await sendEmail({
            to: admin.email,
            subject: "Your Password Reset OTP",
            html: otpTemplate(admin.name, otp)
        });

        await auditLog('OTP_SENT', admin._id.toString(), { email, ip, userAgent }, true);

        return { success: true, message: "OTP sent to your email" };
    } catch (error) {
        console.error("OTP Request error:", error);
        await auditLog('OTP_REQUEST_ERROR', null, { email, ip, userAgent, error: String(error) }, false);
        return { success: false, message: "Failed to send OTP" };
    }
}

export async function verifyOTP(email: string, otp: string) {
    await dbConnect();

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    if (!email || !otp) {
        return { success: false, message: "Email and OTP are required" };
    }

    email = email.toLowerCase().trim();

    if (!checkRateLimit(`otp_verify_${email}`)) {
        await auditLog('OTP_VERIFY_RATE_LIMITED', null, { email }, false);
        return { success: false, message: "Too many verification attempts. Please try again after 15 minutes." };
    }

    try {
        const admin = await Admin.findOne({ email, otp });
        if (!admin) {
            await auditLog('OTP_VERIFY_INVALID', null, { email, ip, userAgent }, false);
            return { success: false, message: "Invalid OTP" };
        }

        if (new Date() > admin.otpExpiry) {
            await auditLog('OTP_VERIFY_EXPIRED', admin._id.toString(), { email, ip, userAgent }, false);
            return { success: false, message: "OTP has expired" };
        }

        await auditLog('OTP_VERIFIED', admin._id.toString(), { email, ip, userAgent }, true);
        return { success: true, message: "OTP verified correctly" };
    } catch (error) {
        console.error("OTP verification error:", error);
        await auditLog('OTP_VERIFY_ERROR', null, { email, error: String(error) }, false);
        return { success: false, message: "Verification error" };
    }
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
    await dbConnect();

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    if (!email || !otp || !newPassword) {
        return { success: false, message: "All fields are required" };
    }

    if (newPassword.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long" };
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return {
            success: false,
            message: "Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)"
        };
    }

    email = email.toLowerCase().trim();

    try {
        const admin = await Admin.findOne({ email, otp });
        if (!admin || new Date() > admin.otpExpiry) {
            await auditLog('PASSWORD_RESET_INVALID', null, { email }, false);
            return { success: false, message: "Unauthorized or expired OTP" };
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        admin.password = hashed;
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        
        admin.refreshToken = undefined;
        await admin.save();

        await sendEmail({
            to: admin.email,
            subject: "Password Reset Successful",
            html: passwordSuccessTemplate(admin.name)
        });

        clearRateLimit(`otp_verify_${email}`);
        clearRateLimit(email);

        await auditLog('PASSWORD_RESET_SUCCESS', admin._id.toString(), { email, ip, userAgent }, true);

        return { success: true, message: "Password reset successful" };
    } catch (error) {
        console.error("Password reset error:", error);
        await auditLog('PASSWORD_RESET_ERROR', null, { email, ip, userAgent, error: String(error) }, false);
        return { success: false, message: "Failed to reset password" };
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function changePassword(oldPass: string, newPass: string) {
    await dbConnect();
    try {
        const session = await getSession();
        if (!session || !session.email) return { success: false, message: "Unauthorized: Session not found" };

        const admin = await Admin.findOne({ email: session.email });
        if (!admin) return { success: false, message: "Admin node not detected" };

        const isMatch = await bcrypt.compare(oldPass, admin.password);
        if (!isMatch) return { success: false, message: "Incorrect security passcode" };

        const hashed = await bcrypt.hash(newPass, 12);
        admin.password = hashed;
        await admin.save();

        await sendEmail({
            to: admin.email,
            subject: "Security Notification: Password Changed",
            html: passwordSuccessTemplate(admin.name)
        });

        return { success: true, message: "Central security passcode updated" };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { success: false, message: "Failed to synchronize new passcode" };
    }
}

export async function updateProfile(name: string, email: string) {
    await dbConnect();
    try {
        const session = await getSession();
        if (!session || !session.email) return { success: false, message: "Unauthorized: Session not found" };

        const admin = await Admin.findOne({ email: session.email });
        if (!admin) return { success: false, message: "Admin node not detected" };

        if (email !== admin.email) {
            const existing = await Admin.findOne({ email });
            if (existing) return { success: false, message: "Email already registered to another admin" };
        }

        admin.name = name;
        admin.email = email;
        await admin.save();

        const payload = { id: admin._id.toString(), email: admin.email, name: admin.name };
        const accessToken = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);

        admin.refreshToken = refreshToken;
        await admin.save();

        const cookieStore = await cookies();

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 
        });

        return {
            success: true,
            message: "Profile credentials updated locally",
            data: { name: admin.name, email: admin.email }
        };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, message: "Failed to update profile nodes" };
    }
}
