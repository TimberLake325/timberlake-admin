import CaseStudiesContent from './CaseStudiesContent';
import { getCaseStudies } from '@/services/caseStudyService';

export const dynamic = "force-static";

export default async function CaseStudies() {
    const res = await getCaseStudies(true);
    const caseStudies = res.success ? res.data : [];

    return <CaseStudiesContent initialCaseStudies={caseStudies} />;
}

