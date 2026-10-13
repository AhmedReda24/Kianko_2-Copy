import CertificationsGrid from '../components/CertificationsGrid';
import { useAccreditations } from '../hooks/useContent';

export default function IsoCertificationsPage({ lang = 'en', themeColor }) {
  const isAr = lang === 'ar';
  const n = useAccreditations().length;
  return (
    <CertificationsGrid
      lang={lang}
      themeColor={themeColor}
      badge={isAr ? 'الاعتمادات والجودة المعتمدة' : 'GLOBAL ACCREDITATIONS & CERTIFICATES'}
      title={isAr ? `${n} شهادات جودة واعترافات دولية` : `${n} Accredited International Certifications`}
      intro={isAr
        ? 'تلتزم كيانكو بأعلى معايير التصنيع والجودة والجلفنة للحلول الهيكلية وحوامل الكابلات.'
        : 'Kianko Steel adheres to global quality, safety, and galvanizing compliance frameworks.'}
    />
  );
}
