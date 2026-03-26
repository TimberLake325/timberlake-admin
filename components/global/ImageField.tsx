"use client";

import React from 'react';
import { FiImage } from 'react-icons/fi';
import MediaPicker from './MediaPicker';

interface ImageFieldProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
}

const ImageField = ({ label, value, onChange }: ImageFieldProps) => {
    const [isPickerOpen, setIsPickerOpen] = React.useState(false);

    return (
        <div className="mb-4">
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black/[0.03] border border-black/[0.06] overflow-hidden shrink-0">
                    {value ? (
                        <img src={value} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/10">
                            <FiImage size={16} />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="flex-1 py-3 px-4 bg-black/[0.02] border border-dashed border-black/[0.1] rounded-xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all text-left truncate"
                >
                    {value ? value.split('/').pop() : 'Select Image...'}
                </button>
            </div>

            <MediaPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => {
                    onChange(url);
                    setIsPickerOpen(false);
                }}
            />
        </div>
    );
};

export default ImageField;
