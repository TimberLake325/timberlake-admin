"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { deleteCaseStudy } from '@/services/caseStudyService';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiEdit3, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { redirect, useRouter } from 'next/navigation';

interface CaseStudiesContentProps {
    initialCaseStudies: any[];
}

const CaseStudiesContent = ({ initialCaseStudies }: CaseStudiesContentProps) => {
    const { showToast } = useToast();
    const router = useRouter();

    const [items, setItems] = useState(initialCaseStudies);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemToDelete, setItemToDelete] = useState<{ id: string, permanent: boolean } | null>(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/case-studies`);
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Failed to fetch case studies', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        router.push('/admin/case-studies/create');
    };

    const handleEditClick = (id: string) => {
        router.push(`/admin/case-studies/${id}`);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { id, permanent } = itemToDelete;
        const res = await deleteCaseStudy(id, permanent);

        if (res.success) {
            showToast(res.message, 'success');
            fetchItems();
        } else {
            showToast(res.message, 'error');
        }
        setItemToDelete(null);
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Manage your case studies"
                onSave={handleAddClick}
                actionLabel="Add Case Study"
                icon={FiPlus}

                pageClick={() => redirect('/admin/case-studies/page')}
                pageClickText="View Page"
            />

            <div className="mt-8">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                        <input
                            type="text"
                            placeholder="Search case studies..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {items.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-black/[0.06] rounded-[2rem]">
                            <p className="text-black/20 text-xs font-black uppercase tracking-widest">No case studies found</p>
                        </div>
                    ) : (
                        items.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                            <div key={item._id} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm flex items-center justify-between group hover:border-[#2563eb]/20 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-14 bg-black/[0.02] rounded-xl overflow-hidden border border-black/[0.05]">
                                        {item?.image && (
                                            <Image
                                                src={item.image}
                                                alt=""
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {item.isActive ? (
                                                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-tighter rounded-full">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[8px] font-black uppercase tracking-tighter rounded-full">Inactive</span>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-black text-black tracking-tight">{item.title}</h3>
                                        <p className="text-[10px] text-black/40 font-medium truncate max-w-md">{item.summary}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditClick(item._id)} className="p-3 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-xl transition-all">
                                        <FiEdit3 size={18} />
                                    </button>
                                    <button onClick={() => setItemToDelete({ id: item._id, permanent: false })} className="p-3 text-black/20 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                                        <FiTrash2 size={18} />
                                    </button>
                                    <button onClick={() => setItemToDelete({ id: item._id, permanent: true })} className="p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <FiX size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title={`${itemToDelete?.permanent ? 'Permanent' : 'Soft'} Delete Case Study`}
                message={itemToDelete?.permanent
                    ? "WARNING: This will PERMANENTLY remove this case study. This action cannot be undone."
                    : "Are you sure you want to move this case study to trash?"}
                confirmLabel={itemToDelete?.permanent ? "Yes, Delete Forever" : "Yes, Soft Delete"}
                type={itemToDelete?.permanent ? 'danger' : 'info'}
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default CaseStudiesContent;

