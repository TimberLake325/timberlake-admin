

import { refreshAccessToken, logout } from '@/services/authService';

let refreshPromise: Promise<boolean> | null = null;

export async function ensureAccessToken(): Promise<boolean> {
    
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = performTokenRefresh();
    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

async function performTokenRefresh(): Promise<boolean> {
    try {
        const response = await refreshAccessToken();
        return response.success;
    } catch (error) {
        console.error('Token refresh failed:', error);
        
        await logout();
        return false;
    }
}

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshed = await ensureAccessToken();
        if (refreshed) {
            response = await fetch(url, options);
        } else {
            
            window.location.href = '/login';
        }
    }

    return response;
}

export function initializeSessionSync() {
    
    window.addEventListener('storage', (event) => {
        if (event.key === 'auth_logout' && event.newValue === 'true') {
            
            window.location.href = '/login';
        }
    });
}

export async function logoutAllSessions() {
    
    localStorage.setItem('auth_logout', 'true');
    localStorage.removeItem('auth_logout');

    await logout();
    window.location.href = '/login';
}

export function isAuthenticated(): boolean {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='));
        return !!token;
    } catch {
        return false;
    }
}
