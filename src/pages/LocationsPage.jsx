import LocationsSection from '../components/home/LocationsSection';

export default function LocationsPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';

  return (
    <div className="pt-6" dir={isAr ? 'rtl' : 'ltr'}>
      <LocationsSection isAr={isAr} themeColor={themeColor} asPage darkMode={darkMode} />
    </div>
  );
}