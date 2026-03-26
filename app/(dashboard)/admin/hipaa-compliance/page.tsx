import { getHipaa } from '@/services/hipaaService';
import HipaaContent from './content';

export const dynamic = "force-static";

const HipaaRoot = async () => {
    const response = await getHipaa();

    return (
        <HipaaContent initialData={response.success ? response.data : null} />
    );
};

export default HipaaRoot;
