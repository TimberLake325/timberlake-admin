import { getCurrentUser } from "@/lib/authServer";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (user) {
        redirect("/admin/dashboard");
    }

    return <>{children}</>;
}
