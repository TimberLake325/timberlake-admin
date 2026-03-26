import ServicesContent from './ServicesContent';
import { getServices } from '@/services/serviceService';

export const dynamic = "force-static";

export default async function Services() {
    const res = await getServices(true);
    const services = res.success ? res.data : [];

    return <ServicesContent initialServices={services} />;
}