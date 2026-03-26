import { getBlogPosts } from '@/services/blogService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId') || undefined;
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    try {
        const result = await getBlogPosts(page, limit, categoryId, includeDeleted);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch posts' }, { status: 500 });
    }
}