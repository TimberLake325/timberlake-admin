"use server";

import { dbConnect } from "@/lib/db";
import { Sitemap } from "@/lib/model";
import { unstable_cache, revalidateTag } from "next/cache";

export async function getSitemap() {
    await dbConnect();
    try {
        let sitemap = await Sitemap.findOne();

        if (!sitemap) {
            sitemap = await Sitemap.create({
                metadata: {
                    title: 'Sitemap - Timberlake',
                    description: 'Complete directory of all pages and resources available on Timberlake website',
                },
                sections: [
                    {
                        title: 'Pages',
                        links: [
                            { name: 'Home', href: '/', description: 'Main Homepage' },
                            { name: 'About Us', href: '/about-us', description: 'Company Information' },
                            { name: 'Services', href: '/services', description: 'Our Services' },
                            { name: 'Contact', href: '/contact-us', description: 'Get in Touch' },
                            { name: 'Blogs', href: '/blogs', description: 'Latest Articles' },
                        ]
                    },
                    {
                        title: 'Blogs',
                        links: []
                    },
                    {
                        title: 'Legal',
                        links: [
                            { name: 'Privacy Policy', href: '/privacy-policy', description: 'Privacy Policy' },
                            { name: 'Terms of Service', href: '/terms-of-service', description: 'Terms and Conditions' },
                            { name: 'FAQ', href: '/faq', description: 'Frequently Asked Questions' },
                        ]
                    }
                ]
            });
        }

        return {
            success: true,
            message: "Sitemap fetched successfully",
            data: JSON.parse(JSON.stringify(sitemap))
        };
    } catch (error) {
        console.error("Error fetching sitemap:", error);
        return { success: false, message: "Failed to fetch sitemap", data: null };
    }
}

export async function updateSitemapLink(sectionTitle: string, linkData: { name: string, href: string, description?: string }) {
    await dbConnect();
    try {
        let sitemap = await Sitemap.findOne();
        if (!sitemap) {
            
            await getSitemap();
            sitemap = await Sitemap.findOne();
        }

        const sectionIndex = sitemap.sections.findIndex((s: any) => s.title === sectionTitle);

        if (sectionIndex === -1) {
            
            sitemap.sections.push({
                title: sectionTitle,
                links: [linkData]
            });
        } else {
            
            const linkIndex = sitemap.sections[sectionIndex].links.findIndex((l: any) => l.href === linkData.href);
            if (linkIndex !== -1) {
                
                sitemap.sections[sectionIndex].links[linkIndex] = { ...sitemap.sections[sectionIndex].links[linkIndex], ...linkData, lastModified: new Date() };
            } else {
                
                sitemap.sections[sectionIndex].links.push(linkData);
            }
        }

        sitemap.lastGenerated = new Date();
        await sitemap.save();

        (revalidateTag as any)('sitemap-page-data', 'default');

        return {
            success: true,
            message: "Sitemap link updated successfully",
            data: JSON.parse(JSON.stringify(sitemap))
        };
    } catch (error: any) {
        console.error("Error updating sitemap link:", error);
        return { success: false, message: error.message || "Failed to update sitemap link" };
    }
}

export async function removeSitemapLink(sectionTitle: string, href: string) {
    await dbConnect();
    try {
        const sitemap = await Sitemap.findOne();
        if (!sitemap) return { success: false, message: "Sitemap not found" };

        const sectionIndex = sitemap.sections.findIndex((s: any) => s.title === sectionTitle);
        if (sectionIndex !== -1) {
            sitemap.sections[sectionIndex].links = sitemap.sections[sectionIndex].links.filter((l: any) => l.href !== href);
            sitemap.lastGenerated = new Date();
            await sitemap.save();
            (revalidateTag as any)('sitemap-page-data', 'default');
        }

        return {
            success: true,
            message: "Sitemap link removed successfully",
            data: JSON.parse(JSON.stringify(sitemap))
        };
    } catch (error: any) {
        console.error("Error removing sitemap link:", error);
        return { success: false, message: error.message || "Failed to remove sitemap link" };
    }
}

export async function updateSitemapMetadata(metadata: any) {
    await dbConnect();
    try {
        const sitemap = await Sitemap.findOneAndUpdate({}, { metadata, lastGenerated: new Date() }, { new: true, upsert: true });
        (revalidateTag as any)('sitemap-page-data', 'default');
        return {
            success: true,
            message: "Sitemap metadata updated successfully",
            data: JSON.parse(JSON.stringify(sitemap))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateSitemapHeader(data: { title: string, subtitle: string }) {
    await dbConnect();
    try {
        const sitemap = await Sitemap.findOneAndUpdate({}, {
            title: data.title,
            subtitle: data.subtitle,
            lastGenerated: new Date()
        }, { new: true, upsert: true });
        (revalidateTag as any)('sitemap-page-data', 'default');
        return {
            success: true,
            message: "Sitemap header updated successfully",
            data: JSON.parse(JSON.stringify(sitemap))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
