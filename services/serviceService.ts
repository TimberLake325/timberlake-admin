"use server";

import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { Service, ServiceCategory } from "@/lib/model";
import { trackMediaUsage, untrackMediaUsage, trackSeoImages } from "./mediaService";
import { removeSitemapLink, updateSitemapLink } from "./sitemapService";

export async function getServiceCategories(includeDeleted = false) {
    await dbConnect();
    try {
        const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
        const categories = await ServiceCategory.find(query).sort({ displayOrder: 1, name: 1 });
        return {
            success: true,
            message: "Categories fetched successfully",
            data: JSON.parse(JSON.stringify(categories))
        };
    } catch (error) {
        console.error("Error fetching service categories:", error);
        return { success: false, message: "Failed to fetch categories", data: [] };
    }
}

export async function getServiceCategoryById(id: string) {
    await dbConnect();
    try {
        const category = await ServiceCategory.findById(id);
        if (!category) return { success: false, message: "Category not found" };
        return {
            success: true,
            message: "Category fetched successfully",
            data: JSON.parse(JSON.stringify(category))
        };
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        return { success: false, message: "Failed to fetch category" };
    }
}

export async function createServiceCategory(data: any) {
    await dbConnect();
    try {
        if (!data.metadata?.title) data.metadata = { ...data.metadata, title: data.name };
        if (!data.metadata?.description) data.metadata = { ...data.metadata, description: data.description };

        data.slug = await generateUniqueSlug(ServiceCategory, data.name, data.slug);

        const category = await ServiceCategory.create(data);

        await updateSitemapLink("Services", {
            name: category.name,
            href: `/services/${category.slug}`,
            description: category.description
        });

        if (category.image) await trackMediaUsage(category.image, "ServiceCategory", category._id.toString(), "image");
        if (category.icon) await trackMediaUsage(category.icon, "ServiceCategory", category._id.toString(), "icon");
        if (category.metadata) await trackSeoImages(category.metadata, "ServiceCategory", category._id.toString());

        return {
            success: true,
            message: "Category created successfully",
            data: JSON.parse(JSON.stringify(category))
        };
    } catch (error: any) {
        console.error("Error creating category:", error);
        return { success: false, message: error.message || "Failed to create category" };
    }
}

export async function updateServiceCategory(id: string, data: any) {
    await dbConnect();
    try {
        if (data.slug) data.slug = await generateUniqueSlug(ServiceCategory, data.name || '', data.slug, id);

        const oldCategory = await ServiceCategory.findById(id);
        const category = await ServiceCategory.findByIdAndUpdate(id, data, { new: true });

        if (category) {
            await updateSitemapLink("Services", {
                name: category.name,
                href: `/services/${category.slug}`,
                description: category.description
            });

            if (oldCategory && data.image && oldCategory.image !== data.image) {
                if (oldCategory.image) await untrackMediaUsage(oldCategory.image, "ServiceCategory", id, "image");
                await trackMediaUsage(data.image, "ServiceCategory", id, "image");
            }
            if (oldCategory && data.icon && oldCategory.icon !== data.icon) {
                if (oldCategory.icon) await untrackMediaUsage(oldCategory.icon, "ServiceCategory", id, "icon");
                await trackMediaUsage(data.icon, "ServiceCategory", id, "icon");
            }
            if (data.metadata) await trackSeoImages(data.metadata, "ServiceCategory", id);
        }

        return {
            success: true,
            message: "Category updated successfully",
            data: JSON.parse(JSON.stringify(category))
        };
    } catch (error: any) {
        console.error("Error updating category:", error);
        return { success: false, message: error.message || "Failed to update category" };
    }
}

export async function deleteServiceCategory(id: string, permanent = false) {
    await dbConnect();
    try {
        if (permanent) {
            const category = await ServiceCategory.findByIdAndDelete(id);
            if (category) {

                const relatedServices = await Service.find({ category: id });
                for (const service of relatedServices) {
                    await deleteService(service._id.toString(), true);
                }

                await removeSitemapLink("Services", `/services/${category.slug}`);
                if (category.image) await untrackMediaUsage(category.image, "ServiceCategory", id, "image");
                if (category.icon) await untrackMediaUsage(category.icon, "ServiceCategory", id, "icon");
                if (category.metadata) {
                    const seoUrls = [category.metadata.image, category.metadata.ogImage, category.metadata.twitterImage].filter(Boolean);
                    for (const url of seoUrls) {
                        await untrackMediaUsage(url as string, "ServiceCategory", id);
                    }
                }
            }
        } else {
            await ServiceCategory.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
        }
        return { success: true, message: permanent ? "Category permanently removed" : "Category soft deleted" };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, message: "Failed to delete category" };
    }
}

export async function getServices(includeDeleted = false, categoryId?: string) {
    await dbConnect();
    try {
        const query: any = includeDeleted ? {} : { isDeleted: { $ne: true } };
        if (categoryId) query.category = categoryId;

        const services = await Service.find(query).populate('category', 'name slug').sort({ displayOrder: 1, createdAt: -1 });
        return {
            success: true,
            message: "Services fetched successfully",
            data: JSON.parse(JSON.stringify(services))
        };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { success: false, message: "Failed to fetch services", data: [] };
    }
}

export async function getServiceById(id: string) {
    await dbConnect();
    try {
        const service = await Service.findById(id).populate('category', 'name slug');
        if (!service) return { success: false, message: "Service not found" };
        return {
            success: true,
            message: "Service fetched successfully",
            data: JSON.parse(JSON.stringify(service))
        };
    } catch (error) {
        console.error("Error fetching service by ID:", error);
        return { success: false, message: "Failed to fetch service" };
    }
}

function slugify(text: any) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function generateUniqueSlug(model: mongoose.Model<any>, title: string, currentSlug: string = '', id: string = '') {
    let slug = currentSlug ? slugify(currentSlug) : slugify(title);
    if (!slug) slug = `${model.modelName.toLowerCase()}-${Date.now()}`;

    const query: any = { slug, isDeleted: { $ne: true } };
    if (id) query._id = { $ne: id };

    let exists = await model.findOne(query);
    if (!exists) return slug;

    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (true) {
        const exists = await model.findOne({ slug: newSlug, _id: { $ne: id }, isDeleted: { $ne: true } });
        if (!exists) break;
        counter++;
        newSlug = `${slug}-${counter}`;
    }
    return newSlug;
}

export async function createService(data: any) {
    await dbConnect();
    try {
        if (!data.metadata?.title) data.metadata = { ...data.metadata, title: data.title };
        if (!data.metadata?.description) data.metadata = { ...data.metadata, description: data.description };

        data.slug = await generateUniqueSlug(Service, data.title, data.slug);
        const service = await Service.create(data);

        const category = await ServiceCategory.findById(data.category);
        const categorySlug = category ? category.slug : 'uncategorized';

        const serviceUrl = `/services/${categorySlug}/${service.slug}`;
        await updateSitemapLink("Services", {
            name: service.title,
            href: serviceUrl,
            description: service.description
        });

        if (service.image) await trackMediaUsage(service.image, "Service", service._id.toString(), "image");
        if (service.icon) await trackMediaUsage(service.icon, "Service", service._id.toString(), "icon");
        if (service.metadata) await trackSeoImages(service.metadata, "Service", service._id.toString());

        return {
            success: true,
            message: "Service created successfully",
            data: JSON.parse(JSON.stringify(service))
        };
    } catch (error: any) {
        console.error("Error creating service:", error);
        return { success: false, message: error.message || "Failed to create service" };
    }
}

export async function updateService(id: string, data: any) {
    await dbConnect();
    try {
        if (data.metadata) {
            if (!data.metadata.title) data.metadata.title = data.title;
            if (!data.metadata.description) data.metadata.description = data.description;
        }

        if (data.slug) data.slug = await generateUniqueSlug(Service, data.title, data.slug, id);

        const oldService = await Service.findById(id);
        const service = await Service.findByIdAndUpdate(id, data, { new: true }).populate('category', 'name slug');

        if (service) {
            const categorySlug = service.category && typeof service.category !== 'string' ? (service.category as any).slug : 'uncategorized';
            const serviceUrl = `/services/${categorySlug}/${service.slug}`;
            await updateSitemapLink("Services", {
                name: service.title,
                href: serviceUrl,
                description: service.description
            });

            if (oldService && data.image && oldService.image !== data.image) {
                if (oldService.image) await untrackMediaUsage(oldService.image, "Service", id, "image");
                await trackMediaUsage(data.image, "Service", id, "image");
            }
            if (oldService && data.icon && oldService.icon !== data.icon) {
                if (oldService.icon) await untrackMediaUsage(oldService.icon, "Service", id, "icon");
                await trackMediaUsage(data.icon, "Service", id, "icon");
            }
            if (data.metadata) await trackSeoImages(data.metadata, "Service", id);
        }

        return {
            success: true,
            message: "Service updated successfully",
            data: JSON.parse(JSON.stringify(service))
        };
    } catch (error: any) {
        console.error("Error updating service:", error);
        return { success: false, message: error.message || "Failed to update service" };
    }
}

export async function deleteService(id: string, permanent = false) {
    await dbConnect();
    try {
        if (permanent) {
            const service = await Service.findByIdAndDelete(id);
            if (service) {
                if (service.image) await untrackMediaUsage(service.image, "Service", id, "image");
                if (service.icon) await untrackMediaUsage(service.icon, "Service", id, "icon");
                if (service.metadata) {
                    const seoUrls = [service.metadata.image, service.metadata.ogImage, service.metadata.twitterImage].filter(Boolean);
                    for (const url of seoUrls) {
                        await untrackMediaUsage(url as string, "Service", id);
                    }
                }
            }
        } else {
            await Service.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
        }
        return { success: true, message: permanent ? "Service permanently removed" : "Service soft deleted" };
    } catch (error: any) {
        console.error("Error deleting service:", error);
        return { success: false, message: "Failed to delete service" };
    }
}
