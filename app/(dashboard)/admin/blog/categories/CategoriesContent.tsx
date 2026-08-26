"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { deleteBlogCategory, restoreBlogCategory } from '@/services/blogService';
import { useEffect, useState } from 'react';
import { FiArchive, FiEdit3, FiLayers, FiPlus, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import BlogForm from '../pageData';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CategoriesContentProps {
    initialCategories: any[];
    initialTotal?: number;
}

const CategoriesContent = ({ initialCategories, initialTotal = 0 }: CategoriesContentProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState(initialCategories);
    const [totalCategories, setTotalCategories] = useState(initialTotal || initialCategories.length);
    const [loading, setLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, permanent: boolean } | null>(null);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;

    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });
            const res = await fetch(`/api/blog/categories?${params}`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.data.categories || data.data);
                setTotalCategories(data.data.total || data.data.length);
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Failed to fetch categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/admin/blog/categories?${params.toString()}`);
    };

    const handleAddClick = () => {
        router.push('/admin/blog/categories/new');
    };

    const handleEditClick = (id: string) => {
        router.push(`/admin/blog/categories/${id}`);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { id, permanent } = itemToDelete;
        const res = await deleteBlogCategory(id, permanent);

        if (res.success) {
            showToast(res.message, 'success');
            fetchCategories(currentPage);
        } else {
            showToast(res.message, 'error');
        }
        setItemToDelete(null);
    };

    const handleRestore = async (id: string) => {
        const res = await restoreBlogCategory(id);
        if (res.success) {
            showToast(res.message, 'success');
            fetchCategories(currentPage);
        } else {
            showToast(res.message, 'error');
        }
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Organize your blog posts into meaningful topics"
                onSave={handleAddClick}
                actionLabel="Add Category"
                icon={FiPlus}
            />

            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.length === 0 ? (
                        <div className="col-span-full p-12 text-center bg-white border border-black/[0.06] rounded-[2rem]">
                            <p className="text-black/20 text-xs font-black uppercase tracking-widest">No categories found</p>
                        </div>
                    ) : (
                        categories.map(cat => (
                            <div key={cat._id} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm group hover:border-[#2563eb]/20 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-[#2563eb]/5 text-[#2563eb] rounded-2xl">
                                            <FiLayers size={20} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditClick(cat._id)} className="p-3 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-xl transition-all">
                                                <FiEdit3 size={18} />
                                            </button>
                                            {cat.isDeleted ? (
                                                <button onClick={() => handleRestore(cat._id)} className="p-3 text-black/20 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Restore Category">
                                                    <FiRefreshCw size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => setItemToDelete({ id: cat._id, permanent: false })} className="p-3 text-black/20 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all" title="Soft Delete">
                                                    <FiArchive size={18} />
                                                </button>
                                            )}
                                            <button onClick={() => setItemToDelete({ id: cat._id, permanent: true })} className="p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Permanent Delete">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-widest mb-1">{cat.name}</h3>
                                    <p className="text-[10px] text-black/40 font-medium tracking-tighter mb-4">slug: {cat.slug}</p>
                                    <p className="text-[11px] text-black/60 line-clamp-2">{cat.description || 'No description provided.'}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-black/[0.03] flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        {cat.isDeleted && (
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-500">Deleted</span>
                                        )}
                                    </div>
                                    <span className="text-[8px] text-black/20 font-black uppercase tracking-widest">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <button
                        onClick={handleAddClick}
                        className="p-6 border-2 border-dashed border-black/[0.1] rounded-[2rem] text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 hover:bg-[#2563eb]/5 transition-all flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="p-4 bg-black/[0.02] rounded-2xl group-hover:bg-[#2563eb]/10 transition-all">
                            <FiPlus size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Add New Category</span>
                    </button>
                </div>

                {totalCategories > limit && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="p-3 bg-white border border-black/[0.06] rounded-xl text-black/40 hover:text-[#2563eb] disabled:opacity-50"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                            Page {currentPage} of {Math.ceil(totalCategories / limit)}
                        </span>
                        <button
                            disabled={currentPage === Math.ceil(totalCategories / limit) || loading}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="p-3 bg-white border border-black/[0.06] rounded-xl text-black/40 hover:text-[#2563eb] disabled:opacity-50"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title={`${itemToDelete?.permanent ? 'Permanent' : 'Soft'} Delete Category`}
                message={itemToDelete?.permanent
                    ? "WARNING: This will PERMANENTLY remove this category. This action cannot be undone."
                    : "Deleting a category will also soft-delete all posts in this category. Continue?"}
                confirmLabel={itemToDelete?.permanent ? "Yes, Delete Forever" : "Yes, Soft Delete"}
                type={itemToDelete?.permanent ? 'danger' : 'info'}
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default CategoriesContent;