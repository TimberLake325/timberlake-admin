

export const securityHeaders = [
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
    },
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.timberlake.com; frame-ancestors 'none';"
    },
    {
        key: 'Cache-Control',
        value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
    },
    {
        key: 'Pragma',
        value: 'no-cache'
    },
    {
        key: 'Expires',
        value: '0'
    },
    {
        key: 'Surrogate-Control',
        value: 'no-store'
    }
];

export default securityHeaders;
