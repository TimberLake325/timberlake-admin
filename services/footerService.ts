"use server";

import { dbConnect } from "@/lib/db";
import { Footer } from "@/lib/model";
import { trackMediaUsage } from "./mediaService";

import { unstable_cache, revalidatePath } from "next/cache";

const DEFAULT_COMPANY = "Timberlake";

export async function getFooter() {
    await dbConnect();
    try {
        const footer = await Footer.findOne({ companyName: DEFAULT_COMPANY });
        if (!footer) {
            return {
                success: false,
                message: "Footer data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "Footer fetched successfully",
            data: JSON.parse(JSON.stringify(footer))
        };
    } catch (error) {
        console.error("Error fetching footer:", error);
        return {
            success: false,
            message: "Critical error fetching footer data",
            data: null
        };
    }
}

export async function saveFooter(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const footer = await Footer.findOneAndUpdate(
            { companyName: DEFAULT_COMPANY },
            {
                ...data,
                companyName: DEFAULT_COMPANY
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (footer && (data.complianceBadges as any[])) {
            for (const [index, badge] of (data.complianceBadges as any[]).entries()) {
                if (badge.icon && (badge.icon.startsWith('/') || badge.icon.startsWith('http'))) {
                    await trackMediaUsage(badge.icon, "Footer", "footer_config", `badge_${index}_icon`);
                }
            }
        }

        revalidatePath('admin/footer');

        return {
            success: true,
            message: "Footer configuration persisted successfully",
            data: JSON.parse(JSON.stringify(footer))
        };
    } catch (error: any) {
        console.error("Error saving footer:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist footer configuration",
        };
    }
}
