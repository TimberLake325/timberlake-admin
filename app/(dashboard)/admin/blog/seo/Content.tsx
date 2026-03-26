"use client";

import PageHeader from '@/components/global/PageHeader';
import SeoComponent from '@/components/global/Seo';
import { useToast } from '@/components/global/Toast';
import { updateBlogPage } from '@/services/blogPageService';
import { useState } from 'react';
import ConfirmationModal from '@/components/global/ConfirmationModal';

import LexicalEditor from '@/components/global/LexicalEditor';
import { FiEdit3, FiType } from 'react-icons/fi';

interface BlogPageData {
    title?: string;
    description?: string;
    metadata?: any;
}

const BlogSeoContent = ({ initialData }: { initialData: BlogPageData | null }) => {
    const [saving, setSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const [data, setData] = useState<BlogPageData>(initialData || {
        title: '',
        description: '',
        metadata: {}
    });

    const handleSave = async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
            const response = await updateBlogPage(data);
            if (response.success) {
                showToast(response.message, 'success');
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error("Error saving blog content:", error);
            showToast("Critical system error during persistence", 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateMetadata = (field: string, value: string) => {
        setData({
            ...data,
            metadata: { ...data.metadata, [field]: value }
        });
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen pb-32">
            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Persist Blog Configuration"
                message="Are you sure you want to save these settings for the Blog Landing Page? This will update both page content and SEO metadata."
                onConfirm={handleSave}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel={saving ? "Saving..." : "Yes, Persist Changes"}
            />

            <PageHeader
                description="Manage content and SEO metadata for the main blog landing page"
                onSave={() => setIsConfirmOpen(true)}
                saving={saving}
            />

            <div className="w-full mx-auto space-y-8 mt-4 lg:mt-8">

                <div className="bg-white border border-black/[0.06] rounded-[2.5rem] p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-8 border-b border-black/[0.03] pb-4">
                        <div className="p-2.5 bg-[#2563eb]/5 rounded-xl">
                            <FiEdit3 className="text-[#2563eb]" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-black uppercase tracking-tight">Main Content</h2>
                            <p className="text-[11px] text-black/40 font-medium uppercase tracking-wider">Configure the visible title and description</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-3 ml-1 flex items-center gap-2">
                                <FiType size={12} className="text-[#2563eb]" />
                                Page Heading (H1)
                            </label>
                            <input
                                type="text"
                                value={data.title || ''}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                placeholder="e.g., Insights & Innovation"
                                className="w-full p-5 bg-black/[0.02] border border-black/[0.06] rounded-[1.5rem] text-sm font-medium focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-3 ml-1 flex items-center gap-2">
                                <FiEdit3 size={12} className="text-[#2563eb]" />
                                Hero Description
                            </label>
                            <LexicalEditor
                                value={data.description || ''}
                                onChange={(val) => setData({ ...data, description: val })}
                                placeholder="Enter the main description for your blog page..."
                            />
                        </div>
                    </div>
                </div>


                <SeoComponent
                    data={data.metadata || {}}
                    onChange={updateMetadata}
                />
            </div>
        </div>
    );
};

export default BlogSeoContent;
