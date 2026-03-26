'use client';

import { useState, useEffect } from 'react';
import { Palette, Save, History, Monitor, Smartphone, Globe } from 'lucide-react';
import PageHeader from "@/components/global/PageHeader";
import { useToast } from "@/components/global/Toast";
import { getThemeConfig, saveThemeAction, restoreThemeAction } from "@/actions/theme";

interface ModeConfig {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
}

interface ThemeConfig {
    light: ModeConfig;
}

export default function ThemeSettingsPage() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<ThemeConfig[]>([]);
    const [config, setConfig] = useState<ThemeConfig>({
        light: {
            primary: '#7c3aed',
            secondary: '#e2e0ff',
            accent: '#06b6d4',
            background: '#fafaff',
            foreground: '#13111c',
        }
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await getThemeConfig();
            if (res.success) {
                setConfig(res.themeConfig);
                setHistory(res.history || []);
            }
        } catch (error) {
            showToast("Failed to fetch theme configuration", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await saveThemeAction(config);
            if (res.success) {
                showToast("Theme synchronized successfully", "success");
                setHistory(res.history || []);
            } else {
                showToast(res.error || "Failed to save configuration", "error");
            }
        } catch (error) {
            showToast("Error saving theme configuration", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestore = async (index: number) => {
        setIsSaving(true);
        try {
            const res = await restoreThemeAction(index);
            if (res.success) {
                setConfig(res.themeConfig);
                setHistory(res.history || []);
                showToast("Theme restored", "success");
            }
        } catch (error) {
            showToast("Error restoring theme", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const updateColor = (key: keyof ModeConfig, value: string) => {
        setConfig({
            ...config,
            light: {
                ...config.light,
                [key]: value
            }
        });
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Initializing_Chroma_Engine...</div>;
    }

    const currentPreview = config.light;

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
            <PageHeader
                description="Manage global brand variables for the website theme."
                icon={Palette}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="xl:col-span-7 space-y-8">
                    <form onSubmit={handleSave} className="space-y-8">
                        <section className="bg-white border border-black/[0.08] rounded-[2rem] p-6 md:p-10 shadow-sm">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-3 bg-black text-white rounded-xl shadow-lg transform -rotate-3">
                                    <Palette size={20} />
                                </div>
                                <h2 className="text-lg font-black uppercase tracking-tighter italic">BRAND_SPECTRUM</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { key: 'primary', label: 'Primary Brand' },
                                    { key: 'secondary', label: 'Secondary Tone' },
                                    { key: 'accent', label: 'Accent Highlight' },
                                    { key: 'background', label: 'Core Background' },
                                    { key: 'foreground', label: 'Text/Foreground' },
                                ].map((field) => (
                                    <div key={field.key} className="group space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">{field.label}</label>
                                        <div className="flex items-center gap-3 p-2 bg-black/[0.02] border border-black/[0.05] rounded-2xl group-hover:border-black/20 transition-all">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-black/10 shrink-0">
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer border-none"
                                                    value={config.light[field.key as keyof ModeConfig]}
                                                    onChange={(e) => updateColor(field.key as keyof ModeConfig, e.target.value)}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-none text-xs font-mono font-bold uppercase focus:ring-0 placeholder:opacity-20"
                                                value={config.light[field.key as keyof ModeConfig]}
                                                onChange={(e) => updateColor(field.key as keyof ModeConfig, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-black text-white rounded-2xl py-5 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSaving ? 'Deploying_Changes...' : 'Apply Global Spectrum'}
                            <Save size={16} />
                        </button>
                    </form>

                    <section className="bg-white border border-black/[0.08] rounded-[2rem] p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-neutral-100 text-black rounded-xl border border-black/5">
                                <History size={20} />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-tighter italic">Deployment_Log</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {history.length === 0 ? (
                                <p className="text-center py-8 text-[10px] uppercase font-bold opacity-20 italic">No historical snapshots found</p>
                            ) : (
                                history.map((h, i) => (
                                    <div key={i} className="flex flex-wrap items-center justify-between p-4 bg-neutral-50 border border-black/[0.04] rounded-2xl gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                {[
                                                    h.light?.primary || '#7c3aed',
                                                    h.light?.accent || '#06b6d4'
                                                ].map((c, idx) => (
                                                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                            <div className="text-[9px] font-bold opacity-30 text-center leading-tight uppercase">
                                                Snapshot<br />V{history.length - i}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRestore(i)}
                                            className="px-5 py-2 bg-white border border-black/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                        >
                                            Rollback
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="xl:col-span-5">
                    <div className="xl:sticky xl:top-8 space-y-4">
                        <div className="bg-[#0a0a0c] rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/5 overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Monitor size={16} className="text-white/40" />
                                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Real_Time_Render</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                </div>
                            </div>

                            <div
                                className="rounded-3xl p-6 md:p-8 space-y-8 min-h-[400px] transition-all duration-500 ease-in-out"
                                style={{ backgroundColor: currentPreview.background }}
                            >
                                <nav className="flex items-center justify-between pb-4 border-b border-black/[0.03]">
                                    <div className="text-sm font-black tracking-tighter" style={{ color: currentPreview.foreground }}>
                                        TIMBERLAKE<span style={{ color: currentPreview.primary }}>.</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: currentPreview.foreground }} />
                                </nav>

                                <div className="space-y-4 text-center py-6">
                                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none" style={{ color: currentPreview.foreground }}>
                                        Design <span style={{ color: currentPreview.primary }}>Manifesto.</span>
                                    </h3>
                                    <p className="text-[10px] opacity-40 mx-auto max-w-[220px]" style={{ color: currentPreview.foreground }}>
                                        Engineering the intersection of aesthetic and high-performance digital logic.
                                        (Dark mode deactivated)
                                    </p>
                                    <div className="flex justify-center gap-3 pt-4">
                                        <div className="px-6 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: currentPreview.primary }}>Initialize</div>
                                        <div className="px-6 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-black/5" style={{ color: currentPreview.foreground }}>Docs</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl border border-black/5" style={{ backgroundColor: currentPreview.accent + '10' }}>
                                        <div className="w-5 h-5 rounded-md mb-3" style={{ backgroundColor: currentPreview.accent }} />
                                        <div className="h-1.5 w-10 bg-black/10 rounded-full mb-1" />
                                        <div className="h-1 w-full bg-black/5 rounded-full" />
                                    </div>
                                    <div className="p-4 rounded-xl border border-black/5" style={{ backgroundColor: '#64748b' + '20' }}>
                                        <div className="w-5 h-5 rounded-md mb-3" style={{ backgroundColor: '#64748b' }} />
                                        <div className="h-1.5 w-10 bg-black/10 rounded-full mb-1" />
                                        <div className="h-1 w-full bg-black/5 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between items-center opacity-20">
                                <div className="flex gap-4">
                                    <Globe size={12} className="text-white" />
                                    <Smartphone size={12} className="text-white" />
                                </div>
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">TIMBERLAKE_Engine_v4.5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
