import React from 'react';
import BlogForm from '../../pageData';
import { getBlogPostById, getBlogCategories } from '@/services/blogService';
import { notFound } from 'next/navigation';

export default async function EditPostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const [postRes, catRes] = await Promise.all([
        getBlogPostById(id),
        getBlogCategories()
    ]);

    if (!postRes.success || !postRes.data) {
        notFound();
    }

    return (
        <BlogForm
            type="post"
            editingItem={postRes.data}
            categories={catRes.success ? catRes.data : []}
        />
    );
}
