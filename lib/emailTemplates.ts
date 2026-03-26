export const otpTemplate = (name: string, otp: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
    <h2 style="color: #333; text-align: center;">Verify Your Identity</h2>
    <p style="color: #555;">Hello <strong>${name}</strong>,</p>
    <p style="color: #555;">You requested a password reset for your admin account. Please use the following 6-digit OTP to proceed:</p>
    <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; background: #f3f4f6; border-radius: 8px;">
            ${otp}
        </span>
    </div>
    <p style="color: #555; font-size: 14px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Timberlake Admin Dashboard. All rights reserved.</p>
</div>
`;

export const securityAlertTemplate = (adminName: string, attemptedEmail: string, timestamp: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; background: #fffaf0; rounded: 12px;">
    <h2 style="color: #dc2626; text-align: center;">Security Alert: Failed Login Attempt</h2>
    <p style="color: #555;">Hello <strong>${adminName}</strong>,</p>
    <p style="color: #555;">This is an automated security notification. There was a failed login attempt on the admin dashboard with the following details:</p>
    <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; margin: 20px 0;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Attempted Email:</strong> ${attemptedEmail}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${timestamp}</p>
    </div>
    <p style="color: #555; font-size: 14px;">If this was not you, please ensure your account is secure. Repeated failures may trigger temporary locking.</p>
    <hr style="border: none; border-top: 1px solid #fee2e2; margin: 20px 0;">
    <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Timberlake Admin Security. All rights reserved.</p>
</div>
`;

export const passwordSuccessTemplate = (name: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
    <h2 style="color: #10b981; text-align: center;">Password Changed Successfully</h2>
    <p style="color: #555;">Hello <strong>${name}</strong>,</p>
    <p style="color: #555;">Your administrator password has been successfully updated.</p>
    <p style="color: #555; font-size: 14px;">If you did not perform this change, please contact support immediately to secure your account.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Timberlake Admin Dashboard. All rights reserved.</p>
</div>
`;
