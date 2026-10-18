import CertificationsGrid from '../components/CertificationsGrid';

export default function GovernanceQualityPage({ lang = 'en', themeColor, darkMode }) {
  const isAr = lang === 'ar';
  return (
    <CertificationsGrid
      lang={lang}
      themeColor={themeColor}
      darkMode={darkMode}
      badge={isAr ? 'الاعتمادات والجودة' : 'ACCREDITATIONS & QUALITY'}
      title={isAr ? 'الاعتمادات والجودة في كيانكو' : 'Accreditations & Quality at KIANKO'}
      intro={isAr
        ? 'الأنظمة والمعايير والاعتمادات الرسمية اللي بنشتغل بيها لضمان جودة ثابتة في كل مرحلة تصنيع.'
        : 'The systems, standards, and official accreditations we work to, so quality stays consistent at every stage of manufacturing.'}
    />
  );
}