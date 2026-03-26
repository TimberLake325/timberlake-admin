"use client";

import { IconType } from 'react-icons';
import { FiSave } from 'react-icons/fi';

interface PageHeaderProps {
    description: string; 
    onSave?: () => void;
    pageClick?: () => void;
    pageClickText?: string;
    saving?: boolean;
    icon?: IconType;
    actionLabel?: string;
    savingLabel?: string;
}

const PageHeader = ({
    description,
    onSave,
    pageClick,
    pageClickText,
    saving = false,
    icon: Icon = FiSave,
    actionLabel = "Save Changes",
    savingLabel = "Saving..."
}: PageHeaderProps) => {
    return (
        <div className="mb8 flex flex-col sm:flex-row justify-between items-start  sm:items-end gap-6 sm:gap-0">
            <div className="space-y-2 mb-auto">
                <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em] italic hover:text-black/80">
                    {description}
                </p>
            </div>
            <div className="flex items-center gap-6">
                {pageClick && (
                    <button
                        onClick={pageClick}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent text-black border border-black/[0.06] px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black/10 transition-all disabled:opacity-50 shadow-2xl shadow-black/10 group"
                    >
                        {pageClickText || "Page"}
                    </button>
                )}
                {onSave && (
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#2563eb] transition-all disabled:opacity-50 shadow-2xl shadow-black/10 group"
                    >
                        {saving ? savingLabel : actionLabel}
                        {!saving && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
