import { getCaseStudies } from '@/services/caseStudyService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    try {
        const result = await getCaseStudies(includeDeleted);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch case studies' }, { status: 500 });
    }
}
