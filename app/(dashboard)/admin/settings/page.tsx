'use client';

import { useState, useEffect } from 'react';
import { FiLock, FiMail, FiSave, FiCheckCircle, FiAlertCircle, FiSettings, FiUser, FiPower } from 'react-icons/fi';
import PageHeader from "@/components/global/PageHeader";
import { changePassword, updateProfile, getSession } from "@/services/authService";
import { clearCache } from "@/actions/revalidate";
import { useToast } from "@/components/global/Toast";
import { FiRefreshCw, FiZap } from 'react-icons/fi';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isClearingCache, setIsClearingCache] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            const session = await getSession();
            if (session) {
                setProfile({
                    name: (session.name as string) || '',
                    email: (session.email as string) || ''
                });
            }
        };
        fetchUser();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const res = await updateProfile(profile.name, profile.email);
            if (res.success) {
                showToast(res.message, "success");

                window.location.reload();
            } else {
                showToast(res.message, "error");
            }
        } catch (error) {
            showToast("Failed to update profile", "error");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast("Passwords do not match", "error");
            return;
        }

        setIsSavingPassword(true);
        try {
            const res = await changePassword(passwords.old, passwords.new);

            if (res.success) {
                showToast(res.message, "success");
                setPasswords({ old: '', new: '', confirm: '' });
            } else {
                showToast(res.message, "error");
            }
        } catch (error) {
            showToast("Failed to update password", "error");
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleClearCache = async () => {
        setIsClearingCache(true);
        try {
            const res = await clearCache();
            if (res.success) {
                showToast(res.message, "success");
            } else {
                showToast(res.message, "error");
            }
        } catch (error) {
            showToast("Failed to trigger revalidation", "error");
        } finally {
            setIsClearingCache(false);
        }
    };

    return (
        <div className="p-8 w-full mx-auto space-y-12">
            <PageHeader
                description="Manage your administrator credentials and platform access"
                icon={FiLock}
            />

            <div className="bg-white border border-black/[0.06] rounded-[2.5rem] p-12 shadow-sm relative overflow-hidden group">

                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563eb]/[0.02] rounded-full translate-x-24 -translate-y-24 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-2xl transform -rotate-3">
                            <FiUser />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none mb-1">Profile_Identity</h2>
                            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Manage Administrator Persona</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-1">Administrator Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-1">Access Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="w-full bg-black text-white rounded-2xl py-5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-2xl shadow-black/10"
                            >
                                {isSavingProfile ? 'Syncing Profile...' : 'Update Identity'}
                                {!isSavingProfile && <FiSave className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-[2.5rem] p-12 shadow-sm relative overflow-hidden group">

                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563eb]/[0.02] rounded-full translate-x-24 -translate-y-24 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-2xl transform -rotate-3">
                            <FiLock />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none mb-1">Passcode_Update</h2>
                            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Refresh Core Security Access</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-1">Universal Core Passcode (Current)</label>
                                <input
                                    type="password"
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                    value={passwords.old}
                                    onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-1">New Terminal Secret</label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 ml-1">Confirm Secret</label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                className="w-full bg-black text-white rounded-2xl py-5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-2xl shadow-black/10"
                            >
                                {isSavingPassword ? 'Updating Core...' : 'Sync New Passcode'}
                                {!isSavingPassword && <FiSave className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>


            <div className="bg-white border border-black/[0.06] rounded-[2.5rem] p-12 shadow-sm relative overflow-hidden group">

                <div className="absolute top-0 right-0 w-48 h-48 bg-[#ef4444]/[0.02] rounded-full translate-x-24 -translate-y-24 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-2xl transform -rotate-3">
                            <FiZap />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none mb-1">Cache_Management</h2>
                            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Control Cache Infrastructure</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-black/[0.02] border border-black/[0.06] rounded-2xl p-6">
                            <h3 className="text-sm font-black uppercase tracking-wider mb-2">Cache Purge</h3>
                            <p className="text-xs text-black/50 font-medium leading-relaxed mb-6">
                                Revalidate all server-rendered pages and data caches across the website.
                                Use this after making content updates that need to be visible immediately.
                            </p>

                            <button
                                onClick={handleClearCache}
                                disabled={isClearingCache}
                                className="w-full md:w-auto bg-black text-white rounded-2xl px-10 py-5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-2xl shadow-black/10"
                            >
                                {isClearingCache ? 'Clearing Cache...' : 'Clear Cache'}
                                {!isClearingCache && <FiRefreshCw className={`group-hover:rotate-180 transition-transform duration-500`} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
