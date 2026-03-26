import { getTerms } from '@/services/termsService';
import TermsContent from './content';
export const dynamic = "force-static"

const TermsRoot = async () => {
    const response = await getTerms();

    return (
        <TermsContent initialData={response.success ? response.data : null} />
    );
};

export default TermsRoot;