import { getStatesPage } from "@/services/statesPageService";
import StatesPageContent from "./content";

export const metadata = {
    title: "Manage States Page | Timberlake Admin",
    description: "National coverage and state hubs management",
};

export default async function StatesAdminPage() {
    const response = await getStatesPage();
    const initialData = response.success ? response.data : null;

    return <StatesPageContent initialData={initialData} />;
}
