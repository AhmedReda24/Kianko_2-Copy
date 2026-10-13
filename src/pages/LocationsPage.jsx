import LocationsSection from '../components/home/LocationsSection';

export default function LocationsPage({ lang = 'en', themeColor = '#C9252C' }) {
  return (
    <div className="pt-6">
      <LocationsSection isAr={lang === 'ar'} themeColor={themeColor} asPage />
    </div>
  );
}
