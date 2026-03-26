import { getBlogCategories } from '@/services/blogService';
import CategoriesContent from './CategoriesContent';

export const dynamic = "force-static";

const BlogCategoriesPage = async () => {
    const categoriesRes = await getBlogCategories();

    return (
        <CategoriesContent
            initialCategories={categoriesRes.success ? categoriesRes.data : []}
        />
    );
};

export default BlogCategoriesPage;
