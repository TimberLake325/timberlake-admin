import { getPrivacy } from '@/services/privacyService';
import PrivacyContent from './content';
export const dynamic = "force-static"

const PrivacyRoot = async () => {
    const response = await getPrivacy();

    return (
        <PrivacyContent initialData={response.success ? response.data : null} />
    );
};

export default PrivacyRoot;