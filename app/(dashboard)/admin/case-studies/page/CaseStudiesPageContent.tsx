"use client";

import LexicalEditor from "@/components/global/LexicalEditor";
import SeoComponent from '@/components/global/Seo';
import { useToast } from '@/components/global/Toast';
import React, { useEffect, useState } from 'react';
import { FiLayout, FiSave } from 'react-icons/fi';
import PageHeader from '@/components/global/PageHeader';

const InputField = ({ label, value, onChange, placeholder, isTextArea = false, isRichText = false }: any) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        {isRichText ? (
            <LexicalEditor
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        ) : isTextArea ? (
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
            />
        ) : (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
            />
        )}
    </div>
);

const CaseStudiesPageContent = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<any>({
        hero: {
            title: '',
            subtitle: '',
            description: ''
        },
        metadata: {
            title: '',
            description: '',
            keywords: '',
            image: '',
            ogImage: ''
        }
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/case-studies-page');
                const data = await res.json();
                if (data.success && data.data) {
                    setFormData(data.data);
                }
            } catch (error) {
                console.error("Failed to load page data");
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, []);

    const handleHeroChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const handleSeoChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            metadata: { ...prev.metadata, [field]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/case-studies-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                showToast('Page settings updated successfully', 'success');
            } else {
                showToast(data.message || 'Failed to update settings', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-black/40 text-xs font-mono">Loading configuration...</div>;

    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto">
            <PageHeader
                description="Manage the SEO and Hero section of the main case studies page."
                onSave={() => handleSubmit({ preventDefault: () => { } } as any)}
                saving={loading}
                actionLabel="Save Changes"
                icon={FiSave}
            />

            <div className="bg-white p-8 mt-8 rounded-[2.5rem] shadow-sm border border-black/[0.03] mb-8">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-black/[0.05]">
                    <div className="w-12 h-12 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                        <FiLayout size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-black uppercase tracking-tight">Hero Section</h3>
                        <p className="text-[10px] text-black/40 font-medium">Configure the main banner of the case studies page</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div className="md:col-span-2">
                        <InputField
                            label="Main Title"
                            value={formData.hero?.title}
                            onChange={(v: string) => handleHeroChange('title', v)}
                            placeholder="e.g. Our Case Studies"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InputField
                            label="Subtitle / Tagline"
                            value={formData.hero?.subtitle}
                            onChange={(v: string) => handleHeroChange('subtitle', v)}
                            placeholder="e.g. Real problems. Real solutions."
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InputField
                            label="Description"
                            value={formData.hero?.description}
                            onChange={(v: string) => handleHeroChange('description', v)}
                            placeholder="Brief introduction..."
                            isRichText
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
                <SeoComponent
                    data={formData.metadata}
                    onChange={handleSeoChange}
                />
            </div>
        </form>
    );
};

export default CaseStudiesPageContent;
