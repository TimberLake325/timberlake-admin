import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
    
}

if (JWT_SECRET.length < 32) {
    
}

const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET || 'timberlake-ultra-secure-key-256-bit-alpha-numeric-terminal-access');

import { JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
    id: string;
    email: string;
    name: string;
}

export async function signAccessToken(payload: TokenPayload) {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(ENCODED_SECRET);
    } catch (error) {
        console.error('Failed to sign access token:', error);
        throw new Error('Failed to generate access token');
    }
}

export async function signRefreshToken(payload: TokenPayload) {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(ENCODED_SECRET);
    } catch (error) {
        console.error('Failed to sign refresh token:', error);
        throw new Error('Failed to generate refresh token');
    }
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, ENCODED_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        return null;
    }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, ENCODED_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        return null;
    }
}
