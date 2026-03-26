"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { FiCopy, FiImage, FiPlus, FiSearch, FiTrash2, FiInfo, FiExternalLink } from 'react-icons/fi';

interface MediaContentProps {
    initialMedia: any[];
}

const MediaContent = ({ initialMedia }: MediaContentProps) => {
    const { showToast } = useToast();
    const [media, setMedia] = useState(initialMedia);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'in-use' | 'unused'>('all');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const filteredMedia = useMemo(() => {
        return media.filter(item =>
            item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [media, searchTerm]);

    const fetchMedia = async (currentFilter: string = filter) => {
        try {
            const res = await fetch(`/api/media?filter=${currentFilter}`);
            const data = await res.json();
            if (data.success) {
                setMedia(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch media', error);
        }
    };

    const handleFilterChange = (newFilter: 'all' | 'in-use' | 'unused') => {
        setFilter(newFilter);
        fetchMedia(newFilter);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                showToast("Image uploaded successfully", "success");
                fetchMedia();
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            showToast("Upload failed", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (force: boolean = false) => {
        if (!itemToDelete) return;

        try {
            const res = await fetch(`/api/media?id=${itemToDelete._id}${force ? '&force=true' : ''}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                showToast("Media deleted successfully", "success");
                setMedia(media.filter(m => m._id !== itemToDelete._id));
                setSelectedItem(null);
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            showToast("Failed to delete media", "error");
        } finally {
            setItemToDelete(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("URL copied to clipboard", "success");
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Manage your global media library and track image usage."
                onSave={() => document.getElementById('media-upload')?.click()}
                actionLabel={isUploading ? "Uploading..." : "Upload Media"}
                icon={FiPlus}
            />
            <input
                type="file"
                id="media-upload"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
            />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                <div className="lg:col-span-3 space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                            <input
                                type="text"
                                placeholder="Search media by name..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-black/[0.06] rounded-[1.5rem] text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value as any)}
                            className="px-6 py-4 bg-white border border-black/[0.06] rounded-[1.5rem] text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#2563eb]/30 transition-all shadow-sm cursor-pointer"
                        >
                            <option value="all">All Media</option>
                            <option value="in-use">In Use</option>
                            <option value="unused">Unused</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredMedia.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white border border-dashed border-black/[0.1] rounded-[2rem]">
                                <FiImage size={40} className="mx-auto text-black/10 mb-4" />
                                <p className="text-black/30 text-xs font-black uppercase tracking-widest">No media files found</p>
                            </div>
                        ) : (
                            filteredMedia.map(item => (
                                <div
                                    key={item._id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`group relative aspect-square bg-white border-2 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 ${selectedItem?._id === item._id ? 'border-[#2563eb] shadow-lg shadow-[#2563eb]/10' : 'border-black/[0.05] hover:border-black/[0.1] shadow-sm'}`}
                                >
                                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] text-white font-black truncate uppercase tracking-widest">{item.originalName || item.filename}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>


                <div className="lg:col-span-1">
                    <div className="sticky top-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm overflow-hidden h-fit">
                        {selectedItem ? (
                            <div className="flex flex-col">
                                <div className="aspect-video w-full bg-black/[0.02] border-b border-black/[0.05] relative p-1">
                                    <img src={selectedItem.url} alt="" className="w-full h-full object-contain rounded-xl" />
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-2">Metadata</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-[11px]">
                                                <span className="text-black/40">Name</span>
                                                <span className="font-bold text-black truncate max-w-[120px]">{selectedItem.originalName || selectedItem.filename}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px]">
                                                <span className="text-black/40">Size</span>
                                                <span className="font-bold text-black">{(selectedItem.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px]">
                                                <span className="text-black/40">Type</span>
                                                <span className="font-bold text-black uppercase">{selectedItem.mimeType?.split('/')[1] || 'IMG'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-2">Usage Tracking</h3>
                                        {selectedItem.usage && selectedItem.usage.length > 0 ? (
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                {selectedItem.usage.map((u: any, i: number) => (
                                                    <div key={i} className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.05] space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] font-extrabold text-[#2563eb] uppercase">{u.module || u.feature}</span>
                                                            <span className="text-[8px] text-black/30 capitalize">{u.fieldName?.replace(/_/g, ' ') || 'Associated'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-medium text-black/60">ID: {u.entityId.slice(-8)}</span>
                                                            {u.timestamp && (
                                                                <span className="text-[8px] text-black/30">
                                                                    {new Date(u.timestamp).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center bg-black/[0.02] rounded-2xl border border-dashed border-black/[0.1]">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Not in use</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-black/[0.05]">
                                        <button
                                            onClick={() => copyToClipboard(selectedItem.url)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <FiCopy size={14} /> Copy Path
                                        </button>
                                        <a
                                            href={selectedItem.url}
                                            target="_blank"
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.05] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <FiExternalLink size={14} /> View Original
                                        </a>
                                        <button
                                            onClick={() => setItemToDelete(selectedItem)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <FiTrash2 size={14} /> Delete Media
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <FiInfo size={24} className="mx-auto text-black/10 mb-4" />
                                <p className="text-black/30 text-[10px] font-black uppercase tracking-widest leading-relaxed">Select an image to view details and usage</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Delete Media"
                message={itemToDelete?.usage?.length > 0
                    ? `Warning: This image is currently in use by ${itemToDelete.usage.length} items. Deleting it may cause broken images in your application. Proceed anyway?`
                    : "Are you sure you want to permanently delete this image? This action cannot be undone."
                }
                type="danger"
                confirmLabel="Yes, Delete Permanently"
                onConfirm={() => handleDelete(itemToDelete?.usage?.length > 0)}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default MediaContent;
