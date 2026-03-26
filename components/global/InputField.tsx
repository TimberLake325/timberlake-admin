"use client";

import React, { forwardRef } from 'react';
import LexicalEditor from './LexicalEditor';

interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
    isTextArea?: boolean;
    isRichText?: boolean;
    error?: string;
    value?: string;
    onChange?: (val: string) => void;
    [key: string]: any;
}

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
    ({ label, placeholder, type = "text", isTextArea = false, isRichText = false, error, value, onChange, ...props }, ref) => {
        const baseStyles = "w-full p-4 bg-black/[0.02] border border-black/[0.06] rounded-xl text-sm focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20";
        const errorStyles = error ? "border-red-500/50" : "";

        return (
            <div className="w-full">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2 ml-1">
                    {label}
                </label>
                {isRichText ? (
                    <LexicalEditor
                        value={value || ''}
                        onChange={onChange || (() => { })}
                        placeholder={placeholder}
                    />
                ) : isTextArea ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className={`${baseStyles} ${errorStyles}`}
                        {...props}
                    />
                ) : (
                    <input
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        value={value}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`${baseStyles} ${errorStyles}`}
                        {...props}
                    />
                )}
                {error && <p className="mt-1.5 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export default InputField;
