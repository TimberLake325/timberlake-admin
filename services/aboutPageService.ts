"use server";

import { dbConnect } from "@/lib/db";
import { AboutPage } from "@/lib/model";
import { trackMediaUsage, trackSeoImages } from "./mediaService";
import { unstable_cache, revalidatePath } from "next/cache";

async function trackAboutPageImages(data: any) {

    if (data.metadata) {
        await trackSeoImages(data.metadata, "AboutPage", "about_page");
    }

    if (data.pageData?.missionVision) {
        const { mission, vision } = data.pageData.missionVision;
        if (mission?.icon && (mission.icon.startsWith('/') || mission.icon.startsWith('http'))) {
            await trackMediaUsage(mission.icon, "AboutPage", "about_page", "mission_icon");
        }
        if (vision?.icon && (vision.icon.startsWith('/') || vision.icon.startsWith('http'))) {
            await trackMediaUsage(vision.icon, "AboutPage", "about_page", "vision_icon");
        }
    }

    if (data.pageData?.compliance) {
        const { badgeIcon, watermarkIcon } = data.pageData.compliance;
        if (badgeIcon && (badgeIcon.startsWith('/') || badgeIcon.startsWith('http'))) {
            await trackMediaUsage(badgeIcon, "AboutPage", "about_page", "compliance_badge");
        }
        if (watermarkIcon && (watermarkIcon.startsWith('/') || watermarkIcon.startsWith('http'))) {
            await trackMediaUsage(watermarkIcon, "AboutPage", "about_page", "compliance_watermark");
        }
    }

    if (data.pageData?.testimonials) {
        for (const [index, testimonial] of (data.pageData.testimonials as any[]).entries()) {
            if (testimonial.avatar && (testimonial.avatar.startsWith('/') || testimonial.avatar.startsWith('http'))) {
                await trackMediaUsage(testimonial.avatar, "AboutPage", "about_page", `testimonial_${index}_avatar`);
            }
        }
    }

    if (data.pageData?.leadership?.members) {
        for (const [index, member] of (data.pageData.leadership.members as any[]).entries()) {
            if (member.image && (member.image.startsWith('/') || member.image.startsWith('http'))) {
                await trackMediaUsage(member.image, "AboutPage", "about_page", `member_${index}_image`);
            }
        }
    }
}

const DEFAULT_PAGE = "About Us";

export async function getAboutPage() {
    await dbConnect();
    try {
        const aboutPage = await AboutPage.findOne({ page: DEFAULT_PAGE });
        if (!aboutPage) {
            return {
                success: false,
                message: "About page data not yet initialized",
                data: null
            };
        }
        return {
            success: true,
            message: "About page fetched successfully",
            data: JSON.parse(JSON.stringify(aboutPage))
        };
    } catch (error) {
        console.error("Error fetching about page:", error);
        return {
            success: false,
            message: "Failed to connect and fetch about page records",
            data: null
        };
    }
}

export async function saveAboutPage(data: Record<string, unknown>) {
    await dbConnect();
    try {

        const aboutPage = await AboutPage.findOneAndUpdate(
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

        if (aboutPage) {
            await trackAboutPageImages(data);
        }

        revalidatePath('/admin/about');

        return {
            success: true,
            message: "About page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(aboutPage))
        };
    } catch (error: any) {
        console.error("Error persisting about page:", error);
        return {
            success: false,
            message: error.message || "A critical error occurred while persisting page data",
        };
    }
}
