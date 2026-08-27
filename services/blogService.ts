"use server";

import { dbConnect } from "@/lib/db";
import { BlogCategory, BlogPost } from "@/lib/model";
import { unstable_cache } from "next/cache";
import { updateSitemapLink, removeSitemapLink } from "./sitemapService";
import { trackMediaUsage, untrackMediaUsage, trackSeoImages } from "./mediaService";

export async function getBlogCategories(includeDeleted = false) {
    await dbConnect();
    try {
        const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
        const categories = await BlogCategory.find(query).sort({ createdAt: -1 });
        return {
            success: true,
            message: "Categories fetched successfully",
            data: JSON.parse(JSON.stringify(categories))
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, message: "Failed to fetch categories", data: [] };
    }
}

export async function getBlogCategoryById(id: string) {
    await dbConnect();
    try {
        const category = await BlogCategory.findById(id);
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

export async function createBlogCategory(data: any) {
    await dbConnect();
    try {
        if (!data.metadata?.title) data.metadata = { ...data.metadata, title: data.name };
        if (!data.metadata?.description) data.metadata = { ...data.metadata, description: data.description };
        const category = await BlogCategory.create(data);
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

export async function updateBlogCategory(id: string, data: any) {
    await dbConnect();
    try {
        if (data.metadata) {
            if (!data.metadata.title) data.metadata.title = data.name;
            if (!data.metadata.description) data.metadata.description = data.description;
        }
        const category = await BlogCategory.findByIdAndUpdate(id, data, { new: true });
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

export async function deleteBlogCategory(id: string, permanent = false) {
    await dbConnect();
    try {
        if (permanent) {
            await BlogCategory.findByIdAndDelete(id);

            await BlogPost.updateMany({ category: id }, { isDeleted: true, deletedAt: new Date() });
        } else {
            await BlogCategory.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
            await BlogPost.updateMany({ category: id }, { isDeleted: true, deletedAt: new Date() });
        }
        return { success: true, message: permanent ? "Category permanently removed" : "Category soft deleted" };
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return { success: false, message: "Failed to delete category" };
    }
}

export async function restoreBlogCategory(id: string) {
    await dbConnect();
    try {
        const category = await BlogCategory.findById(id);
        if (!category) return { success: false, message: "Category not found" };
        if (!category.isDeleted) return { success: false, message: "Category is not deleted" };

        await BlogCategory.findByIdAndUpdate(id, {
            isDeleted: false,
            $unset: { deletedAt: 1 }
        });
        
        // Also restore associated blog posts
        await BlogPost.updateMany(
            { category: id, isDeleted: true },
            { isDeleted: false, $unset: { deletedAt: 1 } }
        );

        return { success: true, message: "Category and associated posts restored successfully" };
    } catch (error: any) {
        console.error("Error restoring category:", error);
        return { success: false, message: error.message || "Failed to restore category" };
    }
}

export async function getBlogPostById(id: string) {
    await dbConnect();
    try {
        const post = await BlogPost.findById(id).populate('category', 'name _id');
        if (!post) return { success: false, message: "Post not found" };
        return {
            success: true,
            message: "Post fetched successfully",
            data: JSON.parse(JSON.stringify(post))
        };
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return { success: false, message: "Failed to fetch post" };
    }
}

export const getBlogPosts = async (page = 1, limit = 10, categoryId?: string, includeDeleted = false) => {
    try {
        await dbConnect();
        const skip = (page - 1) * limit;
        const query: any = includeDeleted ? {} : { isDeleted: { $ne: true } };
        if (categoryId) {
            query.category = categoryId;
        }

        const posts = await BlogPost.find(query)
            .populate('category', 'name')
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BlogPost.countDocuments(query);

        return {
            success: true,
            message: "Posts fetched successfully",
            data: {
                posts: JSON.parse(JSON.stringify(posts)),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return {
            success: false,
            message: "Failed to fetch posts",
            data: { posts: [], total: 0, page, totalPages: 0 }
        };
    }
};

export async function createBlogPost(data: any) {
    await dbConnect();
    try {
        if (!data.metadata?.title) data.metadata = { ...data.metadata, title: data.title };
        if (!data.metadata?.description) data.metadata = { ...data.metadata, description: data.excerpt };
        const post = await BlogPost.create(data);

        const blogUrl = `/blogs/${post.slug}`;
        await updateSitemapLink("Blogs", {
            name: post.title,
            href: blogUrl,
            description: post.excerpt
        });

        if (post.image) {
            await trackMediaUsage(post.image, "Blog", post._id.toString(), "featured_image");
        }
        if (post.bannerBg) {
            await trackMediaUsage(post.bannerBg, "Blog", post._id.toString(), "banner_bg");
        }
        if (post.metadata) {
            await trackSeoImages(post.metadata, "Blog", post._id.toString());
        }

        return {
            success: true,
            message: "Blog post created successfully",
            data: JSON.parse(JSON.stringify(post))
        };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, message: error.message || "Failed to create post" };
    }
}

export async function updateBlogPost(id: string, data: any) {
    await dbConnect();
    try {
        if (data.metadata) {
            if (!data.metadata.title) data.metadata.title = data.title;
            if (!data.metadata.description) data.metadata.description = data.excerpt;
        }

        const oldPost = await BlogPost.findById(id);

        const post = await BlogPost.findByIdAndUpdate(id, data, { new: true });

        if (post) {

            const blogUrl = `/blogs/${post.slug}`;
            await updateSitemapLink("Blogs", {
                name: post.title,
                href: blogUrl,
                description: post.excerpt
            });

        }

        if (oldPost && data.image && oldPost.image !== data.image) {
            if (oldPost.image) {
                await untrackMediaUsage(oldPost.image, "Blog", id, "featured_image");
            }
            await trackMediaUsage(data.image, "Blog", id, "featured_image");
        } else if (oldPost && !data.image && oldPost.image) {
            await untrackMediaUsage(oldPost.image, "Blog", id, "featured_image");
        }

        if (oldPost && data.bannerBg && oldPost.bannerBg !== data.bannerBg) {
            if (oldPost.bannerBg) {
                await untrackMediaUsage(oldPost.bannerBg, "Blog", id, "banner_bg");
            }
            await trackMediaUsage(data.bannerBg, "Blog", id, "banner_bg");
        } else if (oldPost && !data.bannerBg && oldPost.bannerBg) {
            await untrackMediaUsage(oldPost.bannerBg, "Blog", id, "banner_bg");
        }

        const oldMeta = oldPost?.metadata;
        const newMeta = data.metadata;

        if (data.metadata) {
            await trackSeoImages(data.metadata, "Blog", id);
        }

        return {
            success: true,
            message: "Blog post updated successfully",
            data: JSON.parse(JSON.stringify(post))
        };
    } catch (error: any) {
        console.error("Error updating post:", error);
        return { success: false, message: error.message || "Failed to update post" };
    }
}

export async function deleteBlogPost(id: string, permanent = false) {
    await dbConnect();
    try {
        if (permanent) {
            const post = await BlogPost.findByIdAndDelete(id);
            if (post) {
                await removeSitemapLink("Blogs", `/blogs/${post.slug}`);
                if (post.image) {
                    await untrackMediaUsage(post.image, "Blog", post._id.toString(), "featured_image");
                }
                if (post.bannerBg) {
                    await untrackMediaUsage(post.bannerBg, "Blog", post._id.toString(), "banner_bg");
                }
                if (post.metadata) {
                    const seoUrls = [post.metadata.image, post.metadata.ogImage, post.metadata.twitterImage].filter(Boolean);
                    for (const url of seoUrls) {
                        await untrackMediaUsage(url as string, "Blog", post._id.toString());
                    }
                }
            }
        } else {
            const post = await BlogPost.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
            if (post) {
                await removeSitemapLink("Blogs", `/blogs/${post.slug}`);
                if (post.image) {
                    await untrackMediaUsage(post.image, "Blog", post._id.toString(), "featured_image");
                }
                if (post.bannerBg) {
                    await untrackMediaUsage(post.bannerBg, "Blog", post._id.toString(), "banner_bg");
                }
                if (post.metadata?.image) {
                    await untrackMediaUsage(post.metadata.image, "Blog", post._id.toString(), "seo_image");
                }
                if (post.metadata?.ogImage) {
                    await untrackMediaUsage(post.metadata.ogImage, "Blog", post._id.toString(), "seo_ogImage");
                }
            }
        }
        return { success: true, message: permanent ? "Post permanently removed" : "Post soft deleted" };
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return { success: false, message: "Failed to delete post" };
    }
}


export async function restoreBlogPost(id: string) {
    await dbConnect();
    try {
        const post = await BlogPost.findById(id);
        if (!post) return { success: false, message: "Post not found" };
        if (!post.isDeleted) return { success: false, message: "Post is not deleted" };

        await BlogPost.findByIdAndUpdate(id, {
            isDeleted: false,
            $unset: { deletedAt: 1 }
        });
        
        // Optionally, re-add to sitemap if needed, since soft-delete removes it
        const blogUrl = `/blogs/${post.slug}`;
        await updateSitemapLink("Blogs", {
            name: post.title,
            href: blogUrl,
            description: post.excerpt
        });

        return { success: true, message: "Post restored successfully" };
    } catch (error: any) {
        console.error("Error restoring post:", error);
        return { success: false, message: error.message || "Failed to restore post" };
    }
}
