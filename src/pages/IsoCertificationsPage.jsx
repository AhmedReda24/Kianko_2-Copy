import { useState, useEffect } from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle2, ZoomIn, X, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../routes';
import { supabase } from '../lib/supabase';
export default function IsoCertificationsPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const [selectedCert, setSelectedCert] = useState(null);
  const [dbCertifications, setDbCertifications] = useState([]);

  useEffect(() => {
    async function fetchCerts() {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('category', 'iso');
      if (!error && data) {
        setDbCertifications(data);
      }
    }
    fetchCerts();
  }, []);

  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-950 shadow-xl';
  const textTitle = darkMode ? 'text-white' : 'text-slate-950';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const badgeBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/80' : 'bg-slate-100 text-slate-800 border-slate-300';
  const subSectionBg = darkMode ? 'bg-[#0A1832] border-blue-900/60' : 'bg-white border-slate-200 shadow-2xl';
  const subBoxBg = darkMode ? 'bg-slate-900/80 border-blue-900/40 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';
  const modalBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/80' : 'bg-white text-slate-900 border-slate-300';
  const defaultIsoList = [
    {
      id: 'iso-9001',
      code: 'ISO 9001:2015',
      titleEn: 'Quality Management System',
      titleAr: 'نظام إدارة الجودة العالمي',
      descEn: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
      descAr: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والتدلفين.',
      file_url: '/Image/ISO-9001-2015.webp',
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    },
    {
      id: 'iso-14001',
      code: 'ISO 14001:2015',
      titleEn: 'Environmental Management System',
      titleAr: 'نظام الإدارة البيئية',
      descEn: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
      descAr: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
      file_url: '/Image/ISO-14001-2015.webp',
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    },
    {
      id: 'iso-45001',
      code: 'ISO 45001:2018',
      titleEn: 'Occupational Health & Safety',
      titleAr: 'إدارة السلامة والصحة المهنية',
      descEn: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
      descAr: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
      file_url: '/Image/ISO-45001-2018.webp',
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    }
  ];

  const accreditationsList = [
    ...defaultIsoList,
    ...dbCertifications.map(c => ({
      id: c.id,
      code: c.code || 'ISO',
      titleEn: c.title,
      titleAr: c.title,
      descEn: c.issuer || 'Official ISO certification document.',
      descAr: c.issuer ? `جهة الإصدار: ${c.issuer}` : 'شهادة أيزو معتمدة وموثقة.',
      file_url: c.file_url,
      badgeEn: 'Verified ISO',
      badgeAr: 'أيزو معتمد',
      hasImage: Boolean(c.file_url)
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16 text-start">
      
      {/* 1. Header Section */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md border ${badgeBg}`}>
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('GLOBAL ACCREDITATIONS & CERTIFICATES', 'الاعتمادات والجودة المعتمدة')}</span>
        </span>
        
        <h1 className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug ${textTitle}`}>
          {pick(
            `${accreditationsList.length} Accredited International Certifications`,
            `${accreditationsList.length} شهادات جودة واعترافات دولية`
          )}
        </h1>

        <p className={`font-medium text-xs sm:text-base leading-relaxed max-w-2xl mx-auto ${textDesc}`}>
          {pick(
            'Kianko Steel adheres to global quality, environmental safety, and galvanizing compliance frameworks.',
            'تلتزم كيانكو بأعلى معايير التصنيع والجودة والجلفنة للحلول الهيكلية وحوامل الكابلات.'
          )}
        </p>
      </div>

      {/* 2. Full Accreditations Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {accreditationsList.map((cert) => (
          <div
            key={cert.id}
            className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xl transition-all duration-300 group border ${cardBg}`}
          >
            <div className="space-y-3 sm:space-y-4">
              {cert.hasImage ? (
                <div 
                  className="relative rounded-2xl overflow-hidden bg-white p-2 border border-slate-700 shadow-inner group/img cursor-pointer h-52 sm:h-64 flex items-center justify-center"
                  onClick={() => setSelectedCert(cert)}
                >
                  <img
                    src={cert.file_url || cert.img}
                    alt={cert.code}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-2xl">
                    <ZoomIn className="w-5 h-5" />
                    <span>{pick('Click to Enlarge', 'انقر للتكبير')}</span>
                  </div>
                </div>
              ) : (
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border flex items-center justify-center shadow-inner ${darkMode ? 'bg-slate-900 border-blue-900/80' : 'bg-slate-100 border-slate-300'}`}>
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: themeColor }} />
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white inline-block" style={{ backgroundColor: themeColor }}>
                  {cert.code}
                </span>
                <h3 className={`text-base sm:text-lg font-bold leading-snug ${textTitle}`}>{pick(cert.titleEn, cert.titleAr)}</h3>
                <p className={`text-xs leading-relaxed ${textDesc}`}>{pick(cert.descEn, cert.descAr)}</p>
              </div>
            </div>

            <div className={`pt-3 sm:pt-4 border-t flex items-center justify-between text-xs font-bold ${darkMode ? 'border-blue-900/40 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{pick(cert.badgeEn, cert.badgeAr)}</span>
              </span>
              {cert.hasImage && (
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className={`hover:underline flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs ${textTitle}`}
                >
                  <span>{pick('View Cert', 'معاينة الشهادة')}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. CTA Section */}
      <div className={`rounded-3xl p-6 sm:p-10 text-center space-y-5 sm:space-y-6 shadow-2xl border ${darkMode ? 'bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border-blue-900/60' : 'bg-slate-100 border-slate-300'}`}>
        <h2 className={`text-lg sm:text-2xl md:text-3xl font-extrabold leading-snug ${textTitle}`}>
          {pick('Need Quality Certificates for Consultant Approval?', 'تحتاج صور الشهادات المعتمدة للتقديم للاستشاري؟')}
        </h2>
        <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${textDesc}`}>
          {pick(
            'Request verified copies of our ISO certificates and mill test reports directly for your project submittals.',
            'اطلب نسخاً معتمدة وموثوقة من شهادات ISO وتقارير فحص المصنع لتقديمها مباشرة ضمن أوراق اعتماد المشروع.'
          )}
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to={ROUTES.contact}
            className="inline-flex items-center justify-center gap-3 py-3.5 px-6 sm:px-8 rounded-xl font-bold text-xs sm:text-base text-white shadow-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Request Certified Submittal Dossier', 'اطلب ملف الاعتمادات المعتمد')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* 4. Lightbox Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className={`relative rounded-3xl p-4 sm:p-6 max-w-2xl w-full space-y-3 sm:space-y-4 shadow-2xl border ${modalBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${darkMode ? 'border-blue-900/60' : 'border-slate-200'}`}>
              <h3 className={`text-sm sm:text-lg font-bold truncate max-w-[80%] ${textTitle}`}>
                {selectedCert.code} - {pick(selectedCert.titleEn, selectedCert.titleAr)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${darkMode ? 'bg-slate-900 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-2 rounded-2xl max-h-[65vh] sm:max-h-[70vh] overflow-y-auto flex items-center justify-center">
              <img src={selectedCert.file_url || selectedCert.img} alt={selectedCert.code} className="max-h-[60vh] sm:max-h-[65vh] object-contain rounded-xl" />
            </div>

            <div className="flex justify-end pt-1 sm:pt-2">
              <a
                href={selectedCert.file_url || selectedCert.img}
                download
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-all border border-blue-900/80 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>{pick('Download Certificate Image', 'تحميل صورة الشهادة')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}