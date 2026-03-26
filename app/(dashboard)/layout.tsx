import { headers } from "next/headers";
import { routes } from "@/lib/routes";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "/admin";

    const currentRoute = routes.find(r =>
        r.path === '/' ? pathname === '/admin' : pathname.startsWith(r.path)
    );

    const pageTitle = currentRoute ? currentRoute.label : 'Dashboard';

    return (
        <DashboardLayoutClient pageTitle={pageTitle}>
            {children}
        </DashboardLayoutClient>
    );
}
