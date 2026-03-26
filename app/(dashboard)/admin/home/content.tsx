"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import SeoComponent from '@/components/global/Seo';
import { useToast } from '@/components/global/Toast';
import { saveHomePage } from '@/services/homePageService';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { FiSearch } from 'react-icons/fi';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SectionManager from './pageData';

interface SectionHeaderProps {
    title: string;
    icon: IconType;
    isOpen: boolean;
    onToggle: () => void;
}

const SectionHeader = ({ title, icon: Icon, isOpen, onToggle }: SectionHeaderProps) => (
    <div
        onClick={onToggle}
        className="mt-6 flex items-center justify-between p-6 bg-white border border-black/6 rounded-2xl cursor-pointer hover:border-[#2563eb]/30 transition-all group mb-4"
    >
        <div className="flex items-center gap-4">
            <div className="p-3 bg-black/3 rounded-xl group-hover:bg-[#2563eb]/5 transition-colors">
                <Icon size={20} className="text-black group-hover:text-[#2563eb] transition-colors" />
            </div>
            <div>
                <h3 className="text-sm font-black text-black uppercase tracking-widest">{title}</h3>
                <p className="text-[10px] text-black/40 font-medium uppercase tracking-tighter">Configure section details and content</p>
            </div>
        </div>
        {isOpen ? <ChevronUp className="text-black/20" /> : <ChevronDown className="text-black/20" />}
    </div>
);

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    type?: string;
    isTextArea?: boolean;
}

const InputField = ({ label, value, onChange, placeholder, type = "text", isTextArea = false }: InputFieldProps) => (
    <div className="mb-6">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-2 ml-1">
            {label}
        </label>
        {isTextArea ? (
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full p-4 bg-black/2 border border-black/6 rounded-xl text-sm focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-black/2 border border-black/6 rounded-xl text-sm focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        )}
    </div>
);

interface HomePageData {
    metadata?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    sections?: any[];
}

const HomePageContent = ({ initialData, availableServices, availableCaseStudies }: { initialData: HomePageData | null, availableServices: any[], availableCaseStudies: any[] }) => {
    const [saving, setSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const [data, setData] = useState<HomePageData>(initialData || {
        metadata: {},
        sections: []
    });
    const [openSection, setOpenSection] = useState<string | null>('metadata');

    const handleSave = async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
            const response = await saveHomePage(data as Record<string, unknown>);
            if (response.success) {
                showToast(response.message, 'success');
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error("Error saving home page:", error);
            showToast("Critical system error during persistence", 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateMetadata = (field: string, value: string) => {
        setData({
            ...data,
            metadata: { ...data.metadata, [field]: value }
        });
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen pb-32">
            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Persist Home Configuration"
                message="Are you sure you want to save these changes to the Home Page? This will overwrite the current live settings."
                onConfirm={handleSave}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel={saving ? "Saving..." : "Yes, Persist Changes"}
            />

            <PageHeader
                description="Configure homepage sections, content, and SEO metadata"
                onSave={() => setIsConfirmOpen(true)}
                saving={saving}
            />


            <div className="w-full">

                <SectionManager
                    sections={data.sections || []}
                    availableServices={availableServices}
                    availableCaseStudies={availableCaseStudies}
                    onChange={(newSections) => setData({ ...data, sections: newSections })}
                />


                <SectionHeader
                    title="SEO Metadata"
                    icon={FiSearch}
                    isOpen={openSection === 'metadata'}
                    onToggle={() => toggleSection('metadata')}
                />
                {openSection === 'metadata' && (
                    <SeoComponent
                        data={data.metadata || {}}
                        onChange={updateMetadata}
                    />
                )}

            </div>
        </div>
    );
};

export default HomePageContent;
