"use client";

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiActivity, FiLayers, FiList, FiCommand, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import ImageField from '@/components/global/ImageField';

import LexicalEditor from '@/components/global/LexicalEditor';

interface InputFieldProps {
    label: string;
    value: any;
    onChange: (val: any) => void;
    placeholder: string;
    type?: string;
    isTextArea?: boolean;
    isRichText?: boolean;
}

const InputField = ({ label, value, onChange, placeholder, type = "text", isTextArea = false, isRichText = false }: InputFieldProps) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        {isRichText ? (
            <LexicalEditor
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        ) : isTextArea ? (
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full p-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        )}
    </div>
);

const HeroEditor = ({ data, onChange }: { data: any, onChange: (val: any) => void }) => (
    <div className="p-6 bg-white border border-black/[0.06] rounded-[2rem] mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
            <FiActivity size={14} /> Hero Section
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
                label="Headline"
                value={data?.title}
                onChange={(v) => onChange({ ...data, title: v })}
                placeholder="Our Services"
            />
            <InputField
                label="Subtitle"
                value={data?.subtitle}
                onChange={(v) => onChange({ ...data, subtitle: v })}
                placeholder="What we offer"
            />
        </div>
        <InputField
            label="Description"
            value={data?.description}
            onChange={(v) => onChange({ ...data, description: v })}
            placeholder="Detailed description of your services..."
            isRichText
        />
    </div>
);

const ServicesListEditor = ({ services, onChange }: { services: any[], onChange: (val: any[]) => void }) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const addService = () => {
        const newService = {
            id: Date.now().toString(),
            title: '',
            description: '',
            features: [],
            tech: [],
            icon: ''
        };
        onChange([...services, newService]);
    };

    const updateService = (index: number, val: any) => {
        const newServices = [...services];
        newServices[index] = val;
        onChange(newServices);
    };

    const removeService = () => {
        if (itemToDelete !== null) {
            onChange(services.filter((_, i) => i !== itemToDelete));
            setItemToDelete(null);
        }
    };

    const moveService = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === services.length - 1) return;

        const newServices = [...services];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
        onChange(newServices);
    };

    return (
        <div className="space-y-6">
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Confirm Deletion"
                message="Are you sure you want to remove this service? This action cannot be undone until you save the page."
                onConfirm={removeService}
                onCancel={() => setItemToDelete(null)}
                confirmLabel="Yes, Remove Service"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2 ml-2">
                <FiLayers size={14} /> Service Items ({services?.length || 0})
            </p>
            {services?.map((service, idx) => (
                <div key={service.id || idx} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Service Item #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => moveService(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1.5 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-lg transition-all disabled:opacity-0"
                                >
                                    <FiChevronUp size={14} />
                                </button>
                                <button
                                    onClick={() => moveService(idx, 'down')}
                                    disabled={idx === services.length - 1}
                                    className="p-1.5 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-lg transition-all disabled:opacity-0"
                                >
                                    <FiChevronDown size={14} />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setItemToDelete(idx)}
                            className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Internal Name"
                            value={service.name}
                            onChange={(v) => updateService(idx, { ...service, name: v })}
                            placeholder="e.g. web-dev"
                        />
                        <InputField
                            label="Service Title"
                            value={service.title}
                            onChange={(v) => updateService(idx, { ...service, title: v })}
                            placeholder="e.g. Web Development"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ImageField
                            label="Service Icon / Image"
                            value={service.icon}
                            onChange={(v) => updateService(idx, { ...service, icon: v })}
                        />
                        <InputField
                            label="Icon Background Color"
                            value={service.icon_bg}
                            onChange={(v) => updateService(idx, { ...service, icon_bg: v })}
                            placeholder="e.g. #2563eb"
                        />
                    </div>

                    <InputField
                        label="Description"
                        value={service.description}
                        onChange={(v) => updateService(idx, { ...service, description: v })}
                        placeholder="Briefly describe the service..."
                        isRichText
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] mb-3 flex items-center gap-2">
                                <FiList size={12} /> Key Features
                            </p>
                            <InputField
                                label="Features (comma separated)"
                                value={service.features?.join(', ')}
                                onChange={(v) => updateService(idx, { ...service, features: v.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                                placeholder="Feature 1, Feature 2..."
                                isTextArea
                            />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] mb-3 flex items-center gap-2">
                                <FiCommand size={12} /> Technologies
                            </p>
                            <InputField
                                label="Tech Stack (comma separated)"
                                value={service.tech?.join(', ')}
                                onChange={(v) => updateService(idx, { ...service, tech: v.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                                placeholder="React, Node.js..."
                                isTextArea
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addService}
                className="w-full py-6 border-2 border-dashed border-black/[0.06] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 hover:bg-[#2563eb]/5 transition-all flex items-center justify-center gap-2 group"
            >
                <div className="p-2 bg-black/[0.03] rounded-lg group-hover:bg-[#2563eb]/10 transition-colors">
                    <FiPlus size={16} />
                </div>
                Add New Service
            </button>
        </div>
    );
};

const ServicesPageData = ({ data, onChange }: { data: any, onChange: (newData: any) => void }) => {
    return (
        <div className="mt-4">
            <HeroEditor
                data={data.hero}
                onChange={(heroData) => onChange({ ...data, hero: heroData })}
            />
            <ServicesListEditor
                services={data.services || []}
                onChange={(servicesData) => onChange({ ...data, services: servicesData })}
            />
        </div>
    );
};

export default ServicesPageData;