"use server";

import { dbConnect } from "@/lib/db";
import { AuditLog } from "@/lib/model";

export interface AuditLogDisplay {
    id: string;
    action: string;
    adminId: string | null;
    details: any;
    success: boolean;
    ip: string;
    userAgent: string;
    timestamp: Date;
}

export async function getAuditLogs(page = 1, limit = 10, filters?: { action?: string; success?: boolean; search?: string }) {
    await dbConnect();
    try {
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters?.action && filters.action !== 'ALL') {
            query.action = filters.action;
        }

        if (filters?.success !== undefined) {
            query.success = filters.success;
        }

        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase().trim();
            query.$or = [
                { 'details.email': { $regex: searchTerm, $options: 'i' } },
                { ip: { $regex: searchTerm, $options: 'i' } },
                { userAgent: { $regex: searchTerm, $options: 'i' } },
                { action: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        return {
            success: true,
            data: {
                logs: JSON.parse(JSON.stringify(logs)),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return { success: false, message: "Failed to fetch audit logs", data: { logs: [], total: 0 } };
    }
}

export async function getRecentAuditLogs(limit = 5) {
    await dbConnect();
    try {
        const logs = await AuditLog.find({})
            .sort({ timestamp: -1 })
            .limit(limit);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(logs))
        };
    } catch (error) {
        console.error("Error fetching recent logs:", error);
        return { success: false, data: [] };
    }
}
