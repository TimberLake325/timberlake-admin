"use client";

import React, { useState } from 'react';
import { saveFooter } from '@/services/footerService';
import { FiSave, FiActivity } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useToast } from '@/components/global/Toast';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FooterData from './sectionData';

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

interface FooterDataState {
    companyName: string;
    mission?: string;
    complianceText?: string;
    complianceBadges?: any[];
    solutionsTitle?: string;
    serviceIds?: string[];
    resourcesTitle?: string;
    blogPostIds?: string[];
    customSections?: any[];
    contactTitle?: string;
    contactDetails?: any[];
    legalLinks?: any[];
    copyrightYear?: number;
    copyrightCompany?: string;
    copyrightTagline?: string;
    socials: any[];
    sections: any[];
}

const FooterContent = ({
    initialData,
    availableServices = [],
    availableBlogs = []
}: {
    initialData: FooterDataState | null,
    availableServices?: any[],
    availableBlogs?: any[]
}) => {
    const [saving, setSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const [data, setData] = useState<FooterDataState>(initialData || {
        companyName: 'Timberlake',
        mission: '',
        complianceText: '',
        complianceBadges: [],
        solutionsTitle: 'Solutions',
        serviceIds: [],
        resourcesTitle: 'Resources',
        blogPostIds: [],
        customSections: [],
        contactTitle: 'Contact Operations',
        contactDetails: [],
        legalLinks: [],
        copyrightYear: new Date().getFullYear(),
        copyrightCompany: 'Timberlake Medical Billing',
        copyrightTagline: 'Specialized RCM Solutions for Healthcare.',
        socials: [],
        sections: []
    });
    const [openSection, setOpenSection] = useState<string | null>('content');

    const handleSave = async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
            const response = await saveFooter(data as any);
            if (response.success) {
                showToast(response.message, 'success');
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error("Error saving footer:", error);
            showToast("Critical system error during persistence", 'error');
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen pb-32">
            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Persist Footer Configuration"
                message="Are you sure you want to save these changes to the Footer? This will overwrite the current live settings."
                onConfirm={handleSave}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel={saving ? "Saving..." : "Yes, Persist Changes"}
            />

            <PageHeader
                description="Configure footer sections, social links, and company information"
                onSave={() => setIsConfirmOpen(true)}
                saving={saving}
            />

            <div className="w-full">
                <SectionHeader
                    title="Footer Content"
                    icon={FiActivity}
                    isOpen={openSection === 'content'}
                    onToggle={() => toggleSection('content')}
                />

                {openSection === 'content' && (
                    <FooterData
                        data={data}
                        onChange={(newData: any) => setData(newData)}
                        availableServices={availableServices}
                        availableBlogs={availableBlogs}
                    />
                )}
            </div>
        </div>
    );
};

export default FooterContent;