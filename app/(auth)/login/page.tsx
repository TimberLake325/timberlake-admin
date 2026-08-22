'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { FiArrowRight, FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import { login } from '@/services/authService';
import Link from 'next/link';
import Image from "next/image";

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const validateForm = (email: string, password: string) => {
        const errors: Record<string, string> = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setValidationErrors({});

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string || '').trim();
        const password = formData.get('password') as string || '';

        const errors = validateForm(email, password);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsPending(true);

        try {
            const response = await login(email, password, navigator.userAgent);
            if (response.success) {
                const searchParams = new URLSearchParams(window.location.search);
                const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
                router.push(callbackUrl);
            } else {
                setErrorMessage(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Login failed. Please check your connection and try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 relative overflow-hidden ">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none  bg-white">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2563eb]/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-white border border-black/[0.06] rounded-[2rem] p-12 shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <div className="w-fit h-fit p-2 text-white rounded-xl flex items-center justify-center mx-auto mb-6  text-xl font-black">
                        <Image src="/images/logo.png" alt="Logo" width={180} height={180} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                        Timberlake<span className="text-[#2563eb]">_</span>Admin
                    </h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6" noValidate>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    className={`w-full bg-black/[0.02] border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all text-black placeholder:text-black/20 ${validationErrors.email
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-black/[0.06] focus:border-[#2563eb]/50'
                                        }`}
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    required
                                    disabled={isPending}
                                    autoComplete="email"
                                />
                                <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FiAlertCircle size={14} /> {validationErrors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black" htmlFor="password">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    className={`w-full bg-black/[0.02] border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all text-black placeholder:text-black/20 ${validationErrors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-black/[0.06] focus:border-[#2563eb]/50'
                                        }`}
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    disabled={isPending}
                                    autoComplete="current-password"
                                    minLength={6}
                                />
                                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FiAlertCircle size={14} /> {validationErrors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[11px] tracking-widest hover:bg-[#2563eb] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-busy={isPending}
                        >
                            {isPending ? 'Authenticating...' : 'Sign In'}
                            {!isPending && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>

                    <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <p className="text-red-500 text-xs font-medium w-full text-center bg-red-50 py-2 rounded-lg flex items-center justify-center gap-2">
                                <FiAlertCircle size={14} /> {errorMessage}
                            </p>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
}
