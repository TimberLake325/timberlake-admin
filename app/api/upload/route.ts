import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { recordMediaUpload } from '@/services/mediaService';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ success: false, message: 'Only images (JPEG, PNG, GIF, WEBP) are allowed' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: 'File size too large (max 5MB)' }, { status: 400 });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `blog-${uniqueSuffix}-${file.name}`;

        const blob = await put(`uploads/blog/${fileName}`, file, {
            access: 'public',
        });

        await recordMediaUpload({
            url: blob.url,
            filename: fileName,
            originalName: file.name,
            mimeType: file.type,
            size: file.size
        });

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            url: blob.url
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to upload image'
        }, { status: 500 });
    }
}
