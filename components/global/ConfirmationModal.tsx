"use client";

import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'info';
}

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    type = 'info'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-black/[0.05] animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-[#2563eb]/5 text-[#2563eb]'}`}>
                            <FiAlertTriangle size={24} />
                        </div>
                        <button type="button" onClick={onCancel} className="text-black/20 hover:text-black transition-colors">
                            <FiX size={20} />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-2">
                        {title}<span className={type === 'danger' ? 'text-red-500' : 'text-[#2563eb]'}>?</span>
                    </h3>
                    <p className="text-sm text-black/40 font-medium leading-relaxed mb-10">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl ${type === 'danger'
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                                : 'bg-black text-white hover:bg-[#2563eb] shadow-black/20'
                                }`}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-black/30 hover:text-black hover:bg-black/5 transition-all"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
