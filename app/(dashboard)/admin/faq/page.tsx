import { getFAQ } from '@/services/faqService';
import FaqPageContent from './content';
export const dynamic = "force-static"

const FaqRoot = async () => {
    const response = await getFAQ();

    return (
        <FaqPageContent initialData={response.success ? response.data : null} />
    );
};

export default FaqRoot;