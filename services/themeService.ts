export const getThemeConfig = async () => {
    const res = await fetch('/api/admin/theme');
    return res.json();
};

export const saveThemeConfig = async (themeConfig: any) => {
    const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeConfig)
    });
    return res.json();
};
