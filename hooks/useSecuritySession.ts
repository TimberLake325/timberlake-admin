

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ensureAccessToken, logoutAllSessions } from '@/lib/authClient';

const REFRESH_CHECK_INTERVAL = 20 * 60 * 1000; 
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

export function useSecuritySession() {
    const router = useRouter();
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        inactivityTimeoutRef.current = setTimeout(() => {
            
            logoutAllSessions();
        }, INACTIVITY_TIMEOUT);
    }, []);

    const checkAndRefreshToken = useCallback(async () => {
        const success = await ensureAccessToken();
        if (!success) {
            console.error('Token refresh failed - user will be logged out');
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            window.addEventListener(event, resetInactivityTimer, true);
        });

        resetInactivityTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetInactivityTimer, true);
            });

            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, [resetInactivityTimer]);

    useEffect(() => {
        
        checkAndRefreshToken();

        refreshIntervalRef.current = setInterval(
            checkAndRefreshToken,
            REFRESH_CHECK_INTERVAL
        );

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [checkAndRefreshToken]);

    useEffect(() => {
        return () => {
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);
}

export function SecurityMonitor() {
    useSecuritySession();
    return null; 
}
