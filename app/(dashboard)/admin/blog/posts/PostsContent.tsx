"use client";

import ConfirmationModal from '@/components/global/ConfirmationModal';
import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { deleteBlogPost } from '@/services/blogService';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit3, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import BlogForm from '../pageData';

import { useRouter, useSearchParams } from 'next/navigation';

interface PostsContentProps {
    initialCategories: any[];
    initialPosts: any[];
    initialTotal: number;
}

const PostsContent = ({ initialCategories, initialPosts, initialTotal }: PostsContentProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [posts, setPosts] = useState(initialPosts);
    const [categories] = useState(initialCategories);
    const [totalPosts, setTotalPosts] = useState(initialTotal);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categoryId') || '');
    const [itemToDelete, setItemToDelete] = useState<{ id: string, permanent: boolean } | null>(null);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(selectedCategory && { categoryId: selectedCategory })
            });
            const res = await fetch(`/api/blog/posts?${params}`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.data.posts);
                setTotalPosts(data.data.total);
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            showToast('Failed to fetch posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [selectedCategory, currentPage]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/admin/blog/posts?${params.toString()}`);
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        const params = new URLSearchParams(searchParams.toString());
        if (catId) {
            params.set('categoryId', catId);
        } else {
            params.delete('categoryId');
        }
        params.set('page', '1');
        router.push(`/admin/blog/posts?${params.toString()}`);
    };

    const handleAddClick = () => {
        router.push('/admin/blog/posts/new');
    };

    const handleEditClick = (id: string) => {
        router.push(`/admin/blog/posts/${id}`);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { id, permanent } = itemToDelete;
        const res = await deleteBlogPost(id, permanent);

        if (res.success) {
            showToast(res.message, 'success');
            fetchPosts(currentPage);
        } else {
            showToast(res.message, 'error');
        }
        setItemToDelete(null);
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <PageHeader
                description="Manage your blog articles and stories"
                onSave={handleAddClick}
                actionLabel="Add Post"
                icon={FiPlus}
            />

            <div className="mt-8">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium min-w-[150px]"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center bg-white border border-black/[0.06] rounded-2xl sm:rounded-[2rem]">
                            <p className="text-black/20 text-xs font-black uppercase tracking-widest">
                                No blog posts found
                            </p>
                        </div>
                    ) : (
                        posts
                            .filter((p) =>
                                p.title.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((post) => (
                                <div
                                    key={post._id}
                                    className="p-4 sm:p-6 bg-white border border-black/[0.06] rounded-2xl sm:rounded-[2rem] shadow-sm 
                     flex flex-col sm:flex-row sm:items-center sm:justify-between 
                     gap-4 group hover:border-[#2563eb]/20 transition-all"
                                >
                                    
                                    <div className="flex gap-4 sm:gap-6">
                                        <div className="w-16 h-12 sm:w-20 sm:h-14 bg-black/[0.02] rounded-xl overflow-hidden border border-black/[0.05] shrink-0">
                                            {post.image && (
                                                <Image
                                                    src={post.image}
                                                    alt=""
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-[#2563eb]/5 text-[#2563eb] text-[8px] font-black uppercase tracking-tighter rounded-full">
                                                    {post.category?.name || "Uncategorized"}
                                                </span>

                                                <span className="text-[10px] text-black/20 font-bold uppercase tracking-tighter">
                                                    {new Date(post.publishDate).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-black text-black tracking-tight line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-[10px] text-black/40 font-medium truncate sm:max-w-md">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            onClick={() => handleEditClick(post._id)}
                                            className="p-2 sm:p-3 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-xl transition-all"
                                        >
                                            <FiEdit3 size={16} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setItemToDelete({ id: post._id, permanent: false })
                                            }
                                            className="p-2 sm:p-3 text-black/20 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setItemToDelete({ id: post._id, permanent: true })
                                            }
                                            className="p-2 sm:p-3 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {totalPosts > 10 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="p-3 bg-white border border-black/[0.06] rounded-xl text-black/40 hover:text-[#2563eb] disabled:opacity-50"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                            Page {currentPage} of {Math.ceil(totalPosts / 10)}
                        </span>
                        <button
                            disabled={currentPage === Math.ceil(totalPosts / 10) || loading}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="p-3 bg-white border border-black/[0.06] rounded-xl text-black/40 hover:text-[#2563eb] disabled:opacity-50"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={itemToDelete !== null}
                title={`${itemToDelete?.permanent ? 'Permanent' : 'Soft'} Delete Blog Post`}
                message={itemToDelete?.permanent
                    ? "WARNING: This will PERMANENTLY remove this post. This action cannot be undone."
                    : "Are you sure you want to move this post to trash?"}
                confirmLabel={itemToDelete?.permanent ? "Yes, Delete Forever" : "Yes, Soft Delete"}
                type={itemToDelete?.permanent ? 'danger' : 'info'}
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </div>
    );
};

export default PostsContent;