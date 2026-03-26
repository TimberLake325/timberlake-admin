"use server";

import { dbConnect } from "@/lib/db";
import { HomePage } from "@/lib/model";
import { syncMediaUsage, trackSeoImages } from "./mediaService";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";

function getAllImagesFromData(data: any) {
    const urls: string[] = [];
    if (!data.sections) return urls;

    for (const section of data.sections) {
        if (!section.content) continue;

        if (section.type === 'HERO') {
            if (section.content.image) urls.push(section.content.image);
        }

        if (section.type === 'WHAT_WE_DO' && section.content.logos) {
            section.content.logos.forEach((l: any) => l.icon && urls.push(l.icon));
        }

        if (section.type === 'WHY_CHOOSE_US' && section.content.points) {
            section.content.points.forEach((p: any) => p.icon && urls.push(p.icon));
        }

        if (section.type === 'PROCESS' && section.content.steps) {
            section.content.steps.forEach((s: any) => s.icon && urls.push(s.icon));
        }

        if (section.type === 'TECH_STACK' && section.content.categories) {
            section.content.categories.forEach((cat: any) => {
                cat.technologies?.forEach((t: any) => t.icon && urls.push(t.icon));
            });
        }

        if (section.type === 'CASE_STUDIES' && section.content.items) {
            section.content.items.forEach((item: any) => item.image && urls.push(item.image));
        }

        if (section.type === 'TESTIMONIALS' && section.content.items) {
            section.content.items.forEach((item: any) => item.avatar && urls.push(item.avatar));
        }

        if (section.type === 'APPOINTMENT_BOOKING') {
            if (section.content.securityIcon) urls.push(section.content.securityIcon);
            if (section.content.securityIconForm) urls.push(section.content.securityIconForm);
            if (section.content.valueProps) {
                section.content.valueProps.forEach((v: any) => v.icon && urls.push(v.icon));
            }
        }

        if (section.type === 'INSURANCE_PAYERS') {
            if (section.content.footerNoteIcon) urls.push(section.content.footerNoteIcon);
            if (section.content.items) {
                section.content.items.forEach((item: any) => item.logo && urls.push(item.logo));
            }
        }
    }
    return [...new Set(urls.filter(Boolean))];
}

const DEFAULT_SLUG = "home";

export async function getHomePage() {
    await dbConnect();
    try {
        const homePage = await HomePage.findOne({ slug: DEFAULT_SLUG });
        if (!homePage) {
            return {
                success: false,
                message: "Home page data not found",
                data: null
            };
        }
        return {
            success: true,
            message: "Home page data fetched successfully",
            data: JSON.parse(JSON.stringify(homePage))
        };
    } catch (error) {
        console.error("Error fetching home page:", error);
        return {
            success: false,
            message: "Critical error fetching home page data",
            data: null
        };
    }
}

export async function saveHomePage(data: Record<string, any>) {
    await dbConnect();
    try {

        const oldPage = await HomePage.findOne({ slug: DEFAULT_SLUG });
        const oldImages = oldPage ? getAllImagesFromData(oldPage) : [];
        const newImages = getAllImagesFromData(data);

        const homePage = await HomePage.findOneAndUpdate(
            { slug: DEFAULT_SLUG },
            {
                ...data,
                slug: DEFAULT_SLUG
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        if (homePage) {

            if (data.metadata) {
                await trackSeoImages(data.metadata, "HomePage", "home_page");
            }

            await syncMediaUsage(oldImages, newImages, "HomePage", "home_page", "content_images");

            revalidatePath('/');
            revalidateTag('home-page-data', 'default');
        }

        return {
            success: true,
            message: "Home page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(homePage))
        };
    } catch (error: any) {
        console.error("Error saving home page:", error);
        return {
            success: false,
            message: error.message || "System error: Failed to persist home page configuration",
        };
    }
}
