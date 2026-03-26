import { dbConnect } from "@/lib/db";
import { Media } from "@/lib/model";
import { del } from "@vercel/blob";
import path from "path";

export async function getMediaLibrary(filter: 'all' | 'in-use' | 'unused' = 'all') {
    await dbConnect();
    try {
        let query = {};
        if (filter === 'in-use') {
            query = { "usage.0": { $exists: true } };
        } else if (filter === 'unused') {
            query = { usage: { $size: 0 } };
        }

        const media = await Media.find(query).sort({ createdAt: -1 });
        return {
            success: true,
            data: JSON.parse(JSON.stringify(media))
        };
    } catch (error: any) {
        console.error("Error fetching media library:", error);
        return { success: false, message: error.message || "Failed to fetch media" };
    }
}

export async function recordMediaUpload(data: {
    url: string;
    filename: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
}) {
    await dbConnect();
    try {
        const media = await Media.create(data);
        return {
            success: true,
            data: JSON.parse(JSON.stringify(media))
        };
    } catch (error: any) {
        console.error("Error recording media upload:", error);
        return { success: false, message: error.message || "Failed to record media" };
    }
}

export async function trackMediaUsage(url: string, moduleName: string, entityId: string, fieldName?: string) {
    await dbConnect();
    try {
        // Use moduleName as feature for backward compatibility if needed, 
        // or just pass it in usage object.
        await Media.findOneAndUpdate(
            { url },
            {
                $addToSet: {
                    usage: {
                        module: moduleName,
                        entityId,
                        fieldName,
                        feature: moduleName, // Backward comp
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error tracking media usage:", error);
        return { success: false };
    }
}

export async function untrackMediaUsage(url: string, moduleName: string, entityId: string, fieldName?: string) {
    await dbConnect();
    try {
        const pullQuery: any = { module: moduleName, entityId };
        if (fieldName) pullQuery.fieldName = fieldName;

        await Media.findOneAndUpdate(
            { url },
            { $pull: { usage: pullQuery } },
            { new: true }
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error untracking media usage:", error);
        return { success: false };
    }
}

export async function deleteMedia(id: string, force = false) {
    await dbConnect();
    try {
        const media = await Media.findById(id);
        if (!media) {
            return { success: false, message: "Media not found" };
        }

        if (media.usage.length > 0 && !force) {
            return {
                success: false,
                message: `Media is currently in use by ${media.usage.length} items (${media.usage[0].feature}).`
            };
        }

        try {
            await del(media.url);
        } catch (err) {

        }

        await Media.findByIdAndDelete(id);
        return { success: true, message: "Media deleted successfully" };
    } catch (error: any) {
        console.error("Error deleting media:", error);
        return { success: false, message: error.message || "Failed to delete media" };
    }
}

export async function syncMediaUsage(oldUrls: string[], newUrls: string[], moduleName: string, entityId: string, fieldName?: string) {
    await dbConnect();
    try {
        const removedUrls = oldUrls.filter(url => url && !newUrls.includes(url));
        const addedUrls = newUrls.filter(url => url && !oldUrls.includes(url));

        for (const url of removedUrls) {
            await untrackMediaUsage(url, moduleName, entityId, fieldName);
        }

        for (const url of addedUrls) {
            await trackMediaUsage(url, moduleName, entityId, fieldName);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error syncing media usage:", error);
        return { success: false };
    }
}

export async function trackSeoImages(metadata: any, moduleName: string, entityId: string) {
    if (!metadata) return;

    const imageUrls = [
        { url: metadata.image, field: 'seo_image' },
        { url: metadata.ogImage, field: 'seo_ogImage' },
        { url: metadata.twitterImage, field: 'seo_twitterImage' }
    ].filter(
        item => typeof item.url === 'string' && (item.url.startsWith('/') || item.url.startsWith('http'))
    );

    for (const item of imageUrls) {
        await trackMediaUsage(item.url, moduleName, entityId, item.field);
    }
}
