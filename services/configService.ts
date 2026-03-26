'use server';

import { dbConnect } from "@/lib/db";
import { Config } from "@/lib/model";

export interface SMTPConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from: string;
}

import { unstable_cache } from 'next/cache';

export async function getSMTPConfig(): Promise<{ success: boolean; message: string; data: SMTPConfig | null }> {
    await dbConnect();
    try {
        const config = await Config.findOne({ key: 'SMTP' });
        if (!config) {
            return {
                success: false,
                message: "SMTP configuration not found",
                data: {
                    host: '',
                    port: 587,
                    secure: false,
                    auth: {
                        user: '',
                        pass: ''
                    },
                    from: ''
                }
            };
        }
        const rawData = config.value || {};
        
        const normalizedData = {
            host: rawData.host || '',
            port: rawData.port || 587,
            secure: rawData.secure || false,
            auth: {
                user: rawData.auth?.user || rawData.user || '',
                pass: rawData.auth?.pass || rawData.pass || ''
            },
            from: rawData.from || ''
        };

        return {
            success: true,
            message: "SMTP configuration fetched successfully",
            data: normalizedData
        };
    } catch (error) {
        console.error("Error fetching SMTP config:", error);
        return {
            success: false,
            message: "Critical error fetching SMTP configuration",
            data: null
        };
    }
}

export async function saveSMTPConfig(data: any) {
    await dbConnect();
    try {
        const config = await Config.findOneAndUpdate(
            { key: 'SMTP' },
            { value: data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        return {
            success: true,
            message: "SMTP configuration persisted successfully",
            data: config.value
        };
    } catch (error: any) {
        console.error("Error saving SMTP config:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist SMTP configuration",
        };
    }
}
