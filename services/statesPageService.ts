"use server";

import { dbConnect } from "@/lib/db";
import { StatesPage } from "@/lib/model";
import { trackMediaUsage, trackSeoImages } from "./mediaService";
import { revalidatePath } from "next/cache";

const DEFAULT_PAGE = "States";

async function trackStatesPageImages(data: any) {

    if (data.metadata) {
        await trackSeoImages(data.metadata, "StatesPage", "states_page");
    }

    if (data.pageData?.states) {
        for (const [index, state] of (data.pageData.states as any[]).entries()) {
            if (state.image && (state.image.startsWith('/') || state.image.startsWith('http'))) {
                await trackMediaUsage(state.image, "StatesPage", "states_page", `state_${state.slug || index}_image`);
            }
        }
    }
}

export async function getStatesPage() {
    await dbConnect();
    try {
        const statesPage = await StatesPage.findOne({ page: DEFAULT_PAGE });

        if (!statesPage) {
            return {
                success: false,
                message: "States page data not yet initialized",
                data: null
            };
        }
        if (statesPage && statesPage.pageData?.states) {
            statesPage.pageData.states.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }

        return {
            success: true,
            message: "States page fetched successfully",
            data: JSON.parse(JSON.stringify(statesPage))
        };
    } catch (error) {
        console.error("Error fetching states page:", error);
        return {
            success: false,
            message: "Failed to connect and fetch states page records",
            data: null
        };
    }
}

export async function saveStatesPage(data: Record<string, unknown>) {
    await dbConnect();
    try {
        const statesPage = await StatesPage.findOneAndUpdate(
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

        if (statesPage) {
            await trackStatesPageImages(data);
        }

        revalidatePath('/admin/states');

        return {
            success: true,
            message: "States page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(statesPage))
        };
    } catch (error: any) {
        console.error("Error persisting states page:", error);
        return {
            success: false,
            message: error.message || "A critical error occurred while persisting page data",
        };
    }
}
