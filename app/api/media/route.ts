import { getMediaLibrary, deleteMedia } from '@/services/mediaService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = (searchParams.get('filter') as 'all' | 'in-use' | 'unused') || 'all';

        const result = await getMediaLibrary(filter);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const force = searchParams.get('force') === 'true';

        if (!id) {
            return NextResponse.json({ success: false, message: 'Media ID is required' }, { status: 400 });
        }

        const result = await deleteMedia(id, force);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete media' }, { status: 500 });
    }
}
