import { getSitemap } from "@/services/sitemapService";
import SitemapPageData from "./pageData";

export async function generateMetadata() {
    return {
        title: 'Sitemap | Timberlake',
        description: 'Navigate through the architectural structure of Timberlake.'
    };
}

export default async function PublicSitemapPage() {
    const { data: sitemap } = await getSitemap();

    if (!sitemap) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center font-black uppercase tracking-widest text-black/20">
                Initializing Directory...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-20 px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
                <SitemapPageData />

            </div>
        </main>
    );
}