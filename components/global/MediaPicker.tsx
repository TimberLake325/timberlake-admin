"use client";

import { useState, useEffect, useMemo } from 'react';
import { FiImage, FiPlus, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { useToast } from './Toast';

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    currentValue?: string;
}

const MediaPicker = ({ isOpen, onClose, onSelect, currentValue }: MediaPickerProps) => {
    const { showToast } = useToast();
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUrl, setSelectedUrl] = useState(currentValue || '');

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedUrl(currentValue || '');
        }
    }, [isOpen, currentValue]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            if (data.success) {
                setMedia(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch media');
        } finally {
            setLoading(false);
        }
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
                setSelectedUrl(data.url);
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            showToast("Upload failed", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const filteredMedia = useMemo(() => {
        return media.filter(item =>
            item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [media, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full w-full h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                <div className="p-6 border-b border-black/[0.05] flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-black uppercase tracking-tighter">Media Library</h2>
                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">Select an existing image or upload a new one</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 bg-black/[0.03] rounded-2xl hover:bg-black/[0.08] transition-colors">
                        <FiX size={20} />
                    </button>
                </div>


                <div className="p-6 border-b border-black/[0.02] flex items-center gap-4 bg-black/[0.01] shrink-0">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                        <input
                            type="text"
                            placeholder="Search images..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => document.getElementById('picker-upload')?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#7C3AED] transition-all"
                    >
                        <FiPlus size={16} /> {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <input type="file" id="picker-upload" className="hidden" onChange={handleUpload} accept="image/*" />
                </div>


                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-black/10">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 animate-pulse">Loading library...</p>
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-black/20">
                            <FiImage size={40} className="mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No images found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {filteredMedia.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => setSelectedUrl(item.url)}
                                    className={`relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer border-2 transition-all ${selectedUrl === item.url ? 'border-[#2563eb] scale-95 shadow-lg shadow-[#2563eb]/20' : 'border-black/[0.05] hover:border-black/[0.1]'}`}
                                >
                                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                                    {selectedUrl === item.url && (
                                        <div className="absolute inset-0 bg-[#2563eb]/20 flex items-center justify-center">
                                            <div className="p-2 bg-white text-[#2563eb] rounded-full shadow-lg">
                                                <FiCheck size={16} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="p-6 border-t border-black/[0.05] flex justify-end gap-3 bg-white shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 bg-black/[0.03] text-black/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black/[0.05] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedUrl) {
                                onSelect(selectedUrl);
                                onClose();
                            }
                        }}
                        disabled={!selectedUrl}
                        className="px-10 py-4 bg-[#2563eb] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#7C3AED] disabled:opacity-50 transition-all shadow-lg shadow-[#2563eb]/20"
                    >
                        Select Image
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaPicker;
