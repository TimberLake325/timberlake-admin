import DashboardClient from '@/components/dashboard/DashboardClient';
import { getDashboardStats } from '@/services/dashboardService';

export default async function Home() {
  const initialStats = await getDashboardStats('30D');

  return <DashboardClient initialStats={initialStats} />;
}
