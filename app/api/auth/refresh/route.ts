import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/services/authService';

export async function POST() {
    try {
        const response = await refreshAccessToken();

        if (response.success) {
            return NextResponse.json(
                { success: true, message: response.message },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: response.message },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Token refresh API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('accessToken');

        if (!accessToken) {
            return NextResponse.json(
                { valid: false, message: 'No access token found' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { valid: true, message: 'Session is valid' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Token validation API error:', error);
        return NextResponse.json(
            { valid: false, message: 'Failed to validate token' },
            { status: 500 }
        );
    }
}
