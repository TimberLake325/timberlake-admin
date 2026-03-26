"use client";

import React, { useEffect, useState } from 'react';
import BlogForm from '../../pageData';
import { getBlogCategories } from '@/services/blogService';

export default function CreatePostPage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getBlogCategories();
            if (res.success) {
                setCategories(res.data);
            }
        };
        fetchCategories();
    }, []);

    return (
        <BlogForm
            type="post"
            categories={categories}
        />
    );
}
