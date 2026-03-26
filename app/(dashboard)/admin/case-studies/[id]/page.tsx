import CaseStudyForm from '../CaseStudyForm';
import { getCaseStudyById } from '@/services/caseStudyService';

export const dynamic = "force-static";

export default async function EditCaseStudy({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getCaseStudyById(id);

    if (!res.success) {
        return <div>Case Study not found</div>;
    }

    return <CaseStudyForm editingItem={res.data} />;
}
