import { useEffect } from 'react';
import CertificationsGrid from '../components/CertificationsGrid';

export default function GovernanceQualityPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';

  useEffect(() => {
    const fontId = 'ibm-plex-sans-arabic-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    if (isAr) {
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }
  }, [isAr]);

  return (
    <div style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}>
      <CertificationsGrid
        lang={lang}
        themeColor={themeColor}
        darkMode={darkMode}
        badge={isAr ? 'الاعتمادات والجودة' : 'ACCREDITATIONS & QUALITY'}
        title={isAr ? 'الاعتمادات والجودة في كيانكو' : 'Accreditations & Quality at KIANKO'}
        intro={
          isAr
            ? 'الأنظمة والمعايير القياسية والاعتمادات الرسمية التي نعمل وفقاً لها لضمان جودة مستدامة في كل مرحلة من مراحل التصنيع.'
            : 'The systems, standards, and official accreditations we work to, so quality stays consistent at every stage of manufacturing.'
        }
      />
    </div>
  );
}