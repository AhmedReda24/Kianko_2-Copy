import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck, Award, FileCheck, ZoomIn, X, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../routes';
import { supabase } from '../lib/supabase';

export const defaultIsoList = [
  {
    id: 'iso-9001',
    code: 'ISO 9001:2015',
    titleEn: 'Quality Management System',
    titleAr: 'نظام إدارة الجودة العالمي',
    descEn: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
    descAr: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والدرفلة.',
    file_url: '/Image/ISO-9001-2015.webp',
    badgeEn: 'Verified Certificate',
    badgeAr: 'شهادة موثقة',
    hasImage: true,
    category: 'iso',
  },
  {
    id: 'iso-14001',
    code: 'ISO 14001:2015',
    titleEn: 'Environmental Management System',
    titleAr: 'نظام الإدارة البيئية',
    descEn: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
    descAr: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
    file_url: '/Image/ISO-14001-2015.webp',
    badgeEn: 'Verified Certificate',
    badgeAr: 'شهادة موثقة',
    hasImage: true,
    category: 'iso',
  },
  {
    id: 'iso-45001',
    code: 'ISO 45001:2018',
    titleEn: 'Occupational Health & Safety',
    titleAr: 'إدارة السلامة والصحة المهنية',
    descEn: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
    descAr: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
    file_url: '/Image/ISO-45001-2018.webp',
    badgeEn: 'Verified Certificate',
    badgeAr: 'شهادة موثقة',
    hasImage: true,
    category: 'iso',
  },
];

export default function IsoCertificationsPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const [selectedCert, setSelectedCert] = useState(null);
  const [dbCertifications, setDbCertifications] = useState([]);
  const [deletedCertIds, setDeletedCertIds] = useState([]);

  // تفعيل خط IBM Plex Sans Arabic تلقائياً عند اختيار اللغة العربية
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

  // إغلاق نافذة المعاينة بزر Escape
  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  // جلب شهادات الأيزو المضافة من لوحة التحكم ومزامنة المحذوفات
  useEffect(() => {
    async function fetchCerts() {
      let hidden = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('kianko_deleted_items') || '{}');
        hidden = (parsed.certs || []).map(String);
      } catch {
        hidden = [];
      }
      setDeletedCertIds(hidden);

      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .eq('category', 'iso')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          setDbCertifications(data);
        }
      } catch (err) {
        console.error('Error fetching ISO certifications:', err);
      }
    }
    fetchCerts();
  }, []);

  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-950 shadow-xl';
  const textTitle = darkMode ? 'text-white' : 'text-slate-950';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const badgeBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/80' : 'bg-slate-100 text-slate-800 border-slate-300';
  const modalBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/80' : 'bg-white text-slate-900 border-slate-300';

  const accreditationsList = useMemo(() => {
    const activeDefaults = defaultIsoList.filter(
      (item) => !deletedCertIds.includes(String(item.id))
    );

    const activeDb = dbCertifications
      .filter((c) => !deletedCertIds.includes(String(c.id)))
      .map((c) => ({
        id: c.id,
        code: c.code || 'ISO',
        titleEn: c.title,
        titleAr: c.title,
        descEn: c.issuer ? `Issued by: ${c.issuer} (${c.year || '2026'})` : 'Official ISO certification document.',
        descAr: c.issuer ? `الجهة المانحة: ${c.issuer} (${c.year || '2026'})` : 'شهادة أيزو معتمدة وموثقة.',
        file_url: c.file_url,
        badgeEn: 'Verified ISO',
        badgeAr: 'أيزو معتمد',
        hasImage: Boolean(c.file_url),
        category: 'iso',
      }));

    return [...activeDefaults, ...activeDb];
  }, [dbCertifications, deletedCertIds]);

  const isPdfFile = (url) => Boolean(url && /\.pdf(\?|$)/i.test(String(url)));

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16 text-start"
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2"
      >
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md border ${badgeBg}`}>
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('GLOBAL ACCREDITATIONS & CERTIFICATES', 'شهادات الأيزو والجودة العالمية')}</span>
        </span>
        
        <h1 className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug ${textTitle}`}>
          {pick(
            `${accreditationsList.length} Accredited International ISO Certifications`,
            `${accreditationsList.length} شهادات أيزو واعترافات دولية معتمدة`
          )}
        </h1>

        <p className={`font-medium text-xs sm:text-base leading-relaxed max-w-2xl mx-auto ${textDesc}`}>
          {pick(
            'Kianko Steel adheres to global quality, environmental safety, and galvanizing compliance frameworks.',
            'تلتزم شركة كيانكو للصناعات الحديدية بأعلى معايير التصنيع والجودة والجلفنة للحلول الهيكلية وحوامل الكابلات.'
          )}
        </p>
      </motion.div>

      {/* 2. Full Accreditations Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {accreditationsList.map((cert, index) => {
            const colDelay = (index % 3) * 0.1;
            const fileUrl = cert.file_url || cert.img;
            const isPdf = isPdfFile(fileUrl);

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: colDelay, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group border ${cardBg}`}
              >
                <div className="space-y-3 sm:space-y-4">
                  {cert.hasImage && fileUrl ? (
                    <div 
                      className="relative rounded-2xl overflow-hidden bg-white p-2 border border-slate-700 shadow-inner group/img cursor-pointer h-52 sm:h-64 flex items-center justify-center"
                      onClick={() => setSelectedCert(cert)}
                    >
                      {isPdf ? (
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-800 p-4 text-center">
                          <ShieldCheck className="w-16 h-16" style={{ color: themeColor }} />
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-300">
                            {pick('Official PDF Certificate', 'مستند شهادة PDF رسمي')}
                          </span>
                        </div>
                      ) : (
                        <motion.img
                          initial={{ scale: 1.06, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: false, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: colDelay + 0.05 }}
                          src={fileUrl}
                          alt={cert.code}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-2xl">
                        <ZoomIn className="w-5 h-5" />
                        <span>{pick('Click to Enlarge', 'انقر للمعاينة والتكبير')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border flex items-center justify-center shadow-inner ${darkMode ? 'bg-slate-900 border-blue-900/80' : 'bg-slate-100 border-slate-300'}`}>
                      <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: themeColor }} />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: colDelay + 0.1 }}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white inline-block" style={{ backgroundColor: themeColor }}>
                      {cert.code}
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold leading-snug ${textTitle}`}>
                      {pick(cert.titleEn, cert.titleAr)}
                    </h3>
                    <p className={`text-xs leading-relaxed ${textDesc}`}>
                      {pick(cert.descEn, cert.descAr)}
                    </p>
                  </motion.div>
                </div>

                <div className={`pt-3 sm:pt-4 border-t flex items-center justify-between text-xs font-bold ${darkMode ? 'border-blue-900/40 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs">
                    <FileCheck className="w-4 h-4 shrink-0" />
                    <span>{pick(cert.badgeEn, cert.badgeAr)}</span>
                  </span>
                  {cert.hasImage && fileUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className={`hover:underline flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs ${textTitle}`}
                    >
                      <span>{pick('View Cert', 'معاينة الشهادة')}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 3. CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className={`rounded-3xl p-6 sm:p-10 text-center space-y-5 sm:space-y-6 shadow-2xl border ${darkMode ? 'bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border-blue-900/60' : 'bg-slate-100 border-slate-300'}`}
      >
        <h2 className={`text-lg sm:text-2xl md:text-3xl font-extrabold leading-snug ${textTitle}`}>
          {pick('Need Quality Certificates for Consultant Approval?', 'هل تحتاج نسخ الشهادات المعتمدة لتقديمها للاستشاري؟')}
        </h2>
        <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${textDesc}`}>
          {pick(
            'Request verified copies of our ISO certificates and mill test reports directly for your project submittals.',
            'اطلب نسخاً معتمدة وموثوقة من شهادات الأيزو وتقارير فحص المصنع لتقديمها مباشرة ضمن ملف اعتمادات مشروعك.'
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
      </motion.div>

      {/* 4. Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className={`relative rounded-3xl p-4 sm:p-6 max-w-2xl w-full space-y-3 sm:space-y-4 shadow-2xl border ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
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
              {isPdfFile(selectedCert.file_url || selectedCert.img) ? (
                <iframe
                  src={selectedCert.file_url || selectedCert.img}
                  title={selectedCert.code}
                  className="w-full h-[60vh] rounded-xl border-0"
                />
              ) : (
                <img
                  src={selectedCert.file_url || selectedCert.img}
                  alt={selectedCert.code}
                  className="max-h-[60vh] sm:max-h-[65vh] object-contain rounded-xl"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-1 sm:pt-2 flex-wrap">
              <a
                href={selectedCert.file_url || selectedCert.img}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all w-full sm:w-auto justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{pick('Open in New Tab', 'فتح في نافذة مستقلة')}</span>
              </a>
              <a
                href={selectedCert.file_url || selectedCert.img}
                download
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-all border border-blue-900/80 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>{pick('Download Certificate', 'تحميل الشهادة')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}