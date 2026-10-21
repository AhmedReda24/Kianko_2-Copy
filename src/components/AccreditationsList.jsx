import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, FileCheck, ZoomIn, X, Download, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { accreditations as localAccreditations } from '../data/accreditations';

export default function AccreditationsPage({ lang = 'ar', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dbApprovals, setDbApprovals] = useState([]);
  const [deletedCertIds, setDeletedCertIds] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);

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

  // إغلاق نافذة المعاينة بزر Escape
  useEffect(() => {
    if (!selectedItem) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedItem]);

  useEffect(() => {
    async function fetchAllApprovals() {
      let hidden = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('kianko_deleted_items') || '{}');
        hidden = (parsed.certs || []).map(String);
      } catch {
        hidden = [];
      }
      setDeletedCertIds(hidden);

      try {
        setLoadingCerts(true);
        // جلب الاعتمادات فقط (approval) واستبعاد شهادات الأيزو والمنتجات
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const approvalsOnly = data.filter((item) => {
            const cat = String(item.category || 'approval').toLowerCase();
            return cat === 'approval';
          });
          setDbApprovals(approvalsOnly);
        }
      } catch (err) {
        console.error('Error fetching accreditations:', err);
      } finally {
        setLoadingCerts(false);
      }
    }
    fetchAllApprovals();
  }, []);

  const accreditations = useMemo(() => {
    // 1. الاعتمادات المضافة من الداش بورد
    const dbFormatted = dbApprovals
      .filter((item) => !deletedCertIds.includes(String(item.id)))
      .map((item) => {
        const rawUrl = item.file_url || '';
        const isSupabasePdf = rawUrl.includes('supabase.co') && /\.pdf(\?|$)/i.test(rawUrl);
        return {
          id: item.id,
          code: item.code || 'APPROVAL',
          titleEn: item.title,
          titleAr: item.title,
          descEn: item.issuer
            ? `Issuer / Project: ${item.issuer} (${item.year || '2026'})`
            : 'Official project approval submittal.',
          descAr: item.issuer
            ? `الجهة / المشروع: ${item.issuer} (${item.year || '2026'})`
            : 'اعتماد رسمي وموثق للمشروع.',
          file: rawUrl || null,
          image: isSupabasePdf ? null : rawUrl ? rawUrl.replace(/\.pdf$/i, '.webp') : null,
        };
      });

    // 2. الاعتمادات الأصلية من ملف accreditations.js (مع استبعاد المحذوف منها)
    const localFormatted = (localAccreditations || [])
      .map((item, idx) => ({
        id: item.id || item.code || `local_acc_${idx}`,
        code: item.code || 'APPROVAL',
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        descEn: item.descEn,
        descAr: item.descAr,
        file: item.file,
        image: item.image || (item.file ? item.file.replace(/\.pdf$/i, '.webp') : null),
      }))
      .filter((item) => !deletedCertIds.includes(String(item.id)));

    return [...dbFormatted, ...localFormatted];
  }, [dbApprovals, deletedCertIds]);

  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 shadow-xl' : 'bg-white border-slate-200 shadow-lg';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const thumbWrapper = darkMode ? 'bg-[#061022] border-blue-950' : 'bg-slate-100 border-slate-200';
  const dividerColor = darkMode ? 'border-blue-900/40' : 'border-slate-200';
  const downloadBtn = darkMode 
    ? 'bg-slate-900 text-slate-200 hover:bg-[#C9252C] hover:text-white border border-blue-900/60' 
    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 border border-slate-300';
  const modalBg = darkMode ? 'bg-[#0A1832] border-blue-900/80 text-white' : 'bg-white border-slate-300 text-slate-900';

  const isPdfUrl = (url) => Boolean(url && /\.pdf(\?|$)/i.test(String(url)));

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-start"
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center space-y-3 max-w-3xl mx-auto"
      >
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-[#0A1832] text-white border border-blue-950' : 'bg-slate-200 text-slate-800 border border-slate-300'}`}>
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('OFFICIAL ACCREDITATIONS', 'اعتمادات المشاريع الرسمية')}</span>
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${textTitle}`}>
          {pick('Approved Project Submittals', 'اعتمادات كيانكو للمشاريع الكبرى')}
        </h1>
        <p className={`font-medium text-sm sm:text-base leading-relaxed ${textDesc}`}>
          {pick(
            'Official material submittals and approved vendor certificates for major projects.',
            'استعرض اعتمادات الموادوسجل الموردين المعتمد لشركة كيانكو للصناعات الحديدية في المشاريع الكبرى.'
          )}
        </p>
      </motion.div>

      {loadingCerts ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : accreditations.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${cardBg}`}>
          <p className={`text-sm ${textDesc}`}>{pick('No project approvals added yet.', 'لا توجد اعتمادات مضافة حتى الآن.')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {accreditations.map((item, idx) => {
              const title = pick(item.titleEn, item.titleAr);
              const colDelay = (idx % 3) * 0.1;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: colDelay, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group border ${cardBg}`}
                >
                  <div className="space-y-4">
                    <div 
                      className={`relative rounded-xl overflow-hidden border h-56 flex items-center justify-center cursor-pointer group/img p-2 bg-white ${thumbWrapper}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      
                      {/* واجهة احتياطية أنيقة لو الصورة غير موجودة أو الملف PDF */}
                      <div
                        className={`absolute inset-0 bg-slate-900/95 flex-col items-center justify-center gap-2 text-white p-4 ${
                          item.image ? 'hidden' : 'flex'
                        }`}
                      >
                        <ShieldCheck className="w-12 h-12 text-emerald-400" />
                        <span className="text-xs font-bold text-center line-clamp-2 px-2">{title}</span>
                        <span className="text-[11px] text-slate-300 px-3 py-1 rounded-full bg-white/10">
                          {pick('Official Approval Document', 'مستند اعتماد رسمي')}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-[#0A1832]/75 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-xl">
                        <ZoomIn className="w-5 h-5" />
                        <span>{pick('Preview Document', 'معاينة المستند')}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-start">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs" style={{ backgroundColor: themeColor }}>
                        {item.code}
                      </span>
                      <h3 className={`text-lg font-bold transition-colors ${textTitle}`}>
                        {title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${textDesc}`}>
                        {pick(item.descEn, item.descAr)}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold ${dividerColor}`}>
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <FileCheck className="w-4 h-4 shrink-0" />
                      <span>{pick('Verified Approval', 'اعتماد موثق')}</span>
                    </span>

                    {(item.file || item.image) && (
                      <a
                        href={item.file || item.image}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${downloadBtn}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{pick('Download', 'تحميل')}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* نافذة معاينة تدعم ملفات الـ PDF والصور معاً */}
      {selectedItem && (selectedItem.file || selectedItem.image) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`relative rounded-2xl p-4 sm:p-6 max-w-4xl w-full space-y-4 shadow-2xl border ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between border-b pb-3 gap-3 ${darkMode ? 'border-blue-900/60' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded text-xs font-bold text-white shrink-0" style={{ backgroundColor: themeColor }}>
                  {selectedItem.code}
                </span>
                <h3 className={`text-sm sm:text-base font-bold truncate ${textTitle}`}>
                  {pick(selectedItem.titleEn, selectedItem.titleAr)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${darkMode ? 'bg-slate-900 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`rounded-xl h-[68vh] w-full overflow-hidden border flex items-center justify-center ${darkMode ? 'bg-slate-950 border-blue-950' : 'bg-slate-100 border-slate-300'}`}>
              {isPdfUrl(selectedItem.file) ? (
                <iframe
                  src={`${selectedItem.file}#toolbar=0`}
                  title={selectedItem.code}
                  className="w-full h-full border-0"
                />
              ) : (
                <img
                  src={selectedItem.image || selectedItem.file}
                  alt={pick(selectedItem.titleEn, selectedItem.titleAr)}
                  className="max-h-full max-w-full object-contain p-2 bg-white rounded-lg"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-1 flex-wrap">
              <a
                href={selectedItem.file || selectedItem.image}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{pick('Open in New Tab', 'فتح في نافذة جديدة')}</span>
              </a>
              <a
                href={selectedItem.file || selectedItem.image}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{pick('Download Document', 'تحميل المستند')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}