"use client";

import { useToast } from '@/components/global/Toast';
import { createCaseStudy, updateCaseStudy } from '@/services/caseStudyService';
import React, { useEffect, useState } from 'react';
import { FiCheck, FiLink, FiX, FiType, FiFileText } from 'react-icons/fi';
import ImageField from '@/components/global/ImageField';
import SeoComponent from '@/components/global/Seo';
import { useRouter } from 'next/navigation';
import LexicalEditor from '@/components/global/LexicalEditor';

interface CaseStudyFormProps {
    editingItem?: any;
}

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, isTextArea = false, isRichText = false, rows = 4 }: any) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-4 text-black/20" size={14} />}
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
                    rows={rows}
                    className="w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
                />
            ) : (
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium`}
                />
            )}
        </div>
    </div>
);

const CaseStudyForm = ({ editingItem }: CaseStudyFormProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<any>(editingItem || {
        id: '',
        title: '',
        slug: '',
        industry: '',
        summary: '',
        challenge: '',
        solution: '',
        result: '',
        technologies: [],
        image: '',
        link: '',
        isActive: true,
        metadata: {
            title: '',
            description: '',
            keywords: '',
            image: '',
            ogImage: ''
        }
    });

    const [techInput, setTechInput] = useState(
        editingItem?.technologies && Array.isArray(editingItem.technologies)
            ? editingItem.technologies.join('\n')
            : ''
    );

    useEffect(() => {
        if (editingItem) {
            setFormData(editingItem);
            if (editingItem.technologies && Array.isArray(editingItem.technologies)) {
                setTechInput(editingItem.technologies.join('\n'));
            } else {
                setTechInput('');
            }
        } else {

            if (!formData.id) {
                setFormData((prev: any) => ({ ...prev, id: Date.now().toString() }));
            }
        }
    }, [editingItem]);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleTitleChange = (val: string) => {
        setFormData((prev: any) => ({
            ...prev,
            title: val,
            slug: !editingItem ? generateSlug(val) : prev.slug || generateSlug(val)
        }));
    };

    const handleSeoChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            metadata: {
                ...(prev.metadata || {}),
                [field]: value
            }
        }));
    };

    const handleBack = () => {
        router.push('/admin/case-studies');
    };

    const handleTechChange = (val: string) => {
        setTechInput(val);
        const techArray = val.split('\n').filter(t => t.trim() !== '');
        setFormData((prev: any) => ({ ...prev, technologies: techArray }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (editingItem?._id) {
                res = await updateCaseStudy(editingItem._id, formData);
            } else {
                res = await createCaseStudy(formData);
            }

            if (res.success) {
                showToast(res.message, 'success');
                handleBack();
            } else {
                showToast(res.message, 'error');
            }
        } catch (error) {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <div className="w-full mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter">
                            {editingItem ? 'Edit' : 'Create New'} Case Study
                        </h2>
                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">
                            Showcase your success stories
                        </p>
                    </div>
                    <button type="button" onClick={handleBack} className="p-3 bg-white border border-black/[0.05] rounded-2xl hover:bg-black/[0.08] transition-colors shadow-sm">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="md:col-span-1">
                            <InputField
                                label="Custom ID (Required)"
                                value={formData.id}
                                onChange={(v: string) => setFormData({ ...formData, id: v })}
                                placeholder="e.g. 1767253985678"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <input type="hidden" /> { }
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="Case Study Title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="e.g. Enterprise Web Platform Modernization"
                                icon={FiType}
                            />
                        </div>
                        <InputField
                            label="URL Slug"
                            value={formData.slug}
                            onChange={(v: string) => setFormData({ ...formData, slug: v })}
                            placeholder="enterprise-web-platform"
                            icon={FiLink}
                        />

                        <div className="md:col-span-1">
                            <InputField
                                label="Industry"
                                value={formData.industry}
                                onChange={(v: string) => setFormData({ ...formData, industry: v })}
                                placeholder="e.g. Technology"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <ImageField
                                label="Featured Image"
                                value={formData.image || ''}
                                onChange={(url: string) => setFormData((prev: any) => ({ ...prev, image: url }))}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <InputField
                                label="Technologies (One per line)"
                                value={techInput}
                                onChange={handleTechChange}
                                placeholder="React\nNode.js\nAWS"
                                isTextArea
                                rows={6}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <InputField
                                label="External Link (Optional)"
                                value={formData.link}
                                onChange={(v: string) => setFormData({ ...formData, link: v })}
                                placeholder="e.g. /case-studies/enterprise-web-platform"
                                icon={FiLink}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="Summary"
                                value={formData.summary}
                                onChange={(v: string) => setFormData({ ...formData, summary: v })}
                                placeholder="Brief summary of the case study..."
                                isRichText
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="The Challenge"
                                value={formData.challenge}
                                onChange={(v: string) => setFormData({ ...formData, challenge: v })}
                                placeholder="What was the problem?"
                                isRichText
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="The Solution"
                                value={formData.solution}
                                onChange={(v: string) => setFormData({ ...formData, solution: v })}
                                placeholder="How did you solve it?"
                                isRichText
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="The Result"
                                value={formData.result}
                                onChange={(v: string) => setFormData({ ...formData, result: v })}
                                placeholder="What was the outcome?"
                                isRichText
                            />
                        </div>


                        <div className="md:col-span-2 flex items-center gap-2 mb-6 ml-1">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="accent-[#2563eb]"
                            />
                            <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-black/60">Case Study is Active</label>
                        </div>


                        <div className="md:col-span-2">
                            <SeoComponent
                                data={formData.metadata}
                                onChange={handleSeoChange}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-4 bg-black/[0.03] text-black/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black/[0.08] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#7C3AED] shadow-lg shadow-[#2563eb]/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <FiCheck size={16} /> {editingItem ? 'Update' : 'Create'} Case Study
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaseStudyForm;
