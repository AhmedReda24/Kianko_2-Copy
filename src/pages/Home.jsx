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

export default function Home({ lang, themeColor, darkMode = true }) {
  const isAr = lang === 'ar';

  const pageBg = darkMode ? 'bg-[#050C1E] text-slate-100' : 'bg-white text-slate-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <HeroSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <AboutSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <StatsSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <ExpertiseSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <MenaReachSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <FacilitiesSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <CertificatesSlider isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <FaqSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <LocationsSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
      <CtaSection isAr={isAr} themeColor={themeColor} darkMode={darkMode} />
    </div>
  );
}