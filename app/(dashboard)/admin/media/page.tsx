import { getMediaLibrary } from '@/services/mediaService';
import MediaContent from './Content';

export default async function MediaPage() {
    const result = await getMediaLibrary();
    const initialMedia = result.success ? result.data : [];

    return <MediaContent initialMedia={initialMedia} />;
}
