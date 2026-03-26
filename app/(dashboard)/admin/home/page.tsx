import { getHomePage } from '@/services/homePageService';
import { getServices } from '@/services/serviceService';
import { getActiveCaseStudies } from '@/services/caseStudyService';
import HomePageContent from './content';
export const dynamic = "force-static"

const Home = async () => {
    const [homeResponse, servicesResponse, caseStudiesResponse] = await Promise.all([
        getHomePage(),
        getServices(false), 
        getActiveCaseStudies() 
    ]);

    return (
        <HomePageContent
            initialData={homeResponse.success ? homeResponse.data : null}
            availableServices={servicesResponse.success ? servicesResponse.data : []}
            availableCaseStudies={caseStudiesResponse.success ? caseStudiesResponse.data : []}
        />
    );
};

export default Home;