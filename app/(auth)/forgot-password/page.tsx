'use client';

import { useRouter } from "next/navigation";
import { useState } from 'react';
import { FiArrowRight, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { requestOTP, verifyOTP, resetPassword } from '@/services/authService';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); 
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage('');
        try {
            const res = await requestOTP(email);
            if (res.success) {
                setStep(2);
                setSuccessMessage(res.message);
            } else {
                setErrorMessage(res.message);
            }
        } catch (error) {
            setErrorMessage('Failed to request OTP');
        } finally {
            setIsPending(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage('');
        try {
            const res = await verifyOTP(email, otp);
            if (res.success) {
                setStep(3);
                setSuccessMessage(res.message);
            } else {
                setErrorMessage(res.message);
            }
        } catch (error) {
            setErrorMessage('OTP Verification failed');
        } finally {
            setIsPending(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        setIsPending(true);
        setErrorMessage('');
        try {
            const res = await resetPassword(email, otp, newPassword);
            if (res.success) {
                setStep(4); 
            } else {
                setErrorMessage(res.message);
            }
        } catch (error) {
            setErrorMessage('Password reset failed');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2563eb]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-white border border-black/[0.06] rounded-[2rem] p-12 shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 text-xl font-black">
                        Y
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                        Reset Password
                    </h1>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">
                        {step === 1 && "Start recovery via email"}
                        {step === 2 && "Enter verification code"}
                        {step === 3 && "Create your new password"}
                        {step === 4 && "Recovery complete"}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2563eb]/50 transition-all"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="enter your email"
                                    required
                                />
                                <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isPending ? 'Sending...' : 'Send Reset OTP'}
                            {!isPending && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">6-Digit OTP</label>
                            <input
                                className="w-full bg-black/[0.02] border border-black/[0.06] rounded-xl px-4 py-3 text-center text-3xl font-black tracking-[10px] focus:outline-none focus:border-[#2563eb]/50 transition-all text-[#2563eb]"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                required
                            />
                            <p className="text-[9px] text-center mt-4 text-black/40 font-bold uppercase tracking-widest">
                                Check your email for the verification code
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isPending ? 'Verifying...' : 'Verify OTP'}
                            {!isPending && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/[0.02] border border-black/[0.06] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2563eb]/50 transition-all"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-black/[0.02] border border-black/[0.06] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2563eb]/50 transition-all"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Reset My Password'}
                            {!isPending && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-50 rounded-full text-green-500">
                                <FiCheckCircle size={48} />
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-black uppercase tracking-tight">Security Successful</h2>
                        <p className="text-xs text-black/50 font-medium">Your password has been reset. You can now log in with your new credentials.</p>
                        <Link
                            href="/login"
                            className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group inline-block"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}

                {(errorMessage || successMessage) && step !== 4 && (
                    <div className="mt-6 flex h-8 items-end space-x-1" aria-live="polite">
                        {errorMessage && (
                            <p className="text-red-500 text-[10px] font-bold uppercase bg-red-50 w-full text-center py-2 rounded-lg">{errorMessage}</p>
                        )}
                        {successMessage && !errorMessage && (
                            <p className="text-green-600 text-[10px] font-bold uppercase bg-green-50 w-full text-center py-2 rounded-lg">{successMessage}</p>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-black/[0.04] text-center">
                    <Link href="/login" className="text-[10px] text-black/40 font-black uppercase hover:text-[#2563eb] transition-colors">
                        Cancel and return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
