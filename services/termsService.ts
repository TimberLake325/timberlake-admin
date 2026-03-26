"use server";

import { dbConnect } from "@/lib/db";
import { Terms } from "@/lib/model";
import { trackSeoImages } from "./mediaService";
import { unstable_cache } from "next/cache";

const DEFAULT_DOC = "Terms of Condition";

export async function getTerms() {
    await dbConnect();

    try {
        const terms = await Terms.findOne();

        if (!terms) {
            return {
                success: false,
                message: "Terms data not found",
                data: null,
            };
        }

        return {
            success: true,
            message: "Terms fetched successfully",
            data: JSON.parse(JSON.stringify(terms)),
        };
    } catch (error) {
        console.error("Error fetching terms:", error);
        return {
            success: false,
            message: "Critical error fetching terms data",
            data: null,
        };
    }
}

export async function saveTerms(data: Record<string, unknown>) {
    await dbConnect();
    try {

        const terms = await Terms.findOneAndUpdate(
        {},
            { ...data },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (terms && data.metadata) {
            await trackSeoImages(data.metadata, "Terms", "terms");
        }

        return {
            success: true,
            message: "Terms and Conditions persisted successfully",
            data: JSON.parse(JSON.stringify(terms))
        };
    } catch (error: any) {
        console.error("Error saving terms:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist terms configuration",
        };
    }
}
