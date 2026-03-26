"use server";

import { dbConnect } from "@/lib/db";
import { FAQ } from "@/lib/model";
import { trackSeoImages } from "./mediaService";

export async function getFAQ() {
    await dbConnect();
    try {
        const faq = await FAQ.findOne();
        if (!faq) {
            return {
                success: false,
                message: "FAQ data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "FAQ fetched successfully",
            data: JSON.parse(JSON.stringify(faq))
        };
    } catch (error) {
        console.error("Error fetching FAQ:", error);
        return {
            success: false,
            message: "Critical error fetching FAQ data",
            data: null
        };
    }
}

export async function saveFAQ(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const faq = await FAQ.findOneAndUpdate(
            {},
            { ...data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (faq && data.metadata) {
            await trackSeoImages(data.metadata, "FAQ", "faq");
        }

        return {
            success: true,
            message: "FAQ configuration persisted successfully",
            data: JSON.parse(JSON.stringify(faq))
        };
    } catch (error: any) {
        console.error("Error saving FAQ:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist FAQ configuration",
        };
    }
}
