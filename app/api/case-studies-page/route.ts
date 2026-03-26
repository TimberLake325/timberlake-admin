import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { CaseStudiesPage } from "@/lib/model";

const DEFAULT_PAGE = "CaseStudies";

export async function GET() {
    await dbConnect();
    try {
        const caseStudiesPage = await CaseStudiesPage.findOne({ page: DEFAULT_PAGE });
        if (!caseStudiesPage) {
            return NextResponse.json({
                success: false,
                message: "Case studies page data not yet initialized",
                data: null
            });
        }
        return NextResponse.json({
            success: true,
            message: "Case studies page fetched successfully",
            data: JSON.parse(JSON.stringify(caseStudiesPage))
        });
    } catch (error) {
        console.error("Error fetching case studies page:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch case studies page records",
            data: null
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const data = await req.json();
        const caseStudiesPage = await CaseStudiesPage.findOneAndUpdate(
            { page: DEFAULT_PAGE },
            {
                ...data,
                page: DEFAULT_PAGE
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        return NextResponse.json({
            success: true,
            message: "Case studies page configuration persisted successfully",
            data: JSON.parse(JSON.stringify(caseStudiesPage))
        });
    } catch (error: any) {
        console.error("Error persisting case studies page:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "A critical error occurred while persisting page data"
        }, { status: 500 });
    }
}
