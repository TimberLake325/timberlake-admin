"use server";

import { dbConnect } from "@/lib/db";
import { BlogPage } from "@/lib/model";
import { revalidateTag } from "next/cache";

export async function getBlogPage() {
    await dbConnect();
    try {
        let page = await BlogPage.findOne({ page: 'Blog Index' });
        if (!page) {
            page = await BlogPage.create({
                page: 'Blog Index',
                metadata: {
                    title: 'Blog | Timberlake',
                    description: 'Explore the latest insights and articles from Timberlake.',
                }
            });
        }
        return {
            success: true,
            message: "Blog page fetched successfully",
            data: JSON.parse(JSON.stringify(page))
        };
    } catch (error) {
        console.error("Error fetching blog page:", error);
        return { success: false, message: "Failed to fetch blog page", data: null };
    }
}

export async function updateBlogPage(data: any) {
    await dbConnect();
    try {
        const page = await BlogPage.findOneAndUpdate(
            { page: 'Blog Index' },
            { $set: data },
            { new: true, upsert: true }
        );
        revalidateTag('blog-page', 'default');
        return {
            success: true,
            message: "Blog page updated successfully",
            data: JSON.parse(JSON.stringify(page))
        };
    } catch (error) {
        console.error("Error updating blog page:", error);
        return { success: false, message: "Failed to update blog page" };
    }
}
