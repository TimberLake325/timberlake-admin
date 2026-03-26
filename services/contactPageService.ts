"use server";

import { dbConnect } from "@/lib/db";
import { ContactPage } from "@/lib/model";
import { trackMediaUsage, trackSeoImages } from "./mediaService";
import { unstable_cache } from "next/cache";

const DEFAULT_PAGE = "Contact Us";

export async function getContactPage() {
    await dbConnect();
    try {
        const contactPage = await ContactPage.findOne({ page: DEFAULT_PAGE });
        if (!contactPage) {
            return {
                success: false,
                message: "Contact page data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "Contact page fetched successfully",
            data: JSON.parse(JSON.stringify(contactPage))
        };
    } catch (error) {
        console.error("Error fetching contact page:", error);
        return {
            success: false,
            message: "Critical error fetching contact page data",
            data: null
        };
    }
}

export async function saveContactPage(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const contactPage = await ContactPage.findOneAndUpdate(
            { page: DEFAULT_PAGE },
            {
                ...data,
                page: DEFAULT_PAGE
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (contactPage && data.metadata) {
            await trackSeoImages(data.metadata, "ContactPage", "contact_page");
        }

        if (contactPage && (data as any).pageData?.form?.security?.icon) {
            const icon = (data as any).pageData.form.security.icon;
            if (icon && (icon.startsWith('/') || icon.startsWith('http'))) {
                await trackMediaUsage(icon, "ContactPage", "contact_page", "form_security_icon");
            }
        }

        const { clearCache } = await import('@/actions/revalidate');
        await clearCache();

        return {
            success: true,
            message: "Contact page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(contactPage))
        };
    } catch (error: any) {
        console.error("Error saving contact page:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist contact page configuration",
        };
    }
}
