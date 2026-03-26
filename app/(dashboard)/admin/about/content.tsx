"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import SeoComponent from '@/components/global/Seo';
import { useToast } from '@/components/global/Toast';
import { saveAboutPage } from '@/services/aboutPageService';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { FiInfo, FiSearch } from 'react-icons/fi';
import { ChevronUp, ChevronDown } from 'lucide-react';
import AboutPageData from './pageData';

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

interface AboutPageDataInterface {
    metadata?: any;
    pageData?: {
        pageHeader?: { title: string; description: string };
        missionVision?: {
            mission?: { icon: string; title: string; description: string; highlightedText: string };
            vision?: { icon: string; title: string; description: string };
        };
        leadership?: {
            title: string;
            subtitle: string;
            members: { id: number; name: string; role: string; description: string; initials: string }[];
        };
        compliance?: {
            title: string;
            badge: string;
            badgeIcon: string;
            quote: string;
            certifications: string[];
            verificationCode: string;
            watermarkIcon: string;
        };
    };
}

const AboutPageContent = ({ initialData }: { initialData: AboutPageDataInterface | null }) => {
    const [saving, setSaving] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const [data, setData] = useState<AboutPageDataInterface>(initialData || {
        metadata: {},
        pageData: {
            pageHeader: { title: '', description: '' },
            missionVision: {
                mission: { title: '', icon: '', description: '', highlightedText: '' },
                vision: { title: '', icon: '', description: '' }
            },
            leadership: { title: '', subtitle: '', members: [] },
            compliance: { title: '', badge: '', badgeIcon: '', quote: '', certifications: [], verificationCode: '', watermarkIcon: '' }
        }
    });
    const [openSection, setOpenSection] = useState<string | null>('content');

    const handleSave = async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
            const response = await saveAboutPage(data as Record<string, unknown>);
            if (response.success) {
                showToast(response.message, 'success');
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error("Error saving about page:", error);
            showToast("An unexpected system error occurred", 'error');
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
                title="Save Changes"
                message="Are you sure you want to persist these changes to the About Page? This will immediately update the live site content."
                onConfirm={handleSave}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel={saving ? "Saving..." : "Yes, Save Changes"}
            />

            <PageHeader
                description="Configure about page content, company values, and SEO settings"
                onSave={() => setIsConfirmOpen(true)}
                saving={saving}
            />


            <div className="w-full">

                <SectionHeader
                    title="Page Content"
                    icon={FiInfo}
                    isOpen={openSection === 'content'}
                    onToggle={() => toggleSection('content')}
                />
                {openSection === 'content' && (
                    <AboutPageData
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

export default AboutPageContent;
