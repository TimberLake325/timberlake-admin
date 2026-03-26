import { getSecurity } from '@/services/securityService';
import SecurityContent from './content';

export const dynamic = "force-static";

const SecurityRoot = async () => {
    const response = await getSecurity();

    return (
        <SecurityContent initialData={response.success ? response.data : null} />
    );
};

export default SecurityRoot;
