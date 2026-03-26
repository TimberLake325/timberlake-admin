'use server';

import { dbConnect } from "@/lib/db";
import { Config, Theme } from "@/lib/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, "Invalid hex color");

const ModeConfigSchema = z.object({
    primary: hexColorSchema,
    secondary: hexColorSchema,
    accent: hexColorSchema,
    background: hexColorSchema,
    foreground: hexColorSchema,
});

const ThemeConfigSchema = z.object({
    light: ModeConfigSchema
});

const THEME_DEFAULTS = {
    light: {
        primary: '#7c3aed',
        secondary: '#e2e0ff',
        accent: '#06b6d4',
        background: '#fafaff',
        foreground: '#13111c',
    }
};

export async function getThemeConfig() {
    try {
        await dbConnect();
        const config = await Config.findOne({ key: 'themeConfig' });

        if (config && config.value) {
            const mergedConfig = {
                ...THEME_DEFAULTS,
                ...config.value,
                light: { ...THEME_DEFAULTS.light, ...(config.value.light || {}) }
            };

            return {
                success: true,
                themeConfig: mergedConfig,
                history: config.history || []
            };
        }

        return {
            success: true,
            themeConfig: THEME_DEFAULTS,
            history: []
        };
    } catch (error: any) {
        console.error("Error fetching theme config:", error);
        return { success: false, error: error.message };
    }
}

export async function saveThemeAction(formData: any) {
    try {
        await dbConnect();

        const validatedData = ThemeConfigSchema.parse(formData);

        const existingConfig = await Config.findOne({ key: 'themeConfig' });

        let history = existingConfig?.history || [];

        if (existingConfig?.value) {
            const snapshot = {
                ...THEME_DEFAULTS,
                ...existingConfig.value,
                light: { ...THEME_DEFAULTS.light, ...(existingConfig.value.light || {}) }
            };

            history = [snapshot, ...history].slice(0, 3);
        }

        const config = await Config.findOneAndUpdate(
            { key: 'themeConfig' },
            {
                value: validatedData,
                history: history
            },
            { upsert: true, new: true }
        );

        revalidatePath('/', 'layout');

        try {
            const secret = process.env.REVALIDATE_SECRET;
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
            await fetch(`${siteUrl}/api/revalidate?secret=${secret}&tag=theme-config`, {
                method: 'POST'
            }).catch(() => { });
        } catch (e) { }

        return { success: true, themeConfig: config.value, history: config.history };
    } catch (error: any) {
        console.error("Error saving theme config:", error);
        return { success: false, error: error instanceof z.ZodError ? error.issues[0].message : error.message };
    }
}

export async function restoreThemeAction(index: number) {
    try {
        await dbConnect();

        const existingConfig = await Config.findOne({ key: 'themeConfig' });
        if (!existingConfig || !existingConfig.history || !existingConfig.history[index]) {
            return { success: false, error: "Historical entry not found" };
        }

        const restoredValue = existingConfig.history[index];
        const currentToHistory = existingConfig.value;

        let newHistory = [...existingConfig.history];
        newHistory.splice(index, 1);
        if (currentToHistory) {
            newHistory = [currentToHistory, ...newHistory].slice(0, 3);
        }

        const config = await Config.findOneAndUpdate(
            { key: 'themeConfig' },
            {
                value: restoredValue,
                history: newHistory
            },
            { new: true }
        );

        revalidatePath('/', 'layout');

        try {
            const secret = process.env.REVALIDATE_SECRET;
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
            await fetch(`${siteUrl}/api/revalidate?secret=${secret}&tag=theme-config`, {
                method: 'POST'
            }).catch(() => { });
        } catch (e) { }

        return { success: true, themeConfig: config.value, history: config.history };
    } catch (error: any) {
        console.error("Error restoring theme config:", error);
        return { success: false, error: error.message };
    }
}

export async function getThemes() {
    try {
        await dbConnect();
        const themes = await Theme.find().sort({ createdAt: -1 });
        const activeConfig = await Config.findOne({ key: 'activeThemeId' });

        return {
            success: true,
            themes: JSON.parse(JSON.stringify(themes)),
            activeThemeId: activeConfig?.value
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveTheme(themeData: any) {
    try {
        await dbConnect();
        const { _id, ...data } = themeData;

        let theme;
        if (_id) {
            theme = await Theme.findByIdAndUpdate(_id, data, { new: true });
        } else {
            theme = await Theme.create(data);
        }

        return { success: true, theme: JSON.parse(JSON.stringify(theme)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function setActiveTheme(activeThemeId: string) {
    try {
        await dbConnect();
        await Config.findOneAndUpdate(
            { key: 'activeThemeId' },
            { value: activeThemeId },
            { upsert: true }
        );

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTheme(id: string) {
    try {
        await dbConnect();
        await Theme.findByIdAndDelete(id);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
