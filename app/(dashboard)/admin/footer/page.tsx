import { getFooter } from '@/services/footerService';
import { getServices } from '@/services/serviceService';
import { getBlogPosts } from '@/services/blogService';
import FooterContent from './content';

export const revalidate = 0;

const FooterRoot = async () => {
    const [footerRes, servicesRes, blogsRes] = await Promise.all([
        getFooter(),
        getServices(),
        getBlogPosts(1, 100)
    ]);

    return (
        <FooterContent
            initialData={footerRes.success ? footerRes.data : null}
            availableServices={servicesRes.success ? servicesRes.data : []}
            availableBlogs={blogsRes.success ? blogsRes.data.posts : []}
        />
    );
};

export default FooterRoot;
