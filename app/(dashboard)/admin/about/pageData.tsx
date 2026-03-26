"use client";

import React from 'react';
import { FiPlus, FiTrash2, FiStar, FiBookOpen, FiZap, FiLink, FiList, FiUsers, FiBarChart2 } from 'react-icons/fi';
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

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-6 mt-8 border-b border-black/3 pb-2">
        <Icon size={14} className="text-[#2563eb]" />
        <h4 className="text-[11px] font-black uppercase tracking-widest text-black/60">{title}</h4>
    </div>
);

interface AboutPageDataProps {
    data: {
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
            stats?: { label: string; value: string; icon: string }[];
            process?: { step: string; title: string; description: string; icon: string }[];
            testimonials?: { name: string; role: string; clinic: string; content: string; avatar: string }[];
        };
    };
    onChange: (newData: any) => void;
}

const AboutPageData = ({ data, onChange }: AboutPageDataProps) => {

    const updatePageData = (section: string, value: any) => {
        onChange({
            ...data,
            pageData: {
                ...(data.pageData || {}),
                [section]: value
            }
        });
    };

    const addMember = () => {
        const members = data.pageData?.leadership?.members || [];
        const nextId = members.length > 0 ? Math.max(...members.map((m: any) => m.id)) + 1 : 1;
        updatePageData('leadership', {
            ...(data.pageData?.leadership || {}),
            members: [...members, { id: nextId, name: '', role: '', description: '', initials: '' }]
        });
    };

    const updateMember = (index: number, val: any) => {
        const members = [...(data.pageData?.leadership?.members || [])];
        members[index] = val;
        updatePageData('leadership', {
            ...(data.pageData?.leadership || {}),
            members: members
        });
    };

    const removeMember = (index: number) => {
        const members = (data.pageData?.leadership?.members || []).filter((_: any, i: number) => i !== index);
        updatePageData('leadership', {
            ...(data.pageData?.leadership || {}),
            members: members
        });
    };

    const addCertification = () => {
        const certs = data.pageData?.compliance?.certifications || [];
        updatePageData('compliance', {
            ...(data.pageData?.compliance || {}),
            certifications: [...certs, '']
        });
    };

    const updateCertification = (index: number, val: string) => {
        const certs = [...(data.pageData?.compliance?.certifications || [])];
        certs[index] = val;
        updatePageData('compliance', {
            ...(data.pageData?.compliance || {}),
            certifications: certs
        });
    };

    const removeCertification = (index: number) => {
        const certs = (data.pageData?.compliance?.certifications || []).filter((_: any, i: number) => i !== index);
        updatePageData('compliance', {
            ...(data.pageData?.compliance || {}),
            certifications: certs
        });
    };

    const addStat = () => {
        const stats = data.pageData?.stats || [];
        updatePageData('stats', [...stats, { label: '', value: '', icon: '' }]);
    };

    const updateStat = (index: number, val: any) => {
        const stats = [...(data.pageData?.stats || [])];
        stats[index] = val;
        updatePageData('stats', stats);
    };

    const removeStat = (index: number) => {
        const stats = (data.pageData?.stats || []).filter((_: any, i: number) => i !== index);
        updatePageData('stats', stats);
    };

    const addStep = () => {
        const process = data.pageData?.process || [];
        updatePageData('process', [...process, { step: '', title: '', description: '', icon: '' }]);
    };

    const updateStep = (index: number, val: any) => {
        const process = [...(data.pageData?.process || [])];
        process[index] = val;
        updatePageData('process', process);
    };

    const removeStep = (index: number) => {
        const process = (data.pageData?.process || []).filter((_: any, i: number) => i !== index);
        updatePageData('process', process);
    };

    const addTestimonial = () => {
        const testimonials = data.pageData?.testimonials || [];
        updatePageData('testimonials', [...testimonials, { name: '', role: '', clinic: '', content: '', avatar: '' }]);
    };

    const updateTestimonial = (index: number, val: any) => {
        const testimonials = [...(data.pageData?.testimonials || [])];
        testimonials[index] = val;
        updatePageData('testimonials', testimonials);
    };

    const removeTestimonial = (index: number) => {
        const testimonials = (data.pageData?.testimonials || []).filter((_: any, i: number) => i !== index);
        updatePageData('testimonials', testimonials);
    };

    return (
        <div className="space-y-8">

            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Page Header" icon={FiZap} />
                <InputField
                    label="Title"
                    value={data.pageData?.pageHeader?.title}
                    onChange={(v) => updatePageData('pageHeader', { ...data.pageData?.pageHeader, title: v })}
                    placeholder="About Timberlake"
                />
                <InputField
                    label="Description"
                    value={data.pageData?.pageHeader?.description}
                    onChange={(v) => updatePageData('pageHeader', { ...data.pageData?.pageHeader, description: v })}
                    placeholder="Short intro text"
                    isRichText
                />
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Mission & Vision" icon={FiBookOpen} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-black/1 border border-black/4 rounded-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-[#2563eb]">Our Mission</p>
                        <InputField label="Title" value={data.pageData?.missionVision?.mission?.title} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, mission: { ...data.pageData?.missionVision?.mission, title: v } })} placeholder="Our Mission" />
                        <InputField label="Icon (Lucide)" value={data.pageData?.missionVision?.mission?.icon} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, mission: { ...data.pageData?.missionVision?.mission, icon: v } })} placeholder="LucideTarget" />
                        <InputField label="Description" value={data.pageData?.missionVision?.mission?.description} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, mission: { ...data.pageData?.missionVision?.mission, description: v } })} placeholder="Mission description" isRichText />
                        <InputField label="Highlighted Text" value={data.pageData?.missionVision?.mission?.highlightedText} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, mission: { ...data.pageData?.missionVision?.mission, highlightedText: v } })} placeholder="accurate, transparent..." />
                    </div>
                    <div className="p-6 bg-black/1 border border-black/4 rounded-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-[#2563eb]">Our Vision</p>
                        <InputField label="Title" value={data.pageData?.missionVision?.vision?.title} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, vision: { ...data.pageData?.missionVision?.vision, title: v } })} placeholder="Our Vision" />
                        <InputField label="Icon (Lucide)" value={data.pageData?.missionVision?.vision?.icon} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, vision: { ...data.pageData?.missionVision?.vision, icon: v } })} placeholder="LucideEye" />
                        <InputField label="Description" value={data.pageData?.missionVision?.vision?.description} onChange={(v) => updatePageData('missionVision', { ...data.pageData?.missionVision, vision: { ...data.pageData?.missionVision?.vision, description: v } })} placeholder="Vision description" isRichText />
                    </div>
                </div>
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Leadership" icon={FiStar} />
                <InputField
                    label="Section Title"
                    value={data.pageData?.leadership?.title}
                    onChange={(v) => updatePageData('leadership', { ...data.pageData?.leadership, title: v })}
                    placeholder="Executive Leadership"
                />
                <InputField
                    label="Section Subtitle"
                    value={data.pageData?.leadership?.subtitle}
                    onChange={(v) => updatePageData('leadership', { ...data.pageData?.leadership, subtitle: v })}
                    placeholder="Guided by veterans..."
                    isRichText
                />

                <div className="mt-8">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4">Team Members</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(data.pageData?.leadership?.members || [])?.map((member: any, idx: number) => (
                            <div key={idx} className="p-6 bg-black/1 border border-black/4 rounded-3xl relative group">
                                <button
                                    onClick={() => removeMember(idx)}
                                    className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                                <div className="grid grid-cols-1 gap-2">
                                    <InputField label="Name" value={member.name} onChange={(v) => updateMember(idx, { ...member, name: v })} placeholder="Name" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <InputField label="Role" value={member.role} onChange={(v) => updateMember(idx, { ...member, role: v })} placeholder="CEO" />
                                        <InputField label="Initials" value={member.initials} onChange={(v) => updateMember(idx, { ...member, initials: v })} placeholder="AC" />
                                    </div>
                                    <InputField label="Description" value={member.description} onChange={(v) => updateMember(idx, { ...member, description: v })} placeholder="Experience..." isRichText />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addMember} className="w-full mt-6 py-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                        <FiPlus /> Add Member
                    </button>
                </div>
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Compliance" icon={FiLink} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Compliance Title" value={data.pageData?.compliance?.title} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, title: v })} placeholder="Uncompromising Compliance" />
                    <InputField label="Badge Text" value={data.pageData?.compliance?.badge} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, badge: v })} placeholder="Certified Protocol" />
                    <InputField label="Badge Icon" value={data.pageData?.compliance?.badgeIcon} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, badgeIcon: v })} placeholder="LucideShield" />
                    <InputField label="Verification Code" value={data.pageData?.compliance?.verificationCode} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, verificationCode: v })} placeholder="T-882-CLM" />
                    <InputField label="Watermark Icon" value={data.pageData?.compliance?.watermarkIcon} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, watermarkIcon: v })} placeholder="LucideShieldCheck" />
                </div>
                <InputField label="Quote" value={data.pageData?.compliance?.quote} onChange={(v) => updatePageData('compliance', { ...data.pageData?.compliance, quote: v })} placeholder="Compliance statement..." isRichText />

                <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4">Certifications</p>
                    <div className="flex flex-wrap gap-3">
                        {(data.pageData?.compliance?.certifications || [])?.map((cert: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-black/2 border border-black/6 rounded-xl px-3 py-1">
                                <input
                                    value={cert}
                                    onChange={(e) => updateCertification(idx, e.target.value)}
                                    className="bg-transparent text-xs focus:outline-none min-w-[100px]"
                                    placeholder="Certification Name"
                                />
                                <button onClick={() => removeCertification(idx)} className="text-red-300 hover:text-red-500">
                                    <FiTrash2 size={10} />
                                </button>
                            </div>
                        ))}
                        <button onClick={addCertification} className="px-3 py-1 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb]">
                            + Add
                        </button>
                    </div>
                </div>
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Success Metrics" icon={FiBarChart2} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(data.pageData?.stats || [])?.map((stat: any, idx: number) => (
                        <div key={idx} className="p-6 bg-black/1 border border-black/4 rounded-3xl relative group">
                            <button onClick={() => removeStat(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiTrash2 size={14} />
                            </button>
                            <InputField label="Value" value={stat.value} onChange={(v) => updateStat(idx, { ...stat, value: v })} placeholder="98%" />
                            <InputField label="Label" value={stat.label} onChange={(v) => updateStat(idx, { ...stat, label: v })} placeholder="Clean Claim Rate" />
                            <InputField label="Icon (Lucide)" value={stat.icon} onChange={(v) => updateStat(idx, { ...stat, icon: v })} placeholder="LucideTrendingUp" />
                        </div>
                    ))}
                </div>
                <button onClick={addStat} className="w-full mt-6 py-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add Metric
                </button>
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Our Process" icon={FiList} />
                <div className="space-y-6">
                    {(data.pageData?.process || [])?.map((step: any, idx: number) => (
                        <div key={idx} className="p-6 bg-black/1 border border-black/4 rounded-3xl relative group">
                            <button onClick={() => removeStep(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiTrash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputField label="Step #" value={step.step} onChange={(v) => updateStep(idx, { ...step, step: v })} placeholder="01" />
                                <InputField label="Title" value={step.title} onChange={(v) => updateStep(idx, { ...step, title: v })} placeholder="Data Integration" />
                                <div className="md:col-span-2">
                                    <InputField label="Description" value={step.description} onChange={(v) => updateStep(idx, { ...step, description: v })} placeholder="How it works..." isRichText />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addStep} className="w-full mt-6 py-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add Step
                </button>
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Testimonials" icon={FiUsers} />
                <div className="grid grid-cols-1 gap-6">
                    {(data.pageData?.testimonials || [])?.map((tm: any, idx: number) => (
                        <div key={idx} className="p-6 bg-black/1 border border-black/4 rounded-3xl relative group">
                            <button onClick={() => removeTestimonial(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiTrash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <InputField label="Name" value={tm.name} onChange={(v) => updateTestimonial(idx, { ...tm, name: v })} placeholder="Dr. John Smith" />
                                    <InputField label="Role" value={tm.role} onChange={(v) => updateTestimonial(idx, { ...tm, role: v })} placeholder="Medical Director" />
                                    <InputField label="Clinic" value={tm.clinic} onChange={(v) => updateTestimonial(idx, { ...tm, clinic: v })} placeholder="City Health Clinic" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputField label="Content" value={tm.content} onChange={(v) => updateTestimonial(idx, { ...tm, content: v })} placeholder="Their services improved our revenue..." isRichText />
                                    <InputField label="Avatar URL" value={tm.avatar} onChange={(v) => updateTestimonial(idx, { ...tm, avatar: v })} placeholder="/avatars/smith.jpg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addTestimonial} className="w-full mt-6 py-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add Testimonial
                </button>
            </div>
        </div>
    );
};

export default AboutPageData;