"use client";

import React from 'react';

type Timeframe = '7D' | '30D' | '90D' | 'ALL';

interface MetricFilterProps {
    value: Timeframe;
    onChange: (value: Timeframe) => void;
}

export default function MetricFilter({ value, onChange }: MetricFilterProps) {
    const options: { label: string; value: Timeframe }[] = [
        { label: '7 Days', value: '7D' },
        { label: '30 Days', value: '30D' },
        { label: '90 Days', value: '90D' },
        { label: 'All Time', value: 'ALL' },
    ];

    return (
        <div className="flex flex-wrap md:flex-nowrap bg-black/[0.03] p-1 rounded-xl border border-black/[0.05] w-full md:w-auto">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 md:flex-none px-2 lg:px-4 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${value === option.value
                        ? 'bg-white text-[#2563eb] shadow-sm'
                        : 'text-black/40 hover:text-black'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
