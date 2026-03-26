"use client";

import React from 'react';
import { FiSearch, FiInfo, FiGlobe, FiTwitter } from 'react-icons/fi';
import ImageField from './ImageField';

interface SeoMetadata {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    ogSiteName?: string;
    ogLocale?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterSite?: string;
    twitterCreator?: string;
}

interface SeoComponentProps {
    data: SeoMetadata;
    onChange: (field: string, value: string) => void;
}

interface InputFieldProps {
    label: string;
    value?: string;
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
                className="w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-xl text-sm focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-xl text-sm focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        )}
    </div>
);

const SubHeading = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-2 mb-6 mt-8 border-b border-black/[0.03] pb-2">
        <Icon size={14} className="text-[#2563eb]" />
        <h4 className="text-[11px] font-black uppercase tracking-widest text-black/60">{title}</h4>
    </div>
);

const SeoComponent = ({ data, onChange }: SeoComponentProps) => {
    return (
        <div className="mt-6 bg-white border border-black/[0.06] rounded-[2rem] p-10 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">

            <SubHeading title="General SEO" icon={FiSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InputField
                    label="Meta Title"
                    value={data?.title}
                    onChange={(val: string) => onChange('title', val)}
                    placeholder="Page title for search engines"
                />
                <InputField
                    label="Meta Keywords"
                    value={data?.keywords}
                    onChange={(val: string) => onChange('keywords', val)}
                    placeholder="Comma separated keywords"
                />
            </div>
            <InputField
                label="Meta Description"
                value={data?.description}
                onChange={(val: string) => onChange('description', val)}
                placeholder="Brief description for search results"
                isTextArea={true}
            />
            <ImageField
                label="Main SEO Image"
                value={data?.image || ''}
                onChange={(val: string) => onChange('image', val)}
            />
            <InputField
                label="Canonical URL"
                value={data?.canonicalUrl}
                onChange={(val: string) => onChange('canonicalUrl', val)}
                placeholder="/canonical-url"
            />


            <SubHeading title="Open Graph (Facebook/Social)" icon={FiGlobe} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InputField
                    label="OG Title"
                    value={data?.ogTitle}
                    onChange={(val: string) => onChange('ogTitle', val)}
                    placeholder="Title for social sharing"
                />
                <InputField
                    label="OG Type"
                    value={data?.ogType}
                    onChange={(val: string) => onChange('ogType', val)}
                    placeholder="website"
                />
                <InputField
                    label="OG Site Name"
                    value={data?.ogSiteName}
                    onChange={(val: string) => onChange('ogSiteName', val)}
                    placeholder="Timberlake"
                />
                <InputField
                    label="OG Locale"
                    value={data?.ogLocale}
                    onChange={(val: string) => onChange('ogLocale', val)}
                    placeholder="en_US"
                />
            </div>
            <InputField
                label="OG URL"
                value={data?.ogUrl}
                onChange={(val: string) => onChange('ogUrl', val)}
                placeholder="https://timberlake.com/current-page"
            />
            <ImageField
                label="OG Image"
                value={data?.ogImage || ''}
                onChange={(val: string) => onChange('ogImage', val)}
            />
            <InputField
                label="OG Description"
                value={data?.ogDescription}
                onChange={(val: string) => onChange('ogDescription', val)}
                placeholder="Description for social sharing"
                isTextArea={true}
            />


            <SubHeading title="Twitter Cards" icon={FiTwitter} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InputField
                    label="Twitter Title"
                    value={data?.twitterTitle}
                    onChange={(val: string) => onChange('twitterTitle', val)}
                    placeholder="Twitter sharing title"
                />
                <InputField
                    label="Twitter Card Type"
                    value={data?.twitterCard}
                    onChange={(val: string) => onChange('twitterCard', val)}
                    placeholder="summary_large_image"
                />
                <InputField
                    label="Twitter Site Handle"
                    value={data?.twitterSite}
                    onChange={(val: string) => onChange('twitterSite', val)}
                    placeholder="@timberlake"
                />
                <InputField
                    label="Twitter Creator Handle"
                    value={data?.twitterCreator}
                    onChange={(val: string) => onChange('twitterCreator', val)}
                    placeholder="@creator"
                />
            </div>
            <ImageField
                label="Twitter Image"
                value={data?.twitterImage || ''}
                onChange={(val: string) => onChange('twitterImage', val)}
            />
            <InputField
                label="Twitter Description"
                value={data?.twitterDescription}
                onChange={(val: string) => onChange('twitterDescription', val)}
                placeholder="Description for Twitter sharing"
                isTextArea={true}
            />

            <div className="mt-8 p-6 bg-[#2563eb]/5 rounded-3xl border border-[#2563eb]/10">
                <p className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FiInfo size={14} /> Global SEO Engine
                </p>
                <p className="text-[11px] text-black/50 leading-relaxed font-medium">
                    This component manages meta tags, Open Graph protocols, and Twitter Cards to ensure maximum visibility and professional appearance across all search engines and social platforms.
                </p>
            </div>
        </div>
    );
};

export default SeoComponent;