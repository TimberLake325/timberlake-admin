"use server";

import { dbConnect } from "@/lib/db";
import { ServicesPage } from "@/lib/model";
import { trackMediaUsage, trackSeoImages } from "./mediaService";
import { unstable_cache } from "next/cache";

async function trackServicesImages(data: any) {

    if (data.metadata) {
        await trackSeoImages(data.metadata, "ServicesPage", "services_page");
    }

    if (!data.services) return;

    for (const [index, service] of (data.services as any[]).entries()) {
        if (service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http'))) {
            await trackMediaUsage(service.icon, "ServicesPage", "services_page", `service_${service.id || index}_icon`);
        }
    }
}

const DEFAULT_PAGE = "Services";

export async function getServicesPage() {
    await dbConnect();
    try {
        const servicesPage = await ServicesPage.findOne({ page: DEFAULT_PAGE });
        if (!servicesPage) {
            return {
                success: false,
                message: "Services page data not yet initialized",
                data: null
            };
        }
        return {
            success: true,
            message: "Services page fetched successfully",
            data: JSON.parse(JSON.stringify(servicesPage))
        };
    } catch (error) {
        console.error("Error fetching services page:", error);
        return {
            success: false,
            message: "Failed to connect and fetch services page records",
            data: null
        };
    }
}

export async function saveServicesPage(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const servicesPage = await ServicesPage.findOneAndUpdate(
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

        if (servicesPage) {
            await trackServicesImages(data);
        }

        return {
            success: true,
            message: "Services page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(servicesPage))
        };
    } catch (error: any) {
        console.error("Error persisting services page:", error);
        return {
            success: false,
            message: error.message || "A critical error occurred while persisting page data",
        };
    }
}
