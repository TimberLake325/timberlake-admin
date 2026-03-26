import { getContactPage } from '@/services/contactPageService';
import ContactPageContent from './content';
export const dynamic = "force-dynamic"

const ContactRoot = async () => {
    const response = await getContactPage();

    return (
        <ContactPageContent initialData={response.success ? response.data : null} />
    );
};

export default ContactRoot;