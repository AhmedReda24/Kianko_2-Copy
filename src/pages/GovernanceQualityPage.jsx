import CertificationsGrid from '../components/CertificationsGrid';

export default function GovernanceQualityPage({ lang = 'en', themeColor }) {
  const isAr = lang === 'ar';
  return (
    <CertificationsGrid
      lang={lang}
      themeColor={themeColor}
      badge={isAr ? 'الحوكمة والجودة' : 'GOVERNANCE & QUALITY'}
      title={isAr ? 'الحوكمة والجودة في كيانكو' : 'Governance & Quality at KIANKO'}
      intro={isAr
        ? 'الأنظمة والمعايير اللي بنشتغل بيها لضمان جودة ثابتة في كل مرحلة تصنيع.'
        : 'The systems and standards we work to, so quality stays consistent at every stage of manufacturing.'}
    />
  );
}
