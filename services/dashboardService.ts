"use server";

import { dbConnect } from "@/lib/db";
import {
    BlogPost,
    BlogCategory,
    User,
    Sitemap,
    Config
} from "@/lib/model";

export type Timeframe = '7D' | '30D' | '90D' | 'ALL';

export interface DashboardStats {
    totalBlogs: number;
    totalCategories: number;
    totalInquiries: number;
    pendingInquiries: number;
    smtpConfigured: boolean;
    seoPagesCount: number;
    recentInquiries: any[];
    recentBlogs: any[];
    trafficTimeSeries: { date: string; visits: number; unique: number }[];
    inquiryTimeSeries: { date: string; count: number }[];
    serviceDistribution: { name: string; value: number }[];
    inquiryStatusDistribution: { name: string; value: number }[];
}

export async function getDashboardStats(timeframe: Timeframe = '30D'): Promise<DashboardStats> {
    await dbConnect();

    try {
        const now = new Date();
        let startDate: Date | null = new Date();

        if (timeframe === '7D') startDate.setDate(now.getDate() - 7);
        else if (timeframe === '30D') startDate.setDate(now.getDate() - 30);
        else if (timeframe === '90D') startDate.setDate(now.getDate() - 90);
        else startDate = null; 

        const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

        const [
            totalBlogs,
            totalCategories,
            totalInquiries,
            pendingInquiries
        ] = await Promise.all([
            BlogPost.countDocuments({ isDeleted: { $ne: true } }),
            BlogCategory.countDocuments({ isDeleted: { $ne: true } }),
            User.countDocuments({}),
            User.countDocuments({ status: 'pending' })
        ]);

        const smtpConfig = await Config.findOne({ key: 'SMTP' });
        const sitemap = await Sitemap.findOne({});

        let seoPagesCount = 0;
        if (sitemap && sitemap.sections) {
            sitemap.sections.forEach((section: any) => {
                seoPagesCount += section.links ? section.links.length : 0;
            });
        }

        const [recentInquiries, recentBlogs] = await Promise.all([
            User.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            BlogPost.find({ isDeleted: { $ne: true } })
                .populate('category', 'name')
                .sort({ updatedAt: -1 })
                .limit(5)
                .lean()
        ]);

        const inquiryRaw = await User.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const trafficTimeSeries: { date: string; visits: number; unique: number }[] = [];

        const inquiryTimeSeries = inquiryRaw.map(item => ({
            date: item._id,
            count: item.count
        }));

        const [serviceRaw, statusRaw] = await Promise.all([
            User.aggregate([
                { $match: dateFilter },
                { $group: { _id: "$service", value: { $sum: 1 } } }
            ]),
            User.aggregate([
                { $match: dateFilter },
                { $group: { _id: "$status", value: { $sum: 1 } } }
            ])
        ]);

        const serviceDistribution = serviceRaw.map(item => ({
            name: item._id || 'General',
            value: item.value
        }));

        const inquiryStatusDistribution = statusRaw.map(item => ({
            name: (item._id || 'pending').replace('_', ' '),
            value: item.value
        }));

        return {
            totalBlogs,
            totalCategories,
            totalInquiries,
            pendingInquiries,
            smtpConfigured: !!(smtpConfig && smtpConfig.value && smtpConfig.value.host),
            seoPagesCount,
            recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
            recentBlogs: JSON.parse(JSON.stringify(recentBlogs)),
            trafficTimeSeries,
            inquiryTimeSeries,
            serviceDistribution,
            inquiryStatusDistribution
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error("Failed to fetch dashboard statistics");
    }
}
