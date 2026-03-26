

import { cookies } from 'next/headers';
import { verifyToken, TokenPayload } from '@/lib/jwt';

import { refreshAccessToken } from '@/services/authService';

export async function getCurrentUser(): Promise<TokenPayload | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (accessToken) {
            const payload = await verifyToken(accessToken);
            if (payload) return payload;
        }

        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (refreshToken) {
            
            const refreshRes = await refreshAccessToken();

            if (refreshRes.success) {

                const newAccessToken = (await cookies()).get('accessToken')?.value;
                if (newAccessToken) {
                    return await verifyToken(newAccessToken);
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
}

export async function requireAuth(): Promise<TokenPayload> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized: No valid authentication token');
    }

    return user;
}

export async function requireRole(_requiredRole: string): Promise<TokenPayload> {
    const user = await requireAuth();

    return user;
}

export async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user: TokenPayload | null }> {
    const user = await getCurrentUser();

    return {
        isAuthenticated: !!user,
        user
    };
}

export async function validateApiRequest(request: Request): Promise<TokenPayload | null> {
    try {
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) {
            return null;
        }

        const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
        if (!accessTokenMatch) {
            return null;
        }

        const accessToken = accessTokenMatch[1];
        const payload = await verifyToken(accessToken);

        return payload as TokenPayload | null;
    } catch (error) {
        console.error('API request validation error:', error);
        return null;
    }
}
