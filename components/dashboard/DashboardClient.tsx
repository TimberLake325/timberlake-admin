"use client";

import React, { useState, useTransition } from 'react';
import {
    FiFileText, FiUsers, FiTrendingUp, FiArrowRight,
    FiMail, FiGlobe, FiActivity, FiLayers, FiPieChart
} from 'react-icons/fi';
import Link from 'next/link';
import { DashboardStats, Timeframe, getDashboardStats } from '@/services/dashboardService';
import MetricFilter from './MetricFilter';
import TrafficLineChart from './TrafficLineChart';
import InquiryChart from './InquiryChart';
import ServiceDistribution from './ServiceDistribution';
import InquiryStatusChart from './InquiryStatusChart';

interface DashboardClientProps {
    initialStats: DashboardStats;
}

export default function DashboardClient({ initialStats }: DashboardClientProps) {
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [timeframe, setTimeframe] = useState<Timeframe>('30D');
    const [isPending, startTransition] = useTransition();

    const handleTimeframeChange = async (newTimeframe: Timeframe) => {
        setTimeframe(newTimeframe);
        startTransition(async () => {
            try {
                const refreshedStats = await getDashboardStats(newTimeframe);
                setStats(refreshedStats);
            } catch (error) {
                console.error("Failed to refresh stats:", error);
            }
        });
    };

    const mainStats = [
        {
            label: "Total Articles",
            value: stats.totalBlogs.toString(),
            icon: FiFileText,
            trend: `${stats.totalCategories} Categories`,
            href: "/admin/blog/posts"
        },
        {
            label: "Total Inquiries",
            value: stats.totalInquiries.toString(),
            icon: FiMail,
            trend: `${stats.pendingInquiries} Pending`,
            href: "/admin/user"
        }
    ];

    const formatTimeAgo = (dateValue: any) => {
        const date = new Date(dateValue);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <div className={`p-4 lg:p-8 bg-[#fcfcfc] min-h-screen transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {mainStats.map((stat, i) => (
                    <Link key={i} href={stat.href} className="p-8 bg-white border border-black/[0.06] rounded-2xl shadow-sm hover:border-[#2563eb]/30 transition-all group block">
                        <div className="flex justify-between items-start mb-4 gap-2">
                            <div className="p-3 bg-black/[0.03] rounded-xl group-hover:bg-[#2563eb]/5 transition-colors">
                                <stat.icon size={20} className="text-black group-hover:text-[#2563eb] transition-colors" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#2563eb] bg-[#2563eb]/5 px-2 py-1 rounded">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{stat.label}</p>
                        <p className="text-3xl font-black tracking-tighter text-black">{stat.value}</p>
                    </Link>
                ))}
            </div>


            <div className="bg-white border border-black/[0.08] rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl shadow-black/[0.02] p-6 lg:p-12 mb-12 relative overflow-hidden">

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 pb-8 border-b border-black/[0.04]">
                    <div>
                        <h3 className="text-lg lg:text-xl font-black tracking-tight text-black flex items-center gap-3">
                            <span className="w-1.5 h-6 lg:w-2 lg:h-8 bg-[#2563eb] rounded-full block" />
                            Statistics for {timeframe === 'ALL' ? 'total history' : `last ${timeframe.replace('D', '')} days`}
                        </h3>
                    </div>
                    <div className="w-full xl:w-auto">
                        <MetricFilter value={timeframe} onChange={handleTimeframeChange} />
                    </div>
                </div>


                <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 mb-12 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="xl:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-[#2563eb]/5 rounded-lg text-[#2563eb]">
                                <FiActivity size={18} />
                            </div>
                            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Traffic Volume Dynamics</h4>
                        </div>
                        <TrafficLineChart data={stats.trafficTimeSeries} />
                    </div>

                    <div className="p-6 lg:p-8 bg-black/[0.02] rounded-[1.5rem] lg:rounded-[2rem] border border-black/[0.03]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-black/5 rounded-lg text-black">
                                <FiPieChart size={18} />
                            </div>
                            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-black">Inquiry Pipeline</h4>
                        </div>
                        <InquiryStatusChart data={stats.inquiryStatusDistribution} />
                    </div>
                </div>


                <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="xl:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-[#2563eb]/5 rounded-lg text-[#2563eb]">
                                <FiTrendingUp size={18} />
                            </div>
                            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Lead Generation Velocity</h4>
                        </div>
                        <InquiryChart data={stats.inquiryTimeSeries} />
                    </div>

                    <div className="p-6 lg:p-8 bg-black/[0.02] rounded-[1.5rem] lg:rounded-[2rem] border border-black/[0.03]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-black/5 rounded-lg text-black">
                                <FiLayers size={18} />
                            </div>
                            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-black">Service Demand Mix</h4>
                        </div>
                        <ServiceDistribution data={stats.serviceDistribution} />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-10 bg-white border border-black/[0.06] rounded-[2rem]">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 border-b border-black/[0.05] pb-4 flex items-center justify-between">
                        <span>Real-time Activity Stream</span>
                        {stats.pendingInquiries > 0 && (
                            <span className="text-[9px] text-[#2563eb] italic normal-case font-bold">{stats.pendingInquiries} pending leads</span>
                        )}
                    </h4>
                    <div className="space-y-6">
                        {stats.recentBlogs.map((blog: any) => (
                            <div key={blog._id} className="flex items-center justify-between border-b border-black/[0.03] pb-4 last:border-0">
                                <div className="min-w-0 pr-4">
                                    <p className="text-[11px] font-black text-black uppercase tracking-tight truncate">
                                        Content Node: {blog.title}
                                    </p>
                                    <p className="text-[10px] text-black/40 font-medium italic">
                                        {blog.author} • {blog.category?.name || 'Editorial'}
                                    </p>
                                </div>
                                <span className="text-[9px] font-black text-black/20 uppercase tracking-widest shrink-0">
                                    {formatTimeAgo(blog.updatedAt)}
                                </span>
                            </div>
                        ))}
                        {stats.recentInquiries.map((user: any) => (
                            <div key={user._id} className="flex items-center justify-between border-b border-black/[0.03] pb-4 last:border-0">
                                <div className="min-w-0 pr-4">
                                    <p className="text-[11px] font-black text-[#2563eb] uppercase tracking-tight truncate">
                                        Lead Signal: {user.fullName || 'Anonymous'}
                                    </p>
                                    <p className="text-[10px] text-black/40 font-medium italic">
                                        {user.service || 'General'} • {user.status ? user.status.replace('_', ' ') : 'new'}
                                    </p>
                                </div>
                                <span className="text-[9px] font-black text-black/20 uppercase tracking-widest shrink-0">
                                    {formatTimeAgo(user.createdAt)}
                                </span>
                            </div>
                        ))}
                        {stats.recentBlogs.length === 0 && stats.recentInquiries.length === 0 && (
                            <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest text-center py-4">
                                NO ACTIVE SIGNALS DETECTED.
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-10 bg-[#2563eb]/5 border border-[#2563eb]/10 rounded-[2rem] flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#2563eb]/10">
                        <FiGlobe size={24} className="text-[#2563eb]" />
                    </div>
                    <h4 className="text-sm font-black text-black uppercase tracking-widest mb-2">SEO Status Overview</h4>
                    <p className="text-5xl font-black text-black mb-2 tracking-tighter">{stats.seoPagesCount}</p>
                    <p className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.2em] mb-8">Active Indexable Pages</p>

                    <div className="p-4 bg-white rounded-2xl border border-black/[0.03] w-full mb-10">
                        <p className="text-[9px] font-black text-black/30 uppercase mb-1">Mail System</p>
                        <p className={`text-[10px] font-black uppercase ${stats.smtpConfigured ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.smtpConfigured ? 'Connected' : 'Offline'}
                        </p>
                    </div>

                    <Link href="/admin/sitemap" className="text-[10px] font-black uppercase tracking-widest text-white bg-[#2563eb] px-8 py-4 rounded-xl shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-transform w-full">
                        Optimize Intelligence Layer →
                    </Link>
                </div>
            </div>
        </div>
    );
}
