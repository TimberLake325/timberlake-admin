"use client";

import React, { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiLayers, FiImage, FiType, FiLink, FiList, FiCheckCircle, FiUser, FiCode, FiLayout, FiX, FiSearch } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import MediaPicker from '@/components/global/MediaPicker';
import ImageField from '@/components/global/ImageField';
import EditSection from '@/components/home/EditSection';

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
                className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        )}
    </div>
);

const ColorField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        <div className="flex items-center gap-3 p-2 bg-black/2 border border-black/6 rounded-xl focus-within:border-[#2563eb]/30 transition-all">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/6">
                <input
                    type="color"
                    value={value?.startsWith('#') ? value : '#2563eb'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer border-none"
                />
            </div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#hex or tailwind class"
                className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-black/20"
            />
        </div>
    </div>
);

const CtaFields = ({ label, value, onChange }: { label: string, value: any, onChange: (val: any) => void }) => (
    <div className="p-4 bg-black/1 border border-black/3 rounded-2xl mb-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] mb-3">{label}</p>
        <div className="grid grid-cols-2 gap-4">
            <InputField label="Button Label" value={value?.label} onChange={(v) => onChange({ ...value, label: v })} placeholder="e.g. Get Started" />
            <InputField label="Button Link" value={value?.link} onChange={(v) => onChange({ ...value, link: v })} placeholder="e.g. /contact" />
        </div>
    </div>
);

const HeroEditor = ({ data, onChange }: any) => {
    const addSocialProof = () => {
        const newItems = [...(data.socialProof || []), { id: Date.now().toString(), text: '', iconName: '', color: '' }];
        onChange({ ...data, socialProof: newItems });
    };

    const updateSocialProof = (index: number, val: any) => {
        const newItems = [...(data.socialProof || [])];
        newItems[index] = val;
        onChange({ ...data, socialProof: newItems });
    };

    const removeSocialProof = (index: number) => {
        const newItems = (data.socialProof || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, socialProof: newItems });
    };

    return (
        <div>
            <InputField label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} placeholder="Hero Headline" isRichText />
            <InputField label="Subheading" value={data.subheading} onChange={(v) => onChange({ ...data, subheading: v })} placeholder="Hero Subheading" isRichText />
            <CtaFields label="Primary CTA" value={data.primaryCta} onChange={(v) => onChange({ ...data, primaryCta: v })} />
            <CtaFields label="Secondary CTA" value={data.secondaryCta} onChange={(v) => onChange({ ...data, secondaryCta: v })} />

            <div className="mt-4 mb-6">
                <ImageField label="Hero Banner Card Image" value={data.image} onChange={(url: string) => onChange({ ...data, image: url })} />
            </div>

            <div className="mt-6 border-t border-black/3 pt-6">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiCheckCircle size={14} className="text-[#2563eb]" /> Social Proof / Partners
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {(data.socialProof || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-4 bg-black/1 border border-black/4 rounded-2xl relative group">
                            <button type="button" onClick={() => removeSocialProof(idx)} className="absolute top-3 right-3 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <FiTrash2 size={12} />
                            </button>
                            <InputField label="Text" value={item.text} onChange={(v) => updateSocialProof(idx, { ...item, text: v })} placeholder="HIPAA Secure" />
                            <div className="grid grid-cols-2 gap-2">
                                <InputField label="Icon (Lucide)" value={item.iconName} onChange={(v) => updateSocialProof(idx, { ...item, iconName: v })} placeholder="LucideShieldCheck" />
                                <ColorField label="Color" value={item.color} onChange={(v) => updateSocialProof(idx, { ...item, color: v })} />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addSocialProof} className="w-full py-3 mt-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:border-[#2563eb]/30 hover:text-[#2563eb] transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add Partner / Proof
                </button>
            </div>
        </div>
    );
};

const WhatWeDoEditor = ({ data, onChange, availableServices }: any) => {
    const [serviceIdToRemove, setServiceIdToRemove] = React.useState<string | null>(null);

    const toggleService = (serviceId: string) => {
        const currentIds = data.serviceIds || [];
        if (currentIds.includes(serviceId)) return;
        const newIds = [...currentIds, serviceId];
        onChange({ ...data, serviceIds: newIds });
    };

    const confirmRemoveService = () => {
        if (serviceIdToRemove) {
            const newIds = (data.serviceIds || []).filter((id: string) => id !== serviceIdToRemove);
            onChange({ ...data, serviceIds: newIds });
            setServiceIdToRemove(null);
        }
    };

    const selectedServices = availableServices?.filter((s: any) => data.serviceIds?.includes(s._id || s.id)) || [];
    const availableToSelect = availableServices?.filter((s: any) => !data.serviceIds?.includes(s._id || s.id)) || [];

    return (
        <div>
            <ConfirmationModal
                isOpen={serviceIdToRemove !== null}
                title="Remove Service"
                message="Do you want remove this service from home page?"
                onConfirm={confirmRemoveService}
                onCancel={() => setServiceIdToRemove(null)}
                confirmLabel="Yes, Remove"
            />

            <InputField label="Section Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="What We Do Title" />
            <InputField label="Header Description" value={data.headerDescription} onChange={(v) => onChange({ ...data, headerDescription: v })} placeholder="Schedule a specialized audit..." isRichText />
            <InputField label="Section Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="What We Do Description" isRichText />

            <div className="mt-6 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiLayers size={14} className="text-[#2563eb]" /> Home Page Services
                </p>


                <div className="mb-4">
                    <div className="relative group">
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    toggleService(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                            className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all appearance-none cursor-pointer pr-10"
                        >
                            <option value="">+ Add Service to Home Page...</option>
                            {availableToSelect.map((service: any) => (
                                <option key={service._id} value={service._id}>{service.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/20 group-hover:text-[#2563eb] transition-colors">
                            <FiChevronDown size={14} />
                        </div>
                    </div>
                </div>


                <div className="flex flex-wrap gap-2 p-4 bg-black/1 border border-black/4 rounded-2xl min-h-[60px] items-center">
                    {selectedServices.length > 0 ? (
                        selectedServices.map((service: any) => (
                            <div
                                key={service.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#2563eb]/20 rounded-full shadow-sm"
                            >
                                <span className="text-[11px] font-bold text-black">{service.title}</span>
                                <button
                                    onClick={() => setServiceIdToRemove(service._id || service.id)}
                                    className="p-1 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-full transition-all"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-black/30 w-full text-center">No services selected for home page.</p>
                    )}
                </div>
            </div>

            <CtaFields label="Section CTA (Navigate to Service Page)" value={data.cta} onChange={(v) => onChange({ ...data, cta: v })} />
        </div>
    );
};

const AboutUsEditor = ({ data, onChange }: any) => {
    const addHighlight = () => {
        const newItems = [...(data.highlights || []), { title: '', description: '' }];
        onChange({ ...data, highlights: newItems });
    };

    const updateHighlight = (index: number, val: any) => {
        const newItems = [...data.highlights];
        newItems[index] = val;
        onChange({ ...data, highlights: newItems });
    };

    const addStat = () => {
        const newItems = [...(data.stats || []), { label: '', value: '' }];
        onChange({ ...data, stats: newItems });
    };

    const updateStat = (index: number, val: any) => {
        const newItems = [...data.stats];
        newItems[index] = val;
        onChange({ ...data, stats: newItems });
    };

    const removeHighlight = (index: number) => {
        const newItems = (data.highlights || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, highlights: newItems });
    };

    const removeStat = (index: number) => {
        const newItems = (data.stats || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, stats: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="About Section Title" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="About Section Subtitle" />
            <InputField label="Header Description" value={data.headerDescription} onChange={(v) => onChange({ ...data, headerDescription: v })} placeholder="Our RCM engine is integrated..." isRichText />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="About Detail" isRichText />

            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Highlights</p>
                {data.highlights?.map((h: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 mb-2 p-3 bg-black/1 rounded-xl border border-black/4 relative group">
                        <button
                            type="button"
                            onClick={() => removeHighlight(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                        >
                            <FiX size={10} />
                        </button>
                        <InputField label="Title" value={h.title} onChange={(v) => updateHighlight(idx, { ...h, title: v })} placeholder="HL Title" />
                        <InputField label="Desc" value={h.description} onChange={(v) => updateHighlight(idx, { ...h, description: v })} placeholder="HL Desc" isRichText />
                    </div>
                ))}
                <button type="button" onClick={addHighlight} className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest mb-4">+ Add Highlight</button>
            </div>

            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Stats</p>
                {data.stats?.map((s: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 mb-2 p-3 bg-black/1 rounded-xl border border-black/4 relative group">
                        <button
                            type="button"
                            onClick={() => removeStat(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                        >
                            <FiX size={10} />
                        </button>
                        <InputField label="Label" value={s.label} onChange={(v) => updateStat(idx, { ...s, label: v })} placeholder="Projects" />
                        <InputField label="Value" value={s.value} onChange={(v) => updateStat(idx, { ...s, value: v })} placeholder="500+" />
                    </div>
                ))}
                <button type="button" onClick={addStat} className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest mb-4">+ Add Stat</button>
            </div>

            <CtaFields label="Section CTA" value={data.cta} onChange={(v) => onChange({ ...data, cta: v })} />
        </div>
    );
};

const ProcessEditor = ({ data, onChange }: any) => {
    const addStep = () => {
        const newItems = [...(data.steps || []), { step: (data.steps?.length || 0) + 1, title: '', description: '', icon: '' }];
        onChange({ ...data, steps: newItems });
    };

    const updateStep = (index: number, val: any) => {
        const newItems = [...data.steps];
        newItems[index] = val;
        onChange({ ...data, steps: newItems });
    };

    const removeStep = (index: number) => {
        const newItems = (data.steps || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, steps: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Process Title" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Process Subtitle" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Process Description" isRichText />
            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Workflow Steps</p>
                {data.steps?.map((s: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                        <button
                            type="button"
                            onClick={() => removeStep(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                        >
                            <FiX size={10} />
                        </button>
                        <div className="flex gap-4">
                            <div className="w-12">
                                <InputField label="#" value={s.step} onChange={(v) => updateStep(idx, { ...s, step: Number(v) })} placeholder="1" type="number" />
                            </div>
                            <div className="flex-1">
                                <InputField label="Title" value={s.title} onChange={(v) => updateStep(idx, { ...s, title: v })} placeholder="Step title" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Icon" value={s.icon} onChange={(v) => updateStep(idx, { ...s, icon: v })} placeholder="Icon name" />
                            <InputField label="Description" value={s.description} onChange={(v) => updateStep(idx, { ...s, description: v })} placeholder="Step detail" isRichText />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addStep} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Step</button>
            </div>
            <CtaFields label="Section CTA" value={data.cta} onChange={(v) => onChange({ ...data, cta: v })} />
        </div>
    );
};

const CaseStudiesEditor = ({ data, onChange, availableCaseStudies }: any) => {
    const [caseStudyIdToRemove, setCaseStudyIdToRemove] = React.useState<string | null>(null);

    const toggleCaseStudy = (caseStudyId: string) => {
        const currentIds = data.caseStudyIds || [];
        if (currentIds.includes(caseStudyId)) return;
        const newIds = [...currentIds, caseStudyId];
        onChange({ ...data, caseStudyIds: newIds });
    };

    const confirmRemoveCaseStudy = () => {
        if (caseStudyIdToRemove) {
            const newIds = (data.caseStudyIds || []).filter((id: string) => id !== caseStudyIdToRemove);
            onChange({ ...data, caseStudyIds: newIds });
            setCaseStudyIdToRemove(null);
        }
    };

    const selectedCaseStudies = availableCaseStudies?.filter((cs: any) => data.caseStudyIds?.includes(cs._id || cs.id)) || [];
    const availableToSelect = availableCaseStudies?.filter((cs: any) => !data.caseStudyIds?.includes(cs._id || cs.id)) || [];

    const addItem = () => {
        const newItems = [...(data.items || []), { id: Date.now().toString(), title: '', industry: '', summary: '', challenge: '', solution: '', result: '', technologies: [], image: '', link: '' }];
        onChange({ ...data, items: newItems });
    };

    const updateItem = (index: number, val: any) => {
        const newItems = [...data.items];
        newItems[index] = val;
        onChange({ ...data, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = (data.items || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, items: newItems });
    };

    return (
        <div>
            <ConfirmationModal
                isOpen={caseStudyIdToRemove !== null}
                title="Remove Case Study"
                message="Do you want to remove this case study from home page?"
                onConfirm={confirmRemoveCaseStudy}
                onCancel={() => setCaseStudyIdToRemove(null)}
                confirmLabel="Yes, Remove"
            />

            <InputField label="Section Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Case Studies Title" />
            <InputField label="Section Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Case Studies Subtitle" />
            <InputField label="Section Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="The description" isRichText />

            <div className="mt-6 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiLayers size={14} className="text-[#2563eb]" /> Home Page Case Studies
                </p>


                <div className="mb-4">
                    <div className="relative group">
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    toggleCaseStudy(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                            className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all appearance-none cursor-pointer pr-10"
                        >
                            <option value="">+ Add Case Study to Home Page...</option>
                            {availableToSelect.map((caseStudy: any) => (
                                <option key={caseStudy._id} value={caseStudy._id}>{caseStudy.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/20 group-hover:text-[#2563eb] transition-colors">
                            <FiChevronDown size={14} />
                        </div>
                    </div>
                </div>


                <div className="flex flex-wrap gap-2 p-4 bg-black/1 border border-black/4 rounded-2xl min-h-[60px] items-center">
                    {selectedCaseStudies.length > 0 ? (
                        selectedCaseStudies.map((caseStudy: any) => (
                            <div
                                key={caseStudy._id || caseStudy.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#2563eb]/20 rounded-full shadow-sm"
                            >
                                <span className="text-[11px] font-bold text-black">{caseStudy.title}</span>
                                <button
                                    onClick={() => setCaseStudyIdToRemove(caseStudy._id || caseStudy.id)}
                                    className="p-1 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-full transition-all"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-black/30 w-full text-center">No case studies selected for home page.</p>
                    )}
                </div>
            </div>

            <CtaFields label="Section CTA (Navigate to Case Studies Page)" value={data.cta} onChange={(v) => onChange({ ...data, cta: v })} />

            <div className="mt-8 pt-6 border-t border-black/3">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-black/30">
                    <FiLayers size={12} /> Alternative: Manual Case Study Items (Optional)
                </p>
                {data.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-5 bg-black/1 border border-black/4 rounded-4xl mb-6 relative group">
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <FiTrash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Title" value={item.title} onChange={(v) => updateItem(idx, { ...item, title: v })} placeholder="Project Title" />
                            <InputField label="Industry" value={item.industry} onChange={(v) => updateItem(idx, { ...item, industry: v })} placeholder="Fintech / AI" />
                            <ImageField label="Featured Image" value={item.image || ''} onChange={(url: string) => updateItem(idx, { ...item, image: url })} />
                            <InputField label="Project Link" value={item.link} onChange={(v) => updateItem(idx, { ...item, link: v })} placeholder="/cases/..." />
                        </div>
                        <InputField label="Summary" value={item.summary} onChange={(v) => updateItem(idx, { ...item, summary: v })} placeholder="Quick summary" isRichText />
                        <div className="grid grid-cols-3 gap-4">
                            <InputField label="Challenge" value={item.challenge} onChange={(v) => updateItem(idx, { ...item, challenge: v })} placeholder="The problem" isRichText />
                            <InputField label="Solution" value={item.solution} onChange={(v) => updateItem(idx, { ...item, solution: v })} placeholder="The approach" isRichText />
                            <InputField label="Result" value={item.result} onChange={(v) => updateItem(idx, { ...item, result: v })} placeholder="The outcome" isRichText />
                        </div>
                        <InputField label="Technologies (comma separated)" value={item.technologies?.join(',')} onChange={(v) => updateItem(idx, { ...item, technologies: v.split(',') })} placeholder="React, Node, Mongo" />
                    </div>
                ))}
                <button type="button" onClick={addItem} className="w-full py-4 border border-dashed border-black/10 rounded-4xl text-[10px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Manual Case Study</button>
            </div>
        </div>
    );
};

const TestimonialsEditor = ({ data, onChange }: any) => {
    const addItem = () => {
        const newItems = [...(data.items || []), { id: Date.now().toString(), name: '', role: '', company: '', feedback: '', avatar: '', rating: 5 }];
        onChange({ ...data, items: newItems });
    };

    const updateItem = (index: number, val: any) => {
        const newItems = [...data.items];
        newItems[index] = val;
        onChange({ ...data, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = (data.items || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, items: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Testimonials Title" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Testimonials Subtitle" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Description" isRichText />

            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Testimonial Items</p>
                {data.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-5 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <FiTrash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Customer Name" value={item.name} onChange={(v) => updateItem(idx, { ...item, name: v })} placeholder="John Doe" />
                            <InputField label="Role" value={item.role} onChange={(v) => updateItem(idx, { ...item, role: v })} placeholder="CEO" />
                            <InputField label="Company" value={item.company} onChange={(v) => updateItem(idx, { ...item, company: v })} placeholder="Tech Inc" />
                            <ImageField label="Customer Avatar" value={item.avatar || ''} onChange={(url: string) => updateItem(idx, { ...item, avatar: url })} />
                        </div>
                        <InputField label="Feedback" value={item.feedback} onChange={(v) => updateItem(idx, { ...item, feedback: v })} placeholder="The message" isRichText />
                        <InputField label="Rating (1-5)" value={item.rating} onChange={(v) => updateItem(idx, { ...item, rating: Number(v) })} placeholder="5" type="number" />
                    </div>
                ))}
                <button type="button" onClick={addItem} className="w-full py-3 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Testimonial</button>
            </div>
            <CtaFields label="Section CTA" value={data.cta} onChange={(v) => onChange({ ...data, cta: v })} />
        </div>
    );
};

const TechStackEditor = ({ data, onChange }: any) => {
    const addCategory = () => {
        const newItems = [...(data.categories || []), { name: '', technologies: [] }];
        onChange({ ...data, categories: newItems });
    };

    const updateCategory = (index: number, val: any) => {
        const newItems = [...data.categories];
        newItems[index] = val;
        onChange({ ...data, categories: newItems });
    };

    const addTech = (catIdx: number) => {
        const newCats = [...data.categories];
        newCats[catIdx].technologies = [...newCats[catIdx].technologies, { name: '', icon: '' }];
        onChange({ ...data, categories: newCats });
    };

    const updateTech = (catIdx: number, techIdx: number, val: any) => {
        const newCats = [...data.categories];
        newCats[catIdx].technologies[techIdx] = val;
        onChange({ ...data, categories: newCats });
    };

    const removeCategory = (index: number) => {
        const newItems = (data.categories || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, categories: newItems });
    };

    const removeTech = (catIdx: number, techIdx: number) => {
        const newCats = [...data.categories];
        newCats[catIdx].technologies = newCats[catIdx].technologies.filter((_: any, i: number) => i !== techIdx);
        onChange({ ...data, categories: newCats });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Stack Title" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Stack Subtitle" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Stack Description" isRichText />

            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Tech Categories</p>
                {data.categories?.map((cat: any, cIdx: number) => (
                    <div key={cIdx} className="p-4 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                        <button
                            type="button"
                            onClick={() => removeCategory(cIdx)}
                            className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <FiTrash2 size={14} />
                        </button>
                        <InputField label="Category Name" value={cat.name} onChange={(v) => updateCategory(cIdx, { ...cat, name: v })} placeholder="Frontend / Backend" />
                        <div className="ml-4 border-l-2 border-black/3 pl-4">
                            {cat.technologies?.map((t: any, tIdx: number) => (
                                <div key={tIdx} className="grid grid-cols-2 gap-4 mb-2 relative group/tech">
                                    <button
                                        type="button"
                                        onClick={() => removeTech(cIdx, tIdx)}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/tech:opacity-100 transition-opacity z-10 shadow-sm"
                                    >
                                        <FiX size={8} />
                                    </button>
                                    <InputField label="Tech Name" value={t.name} onChange={(v) => updateTech(cIdx, tIdx, { ...t, name: v })} placeholder="React" />
                                    <InputField label="Icon" value={t.icon} onChange={(v) => updateTech(cIdx, tIdx, { ...t, icon: v })} placeholder="Icon string" />
                                </div>
                            ))}
                            <button type="button" onClick={() => addTech(cIdx)} className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest">+ Add Tech</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addCategory} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Category</button>
            </div>
        </div>
    );
};

const SectionCtaEditor = ({ data, onChange }: any) => (
    <div>
        <InputField label="Heading" value={data.heading} onChange={(v) => onChange({ ...data, heading: v })} placeholder="CTA Heading" isRichText />
        <InputField label="Subtext" value={data.subtext} onChange={(v) => onChange({ ...data, subtext: v })} placeholder="CTA Subtext" isRichText />
        <CtaFields label="Action Button" value={data.button} onChange={(v) => onChange({ ...data, button: v })} />
    </div>
);

const CertificationsEditor = ({ data, onChange }: any) => {
    const addItem = () => {
        const newItems = [...(data.items || []), { name: '', description: '', iconName: '', tag: '', tagVariant: 'primary' }];
        onChange({ ...data, items: newItems });
    };

    const updateItem = (index: number, val: any) => {
        const newItems = [...data.items];
        newItems[index] = val;
        onChange({ ...data, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = (data.items || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, items: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Certifications Title" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Certifications Subtitle" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Section Description" isRichText />
            <div className="mb-6">
                <ImageField label="Background Image" value={data.bgImage || ''} onChange={(url: string) => onChange({ ...data, bgImage: url })} />
            </div>
            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Certifications</p>
                {data.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                        <button type="button" onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <FiTrash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Name" value={item.name} onChange={(v) => updateItem(idx, { ...item, name: v })} placeholder="HIPAA Compliant" />
                            <InputField label="Icon Name (Lucide)" value={item.iconName} onChange={(v) => updateItem(idx, { ...item, iconName: v })} placeholder="LucideShieldCheck" />
                            <InputField label="Tag" value={item.tag} onChange={(v) => updateItem(idx, { ...item, tag: v })} placeholder="Certified" />
                            <InputField label="Tag Variant" value={item.tagVariant} onChange={(v) => updateItem(idx, { ...item, tagVariant: v })} placeholder="primary / success / info" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-end mt-4">
                            <div className="flex-1">
                                <InputField label="Description" value={item.description} onChange={(v) => updateItem(idx, { ...item, description: v })} placeholder="Short description" isRichText />
                            </div>
                            <div className="mb-4">
                                <ImageField label="Certificate Image" value={item.image || ''} onChange={(url: string) => updateItem(idx, { ...item, image: url })} />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Certification</button>
            </div>
        </div>
    );
};

const CompanyStatsEditor = ({ data, onChange }: any) => {
    const addItem = () => {
        const newItems = [...(data.stats || []), { label: '', value: '', description: '' }];
        onChange({ ...data, stats: newItems });
    };

    const updateItem = (index: number, val: any) => {
        const newItems = [...data.stats];
        newItems[index] = val;
        onChange({ ...data, stats: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = (data.stats || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, stats: newItems });
    };

    return (
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black/30">Company Performance Stats</p>
            {data.stats?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                    <button type="button" onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <FiTrash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Stat Label" value={item.label} onChange={(v) => updateItem(idx, { ...item, label: v })} placeholder="Clean Claims Rate" />
                        <InputField label="Stat Value" value={item.value} onChange={(v) => updateItem(idx, { ...item, value: v })} placeholder="99.2%" />
                    </div>
                    <InputField label="Stat Description" value={item.description} onChange={(v) => updateItem(idx, { ...item, description: v })} placeholder="Industry-leading accuracy" isRichText />
                </div>
            ))}
            <button type="button" onClick={addItem} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Stat</button>
        </div>
    );
};

const InsurancePayersEditor = ({ data, onChange }: any) => {
    const addItem = () => {
        const newItems = [...(data.items || []), { name: '', status: 'active', type: 'commercial' }];
        onChange({ ...data, items: newItems });
    };

    const updateItem = (index: number, val: any) => {
        const newItems = [...data.items];
        newItems[index] = val;
        onChange({ ...data, items: newItems });
    };

    const removeItem = (index: number) => {
        const newItems = (data.items || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, items: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Direct Payer Connectivity" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Interoperability" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Description" isRichText />
            <div className="grid grid-cols-3 gap-4 mb-6">
                <InputField label="Stats Value" value={data.statsValue} onChange={(v) => onChange({ ...data, statsValue: v })} placeholder="800+" />
                <InputField label="Stats Label" value={data.statsLabel} onChange={(v) => onChange({ ...data, statsLabel: v })} placeholder="EDI Connections active" />
                <ColorField label="Stats Color" value={data.statsColor} onChange={(v) => onChange({ ...data, statsColor: v })} />
            </div>

            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Payers</p>
                <div className="grid grid-cols-2 gap-4">
                    {data.items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-black/1 border border-black/4 rounded-xl mb-2 relative group">
                            <button type="button" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <FiTrash2 size={12} />
                            </button>
                            <InputField label="Payer Name" value={item.name} onChange={(v) => updateItem(idx, { ...item, name: v })} placeholder="Aetna" />
                            <ImageField label="Payer Logo" value={item.logo || ''} onChange={(v) => updateItem(idx, { ...item, logo: v })} />
                            <div className="grid grid-cols-2 gap-2">
                                <InputField label="Status" value={item.status} onChange={(v) => updateItem(idx, { ...item, status: v })} placeholder="active" />
                                <InputField label="Type" value={item.type} onChange={(v) => updateItem(idx, { ...item, type: v })} placeholder="commercial / government" />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addItem} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Payer</button>
            </div>

            <div className="mt-8 pt-6 border-t border-black/3">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black/30">Footer Note</p>
                <div className="grid grid-cols-3 gap-4">
                    <InputField label="Note Text" value={data.footerNoteText} onChange={(v) => onChange({ ...data, footerNoteText: v })} placeholder="Powered by Enterprise Clearinghouse EDI" />
                    <InputField label="Note Icon (Lucide)" value={data.footerNoteIcon} onChange={(v) => onChange({ ...data, footerNoteIcon: v })} placeholder="LucideZap" />
                    <ColorField label="Note Color" value={data.footerNoteColor} onChange={(v) => onChange({ ...data, footerNoteColor: v })} />
                </div>
            </div>
        </div>
    );
};

const AppointmentBookingEditor = ({ data, onChange }: any) => {
    const addValueProp = () => {
        const newItems = [...(data.valueProps || []), { title: '', description: '', icon: '', variant: 'primary' }];
        onChange({ ...data, valueProps: newItems });
    };

    const updateValueProp = (index: number, val: any) => {
        const newItems = [...data.valueProps];
        newItems[index] = val;
        onChange({ ...data, valueProps: newItems });
    };

    const removeValueProp = (index: number) => {
        const newItems = (data.valueProps || []).filter((_: any, i: number) => i !== index);
        onChange({ ...data, valueProps: newItems });
    };

    return (
        <div>
            <InputField label="Title" value={data.title} onChange={(v) => onChange({ ...data, title: v })} placeholder="Transform Your Revenue Cycle" />
            <InputField label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="Expert Consultation" />
            <InputField label="Description" value={data.description} onChange={(v) => onChange({ ...data, description: v })} placeholder="Description" isRichText />

            <div className="mt-6">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Value Propositions</p>
                {data.valueProps?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/1 border border-black/4 rounded-2xl mb-4 relative group">
                        <button type="button" onClick={() => removeValueProp(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <FiTrash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Title" value={item.title} onChange={(v) => updateValueProp(idx, { ...item, title: v })} placeholder="Free Performance Audit" />
                            <InputField label="Icon (Lucide)" value={item.icon} onChange={(v) => updateValueProp(idx, { ...item, icon: v })} placeholder="LucideMessageSquare" />
                        </div>
                        <InputField label="Description" value={item.description} onChange={(v) => updateValueProp(idx, { ...item, description: v })} placeholder="Description" isRichText />
                        <InputField label="Variant" value={item.variant} onChange={(v) => updateValueProp(idx, { ...item, variant: v })} placeholder="primary" />
                    </div>
                ))}
                <button type="button" onClick={addValueProp} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/40 hover:text-[#2563eb] transition-all">+ Add Value Proposition</button>
            </div>

            <div className="mt-8 pt-6 border-t border-black/3">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black/30">Security Block (Side)</p>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Security Title" value={data.securityTitle} onChange={(v) => onChange({ ...data, securityTitle: v })} placeholder="Secure PHI Protocol" />
                    <InputField label="Security Icon (Lucide)" value={data.securityIcon} onChange={(v) => onChange({ ...data, securityIcon: v })} placeholder="LucideShieldCheck" />
                    <ColorField label="Security Color" value={data.securityColor} onChange={(v) => onChange({ ...data, securityColor: v })} />
                </div>
                <InputField label="Security Description" value={data.securityDescription} onChange={(v) => onChange({ ...data, securityDescription: v })} placeholder="Encryption details" isRichText />
            </div>

            <div className="mt-8 pt-6 border-t border-black/3">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black/30">Form Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Form Title" value={data.formTitle} onChange={(v) => onChange({ ...data, formTitle: v })} placeholder="Consultation Inquiry" />
                    <InputField label="Form Security Icon" value={data.securityIconForm} onChange={(v) => onChange({ ...data, securityIconForm: v })} placeholder="LucideLock" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <ColorField label="Form Security Color" value={data.securityColorForm} onChange={(v) => onChange({ ...data, securityColorForm: v })} />
                    <InputField label="Response Note Text" value={data.responseNoteText} onChange={(v) => onChange({ ...data, responseNoteText: v })} placeholder="Average response time:" />
                    <InputField label="Response Note Value" value={data.responseNoteValue} onChange={(v) => onChange({ ...data, responseNoteValue: v })} placeholder="2.4 Hours" />
                </div>
                <ColorField label="Response Value Color" value={data.responseNoteValueColor} onChange={(v) => onChange({ ...data, responseNoteValueColor: v })} />
            </div>
        </div>
    );
};

const SectionManager = ({ sections, onChange, availableServices, availableCaseStudies }: { sections: any[], onChange: (sections: any[]) => void, availableServices: any[], availableCaseStudies: any[] }) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
    const [mediaPickerCallback, setMediaPickerCallback] = React.useState<(url: string) => void>(() => { });

    useEffect(() => {
        (window as any).openMediaPicker = (callback: (url: string) => void) => {
            setMediaPickerCallback(() => callback);
            setIsMediaPickerOpen(true);
        };
    }, []);

    const toggleSection = (idx: number) => setOpenIndex(openIndex === idx ? null : idx);

    const addSection = (type: string) => {
        const defaultContents: any = {
            HERO: { headline: '', subheading: '', primaryCta: { label: '', link: '' }, secondaryCta: { label: '', link: '' }, socialProof: [], image: '' },
            WHAT_WE_DO: { title: '', description: '', serviceIds: [], cta: { label: '', link: '' }, logos: [] },
            ABOUT_US: { title: '', subtitle: '', description: '', highlights: [], stats: [], cta: { label: '', link: '' } },
            WHY_CHOOSE_US: { title: '', subtitle: '', description: '', image: '', points: [], cta: { label: '', link: '' } },
            PROCESS: { title: '', subtitle: '', description: '', steps: [], cta: { label: '', link: '' } },
            CASE_STUDIES: { title: '', subtitle: '', description: '', caseStudyIds: [], items: [], cta: { label: '', link: '' } },
            TESTIMONIALS: { title: '', subtitle: '', description: '', items: [], cta: { label: '', link: '' } },
            TECH_STACK: { title: '', subtitle: '', description: '', categories: [] },
            CTA: { heading: '', subtext: '', button: { label: '', link: '' } },
            CERTIFICATIONS: { title: '', subtitle: '', items: [] },
            COMPANY_STATS: { stats: [] },
            INSURANCE_PAYERS: { title: '', subtitle: '', description: '', items: [], statsValue: '', statsLabel: '', statsColor: '', footerNoteText: '', footerNoteIcon: '', footerNoteColor: '' },
            APPOINTMENT_BOOKING: { title: '', subtitle: '', description: '', valueProps: [], securityTitle: '', securityDescription: '', securityIcon: '', securityColor: '', formTitle: '', securityIconForm: '', securityColorForm: '', responseNoteText: '', responseNoteValue: '', responseNoteValueColor: '' }
        };

        const newSection = {
            type,
            order: sections.length + 1,
            content: defaultContents[type] || {}
        };
        onChange([...sections, newSection]);
        setOpenIndex(sections.length);
    };

    const updateSectionContent = (idx: number, content: any) => {
        const newSections = [...sections];
        newSections[idx].content = content;
        onChange(newSections);
    };

    const removeSection = (idx: number) => {
        const newSections = sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
        onChange(newSections);
    };

    const moveSection = (idx: number, direction: 'up' | 'down') => {
        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === sections.length - 1) return;

        const newSections = [...sections];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];

        const finalSections = newSections.map((s, i) => ({ ...s, order: i + 1 }));
        onChange(finalSections);
        setOpenIndex(targetIdx);
    };

    const renderEditor = (section: any, idx: number) => {
        const props = {
            data: section.content,
            onChange: (v: any) => updateSectionContent(idx, v),
            availableServices,
            availableCaseStudies
        };
        switch (section.type) {
            case 'HERO': return <HeroEditor {...props} />;
            case 'WHAT_WE_DO': return <WhatWeDoEditor {...props} />;
            case 'ABOUT_US': return <AboutUsEditor {...props} />;
            case 'WHY_CHOOSE_US': return <EditSection {...props} />;
            case 'PROCESS': return <ProcessEditor {...props} />;
            case 'CASE_STUDIES': return <CaseStudiesEditor {...props} />;
            case 'TESTIMONIALS': return <TestimonialsEditor {...props} />;
            case 'TECH_STACK': return <TechStackEditor {...props} />;
            case 'CTA': return <SectionCtaEditor {...props} />;
            case 'CERTIFICATIONS': return <CertificationsEditor {...props} />;
            case 'COMPANY_STATS': return <CompanyStatsEditor {...props} />;
            case 'INSURANCE_PAYERS': return <InsurancePayersEditor {...props} />;
            case 'APPOINTMENT_BOOKING': return <AppointmentBookingEditor {...props} />;
            default: return <p>Unknown section type: {section.type}</p>;
        }
    };

    return (
        <div className="mt-8 space-y-6">

            <div className="space-y-4">
                {sections.sort((a, b) => a.order - b.order).map((section, idx) => (
                    <div key={idx} className="bg-white border border-black/6 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md">
                        <div
                            onClick={() => toggleSection(idx)}
                            className="flex items-center justify-between p-6 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center text-[10px] font-black text-black/30 group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-all">
                                    {section.order}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-black group-hover:text-[#2563eb] transition-colors">{section.type.replace(/_/g, ' ')}</h4>
                                    <p className="text-[9px] text-black/30 uppercase tracking-tighter">Section ID: {idx + 1}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => moveSection(idx, 'up')} className="p-2 hover:bg-black/[0.03] rounded-lg transition-colors text-black/20 hover:text-[#2563eb]"><FiChevronUp /></button>
                                <button onClick={() => moveSection(idx, 'down')} className="p-2 hover:bg-black/[0.03] rounded-lg transition-colors text-black/20 hover:text-[#2563eb]"><FiChevronDown /></button>
                                <div className="w-[1px] h-4 bg-black/[0.06] mx-1" />
                                <button onClick={() => removeSection(idx)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-black/20 hover:text-red-500"><FiTrash2 /></button>
                            </div>
                        </div>

                        {openIndex === idx && (
                            <div className="p-8 pt-0 border-t border-black/[0.03] animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="mt-6">
                                    {renderEditor(section, idx)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>


            <div className="p-10 border-2 border-dashed border-black/[0.06] rounded-[2.5rem] bg-white/50 backdrop-blur-sm">

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {['HERO', 'WHAT_WE_DO', 'ABOUT_US', 'WHY_CHOOSE_US', 'PROCESS', 'CASE_STUDIES', 'TESTIMONIALS', 'TECH_STACK', 'CTA', 'CERTIFICATIONS', 'COMPANY_STATS', 'INSURANCE_PAYERS', 'APPOINTMENT_BOOKING'].map((type) => (
                        <button
                            key={type}
                            onClick={() => addSection(type)}
                            className="p-4 bg-white border border-black/[0.06] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#2563eb]/30 hover:scale-[1.02] active:scale-95 transition-all group shadow-sm"
                        >
                            {type === 'HERO' && <FiLayout size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'WHAT_WE_DO' && <FiLayers size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'ABOUT_US' && <FiUser size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'WHY_CHOOSE_US' && <FiCheckCircle size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'PROCESS' && <FiList size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'CASE_STUDIES' && <FiImage size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'TESTIMONIALS' && <FiType size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'TECH_STACK' && <FiCode size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'CTA' && <FiLink size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'CERTIFICATIONS' && <FiCheckCircle size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'COMPANY_STATS' && <FiList size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'INSURANCE_PAYERS' && <FiLayers size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            {type === 'APPOINTMENT_BOOKING' && <FiPlus size={16} className="text-black/20 group-hover:text-[#2563eb]" />}
                            <span className="text-[9px] font-black uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">{type.replace(/_/g, ' ')}</span>
                        </button>
                    ))}
                </div>
            </div>

            <MediaPicker
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={mediaPickerCallback}
            />
        </div>
    );
};

export default SectionManager;
