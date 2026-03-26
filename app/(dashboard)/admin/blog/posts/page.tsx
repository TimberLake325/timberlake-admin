import { getBlogCategories, getBlogPosts } from '@/services/blogService';
import PostsContent from './PostsContent';

export const dynamic = "force-static";

const BlogPostsPage = async () => {
    const [categoriesRes, postsRes] = await Promise.all([
        getBlogCategories(),
        getBlogPosts(1, 10)
    ]);

    return (
        <PostsContent
            initialCategories={categoriesRes.success ? categoriesRes.data : []}
            initialPosts={postsRes.success ? postsRes.data.posts : []}
            initialTotal={postsRes.success ? postsRes.data.total : 0}
        />
    );
};

export default BlogPostsPage;
