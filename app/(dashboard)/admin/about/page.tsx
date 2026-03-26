import { getAboutPage } from '@/services/aboutPageService';
import AboutPageContent from './content';
export const revalidate = 120;

const AboutAdminPage = async () => {
    const response = await getAboutPage();

    return (
        <AboutPageContent initialData={response.success ? response.data : null} />
    );
};

export default AboutAdminPage;