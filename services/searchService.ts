"use server";

import { dbConnect } from "@/lib/db";
import { Admin, BlogPost, ServicesPage } from "@/lib/model";

export interface SearchResult {
    id: string;
    type: 'user' | 'post' | 'page' | 'settings' | 'route';
    title: string;
    subtitle: string;
    link: string;
    category: 'Pages' | 'Users' | 'System';
}

export async function searchDashboard(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return [];

    await dbConnect();
    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    try {
        
        const admins = await Admin.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).limit(5);

        admins.forEach(admin => {
            results.push({
                id: `user-${admin._id}`,
                type: 'user',
                title: admin.name,
                subtitle: admin.email,
                link: '/admin/user',
                category: 'Users'
            });
        });

        const posts = await BlogPost.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { excerpt: { $regex: searchTerm, $options: 'i' } }
            ],
            isDeleted: { $ne: true }
        }).limit(5);

        posts.forEach(post => {
            results.push({
                id: `post-${post._id}`,
                type: 'post',
                title: post.title,
                subtitle: 'Blog Post',
                link: '/admin/blog',
                category: 'System'
            });
        });

        const servicesPage = await ServicesPage.findOne({ page: 'Services' });
        if (servicesPage && servicesPage.services) {
            const matchedServices = servicesPage.services.filter((s: any) =>
                s.title?.toLowerCase().includes(searchTerm) ||
                s.description?.toLowerCase().includes(searchTerm)
            ).slice(0, 5);

            matchedServices.forEach((s: any) => {
                results.push({
                    id: `service-${s.id || s._id}`,
                    type: 'page',
                    title: s.title || 'Untitled Service',
                    subtitle: 'Service Item',
                    link: '/admin/services',
                    category: 'Pages'
                });
            });
        }

        return results;
    } catch (error) {
        console.error("Search service error:", error);
        return [];
    }
}
