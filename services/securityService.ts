"use server";

import { dbConnect } from "@/lib/db";
import { SecurityPolicy } from "@/lib/model";
import { trackSeoImages } from "./mediaService";

export async function getSecurity() {
    await dbConnect();
    try {
        const security = await SecurityPolicy.findOne();
        if (!security) {
            return {
                success: false,
                message: "Security data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "Security data fetched successfully",
            data: JSON.parse(JSON.stringify(security))
        };
    } catch (error) {
        console.error("Error fetching Security:", error);
        return {
            success: false,
            message: "Critical error fetching Security data",
            data: null
        };
    }
}

export async function saveSecurity(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const security = await SecurityPolicy.findOneAndUpdate(
            {},
            { ...data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (security && data.metadata) {
            await trackSeoImages(data.metadata, "Security", "security-policy");
        }

        return {
            success: true,
            message: "Security Policy persisted successfully",
            data: JSON.parse(JSON.stringify(security))
        };
    } catch (error: any) {
        console.error("Error saving Security:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist Security configuration",
        };
    }
}
