'use client';

import { useState, useEffect } from 'react';
import { FiMail, FiSave, FiSettings, FiServer, FiShield, FiKey } from 'react-icons/fi';
import PageHeader from "@/components/global/PageHeader";
import { getSMTPConfig, saveSMTPConfig } from "@/services/configService";
import { useToast } from "@/components/global/Toast";

export default function SmtpConfigPage() {
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [smtp, setSmtp] = useState({
        host: '',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    });

    useEffect(() => {
        const fetchConfig = async () => {
            const res = await getSMTPConfig();
            if (res.success && res.data) {
                setSmtp(res.data);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await saveSMTPConfig(smtp);
            if (res.success) {
                showToast(res.message, "success");
            } else {
                showToast(res.message, "error");
            }
        } catch (error) {
            showToast("Failed to update SMTP configuration", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <PageHeader
                description="Manage global mail server credentials and security protocols"
                icon={FiMail}
            />

            <div className="bg-white border border-black/[0.06] rounded-[2.5rem] p-12 shadow-sm relative overflow-hidden">

                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563eb]/[0.02] rounded-full translate-x-32 -translate-y-32" />

                <form onSubmit={handleSave} className="relative z-10 space-y-10">


                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/[0.04] pb-4 mb-8">
                            <FiServer className="text-[#2563eb]" size={20} />
                            <h3 className="text-xs font-black uppercase tracking-widest text-black/60">Server Architecture</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 ml-1">SMTP Hostname</label>
                                <input
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all font-mono"
                                    value={smtp.host}
                                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                                    placeholder="smtp.gmail.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 ml-1">Active Port</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                    value={smtp.port}
                                    onChange={(e) => setSmtp({ ...smtp, port: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setSmtp({ ...smtp, secure: !smtp.secure })}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest ${smtp.secure
                                    ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20'
                                    : 'bg-white border-black/[0.06] text-black/40 hover:border-black/20'
                                    }`}
                            >
                                <FiShield />
                                {smtp.secure ? 'SSL/TLS Enabled' : 'Standard Connection'}
                            </button>
                            <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">
                                {smtp.secure ? 'Best for Port 465' : 'Recommended for Port 587 (STARTTLS)'}
                            </p>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/[0.04] pb-4 mb-8">
                            <FiKey className="text-[#2563eb]" size={20} />
                            <h3 className="text-xs font-black uppercase tracking-widest text-black/60">Identity & Credentials</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 ml-1">Authentication User</label>
                                <input
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all font-mono"
                                    value={smtp?.auth?.user}
                                    onChange={(e) => setSmtp({ ...smtp, auth: { ...smtp.auth, user: e.target.value } })}
                                    placeholder="user@gmail.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 ml-1">Application Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-black/[0.02] border border-black/[0.06] rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2563eb]/50 focus:bg-white transition-all"
                                    value={smtp?.auth?.pass}
                                    onChange={(e) => setSmtp({ ...smtp, auth: { ...smtp.auth, pass: e.target.value } })}
                                    placeholder="••••••••••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>


                    <div className="pt-10 border-t border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] max-w-sm text-center sm:text-left">
                            Credentials are encrypted at rest and never exposed to the client-side browser directly.
                        </p>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-auto bg-black text-white rounded-2xl px-12 py-5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#2563eb] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-2xl shadow-black/10"
                        >
                            {isSaving ? 'Synchronizing...' : 'Deploy Configuration'}
                            {!isSaving && <FiSave className="group-hover:scale-110 transition-transform" size={16} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
