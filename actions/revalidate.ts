"use server";

export async function clearCache() {
    try {
        const secret = process.env.REVALIDATE_SECRET;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

        if (!secret) {
            console.error('REVALIDATE_SECRET is missing in admin .env');
            return { success: false, message: "REVALIDATE_SECRET not configured in Admin" };
        }

        const fetchUrl = `${siteUrl}/api/revalidate?secret=${secret}`;

        const res = await fetch(fetchUrl, {
            method: 'POST',
            cache: 'no-store'
        });

        const data = await res.json();

        if (res.ok && data.success) {
            return { success: true, message: "Global cache cleared successfully", data };
        } else {
            return {
                success: false,
                message: data.message || "Failed to clear cache",
                details: data.error || "Check server logs"
            };
        }
    } catch (error: any) {
        console.error("Error in clearCache action:", error);
        return {
            success: false,
            message: "Connection Error: Could not reach public website",
            error: error.message
        };
    }
}
