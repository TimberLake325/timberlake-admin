"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrafficLineChartProps {
    data: { date: string; visits: number; unique: number }[];
}

export default function TrafficLineChart({ data }: TrafficLineChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-black/20">
                Awaiting traffic logs...
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: '#00000040' }}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: '#00000040' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                        labelStyle={{ color: '#2563eb', fontSize: '9px', fontWeight: 900, marginBottom: '4px' }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }}
                    />
                    <Line
                        name="Total Visits"
                        type="monotone"
                        dataKey="visits"
                        stroke="#000"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#000', strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={1500}
                    />
                    <Line
                        name="Unique Visitors"
                        type="monotone"
                        dataKey="unique"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
