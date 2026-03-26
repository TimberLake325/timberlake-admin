"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InquiryStatusChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#000000', '#2563eb', '#10B981', '#F59E0B', '#EF4444'];

export default function InquiryStatusChart({ data }: InquiryStatusChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-black/20">
                Segment data unavailable
            </div>
        );
    }

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                        itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
