import { dbConnect } from "@/lib/db";
import { Theme, Config } from "@/lib/model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const config = await Config.findOne({ key: 'themeConfig' });

        return NextResponse.json({
            success: true,
            themeConfig: config?.value || {
                light: {
                    primary: '#7c3aed',
                    secondary: '#e2e0ff',
                    accent: '#06b6d4',
                    background: '#fafaff',
                    foreground: '#13111c',
                }
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const themeConfig = await req.json();

        const config = await Config.findOneAndUpdate(
            { key: 'themeConfig' },
            { value: themeConfig },
            { upsert: true, new: true }
        );

        try {
            await fetch(`${process.env.PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate-frontend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            console.error("Revalidation trigger failed", e);
        }

        return NextResponse.json({ success: true, themeConfig: config.value });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
