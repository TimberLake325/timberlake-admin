import { getBlogPage } from '@/services/blogPageService';
import BlogSeoContent from './Content';

export const dynamic = "force-static";

const BlogSeoPage = async () => {
    const response = await getBlogPage();

    return (
        <BlogSeoContent
            initialData={response.success ? response.data : null}
        />
    );
};

export default BlogSeoPage;
