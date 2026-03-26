"use server";

import { dbConnect } from "@/lib/db";
import { HipaaCompliance } from "@/lib/model";
import { trackSeoImages } from "./mediaService";

export async function getHipaa() {
    await dbConnect();
    try {
        const hipaa = await HipaaCompliance.findOne();
        if (!hipaa) {
            return {
                success: false,
                message: "HIPAA data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "HIPAA data fetched successfully",
            data: JSON.parse(JSON.stringify(hipaa))
        };
    } catch (error) {
        console.error("Error fetching HIPAA:", error);
        return {
            success: false,
            message: "Critical error fetching HIPAA data",
            data: null
        };
    }
}

export async function saveHipaa(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const hipaa = await HipaaCompliance.findOneAndUpdate(
            {},
            { ...data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (hipaa && data.metadata) {
            await trackSeoImages(data.metadata, "HIPAA", "hipaa-compliance");
        }

        return {
            success: true,
            message: "HIPAA Compliance persisted successfully",
            data: JSON.parse(JSON.stringify(hipaa))
        };
    } catch (error: any) {
        console.error("Error saving HIPAA:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist HIPAA configuration",
        };
    }
}
