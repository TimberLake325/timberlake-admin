import { getServiceById, getServiceCategories } from '@/services/serviceService';
import { notFound } from 'next/navigation';
import ServiceForm from '../ServiceForm';

export default async function EditServicePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const [serviceRes, categoriesRes] = await Promise.all([
        getServiceById(id),
        getServiceCategories()
    ]);

    if (!serviceRes.success || !serviceRes.data) {
        notFound();
    }

    return (
        <ServiceForm
            key={serviceRes.data._id}
            type="service"
            editingItem={serviceRes.data}
            categories={categoriesRes.success ? categoriesRes.data : []}
        />
    );
}
