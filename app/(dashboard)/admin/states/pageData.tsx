"use client";

import React from 'react';
import { FiPlus, FiTrash2, FiZap, FiMap, FiType } from 'react-icons/fi';
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

interface StatesPageDataProps {
    data: {
        pageData?: {
            title?: string;
            subtitle?: string;
            description?: string;
            states?: { name: string; slug: string; description: string; image: string }[];
        };
    };
    onChange: (newData: any) => void;
}

const StatesPageData = ({ data, onChange }: StatesPageDataProps) => {

    const updatePageData = (field: string, value: any) => {
        onChange({
            ...data,
            pageData: {
                ...(data.pageData || {}),
                [field]: value
            }
        });
    };

    const addState = () => {
        const currentStates = data.pageData?.states || [];
        updatePageData('states', [...currentStates, { name: '', slug: '', description: '', image: '' }]);
    };

    const updateState = (index: number, val: any) => {
        const states = [...(data.pageData?.states || [])];
        states[index] = val;
        updatePageData('states', states);
    };

    const removeState = (index: number) => {
        const states = (data.pageData?.states || []).filter((_: any, i: number) => i !== index);
        updatePageData('states', states);
    };

    return (
        <div className="space-y-8">

            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="Page Header & Intro" icon={FiType} />
                <InputField
                    label="Page Title"
                    value={data.pageData?.title}
                    onChange={(v) => updatePageData('title', v)}
                    placeholder="National Coverage"
                />
                <InputField
                    label="Subtitle"
                    value={data.pageData?.subtitle}
                    onChange={(v) => updatePageData('subtitle', v)}
                    placeholder="Comprehensive RCM Coverage"
                    isRichText
                />
                <InputField
                    label="Description (Rich Text)"
                    value={data.pageData?.description}
                    onChange={(v) => updatePageData('description', v)}
                    placeholder="Timberlake provides specialized RCM..."
                    isRichText
                />
            </div>


            <div className="bg-white border border-black/6 rounded-4xl p-10 shadow-sm">
                <SectionHeader title="States (Card List)" icon={FiMap} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(data.pageData?.states || [])?.map((state: any, idx: number) => (
                        <div key={idx} className="p-6 bg-black/1 border border-black/4 rounded-3xl relative group">
                            <button
                                onClick={() => removeState(idx)}
                                className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <FiTrash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 gap-2">
                                <InputField label="State Name" value={state.name} onChange={(v) => updateState(idx, { ...state, name: v })} placeholder="California" />
                                <InputField label="Slug" value={state.slug} onChange={(v) => updateState(idx, { ...state, slug: v })} placeholder="california" />
                                <InputField label="Description" value={state.description} onChange={(v) => updateState(idx, { ...state, description: v })} placeholder="California regulatory hub..." isRichText />
                                <ImageField
                                    label="State Image"
                                    value={state.image}
                                    onChange={(v) => updateState(idx, { ...state, image: v })}
                                />
                                <InputField
                                    label="Order / Rank"
                                    value={state.order}
                                    type="number"
                                    onChange={(v) => updateState(idx, { ...state, order: parseInt(v) || 0 })}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addState} className="w-full mt-6 py-4 border border-dashed border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all flex items-center justify-center gap-2">
                    <FiPlus /> Add State
                </button>
            </div>
        </div>
    );
};

export default StatesPageData;
