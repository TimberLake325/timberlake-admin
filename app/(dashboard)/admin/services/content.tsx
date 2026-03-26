"use client";

import React, { useState } from 'react';
import { saveServicesPage } from '@/services/servicesPageService';
import { FiSave, FiLayout, FiSearch, FiInfo, FiLayers, FiActivity } from 'react-icons/fi';
import { IconType } from 'react-icons';
import SeoComponent from '@/components/global/Seo';
import { useToast } from '@/components/global/Toast';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ServicesPageData from './pageData';

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

interface ServicesPageData {
    metadata?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    hero?: {
        title?: string;
        subtitle?: string;
        description?: string;
    };
    services?: any[];
}

const ServicesPageContent = ({ initialData }: { initialData: ServicesPageData | null }) => {
    const [saving, setSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const [data, setData] = useState<ServicesPageData>(initialData || {
        metadata: {},
        hero: {},
        services: []
    });
    const [openSection, setOpenSection] = useState<string | null>('content');

    const handleSave = async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
            const response = await saveServicesPage(data as Record<string, unknown>);
            if (response.success) {
                showToast(response.message, 'success');
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error("Error saving services page:", error);
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
                title="Persist Services Configuration"
                message="Are you sure you want to save these changes to the Services Page? This will overwrite the current live settings."
                onConfirm={handleSave}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel={saving ? "Saving..." : "Yes, Persist Changes"}
            />

            <PageHeader
                description="Manage services offerings, features, and promotional content"
                onSave={() => setIsConfirmOpen(true)}
                saving={saving}
            />

            <div className="w-full">
                <SectionHeader
                    title="Services Content"
                    icon={FiActivity}
                    isOpen={openSection === 'content'}
                    onToggle={() => toggleSection('content')}
                />

                {openSection === 'content' && (
                    <ServicesPageData
                        data={data}
                        onChange={(newData) => setData(newData)}
                    />
                )}

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

export default ServicesPageContent;
