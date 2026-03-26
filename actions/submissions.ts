"use server";

import { dbConnect } from "@/lib/db";
import { ContactSubmission } from "@/lib/model";
import { revalidatePath } from "next/cache";

export async function getSubmissions() {
    try {
        await dbConnect();
        const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(submissions));
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
}

export async function updateSubmissionStatus(id: string, status: string) {
    try {
        await dbConnect();
        await ContactSubmission.findByIdAndUpdate(id, { status });
        revalidatePath('/admin/contact/submissions');
        return { success: true };
    } catch (error) {
        console.error("Error updating submission:", error);
        return { success: false };
    }
}

export async function deleteSubmission(id: string) {
    try {
        await dbConnect();
        await ContactSubmission.findByIdAndDelete(id);
        revalidatePath('/admin/contact/submissions');
        return { success: true };
    } catch (error) {
        console.error("Error deleting submission:", error);
        return { success: false };
    }
}
