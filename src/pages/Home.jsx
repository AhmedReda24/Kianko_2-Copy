import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FacilitiesSection from '../components/home/FacilitiesSection';
import StatsSection from '../components/home/StatsSection';
import ExpertiseSection from '../components/home/ExpertiseSection';
import CertificatesSlider from '../components/home/CertificatesSlider';
import LocationsSection from '../components/home/LocationsSection';
import CtaSection from '../components/home/CtaSection';

export default function Home({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const shared = { isAr, themeColor };

  return (
    <div className="bg-[#07132B] text-white min-h-screen">
      <HeroSection {...shared} />
      <AboutSection {...shared} />
      <FacilitiesSection {...shared} />
      <StatsSection {...shared} />
      <ExpertiseSection {...shared} />
      <CertificatesSlider key={lang} {...shared} />
      <LocationsSection {...shared} />
      <CtaSection {...shared} />
    </div>
  );
}
