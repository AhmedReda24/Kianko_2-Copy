import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, FileCheck, ExternalLink, X, Download, FileText } from 'lucide-react';
import { accreditations as localAccreditations } from '../data/accreditations';
import { supabase } from '../lib/supabase';

export default function CertificationsGrid({
  lang = 'en',
  themeColor = '#C9252C',
  badge,
  title,
  intro,
  darkMode = true
}) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [dbApprovals, setDbApprovals] = useState([]);
  const [deletedCertIds, setDeletedCertIds] = useState([]);

  // تحميل وتطبيق خط IBM Plex Sans Arabic تلقائياً عند اختيار اللغة العربية
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

  // إغلاق نافذة المعاينة عند الضغط على زر Escape
  useEffect(() => {
    if (!selectedPdf) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPdf(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPdf]);

  // جلب الاعتمادات المضافة من الداش بورد (Supabase) ومزامنة المحذوفات
  useEffect(() => {
    async function fetchApprovalsFromDB() {
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
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          // جلب الاعتمادات فقط (approval) واستبعاد شهادات الأيزو والمنتجات
          const validApprovals = data.filter((item) => {
            const cat = String(item.category || 'approval').toLowerCase();
            return cat === 'approval';
          });
          setDbApprovals(validApprovals);
        }
      } catch (err) {
        console.error('Error fetching approvals in CertificationsGrid:', err);
      }
    }

    fetchApprovalsFromDB();
  }, []);

  // دمج الاعتمادات المضافة من الداش بورد مع الاعتمادات الأصلية في ملف accreditations.js
  const accreditations = useMemo(() => {
    const dynamicApprovals = dbApprovals
      .filter((item) => !deletedCertIds.includes(String(item.id)))
      .map((item) => {
        const rawUrl = item.file_url || '';
        const isImageFile = /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(rawUrl);
        return {
          id: item.id,
          code: item.code || 'APPROVAL',
          name: item.title,
          titleEn: item.title,
          titleAr: item.title,
          descEn: item.issuer
            ? `Approved Submittal — ${item.issuer} (${item.year || '2026'})`
            : 'Official project approval and quality compliance document.',
          descAr: item.issuer
            ? `الجهة / المشروع: ${item.issuer} (${item.year || '2026'})`
            : 'اعتماد رسمي وموثق للمطابقة والجودة.',
          file: rawUrl || null,
          image: isImageFile ? rawUrl : null,
        };
      });

    const staticApprovals = (localAccreditations || [])
      .map((item, idx) => ({
        ...item,
        id: item.id || item.code || `local_acc_${idx}`,
      }))
      .filter((item) => !deletedCertIds.includes(String(item.id)));

    return [...dynamicApprovals, ...staticApprovals];
  }, [dbApprovals, deletedCertIds]);

  // المتغيرات المتكيفة مع الثيم
  const pageBg = darkMode ? 'bg-[#07132B] text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const badgeBg = darkMode ? 'bg-white/10 text-emerald-400 border-white/10' : 'bg-slate-200 text-slate-800 border-slate-300';
  const frameBg = darkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-100 border-slate-300';
  const dividerColor = darkMode ? 'border-blue-900/40' : 'border-slate-200';
  const downloadBtn = darkMode 
    ? 'bg-white/10 text-white hover:bg-[#C9252C] hover:text-white' 
    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300';
  const modalBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/60' : 'bg-white text-slate-900 border-slate-300';

  const isPdfFile = (url) => Boolean(url && /\.pdf(\?|$)/i.test(String(url)));

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className={`min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-start transition-colors duration-300 ${pageBg}`}
    >
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* 1. Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto"
        >
          {badge && (
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm ${badgeBg}`}>
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{badge}</span>
            </span>
          )}
          
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight flex items-center justify-center gap-2 flex-wrap ${textTitle}`}>
            <span>{pick('Accreditations & Quality at', 'الاعتمادات والجودة في')}</span>
            <span style={{ color: themeColor }}>
              {pick('KIANKO', 'كيانكو')}
            </span>
          </h1>

          <p className={`font-medium text-xs sm:text-base leading-relaxed max-w-2xl mx-auto ${textDesc}`}>
            {intro || pick(
              'The systems, standards, and official accreditations we work to, so quality stays consistent at every stage of manufacturing.',
              'الأنظمة والمعايير القياسية والاعتمادات الرسمية التي نعمل وفقاً لها لضمان جودة مستدامة في كل مرحلة من مراحل التصنيع.'
            )}
          </p>
        </motion.div>

        {/* 2. Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {accreditations.map((item, index) => {
              const colDelay = (index % 3) * 0.1;
              const docUrl = item.file || item.image;

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: colDelay, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group border shadow-lg ${cardBg}`}
                >
                  <div className="space-y-4">
                    
                    {/* إطار معاينة صورة الشهادة أو تصميم المستند الرسمي */}
                    <div 
                      className={`relative rounded-xl overflow-hidden border h-52 sm:h-64 flex items-center justify-center cursor-pointer group/frame shadow-md ${frameBg}`}
                      onClick={() => docUrl && setSelectedPdf(item)}
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={pick(item.titleEn, item.titleAr) || 'Cert'} 
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/frame:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}

                      {/* واجهة المستند الرسمي في حال عدم وجود صورة أو كون الملف PDF */}
                      <div
                        className={`w-full h-full p-4 bg-white flex-col justify-between select-none relative overflow-hidden text-slate-800 ${
                          item.image ? 'hidden' : 'flex'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                            {pick('KIANKO CERTIFIED', 'شركة كيانكو للصناعات الحديدية')}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.code}
                          </span>
                        </div>
                        <div className="my-auto text-center space-y-2 py-2">
                          <FileText className="w-9 h-9 mx-auto text-red-600" />
                          <p className="text-xs font-bold text-slate-800 line-clamp-2 px-2">
                            {pick(item.titleEn, item.titleAr)}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 text-center font-bold">
                          {pick('OFFICIAL ACCREDITATION DOCUMENT', 'مستند اعتماد رسمي موثق')}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-[#0A1832]/85 opacity-0 group-hover/frame:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <span>{pick('Click to Preview Full Document', 'انقر لمعاينة المستند الكامل')}</span>
                      </div>
                    </div>

                    {/* تفاصيل الاعتماد */}
                    <div className="space-y-2">
                      <span 
                        className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs"
                        style={{ backgroundColor: themeColor }}
                      >
                        {item.code}
                      </span>
                      <h3 className={`text-lg font-bold transition-colors leading-snug ${textTitle}`}>
                        {pick(item.titleEn, item.titleAr)}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${textDesc}`}>
                        {pick(item.descEn, item.descAr)}
                      </p>
                    </div>
                  </div>

                  {/* أسفل الكارد */}
                  <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold ${dividerColor}`}>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <FileCheck className="w-4 h-4 shrink-0" />
                      <span>{pick('Verified Approval', 'اعتماد موثق')}</span>
                    </span>

                    {docUrl && (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all text-xs font-semibold ${downloadBtn}`}
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{pick('Download Cert', 'تحميل المستند')}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 3. Lightbox Preview Modal */}
        <AnimatePresence>
          {selectedPdf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPdf(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative rounded-2xl p-4 sm:p-6 max-w-5xl w-full space-y-4 shadow-2xl border ${modalBg}`}
              >
                <div className={`flex items-center justify-between border-b pb-3 gap-3 ${darkMode ? 'border-blue-900/50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2.5 py-1 rounded text-xs font-bold text-white shrink-0" style={{ backgroundColor: themeColor }}>
                      {selectedPdf.code}
                    </span>
                    <h3 className={`text-sm sm:text-lg font-bold truncate ${textTitle}`}>
                      {pick(selectedPdf.titleEn, selectedPdf.titleAr)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPdf(null)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${darkMode ? 'bg-white/15 text-slate-200 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-white rounded-xl h-[68vh] w-full overflow-hidden border border-slate-300 shadow-inner flex items-center justify-center">
                  {isPdfFile(selectedPdf.file) ? (
                    <iframe
                      src={`${selectedPdf.file}#toolbar=1`}
                      title={selectedPdf.code}
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <img
                      src={selectedPdf.image || selectedPdf.file}
                      alt={pick(selectedPdf.titleEn, selectedPdf.titleAr)}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-1 flex-wrap">
                  <a
                    href={selectedPdf.file || selectedPdf.image}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{pick('Open in New Tab', 'فتح في نافذة جديدة')}</span>
                  </a>
                  <a
                    href={selectedPdf.file || selectedPdf.image}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Download className="w-4 h-4" />
                    <span>{pick('Download Full Document', 'تحميل الاعتماد الرسمي كامل')}</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}