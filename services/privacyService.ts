"use server";

import { dbConnect } from "@/lib/db";
import { Privacy } from "@/lib/model";
import { trackSeoImages } from "./mediaService";
import { unstable_cache } from "next/cache";

export async function getPrivacy() {
    await dbConnect();
    try {
        const privacy = await Privacy.findOne();
        if (!privacy) {
            return {
                success: false,
                message: "Privacy data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "Privacy data fetched successfully",
            data: JSON.parse(JSON.stringify(privacy))
        };
    } catch (error) {
        console.error("Error fetching privacy:", error);
        return {
            success: false,
            message: "Critical error fetching privacy data",
            data: null
        };
    }
}

export async function savePrivacy(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const privacy = await Privacy.findOneAndUpdate(
            {},
            { ...data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (privacy && data.metadata) {
            await trackSeoImages(data.metadata, "Privacy", "privacy");
        }

        return {
            success: true,
            message: "Privacy Policy persisted successfully",
            data: JSON.parse(JSON.stringify(privacy))
        };
    } catch (error: any) {
        console.error("Error saving privacy:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist privacy configuration",
        };
    }
}
