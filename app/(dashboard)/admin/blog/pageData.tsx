"use client";

import { useToast } from '@/components/global/Toast';
import { createBlogCategory, createBlogPost, updateBlogCategory, updateBlogPost } from '@/services/blogService';
import React, { useEffect, useState } from 'react';
import { FiCheck, FiClock, FiHash, FiImage, FiLink, FiSearch, FiUser, FiX } from 'react-icons/fi';
import MediaPicker from '@/components/global/MediaPicker';
import ImageField from '@/components/global/ImageField';
import SeoComponent from '@/components/global/Seo';

import { useRouter } from 'next/navigation';
import LexicalEditor from '@/components/global/LexicalEditor';

interface BlogFormProps {
    type: 'post' | 'category';
    editingItem?: any;
    categories: any[];
}

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, isTextArea = false, isRichText = false }: any) => (
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
                    rows={4}
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

const BlogForm = ({ type, editingItem, categories }: BlogFormProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (editingItem) {
            
            const normalizedData = { ...editingItem };
            if (normalizedData.category && typeof normalizedData.category === 'object') {
                normalizedData.category = normalizedData.category._id;
            }
            setFormData(normalizedData);
        } else {
            setFormData(type === 'post' ? {
                title: '',
                slug: '',
                category: '',
                excerpt: '',
                image: '',
                bannerBg: '',
                author: 'Admin',
                readTime: 5,
                content: '',
                isPublished: true,
                metadata: {
                    title: '',
                    description: '',
                    keywords: '',
                    image: '',
                    ogImage: ''
                }
            } : {
                name: '',
                slug: '',
                description: '',
                isActive: true,
                metadata: {
                    title: '',
                    description: '',
                    keywords: '',
                    image: '',
                    ogImage: ''
                }
            });
        }
    }, [editingItem, type]);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^a-z0-0\s]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleTitleChange = (val: string) => {
        setFormData({
            ...formData,
            title: val,
            slug: generateSlug(val)
        });
    };

    const handleNameChange = (val: string) => {
        setFormData({
            ...formData,
            name: val,
            slug: generateSlug(val)
        });
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
        router.push(type === 'post' ? '/admin/blog/posts' : '/admin/blog/categories');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (type === 'post') {
                if (editingItem?._id) {
                    res = await updateBlogPost(editingItem._id, formData);
                } else {
                    res = await createBlogPost(formData);
                }
            } else {
                if (editingItem?._id) {
                    res = await updateBlogCategory(editingItem._id, formData);
                } else {
                    res = await createBlogCategory(formData);
                }
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
                            {editingItem ? 'Edit' : 'Create New'} {type === 'post' ? 'Blog Post' : 'Category'}
                        </h2>
                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">
                            {type === 'post' ? 'Craft a compelling story' : 'Organize your content structure'}
                        </p>
                    </div>
                    <button type="button" onClick={handleBack} className="p-3 bg-white border border-black/[0.05] rounded-2xl hover:bg-black/[0.08] transition-colors shadow-sm">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
                    {type === 'post' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div className="md:col-span-2">
                                <InputField
                                    label="Post Title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Enter post title..."
                                />
                            </div>
                            <InputField
                                label="URL Slug"
                                value={formData.slug}
                                onChange={(v: string) => setFormData({ ...formData, slug: v })}
                                placeholder="post-url-slug"
                                icon={FiLink}
                            />
                            <div className="mb-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">Category</label>
                                <div className="relative">
                                    <FiHash className="absolute left-4 top-4 text-black/20" size={14} />
                                    <select
                                        className="w-full pl-11 pr-4 py-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ImageField
                                    label="Featured Image"
                                    value={formData.image || ''}
                                    onChange={(url: string) => setFormData((prev: any) => ({ ...prev, image: url }))}
                                />
                                <ImageField
                                    label="Banner Image"
                                    value={formData.bannerBg || ''}
                                    onChange={(url: string) => setFormData((prev: any) => ({ ...prev, bannerBg: url }))}
                                />
                            </div>
                            <InputField
                                label="Author"
                                value={formData.author}
                                onChange={(v: string) => setFormData({ ...formData, author: v })}
                                placeholder="Admin"
                                icon={FiUser}
                            />
                            <InputField
                                label="Read Time (min)"
                                type="number"
                                value={formData.readTime}
                                onChange={(v: number) => setFormData({ ...formData, readTime: v })}
                                placeholder="5"
                                icon={FiClock}
                            />
                            <div className="md:col-span-2">
                                <InputField
                                    label="Excerpt"
                                    value={formData.excerpt}
                                    onChange={(v: string) => setFormData({ ...formData, excerpt: v })}
                                    placeholder="Short summary of the post..."
                                    isTextArea
                                />
                            </div>
                            <div className="md:col-span-2">
                                <InputField
                                    label="Content"
                                    value={formData.content}
                                    onChange={(v: string) => setFormData({ ...formData, content: v })}
                                    placeholder="Write your article here..."
                                    isRichText
                                />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2 mb-6 ml-1">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="accent-[#2563eb]"
                                />
                                <label htmlFor="isPublished" className="text-[10px] font-black uppercase tracking-widest text-black/60">Publish Immediately</label>
                            </div>

                            <div className="md:col-span-2">
                                <SeoComponent
                                    data={formData.metadata}
                                    onChange={handleSeoChange}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InputField
                                label="Category Name"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="e.g. Technology"
                            />
                            <InputField
                                label="URL Slug"
                                value={formData.slug}
                                onChange={(v: string) => setFormData({ ...formData, slug: v })}
                                placeholder="technology"
                                icon={FiLink}
                            />
                            <InputField
                                label="Description"
                                value={formData.description}
                                onChange={(v: string) => setFormData({ ...formData, description: v })}
                                placeholder="Describe this category..."
                                isTextArea
                            />
                            <div className="flex items-center gap-2 mb-6 ml-1">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="accent-[#2563eb]"
                                />
                                <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-black/60">Category is Active</label>
                            </div>

                            <SeoComponent
                                data={formData.metadata}
                                onChange={handleSeoChange}
                            />
                        </div>
                    )}

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
                                    <FiCheck size={16} /> {editingItem ? 'Update' : 'Create'} {type === 'post' ? 'Post' : 'Category'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;
