"use server";

import { dbConnect } from "@/lib/db";
import { CaseStudy } from "@/lib/model";
import { updateSitemapLink, removeSitemapLink } from "./sitemapService";
import { trackMediaUsage, untrackMediaUsage, trackSeoImages } from "./mediaService";

export async function getCaseStudies(includeDeleted = false) {
    await dbConnect();
    try {
        const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
        const items = await CaseStudy.find(query).sort({ createdAt: -1 });
        return {
            success: true,
            message: "Case studies fetched successfully",
            data: JSON.parse(JSON.stringify(items))
        };
    } catch (error) {
        console.error("Error fetching case studies:", error);
        return { success: false, message: "Failed to fetch case studies", data: [] };
    }
}

export async function getActiveCaseStudies() {
    await dbConnect();
    try {
        const items = await CaseStudy.find({ isActive: true, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
        return {
            success: true,
            message: "Active case studies fetched successfully",
            data: JSON.parse(JSON.stringify(items))
        };
    } catch (error) {
        console.error("Error fetching active case studies:", error);
        return { success: false, message: "Failed to fetch active case studies", data: [] };
    }
}

export async function getCaseStudyById(id: string) {
    await dbConnect();
    try {
        const item = await CaseStudy.findById(id);
        if (!item) return { success: false, message: "Case study not found" };
        return {
            success: true,
            message: "Case study fetched successfully",
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error) {
        console.error("Error fetching case study by ID:", error);
        return { success: false, message: "Failed to fetch case study" };
    }
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function generateUniqueSlug(title: string, currentSlug: string = '', id: string = '') {
    let slug = currentSlug || slugify(title);
    if (!slug) slug = `case-study-${Date.now()}`;

    const query: any = { slug, isDeleted: { $ne: true } };
    if (id) query._id = { $ne: id };

    let exists = await CaseStudy.findOne(query);
    if (!exists) return slug;

    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    const loopQuery: any = { isDeleted: { $ne: true } };
    if (id) loopQuery._id = { $ne: id };

    while (true) {
        loopQuery.slug = newSlug;
        const exists = await CaseStudy.findOne(loopQuery);
        if (!exists) break;
        counter++;
        newSlug = `${slug}-${counter}`;
    }
    return newSlug;
}

export async function createCaseStudy(data: any) {
    await dbConnect();
    try {
        if (!data.metadata?.title) data.metadata = { ...data.metadata, title: data.title };
        if (!data.metadata?.description) data.metadata = { ...data.metadata, description: data.summary };

        data.slug = await generateUniqueSlug(data.title, data.slug);

        const item = await CaseStudy.create(data);

        const url = `/case-studies/${item.slug}`;
        await updateSitemapLink("Case Studies", {
            name: item.title,
            href: url,
            description: item.summary
        });

        if (item.image) await trackMediaUsage(item.image, "CaseStudy", item._id.toString(), "featured_image");
        if (item.metadata) await trackSeoImages(item.metadata, "CaseStudy", item._id.toString());

        return { success: true, message: "Case study created successfully", data: JSON.parse(JSON.stringify(item)) };
    } catch (error: any) {
        console.error("Error creating case study:", error);
        if (error.code === 11000) {
            return { success: false, message: "A case study with this id/slug already exists." };
        }
        return { success: false, message: error.message || "Failed to create case study" };
    }
}

export async function updateCaseStudy(id: string, data: any) {
    await dbConnect();
    try {
        if (data.metadata) {
            if (!data.metadata.title) data.metadata.title = data.title;
            if (!data.metadata.description) data.metadata.description = data.summary;
        }

        if (data.slug) {
            data.slug = await generateUniqueSlug(data.title, data.slug, id);
        }

        const oldItem = await CaseStudy.findById(id);

        const item = await CaseStudy.findByIdAndUpdate(id, data, { new: true });

        if (item) {
            const url = `/case-studies/${item.slug}`;
            await updateSitemapLink("Case Studies", {
                name: item.title,
                href: url,
                description: item.summary
            });
        }

        if (oldItem && data.image && oldItem.image !== data.image) {
            if (oldItem.image) await untrackMediaUsage(oldItem.image, "CaseStudy", id, "featured_image");
            await trackMediaUsage(data.image, "CaseStudy", id, "featured_image");
        } else if (oldItem && !data.image && oldItem.image) {
            await untrackMediaUsage(oldItem.image, "CaseStudy", id, "featured_image");
        }

        const oldMeta = oldItem?.metadata;
        const newMeta = data.metadata;

        if (data.metadata) {
            await trackSeoImages(data.metadata, "CaseStudy", id);
        }

        return {
            success: true,
            message: "Case Study updated successfully",
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error: any) {
        console.error("Error updating case study:", error);
        if (error.code === 11000) {
            return { success: false, message: "A case study with this slug/title already exists." };
        }
        return { success: false, message: error.message || "Failed to update case study" };
    }
}

export async function deleteCaseStudy(id: string, permanent = false) {
    await dbConnect();
    try {
        if (permanent) {
            const data = await CaseStudy.findByIdAndDelete(id);
            if (data) {
                await removeSitemapLink("Case Studies", `/case-studies/${data.slug}`);
                if (data.image) await untrackMediaUsage(data.image, "CaseStudy", data._id.toString(), "featured_image");
                if (data.metadata) {
                    const seoUrls = [data.metadata.image, data.metadata.ogImage, data.metadata.twitterImage].filter(Boolean);
                    for (const url of seoUrls) {
                        await untrackMediaUsage(url as string, "CaseStudy", data._id.toString());
                    }
                }
            }
        } else {
            const data = await CaseStudy.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
            if (data) {
                await removeSitemapLink("Case Studies", `/case-studies/${data.slug}`);
            }
        }
        return { success: true, message: permanent ? "Case Study permanently removed" : "Case Study soft deleted" };
    } catch (error: any) {
        console.error("Error deleting case study:", error);
        return { success: false, message: "Failed to delete case study" };
    }
}
