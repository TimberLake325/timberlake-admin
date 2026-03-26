"use client";

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiActivity, FiLayers, FiChevronUp, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
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
                rows={4}
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

const FaqPageData = ({ data, onChange }: { data: any, onChange: (newData: any) => void }) => {
    const [itemToDelete, setItemToDelete] = useState<{ catIdx: number, qIdx: number | null } | null>(null);

    const addCategory = () => {
        onChange({ ...data, faqs: [...(data.faqs || []), { category: '', questions: [] }] });
    };

    const updateCategory = (idx: number, val: any) => {
        const newFaqs = [...data.faqs];
        newFaqs[idx] = val;
        onChange({ ...data, faqs: newFaqs });
    };

    const removeCategory = (idx: number) => {
        onChange({ ...data, faqs: data.faqs.filter((_: any, i: number) => i !== idx) });
        setItemToDelete(null);
    };

    const addQuestion = (catIdx: number) => {
        const newFaqs = [...data.faqs];
        newFaqs[catIdx].questions = [...(newFaqs[catIdx].questions || []), { id: Date.now().toString(), question: '', answer: '' }];
        onChange({ ...data, faqs: newFaqs });
    };

    const updateQuestion = (catIdx: number, qIdx: number, val: any) => {
        const newFaqs = [...data.faqs];
        newFaqs[catIdx].questions[qIdx] = val;
        onChange({ ...data, faqs: newFaqs });
    };

    const removeQuestion = (catIdx: number, qIdx: number) => {
        const newFaqs = [...data.faqs];
        newFaqs[catIdx].questions = newFaqs[catIdx].questions.filter((_: any, i: number) => i !== qIdx);
        onChange({ ...data, faqs: newFaqs });
        setItemToDelete(null);
    };

    const moveCategory = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === data.faqs.length - 1) return;
        const newFaqs = [...data.faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];
        onChange({ ...data, faqs: newFaqs });
    };

    const moveQuestion = (catIdx: number, qIdx: number, direction: 'up' | 'down') => {
        const questions = data.faqs[catIdx].questions;
        if (direction === 'up' && qIdx === 0) return;
        if (direction === 'down' && qIdx === questions.length - 1) return;
        const newQuestions = [...questions];
        const targetIndex = direction === 'up' ? qIdx - 1 : qIdx + 1;
        [newQuestions[qIdx], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[qIdx]];
        const newFaqs = [...data.faqs];
        newFaqs[catIdx].questions = newQuestions;
        onChange({ ...data, faqs: newFaqs });
    };

    return (
        <div className="mt-4 space-y-6">
            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title="Confirm Deletion"
                message={itemToDelete?.qIdx === null ? "Are you sure you want to remove this whole category?" : "Are you sure you want to remove this question?"}
                onConfirm={() => {
                    if (itemToDelete?.qIdx === null) {
                        removeCategory(itemToDelete.catIdx);
                    } else {
                        removeQuestion(itemToDelete!.catIdx, itemToDelete!.qIdx!);
                    }
                }}
                onCancel={() => setItemToDelete(null)}
                confirmLabel="Yes, Remove"
            />

            <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2 ml-2">
                    <FiLayers size={14} /> FAQ Categories ({data.faqs?.length || 0})
                </p>
                {data.faqs?.map((cat: any, cIdx: number) => (
                    <div key={cIdx} className="p-6 bg-white border border-black/[0.06] rounded-[2rem] shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">Category #{cIdx + 1}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => moveCategory(cIdx, 'up')} disabled={cIdx === 0} className="p-1.5 text-black/20 hover:text-[#2563eb] disabled:opacity-0"><FiChevronUp size={14} /></button>
                                    <button onClick={() => moveCategory(cIdx, 'down')} disabled={cIdx === data.faqs.length - 1} className="p-1.5 text-black/20 hover:text-[#2563eb] disabled:opacity-0"><FiChevronDown size={14} /></button>
                                </div>
                            </div>
                            <button onClick={() => setItemToDelete({ catIdx: cIdx, qIdx: null })} className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 size={16} /></button>
                        </div>

                        <InputField
                            label="Category Name"
                            value={cat.category}
                            onChange={(v) => updateCategory(cIdx, { ...cat, category: v })}
                            placeholder="e.g. Services / Pricing"
                        />

                        <div className="mt-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] mb-3 flex items-center gap-2">
                                <FiHelpCircle size={12} /> Questions ({cat.questions?.length || 0})
                            </p>
                            <div className="space-y-3 pl-4 border-l-2 border-black/[0.02]">
                                {cat.questions?.map((q: any, qIdx: number) => (
                                    <div key={q.id || qIdx} className="p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl relative group/link">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => moveQuestion(cIdx, qIdx, 'up')} disabled={qIdx === 0} className="p-1 text-black/10 hover:text-[#2563eb] disabled:opacity-0"><FiChevronUp size={12} /></button>
                                                <button onClick={() => moveQuestion(cIdx, qIdx, 'down')} disabled={qIdx === cat.questions.length - 1} className="p-1 text-black/10 hover:text-[#2563eb] disabled:opacity-0"><FiChevronDown size={12} /></button>
                                            </div>
                                            <button
                                                onClick={() => setItemToDelete({ catIdx: cIdx, qIdx: qIdx })}
                                                className="p-1 text-black/10 hover:text-red-500 transition-colors opacity-0 group-hover/link:opacity-100"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                        <InputField
                                            label="Question"
                                            value={q.question}
                                            onChange={(v) => updateQuestion(cIdx, qIdx, { ...q, question: v })}
                                            placeholder="e.g. What services do you offer?"
                                        />
                                        <InputField
                                            label="Answer"
                                            value={q.answer}
                                            onChange={(v) => updateQuestion(cIdx, qIdx, { ...q, answer: v })}
                                            placeholder="Write the answer..."
                                            isRichText
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addQuestion(cIdx)}
                                    className="w-full py-3 border-2 border-dashed border-black/[0.04] rounded-xl text-[9px] font-black uppercase text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiPlus size={12} /> Add Question to Category
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addCategory}
                className="w-full py-6 border-2 border-dashed border-black/[0.1] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 hover:bg-[#2563eb]/5 transition-all flex items-center justify-center gap-2 group mt-6"
            >
                <div className="p-2 bg-black/[0.03] rounded-lg group-hover:bg-[#2563eb]/10 transition-colors text-black/20 group-hover:text-[#2563eb]">
                    <FiPlus size={18} />
                </div>
                Add New FAQ Category
            </button>
        </div>
    );
};

export default FaqPageData;