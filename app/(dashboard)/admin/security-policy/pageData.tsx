"use client";

import React from 'react';
import { FiShield, FiType } from 'react-icons/fi';
import LexicalEditor from '@/components/global/LexicalEditor';
import InputField from '@/components/global/InputField';

const SecurityPolicyPageData = ({ data, onChange }: { data: any, onChange: (newData: any) => void }) => {
    return (
        <div className="mt-4 space-y-6">
            <div className="p-8 bg-white border border-black/6 rounded-[2.5rem] shadow-sm space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2">
                    <FiType size={14} /> Page Header
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Page Title"
                        value={data.pageData?.pageTitle || ''}
                        onChange={(v: any) => onChange({
                            ...data,
                            pageData: { ...data.pageData, pageTitle: v }
                        })}
                        placeholder="e.g. Security Policy"
                    />
                    <InputField
                        label="Page Subtitle"
                        value={data.pageData?.pageSubTitle || ''}
                        onChange={(v: any) => onChange({
                            ...data,
                            pageData: { ...data.pageData, pageSubTitle: v }
                        })}
                        placeholder="e.g. Protecting our infrastructure and your data"
                    />
                </div>
            </div>

            <div className="p-8 bg-white border border-black/6 rounded-[2.5rem] shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-6 flex items-center gap-2">
                    <FiShield size={14} /> Main Security Content
                </p>
                <div className="min-h-[500px]">
                    <LexicalEditor
                        value={data.pageData?.content || ''}
                        onChange={(v) => onChange({
                            ...data,
                            pageData: { ...data.pageData, content: v }
                        })}
                        placeholder="Write the security policy body here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default SecurityPolicyPageData;
