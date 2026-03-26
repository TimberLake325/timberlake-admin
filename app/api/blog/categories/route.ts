import { getBlogCategories } from '@/services/blogService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    try {
        const result = await getBlogCategories(includeDeleted);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
    }
}