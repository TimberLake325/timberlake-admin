import { getServiceCategoryById } from '@/services/serviceService';
import { notFound } from 'next/navigation';
import ServiceForm from '../../ServiceForm';

export default async function EditCategoryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const categoryRes = await getServiceCategoryById(id);

    if (!categoryRes.success || !categoryRes.data) {
        notFound();
    }

    return (
        <ServiceForm
            key={categoryRes.data._id}
            type="category"
            editingItem={categoryRes.data}
            categories={[]}
        />
    );
}
