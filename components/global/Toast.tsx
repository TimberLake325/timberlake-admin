"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[env(safe-area-inset-bottom,1rem)] sm:bottom-8 sm:right-8 sm:left-auto sm:p-0 z-[9999] flex flex-col gap-3 items-center sm:items-end pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto w-full max-w-[calc(100vw-32px)] sm:w-[400px] group flex items-start gap-4 p-4 rounded-xl sm:rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-[#059669] border-[#065F46] text-white' :
                            toast.type === 'error' ? 'bg-[#DC2626] border-[#991B1B] text-white' :
                                toast.type === 'warning' ? 'bg-[#D97706] border-[#92400E] text-white' :
                                    'bg-black border-black/10 text-white'
                            }`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {toast.type === 'success' && <FiCheckCircle size={20} />}
                            {toast.type === 'error' && <FiXCircle size={20} />}
                            {toast.type === 'warning' && <FiAlertTriangle size={20} />}
                            {toast.type === 'info' && <FiInfo size={20} />}
                        </div>

                        <div className="flex-grow min-w-0">
                            <p className="text-xs sm:text-[13px] font-semibold tracking-tight leading-snug break-words">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 -mr-1 p-1 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close notification"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
