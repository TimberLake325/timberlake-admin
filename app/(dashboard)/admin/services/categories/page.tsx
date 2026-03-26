import { getServiceCategories } from '@/services/serviceService';
import CategoriesContent from './CategoriesContent';

export const dynamic = "force-static";

const ServiceCategoriesPage = async () => {
    const categoriesRes = await getServiceCategories(true);

    return (
        <CategoriesContent
            initialCategories={categoriesRes.success ? categoriesRes.data : []}
        />
    );
};

export default ServiceCategoriesPage;
