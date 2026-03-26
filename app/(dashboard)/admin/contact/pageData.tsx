"use client";

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiActivity, FiInfo, FiList, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';
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
                className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
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
                className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-black/20 font-medium"
            />
        </div>
    </div>
);

const HeaderEditor = ({ data, onChange }: { data: any, onChange: (val: any) => void }) => (
    <div className="p-8 bg-white border border-black/6 rounded-[2.5rem] mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-6 flex items-center gap-2">
            <FiInfo size={14} /> Page Header
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                label="Page Title"
                value={data?.pageTitle}
                onChange={(v: any) => onChange({ ...data, pageTitle: v })}
                placeholder="e.g. Contact Our Experts"
            />
            <InputField
                label="Page Subtitle"
                value={data?.pageSubTitle}
                onChange={(v: any) => onChange({ ...data, pageSubTitle: v })}
                placeholder="e.g. Ready to transform your practice?"
            />
        </div>
    </div>
);

const HeroContentEditor = ({ data, onChange }: { data: any, onChange: (val: any) => void }) => (
    <div className="p-8 bg-white border border-black/6 rounded-[2.5rem] mb-6 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-6 flex items-center gap-2">
            <FiActivity size={14} /> Hero Section
        </p>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Hero Kicker"
                    value={data?.heroKicker}
                    onChange={(v: any) => onChange({ ...data, heroKicker: v })}
                    placeholder="e.g. Direct Line"
                />
                <InputField
                    label="Hero Title (Main)"
                    value={data?.heroTitleMain}
                    onChange={(v: any) => onChange({ ...data, heroTitleMain: v })}
                    placeholder="e.g. Let's Discuss Your"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Hero Title (Highlighted)"
                    value={data?.heroTitleHighlight}
                    onChange={(v: any) => onChange({ ...data, heroTitleHighlight: v })}
                    placeholder="e.g. Revenue Strategy"
                />
                <InputField
                    label="Highlight Style"
                    value={data?.heroTitleStyle}
                    onChange={(v: any) => onChange({ ...data, heroTitleStyle: v })}
                    placeholder="e.g. italic"
                />
            </div>
            <div className="min-h-[300px]">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
                    Hero Description / Main Content
                </label>
                <LexicalEditor
                    value={data?.content || ''}
                    onChange={(v) => onChange({ ...data, content: v })}
                    placeholder="Write the hero description or main content here..."
                />
            </div>
        </div>
    </div>
);

const ContactDetailsEditor = ({ details, onChange }: { details: any[], onChange: (val: any[]) => void }) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const addDetail = () => {
        const newDetail = {
            id: `contact-${Date.now()}`,
            label: '',
            value: '',
            subtext: '',
            icon: 'LucidePhone',
            color: 'primary'
        };
        onChange([...(details || []), newDetail]);
    };

    const updateDetail = (index: number, val: any) => {
        const newDetails = [...details];
        newDetails[index] = val;
        onChange(newDetails);
    };

    const removeDetail = () => {
        if (itemToDelete !== null) {
            onChange(details.filter((_, i) => i !== itemToDelete));
            setItemToDelete(null);
        }
    };

    const moveDetail = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === details.length - 1) return;
        const newDetails = [...details];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newDetails[index], newDetails[targetIndex]] = [newDetails[targetIndex], newDetails[index]];
        onChange(newDetails);
    };

    return (
        <div className="space-y-6 mb-6">
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Remove Contact Detail"
                message="Are you sure you want to remove this contact entry? This will update the live contact grid."
                onConfirm={removeDetail}
                onCancel={() => setItemToDelete(null)}
                confirmLabel="Yes, Remove Detail"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2 ml-2">
                <FiList size={14} /> Contact Details ({details?.length || 0})
            </p>
            {details?.map((item, idx) => (
                <div key={item.id || idx} className="p-8 bg-white border border-black/6 rounded-[2.5rem] shadow-sm relative group">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Entry #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveDetail(idx, 'up')} disabled={idx === 0} className="p-1.5 text-black/20 hover:text-[#2563eb] transition-all disabled:opacity-0"><FiChevronUp size={14} /></button>
                                <button onClick={() => moveDetail(idx, 'down')} disabled={idx === details.length - 1} className="p-1.5 text-black/20 hover:text-[#2563eb] transition-all disabled:opacity-0"><FiChevronDown size={14} /></button>
                            </div>
                        </div>
                        <button onClick={() => setItemToDelete(idx)} className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Label" value={item.label} onChange={(v: any) => updateDetail(idx, { ...item, label: v })} placeholder="e.g. Call Us" />
                        <InputField label="Value" value={item.value} onChange={(v: any) => updateDetail(idx, { ...item, value: v })} placeholder="e.g. +1 (555) 123-4567" />
                        <InputField label="Subtext" value={item.subtext} onChange={(v: any) => updateDetail(idx, { ...item, subtext: v })} placeholder="e.g. Direct Support" />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Icon" value={item.icon} onChange={(v: any) => updateDetail(idx, { ...item, icon: v })} placeholder="e.g. LucidePhone" />
                            <InputField label="Color" value={item.color} onChange={(v: any) => updateDetail(idx, { ...item, color: v })} placeholder="e.g. primary" />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addDetail} className="w-full py-8 border-2 border-dashed border-black/6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 transition-all flex items-center justify-center gap-2 group">
                <FiPlus size={16} /> Add Contact Detail
            </button>
        </div>
    );
};

const SocialLinksEditor = ({ links, onChange }: { links: any[], onChange: (val: any[]) => void }) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const addLink = () => {
        const newLink = {
            id: `social-${Date.now()}`,
            icon: 'LucideLinkedin',
            link: '',
            isRedirect: true,
            iconBg: 'primary'
        };
        onChange([...(links || []), newLink]);
    };

    const updateLink = (index: number, val: any) => {
        const newLinks = [...links];
        newLinks[index] = val;
        onChange(newLinks);
    };

    const removeLink = () => {
        if (itemToDelete !== null) {
            onChange(links.filter((_, i) => i !== itemToDelete));
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-6 mb-6">
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Remove Social Link"
                message="Are you sure you want to remove this social link?"
                onConfirm={removeLink}
                onCancel={() => setItemToDelete(null)}
                confirmLabel="Yes, Remove"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2 ml-2">
                <FiList size={14} /> Social Media Links ({links?.length || 0})
            </p>
            {links?.map((link, idx) => (
                <div key={link.id || idx} className="p-8 bg-white border border-black/6 rounded-[2.5rem] shadow-sm relative group">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Social Link #{idx + 1}</span>
                        <button onClick={() => setItemToDelete(idx)} className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Icon (Lucide Name)" value={link.icon} onChange={(v: any) => updateLink(idx, { ...link, icon: v })} placeholder="e.g. LucideLinkedin" />
                        <InputField label="URL Link" value={link.link} onChange={(v: any) => updateLink(idx, { ...link, link: v })} placeholder="e.g. https://linkedin.com/..." />
                        <ColorField label="Icon Background Color" value={link.iconBg} onChange={(v: any) => updateLink(idx, { ...link, iconBg: v })} />
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                checked={link.isRedirect}
                                onChange={(e) => updateLink(idx, { ...link, isRedirect: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Open in New Tab (Redirect)</label>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addLink} className="w-full py-8 border-2 border-dashed border-black/6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 transition-all flex items-center justify-center gap-2 group">
                <FiPlus size={16} /> Add Social Link
            </button>
        </div>
    );
};

const FormFieldsEditor = ({ fields, onChange }: { fields: any[], onChange: (val: any[]) => void }) => {
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const addField = () => {
        const newField = {
            id: `field-${Date.now()}`,
            name: `field_${(fields?.length || 0) + 1}`,
            label: '',
            type: 'text',
            placeholder: '',
            defaultValue: '',
            helpText: '',
            required: true,
            isActive: true,
            validationMessage: '',
            validationRules: '',
            options: [],
            order: fields?.length || 0
        };
        onChange([...(fields || []), newField]);
    };

    const updateField = (index: number, val: any) => {
        const newFields = [...(fields || [])];
        newFields[index] = val;
        onChange(newFields);
    };

    const removeField = () => {
        if (itemToDelete !== null) {
            onChange(fields.filter((_, i) => i !== itemToDelete));
            setItemToDelete(null);
        }
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === fields.length - 1) return;
        const newFields = [...fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        onChange(newFields);
    };

    const addOption = (fieldIdx: number) => {
        const field = fields[fieldIdx];
        const newOptions = [...(field.options || []), { label: '', value: '' }];
        updateField(fieldIdx, { ...field, options: newOptions });
    };

    const updateOption = (fieldIdx: number, optIdx: number, val: any) => {
        const field = fields[fieldIdx];
        const newOptions = [...field.options];
        newOptions[optIdx] = val;
        updateField(fieldIdx, { ...field, options: newOptions });
    };

    const removeOption = (fieldIdx: number, optIdx: number) => {
        const field = fields[fieldIdx];
        const newOptions = (field.options || []).filter((_: any, i: number) => i !== optIdx);
        updateField(fieldIdx, { ...field, options: newOptions });
    };

    return (
        <div className="space-y-6 mb-6">
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Remove Form Field"
                message="Are you sure you want to remove this form field? This will update the live contact form."
                onConfirm={removeField}
                onCancel={() => setItemToDelete(null)}
                confirmLabel="Yes, Remove Field"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2 ml-2">
                <FiList size={14} /> Dynamic Form Builder ({fields?.length || 0} Fields)
            </p>
            {fields?.map((field, idx) => (
                <div key={field.id || idx} className={`p-8 bg-white border rounded-[2.5rem] shadow-sm relative group transition-all ${field.isActive ? 'border-black/6' : 'border-red-200 bg-red-50/10'}`}>
                    {!field.isActive && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest z-10 shadow-lg">
                            Inactive / Hidden
                        </div>
                    )}
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/5">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Field #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveField(idx, 'up')} disabled={idx === 0} className="p-1.5 text-black/20 hover:text-[#2563eb] transition-all disabled:opacity-0"><FiChevronUp size={14} /></button>
                                <button onClick={() => moveField(idx, 'down')} disabled={idx === fields.length - 1} className="p-1.5 text-black/20 hover:text-[#2563eb] transition-all disabled:opacity-0"><FiChevronDown size={14} /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-black/30">Active</label>
                                <input
                                    type="checkbox"
                                    checked={field.isActive !== false}
                                    onChange={(e) => updateField(idx, { ...field, isActive: e.target.checked })}
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </div>
                            <button onClick={() => setItemToDelete(idx)} className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="Field Label" value={field.label} onChange={(v: any) => updateField(idx, { ...field, label: v })} placeholder="e.g. Professional Email" />
                        <InputField label="Field Name (don't change if not sure)" value={field.name} onChange={(v: any) => updateField(idx, { ...field, name: v })} placeholder="e.g. email_address" />
                        <div className="space-y-1.5">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Field Type</label>
                            <select
                                value={field.type}
                                onChange={(e) => updateField(idx, { ...field, type: e.target.value })}
                                className="w-full p-3 bg-black/2 border border-black/6 rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-bold"
                            >
                                <option value="text">Textbox</option>
                                <option value="email">Email</option>
                                <option value="number">Number</option>
                                <option value="tel">Phone</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Dropdown (Select)</option>
                                <option value="radio">Radio Buttons</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="date">Date Picker</option>
                                <option value="file">File Upload</option>
                                <option value="hidden">Hidden Field</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <InputField label="Placeholder Text" value={field.placeholder} onChange={(v: any) => updateField(idx, { ...field, placeholder: v })} placeholder="e.g. name@practice.com" />
                        <InputField label="Default Value" value={field.defaultValue} onChange={(v: any) => updateField(idx, { ...field, defaultValue: v })} placeholder="Optional" />
                        <InputField label="Help Text / Description" value={field.helpText} onChange={(v: any) => updateField(idx, { ...field, helpText: v })} placeholder="e.g. We'll never share your email" />
                        <InputField label="Custom Error Message" value={field.validationMessage} onChange={(v: any) => updateField(idx, { ...field, validationMessage: v })} placeholder="e.g. Please enter a valid 10-digit phone number" />
                    </div>

                    <div className="mt-8 p-6 bg-black/2 rounded-3xl border border-black/5">
                        <div className="flex items-center gap-3 mb-6">
                            <input
                                type="checkbox"
                                id={`req-${field.id}`}
                                checked={field.required}
                                onChange={(e) => updateField(idx, { ...field, required: e.target.checked })}
                                className="w-5 h-5 cursor-pointer accent-[#2563eb]"
                            />
                            <label htmlFor={`req-${field.id}`} className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] cursor-pointer">Required Field</label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(['text', 'email', 'tel', 'textarea'].includes(field.type)) && (
                                <>
                                    <InputField type="number" label="Min Length" value={field.minLength} onChange={(v: any) => updateField(idx, { ...field, minLength: v ? parseInt(v) : undefined })} placeholder="e.g. 2" />
                                    <InputField type="number" label="Max Length" value={field.maxLength} onChange={(v: any) => updateField(idx, { ...field, maxLength: v ? parseInt(v) : undefined })} placeholder="e.g. 100" />
                                </>
                            )}
                            {(field.type === 'number') && (
                                <>
                                    <InputField type="number" label="Min Value" value={field.minValue} onChange={(v: any) => updateField(idx, { ...field, minValue: v ? parseFloat(v) : undefined })} placeholder="e.g. 0" />
                                    <InputField type="number" label="Max Value" value={field.maxValue} onChange={(v: any) => updateField(idx, { ...field, maxValue: v ? parseFloat(v) : undefined })} placeholder="e.g. 100" />
                                </>
                            )}
                            {(field.type === 'file') && (
                                <>
                                    <InputField label="Allowed Extensions" value={field.fileTypes} onChange={(v: any) => updateField(idx, { ...field, fileTypes: v })} placeholder="e.g. .jpg,.png,.pdf" />
                                    <InputField type="number" label="Max File Size (MB)" value={field.maxFileSize} onChange={(v: any) => updateField(idx, { ...field, maxFileSize: v ? parseFloat(v) : undefined })} placeholder="e.g. 5" />
                                </>
                            )}
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputField label="Custom Regex Pattern" value={field.validationPattern} onChange={(v: any) => updateField(idx, { ...field, validationPattern: v })} placeholder="e.g. ^[0-9]{10}$" />
                            </div>
                        </div>
                    </div>

                    {(['select', 'radio', 'checkbox'].includes(field.type)) && (
                        <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb]">Option Management</p>
                                <button onClick={() => addOption(idx)} className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] bg-white px-4 py-2 rounded-xl border border-primary/20 shadow-sm hover:bg-primary hover:text-white transition-all">
                                    + Add Option
                                </button>
                            </div>
                            <div className="space-y-3">
                                {field.options?.map((opt: any, oIdx: number) => (
                                    <div key={oIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white/50 p-4 rounded-2xl border border-black/5 group/opt">
                                        <InputField label="Option Label" value={opt.label} onChange={(v) => updateOption(idx, oIdx, { ...opt, label: v })} placeholder="e.g. Yes" />
                                        <InputField label="Option Value" value={opt.value} onChange={(v) => updateOption(idx, oIdx, { ...opt, value: v })} placeholder="e.g. yes_value" />
                                        <div className="flex justify-end pb-4">
                                            <button onClick={() => removeOption(idx, oIdx)} className="p-2 text-black/10 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/opt:opacity-100">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!field.options || field.options.length === 0) && (
                                    <p className="text-center py-8 text-[10px] uppercase font-black text-black/20 tracking-widest">No options added yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={addField} className="w-full py-12 border-2 border-dashed border-black/6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 transition-all flex items-center justify-center gap-3 group">
                <FiPlus size={20} className="group-hover:scale-125 transition-transform" /> Build New Form Field
            </button>
        </div>
    );
};

const FormSettingsEditor = ({ data, onChange }: { data: any, onChange: (val: any) => void }) => (
    <div className="space-y-6">
        <div className="p-8 bg-white border border-black/6 rounded-[2.5rem] mb-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-6 flex items-center gap-2">
                <FiList size={14} /> Global Form Settings
            </p>
            <div className="space-y-8">
                <InputField
                    label="Form Title"
                    value={data?.title}
                    onChange={(v: any) => onChange({ ...data, title: v })}
                    placeholder="e.g. Secure Message"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        label="Security Text"
                        value={data?.security?.text}
                        onChange={(v: any) => onChange({ ...data, security: { ...data.security, text: v } })}
                        placeholder="e.g. HIPAA Compliant Gateway"
                    />
                    <InputField
                        label="Security Icon"
                        value={data?.security?.icon}
                        onChange={(v: any) => onChange({ ...data, security: { ...data.security, icon: v } })}
                        placeholder="e.g. LucideShieldCheck"
                    />
                    <InputField
                        label="Security Color"
                        value={data?.security?.color}
                        onChange={(v: any) => onChange({ ...data, security: { ...data.security, color: v } })}
                        placeholder="e.g. emerald"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Response Time Label"
                        value={data?.responseTime?.text}
                        onChange={(v: any) => onChange({ ...data, responseTime: { ...data.responseTime, text: v } })}
                        placeholder="e.g. Average response time:"
                    />
                    <InputField
                        label="Response Time Value"
                        value={data?.responseTime?.value}
                        onChange={(v: any) => onChange({ ...data, responseTime: { ...data.responseTime, value: v } })}
                        placeholder="e.g. 90 minutes or less"
                    />
                </div>
                <InputField
                    label="Trust Bar Text"
                    value={data?.trustBar?.text}
                    onChange={(v: any) => onChange({ ...data, trustBar: { ...data.trustBar, text: v } })}
                    placeholder="Writing the bottom trust banner text..."
                    isTextArea
                />
            </div>
        </div>

        <FormFieldsEditor
            fields={data?.fields || []}
            onChange={(fields) => onChange({ ...data, fields })}
        />
    </div>
);

const ContactPageData = ({ data, onChange }: { data: any, onChange: (newData: any) => void }) => {
    return (
        <div className="mt-4">
            <HeaderEditor
                data={data.pageData}
                onChange={(h) => onChange({ ...data, pageData: { ...data.pageData, ...h } })}
            />
            <HeroContentEditor
                data={data.pageData}
                onChange={(c) => onChange({ ...data, pageData: { ...data.pageData, ...c } })}
            />
            <ContactDetailsEditor
                details={data.pageData?.contactDetails || []}
                onChange={(d) => onChange({ ...data, pageData: { ...data.pageData, contactDetails: d } })}
            />
            <SocialLinksEditor
                links={data.pageData?.socialLinks || []}
                onChange={(s) => onChange({ ...data, pageData: { ...data.pageData, socialLinks: s } })}
            />
            <FormSettingsEditor
                data={data.pageData?.form}
                onChange={(f) => onChange({ ...data, pageData: { ...data.pageData, form: f } })}
            />
        </div>
    );
};

export default ContactPageData;
