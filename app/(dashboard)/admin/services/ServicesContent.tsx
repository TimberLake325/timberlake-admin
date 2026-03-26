"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { deleteService } from '@/services/serviceService';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEdit3, FiLayers, FiList, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';

interface ServicesContentProps {
    initialServices: any[];
}

const ServicesContent = ({ initialServices }: ServicesContentProps) => {
    const { showToast } = useToast();
    const router = useRouter();

    const [services, setServices] = useState(initialServices);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [itemToDelete, setItemToDelete] = useState<{ id: string, permanent: boolean } | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/services`);
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Failed to fetch services', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/services/categories');
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddClick = () => {
        router.push('/admin/services/new');
    };

    const handleEditClick = (id: string) => {
        router.push(`/admin/services/${id}`);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { id, permanent } = itemToDelete;
        const res = await deleteService(id, permanent);

        if (res.success) {
            showToast(res.message, 'success');
            fetchServices();
        } else {
            showToast(res.message, 'error');
        }
        setItemToDelete(null);
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Manage your professional services"
                onSave={handleAddClick}
                actionLabel="Add Service"
                icon={FiPlus}
                pageClick={() => redirect('/admin/services/page')}
                pageClickText="View Page"
            />

            <div className="mt-8">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-6 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {services.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-black/[0.06] rounded-[2rem]">
                            <p className="text-black/20 text-xs font-black uppercase tracking-widest">No services found</p>
                        </div>
                    ) : (
                        services
                            .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .filter(s => selectedCategory === 'all' || (s.category && (typeof s.category === 'string' ? s.category === selectedCategory : s.category._id === selectedCategory)))
                            .map(service => (
                                <div key={service._id} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm flex items-center justify-between group hover:border-[#2563eb]/20 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-14 bg-black/[0.02] rounded-xl overflow-hidden border border-black/[0.05] flex items-center justify-center">
                                            {service?.icon && !service.image ? (
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                                    <FiLayers size={16} />
                                                </div>
                                            ) : service?.image ? (
                                                <Image
                                                    src={service.image}
                                                    alt=""
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FiList className="text-black/10" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {service.isActive ? (
                                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-tighter rounded-full">Active</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[8px] font-black uppercase tracking-tighter rounded-full">Inactive</span>
                                                )}
                                                {service.category && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-tighter rounded-full">
                                                        {typeof service.category === 'string' ? 'Category' : service.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-black text-black tracking-tight">{service.title}</h3>
                                            <p className="text-[10px] text-black/40 font-medium truncate max-w-md">{service.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditClick(service._id)} className="p-3 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-xl transition-all">
                                            <FiEdit3 size={18} />
                                        </button>
                                        <button onClick={() => setItemToDelete({ id: service._id, permanent: false })} className="p-3 text-black/20 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                                            <FiTrash2 size={18} />
                                        </button>
                                        <button onClick={() => setItemToDelete({ id: service._id, permanent: true })} className="p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
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
                title={`${itemToDelete?.permanent ? 'Permanent' : 'Soft'} Delete Service`}
                message={itemToDelete?.permanent
                    ? "WARNING: This will PERMANENTLY remove this service. This action cannot be undone."
                    : "Are you sure you want to move this service to trash?"}
                confirmLabel={itemToDelete?.permanent ? "Yes, Delete Forever" : "Yes, Soft Delete"}
                type={itemToDelete?.permanent ? 'danger' : 'info'}
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default ServicesContent;
