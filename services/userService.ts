"use server";

import { dbConnect } from "@/lib/db";
import { User } from "@/lib/model";

export async function getUsers(page = 1, limit = 10, status?: string, includeReviewed = true) {
    await dbConnect();
    try {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (status) {
            query.status = status;
        }
        if (!includeReviewed) {
            query.isReviewed = false;
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        return {
            success: true,
            message: "Users fetched successfully",
            data: {
                users: JSON.parse(JSON.stringify(users)),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error fetching users:-- ", error);
        return { success: false, message: "Failed to fetch users", data: { users: [], total: 0 } };
    }
}

export async function getAllUsers(status?: string) {
    await dbConnect();
    try {
        const query: any = {};
        if (status) {
            query.status = status;
        }

        const users = await User.find(query).sort({ createdAt: -1 });

        return {
            success: true,
            message: "All users fetched successfully",
            data: JSON.parse(JSON.stringify(users))
        };
    } catch (error) {
        console.error("Error fetching all users:", error);
        return { success: false, message: "Failed to fetch all users", data: [] };
    }
}

export async function updateUserStatus(id: string, status: string) {
    await dbConnect();
    try {
        const user = await User.findByIdAndUpdate(id, { status, isReviewed: true }, { new: true });
        return {
            success: true,
            message: "User status updated successfully",
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error: any) {
        console.error("Error updating user status:", error);
        return { success: false, message: error.message || "Failed to update user status" };
    }
}

export async function updateUser(id: string, updates: any) {
    await dbConnect();
    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        return {
            success: true,
            message: "User updated successfully",
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { success: false, message: error.message || "Failed to update user" };
    }
}

export async function createUser(data: any) {
    await dbConnect();
    try {
        const user = await User.create(data);
        return {
            success: true,
            message: "User created successfully",
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error: any) {
        console.error("Error creating user:", error);
        return { success: false, message: error.message || "Failed to create user" };
    }
}