import AboutSection from '../components/home/AboutSection';
import CertificatesSlider from '../components/home/CertificatesSlider';
import CtaSection from '../components/home/CtaSection';
import ExpertiseSection from '../components/home/ExpertiseSection';
import FacilitiesSection from '../components/home/FacilitiesSection';
import HeroSection from '../components/home/HeroSection';
import LocationsSection from '../components/home/LocationsSection';
import StatsSection from '../components/home/StatsSection';
import FaqSection from '../components/home/FaqSection';
import MenaReachSection from '../components/home/MenaReachSection';

export default function Home({ lang, themeColor }) {
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#050C1E] text-slate-100">
      <HeroSection isAr={isAr} themeColor={themeColor} />
      <AboutSection isAr={isAr} themeColor={themeColor} />
      <StatsSection isAr={isAr} themeColor={themeColor} />
      <ExpertiseSection isAr={isAr} themeColor={themeColor} />
      <MenaReachSection isAr={isAr} themeColor={themeColor} />
      <FacilitiesSection isAr={isAr} themeColor={themeColor} />
      <CertificatesSlider isAr={isAr} themeColor={themeColor} />
      <FaqSection isAr={isAr} themeColor={themeColor} />
      <LocationsSection isAr={isAr} themeColor={themeColor} />
      <CtaSection isAr={isAr} themeColor={themeColor} />
    </div>
  );
}