"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { deleteServiceCategory, getServiceCategories, restoreServiceCategory } from '@/services/serviceService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiArchive, FiEdit3, FiLayers, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
interface CategoriesContentProps {
    initialCategories: any[];
}

const CategoriesContent = ({ initialCategories }: CategoriesContentProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [loading, setLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, permanent: boolean } | null>(null);

    const refreshCategories = async () => {
        setLoading(true);
        const res = await getServiceCategories(true);
        if (res.success) {
            setCategories(res.data);
        }
        setLoading(false);
    };

    const handleAddClick = () => {
        router.push('/admin/services/categories/new');
    };

    const handleEditClick = (id: string) => {
        router.push(`/admin/services/categories/${id}`);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { id, permanent } = itemToDelete;
        const res = await deleteServiceCategory(id, permanent);

        if (res.success) {
            showToast(res.message, 'success');
            refreshCategories();
        } else {
            showToast(res.message, 'error');
        }
        setItemToDelete(null);
    };

    const handleRestore = async (id: string) => {
        const res = await restoreServiceCategory(id);
        if (res.success) {
            showToast(res.message, 'success');
            refreshCategories();
        } else {
            showToast(res.message, 'error');
        }
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Manage core service pillars (e.g. Revenue Cycle Management)"
                onSave={handleAddClick}
                actionLabel="Add Category"
            />

            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.length === 0 ? (
                        <div className="col-span-full p-12 text-center bg-white border border-black/[0.06] rounded-[2rem]">
                            <p className="text-black/20 text-xs font-black uppercase tracking-widest text-center">No categories found</p>
                        </div>
                    ) : (
                        categories.map((cat: any) => (
                            <div key={cat._id} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm group hover:border-[#2563eb]/20 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                            <FiLayers size={20} />
                                        </div>
                                        <div className="flex gap-1 transition-opacity">
                                            <button onClick={() => handleEditClick(cat._id)} className="p-2 text-black/10 hover:text-blue-600">
                                                <FiEdit3 size={16} />
                                            </button>
                                            {cat.isDeleted ? (
                                                <button onClick={() => handleRestore(cat._id)} className="p-2 text-black/10 hover:text-green-600" title="Restore Category">
                                                    <FiRefreshCw size={16} />
                                                </button>
                                            ) : (
                                                <button onClick={() => setItemToDelete({ id: cat._id, permanent: false })} className="p-2 text-black/10 hover:text-orange-500" title="Soft Delete">
                                                    <FiArchive size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => setItemToDelete({ id: cat._id, permanent: true })} className="p-2 text-black/10 hover:text-red-500" title="Permanent Delete">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-widest mb-1">{cat.name}</h3>
                                    <p className="text-[10px] text-black/40 font-medium tracking-tighter mb-4">slug: {cat.slug}</p>
                                    <p className="text-[11px] text-black/60 line-clamp-2">{cat.description?.replace(/<[^>]*>?/gm, '') || 'No description provided.'}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-black/[0.03] flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {cat.status}
                                        </span>
                                        {cat.isDeleted && (
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-500">Deleted</span>
                                        )}
                                    </div>
                                    <span className="text-[8px] text-black/20 font-black uppercase tracking-widest">
                                        Order: {cat.displayOrder || 0}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <button
                        onClick={handleAddClick}
                        className="p-6 border-2 border-dashed border-black/[0.1] rounded-[2rem] text-black/20 hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-4 py-12"
                    >
                        <FiPlus size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">New Category</span>
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title={`${itemToDelete?.permanent ? 'Permanent' : 'Soft'} Delete Category`}
                message={itemToDelete?.permanent
                    ? "WARNING: This will PERMANENTLY remove this category. This action cannot be undone."
                    : "Are you sure you want to delete this category?"}
                confirmLabel={itemToDelete?.permanent ? "Yes, Delete Forever" : "Yes, Soft Delete"}
                type={itemToDelete?.permanent ? 'danger' : 'info'}
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default CategoriesContent;
