import React from 'react';
import BlogForm from '../../pageData';
import { getBlogCategoryById } from '@/services/blogService';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const res = await getBlogCategoryById(id);

    if (!res.success || !res.data) {
        notFound();
    }

    return (
        <BlogForm
            type="category"
            editingItem={res.data}
            categories={[]}
        />
    );
}
