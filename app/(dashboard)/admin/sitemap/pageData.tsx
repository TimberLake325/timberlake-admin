import { getSitemap } from "@/services/sitemapService";
import SitemapContent from "./content";

const SitemapPageData = async () => {
    const { data: sitemap } = await getSitemap();

    return (
        <SitemapContent initialSitemap={sitemap} />
    );
};

export default SitemapPageData;