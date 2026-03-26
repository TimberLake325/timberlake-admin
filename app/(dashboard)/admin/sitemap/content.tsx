"use client";

import React, { useState } from 'react';
import { updateSitemapLink, removeSitemapLink, updateSitemapHeader } from '@/services/sitemapService';
import { useRouter } from 'next/navigation';
import { FiPlus, FiX, FiEdit3, FiTrash2, FiLink, FiCheck, FiSave, FiSettings } from 'react-icons/fi';
import { useToast } from '@/components/global/Toast';

const HeaderSettings = ({ sitemap, onUpdate }: { sitemap: any, onUpdate: (data: any) => void }) => {
    const [title, setTitle] = useState(sitemap?.title || '');
    const [subtitle, setSubtitle] = useState(sitemap?.subtitle || '');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    React.useEffect(() => {
        if (sitemap) {
            setTitle(sitemap.title || '');
            setSubtitle(sitemap.subtitle || '');
        }
    }, [sitemap]);

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }
        setLoading(true);

        const res = await updateSitemapHeader({ title, subtitle });
        setLoading(false);
        if (res.success) {
            onUpdate(res.data);

            showToast("Sitemap header saved successfully!", "success");
        } else {

            showToast("Error: " + res.message, "error");
        }
    };

};

export default function SitemapContent({ initialSitemap }: { initialSitemap: any }) {
    const router = useRouter();
    const [sitemap, setSitemap] = useState(initialSitemap);
    const [loading, setLoading] = useState(false);

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', href: '', description: '' });
    const [editMode, setEditMode] = useState(false);

    const handleUpdateLink = async (sectionTitle: string) => {
        if (!formData.name || !formData.href) return;
        setLoading(true);
        const res = await updateSitemapLink(sectionTitle, formData);
        setLoading(false);
        if (res.success) {
            setSitemap(res.data);
            setFormData({ name: '', href: '', description: '' });
            setEditMode(false);
            setActiveSection(null);
            router.refresh();
        }
    };

    const handleRemoveLink = async (sectionTitle: string, href: string) => {
        if (!confirm("Remove this architectural link?")) return;
        setLoading(true);
        const res = await removeSitemapLink(sectionTitle, href);
        setLoading(false);
        if (res.success) {
            setSitemap(res.data);
            router.refresh();
        }
    };

    return (
        <div className="space-y-12">

            <div className="space-y-12">
                {sitemap?.sections?.map((section: any, idx: number) => (
                    <div key={idx} className="bg-white border border-black/6 rounded-4xl overflow-hidden shadow-sm">


                        <div className="p-8 border-b border-black/4 flex justify-between items-center bg-black/1">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-[#2563eb] tracking-[0.3em]">0{idx + 1}</span>
                                <h2 className="text-sm font-black text-black uppercase tracking-widest">{section.title}</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setFormData({ name: '', href: '', description: '' });
                                    setEditMode(false);
                                    setActiveSection(activeSection === section.title ? null : section.title);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === section.title
                                    ? 'bg-black text-white'
                                    : 'bg-black/3 text-black hover:bg-[#2563eb] hover:text-white'
                                    }`}
                            >
                                {activeSection === section.title ? <FiX size={14} /> : <FiPlus size={14} />}
                                {activeSection === section.title ? 'Close' : 'Add Link'}
                            </button>
                        </div>


                        {activeSection === section.title && (
                            <div className="p-8 bg-[#2563eb]/5 border-b border-[#2563eb]/10 animate-in slide-in-from-top duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Label</label>
                                        <input
                                            className="w-full p-4 bg-white border border-black/8 rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563eb] transition-all"
                                            placeholder="E.g. About Us"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Path</label>
                                        <input
                                            className="w-full p-4 bg-white border border-black/8 rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563eb] transition-all"
                                            placeholder="/about"
                                            value={formData.href}
                                            onChange={e => setFormData({ ...formData, href: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Notes</label>
                                        <input
                                            className="w-full p-4 bg-white border border-black/8 rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563eb] transition-all"
                                            placeholder="Optional description"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUpdateLink(section.title)}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#2563eb]/20"
                                >
                                    <FiCheck size={14} /> {loading ? 'Syncing...' : (editMode ? 'Update Reference' : 'Append to Sitemap')}
                                </button>
                            </div>
                        )}


                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-black/3">
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">Resource</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">Path</th>
                                        <th className="px-8 py-5 text-right text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/2">
                                    {section.links?.map((link: any, lIdx: number) => (
                                        <tr key={lIdx} className="group hover:bg-black/1 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="text-[11px] font-black text-black uppercase tracking-tight">{link.name}</p>
                                                <p className="text-[9px] text-black/30 font-bold italic uppercase tracking-tighter">{link.description || 'No metadata'}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-black/40 group-hover:text-[#2563eb] transition-colors text-[10px] font-bold">
                                                    <FiLink size={12} />
                                                    <span>{link.href}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setFormData({ name: link.name, href: link.href, description: link.description || '' });
                                                        setActiveSection(section.title);
                                                        setEditMode(true);
                                                    }}
                                                    className="p-2 text-black/20 hover:text-black transition-colors"
                                                >
                                                    <FiEdit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveLink(section.title, link.href)}
                                                    className="p-2 text-black/20 hover:text-red-500 transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}