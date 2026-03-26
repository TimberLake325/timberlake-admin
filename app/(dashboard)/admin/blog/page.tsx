import { redirect } from 'next/navigation';

const BlogPage = () => {
    redirect('/admin/blog/posts');
};

export default BlogPage;
