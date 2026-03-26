"use client";

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiActivity, FiShare2, FiLayers, FiChevronUp, FiChevronDown, FiLink, FiShield, FiFileText, FiPhone, FiMail, FiMapPin, FiCheckCircle, FiX, FiInfo, FiTag } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';

interface InputFieldProps {
    label: string;
    value: any;
    onChange: (val: any) => void;
    placeholder: string;
    type?: string;
    isTextArea?: boolean;
}

const InputField = ({ label, value, onChange, placeholder, type = "text", isTextArea = false }: InputFieldProps) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        {isTextArea ? (
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

const BrandEditor = ({ data, onChange }: any) => (
    <div className="p-6 bg-white border border-black/6 rounded-4xl mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
            <FiInfo size={14} /> Brand & Mission
        </p>
        <InputField
            label="Company Name"
            value={data.companyName}
            onChange={(v) => onChange({ ...data, companyName: v })}
            placeholder="Timberlake"
        />
        <InputField
            label="Mission Statement"
            value={data.mission}
            onChange={(v) => onChange({ ...data, mission: v })}
            placeholder="Providing enterprise-grade revenue cycle management..."
            isTextArea
        />
        <div className="mt-4 pt-4 border-t border-black/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-3">Compliance Section</p>
            <InputField
                label="Compliance Text"
                value={data.complianceText}
                onChange={(v) => onChange({ ...data, complianceText: v })}
                placeholder="HIPAA & SOC2 Compliant"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.complianceBadges || []).map((badge: any, bIdx: number) => (
                    <div key={bIdx} className="p-4 bg-black/1 border border-black/5 rounded-2xl relative group">
                        <button onClick={() => {
                            const newBadges = data.complianceBadges.filter((_: any, i: number) => i !== bIdx);
                            onChange({ ...data, complianceBadges: newBadges });
                        }} className="absolute top-2 right-2 text-black/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"><FiX size={12} /></button>
                        <InputField label="Badge Label" value={badge.label} onChange={(v) => {
                            const newBadges = [...data.complianceBadges];
                            newBadges[bIdx].label = v;
                            onChange({ ...data, complianceBadges: newBadges });
                        }} placeholder="HIPAA Compliant" />
                        <InputField label="Icon (Lucide)" value={badge.icon} onChange={(v) => {
                            const newBadges = [...data.complianceBadges];
                            newBadges[bIdx].icon = v;
                            onChange({ ...data, complianceBadges: newBadges });
                        }} placeholder="LucideShieldCheck" />
                    </div>
                ))}
            </div>
            <button onClick={() => onChange({ ...data, complianceBadges: [...(data.complianceBadges || []), { label: '', icon: '', color: 'primary' }] })} className="w-full py-2 mt-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/30 hover:text-[#2563eb] transition-all">+ Add Compliance Badge</button>
        </div>
    </div>
);

const CollectionPicker = ({ title, itemIds = [], availableItems = [], onChange, labelField = "title" }: any) => {
    const [idToRemove, setIdToRemove] = useState<string | null>(null);

    const toggleItem = (itemId: string) => {
        if (itemIds.includes(itemId)) return;
        onChange([...itemIds, itemId]);
    };

    const removeItem = () => {
        if (idToRemove) {
            onChange(itemIds.filter((id: string) => id !== idToRemove));
            setIdToRemove(null);
        }
    };

    const selectedItems = availableItems.filter((i: any) => itemIds.includes(i._id || i.id));
    const toSelect = availableItems.filter((i: any) => !itemIds.includes(i._id || i.id));

    return (
        <div className="p-6 bg-white border border-black/6 rounded-4xl mb-6 shadow-sm">
            <ConfirmationModal
                isOpen={idToRemove !== null}
                title="Remove Item"
                message="Remove this item from the footer links?"
                onConfirm={removeItem}
                onCancel={() => setIdToRemove(null)}
                confirmLabel="Yes, Remove"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
                <FiLayers size={14} /> {title}
            </p>

            <div className="mb-4 relative">
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            toggleItem(e.target.value);
                            e.target.value = "";
                        }
                    }}
                    className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all appearance-none cursor-pointer pr-10"
                >
                    <option value="">+ Select {title} to display...</option>
                    {toSelect.map((item: any) => (
                        <option key={item._id || item.id} value={item._id || item.id}>{item[labelField]}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/20">
                    <FiChevronDown size={14} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-black/1 border border-black/5 rounded-2xl min-h-[50px] items-center">
                {selectedItems.length > 0 ? selectedItems.map((item: any) => (
                    <div key={item._id || item.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#2563eb]/20 rounded-full shadow-sm">
                        <span className="text-[10px] font-bold text-black">{item[labelField]}</span>
                        <button onClick={() => setIdToRemove(item._id || item.id)} className="p-1 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-full transition-all">
                            <FiX size={10} />
                        </button>
                    </div>
                )) : <p className="text-[9px] text-black/20 w-full text-center italic">No items selected.</p>}
            </div>
        </div>
    );
};

const CustomSectionsEditor = ({ sections = [], onChange }: any) => {
    const addSection = () => onChange([...sections, { title: '', links: [] }]);
    const updateSection = (idx: number, val: any) => {
        const next = [...sections];
        next[idx] = val;
        onChange(next);
    };
    const removeSection = (idx: number) => onChange(sections.filter((_: any, i: number) => i !== idx));

    const addLink = (sIdx: number) => {
        const next = [...sections];
        next[sIdx].links = [...(next[sIdx].links || []), { label: '', href: '' }];
        onChange(next);
    };

    return (
        <div className="p-6 bg-white border border-black/6 rounded-4xl mb-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
                <FiPlus size={14} /> Custom Footer Sections
            </p>
            <div className="space-y-6">
                {sections.map((section: any, sIdx: number) => (
                    <div key={sIdx} className="p-5 bg-black/1 border border-black/5 rounded-3xl relative group">
                        <button onClick={() => removeSection(sIdx)} className="absolute top-4 right-4 text-black/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={16} /></button>
                        <InputField label="Section Title" value={section.title} onChange={(v) => updateSection(sIdx, { ...section, title: v })} placeholder="e.g. Quick Links" />
                        <div className="mt-4 space-y-2">
                            {section.links?.map((link: any, lIdx: number) => (
                                <div key={lIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border border-black/5 rounded-xl relative group/link">
                                    <InputField label="Label" value={link.label} onChange={(v) => {
                                        const next = [...sections];
                                        next[sIdx].links[lIdx].label = v;
                                        onChange(next);
                                    }} placeholder="Link Label" />
                                    <InputField label="URL" value={link.href} onChange={(v) => {
                                        const next = [...sections];
                                        next[sIdx].links[lIdx].href = v;
                                        onChange(next);
                                    }} placeholder="/url" />
                                    <button onClick={() => {
                                        const next = [...sections];
                                        next[sIdx].links = next[sIdx].links.filter((_: any, i: number) => i !== lIdx);
                                        onChange(next);
                                    }} className="absolute top-2 right-2 text-black/5 hover:text-red-500 opacity-0 group-hover/link:opacity-100 transition-all"><FiX size={10} /></button>
                                </div>
                            ))}
                            <button onClick={() => addLink(sIdx)} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/20 hover:text-[#2563eb] transition-all">+ Add Link</button>
                        </div>
                    </div>
                ))}
                <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-black/6 rounded-3xl text-[9px] font-black uppercase tracking-widest text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add Custom Section
                </button>
            </div>
        </div>
    );
};

const ContactEditor = ({ data, onChange }: any) => (
    <div className="p-6 bg-white border border-black/6 rounded-4xl mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
            <FiPhone size={14} /> Contact Information
        </p>
        <InputField label="Contact Selection Title" value={data.contactTitle} onChange={(v) => onChange({ ...data, contactTitle: v })} placeholder="Contact Operations" />
        <div className="space-y-4">
            {(data.contactDetails || []).map((detail: any, dIdx: number) => (
                <div key={dIdx} className="p-4 bg-black/1 border border-black/5 rounded-2xl relative group">
                    <button onClick={() => {
                        const next = data.contactDetails.filter((_: any, i: number) => i !== dIdx);
                        onChange({ ...data, contactDetails: next });
                    }} className="absolute top-2 right-2 text-black/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={12} /></button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InputField label="Label" value={detail.label} onChange={(v) => {
                            const next = [...data.contactDetails];
                            next[dIdx].label = v;
                            onChange({ ...data, contactDetails: next });
                        }} placeholder="Support Line" />
                        <InputField label="Value" value={detail.value} onChange={(v) => {
                            const next = [...data.contactDetails];
                            next[dIdx].value = v;
                            onChange({ ...data, contactDetails: next });
                        }} placeholder="+1..." />
                        <InputField label="Icon (Lucide)" value={detail.icon} onChange={(v) => {
                            const next = [...data.contactDetails];
                            next[dIdx].icon = v;
                            onChange({ ...data, contactDetails: next });
                        }} placeholder="LucidePhone" />
                        <InputField label="Type" value={detail.type} onChange={(v) => {
                            const next = [...data.contactDetails];
                            next[dIdx].type = v;
                            onChange({ ...data, contactDetails: next });
                        }} placeholder="phone/email/address" />
                    </div>
                </div>
            ))}
            <button onClick={() => onChange({ ...data, contactDetails: [...(data.contactDetails || []), { label: '', value: '', icon: '', type: '' }] })} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/30 hover:text-[#2563eb] transition-all">+ Add Contact Detail</button>
        </div>
    </div>
);

const LegalEditor = ({ data, onChange }: any) => (
    <div className="p-6 bg-white border border-black/6 rounded-4xl mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4 flex items-center gap-2">
            <FiFileText size={14} /> Legal & Copyright
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Copyright Year" value={data.copyrightYear} onChange={(v) => onChange({ ...data, copyrightYear: Number(v) })} placeholder="2024" type="number" />
            <InputField label="Copyright Company" value={data.copyrightCompany} onChange={(v) => onChange({ ...data, copyrightCompany: v })} placeholder="Timberlake Medical Billing" />
            <InputField label="Tagline" value={data.copyrightTagline} onChange={(v) => onChange({ ...data, copyrightTagline: v })} placeholder="Specialized RCM Solutions..." />
        </div>
        <div className="mt-4 pt-4 border-t border-black/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-3">Legal Links</p>
            <div className="space-y-4">
                {(data.legalLinks || []).map((link: any, lIdx: number) => (
                    <div key={lIdx} className="flex gap-4 p-3 bg-black/1 border border-black/5 rounded-xl group relative">
                        <button onClick={() => {
                            const next = data.legalLinks.filter((_: any, i: number) => i !== lIdx);
                            onChange({ ...data, legalLinks: next });
                        }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"><FiX size={10} /></button>
                        <div className="flex-1"><InputField label="Label" value={link.label} onChange={(v) => {
                            const next = [...data.legalLinks];
                            next[lIdx].label = v;
                            onChange({ ...data, legalLinks: next });
                        }} placeholder="Privacy Policy" /></div>
                        <div className="flex-1"><InputField label="URL" value={link.href} onChange={(v) => {
                            const next = [...data.legalLinks];
                            next[lIdx].href = v;
                            onChange({ ...data, legalLinks: next });
                        }} placeholder="/privacy-policy" /></div>
                    </div>
                ))}
                <button onClick={() => onChange({ ...data, legalLinks: [...(data.legalLinks || []), { label: '', href: '' }] })} className="w-full py-2 border border-dashed border-black/10 rounded-xl text-[9px] font-black uppercase text-black/30 hover:text-[#2563eb] transition-all">+ Add Legal Link</button>
            </div>
        </div>
    </div>
);

const FooterData = ({ data, onChange, availableServices, availableBlogs }: any) => {
    return (
        <div className="mt-4 pb-20">
            <BrandEditor
                data={data}
                onChange={(newData: any) => onChange(newData)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputField
                        label="Solutions Section Title"
                        value={data.solutionsTitle}
                        onChange={(v) => onChange({ ...data, solutionsTitle: v })}
                        placeholder="Solutions"
                    />
                    <CollectionPicker
                        title="Selected Services"
                        itemIds={data.serviceIds || []}
                        availableItems={availableServices}
                        onChange={(ids: string[]) => onChange({ ...data, serviceIds: ids })}
                        labelField="title"
                    />
                </div>
                <div>
                    <InputField
                        label="Resources Section Title"
                        value={data.resourcesTitle}
                        onChange={(v) => onChange({ ...data, resourcesTitle: v })}
                        placeholder="Resources"
                    />
                    <CollectionPicker
                        title="Selected Blogs"
                        itemIds={data.blogPostIds || []}
                        availableItems={availableBlogs}
                        onChange={(ids: string[]) => onChange({ ...data, blogPostIds: ids })}
                        labelField="title"
                    />
                </div>
            </div>

            <CustomSectionsEditor
                sections={data.customSections || []}
                onChange={(sections: any) => onChange({ ...data, customSections: sections })}
            />

            <ContactEditor
                data={data}
                onChange={(newData: any) => onChange(newData)}
            />

            <LegalEditor
                data={data}
                onChange={(newData: any) => onChange(newData)}
            />
        </div>
    );
};

export default FooterData;