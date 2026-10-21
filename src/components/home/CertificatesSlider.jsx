import { useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, FileText, X, ExternalLink, Download, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { accreditations as localAccreditations } from '../../data/accreditations';
import SectionHeading from '../ui/SectionHeading';

export default function CertificatesSlider({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const reduce = useReducedMotion();
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
  }, []);

  // جلب الشهادات والاعتمادات من سوبابيس مع استبعاد المحذوفات والمنتجات
  useEffect(() => {
    async function loadCerts() {
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
          // السماح فقط بشهادات الأيزو (iso) والاعتمادات (approval) واستبعاد أي منتجات أو كتالوجات
          const validCertsAndApprovals = data.filter((item) => {
            const cat = String(item.category || 'approval').toLowerCase();
            return cat === 'iso' || cat === 'approval';
          });
          setDbCertifications(validCertsAndApprovals);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
    loadCerts();
  }, []);

  const certificates = useMemo(() => {
    // 1. تحويل الاعتمادات الأصلية (مع فلترة أي اعتماد حذفه الأدمن)
    const localCertsFormatted = (localAccreditations || [])
      .map((item, idx) => ({
        id: item.id || item.code || `local_acc_${idx}`,
        code: item.code || 'APPROVAL',
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        descEn: item.descEn,
        descAr: item.descAr,
        img: item.file ? item.file.replace(/\.pdf$/i, '.webp') : '/Image/ISO-9001-2015.webp',
        file: item.file,
        category: 'approval',
        isLocal: true,
      }))
      .filter((item) => !deletedCertIds.includes(String(item.id)));

    // 2. مستندات قاعدة البيانات المضافة من لوحة التحكم (شهادات الأيزو + الاعتمادات الجديدة)
    const dynamicCerts = dbCertifications
      .filter((item) => !deletedCertIds.includes(String(item.id)))
      .map((item) => {
        const isIso = String(item.category || '').toLowerCase() === 'iso';
        const rawUrl = item.file_url || '';
        const isSupabasePdf = rawUrl.includes('supabase.co') && /\.pdf(\?|$)/i.test(rawUrl);

        return {
          id: item.id,
          code: item.code || (isIso ? 'ISO' : 'APPROVAL'),
          titleEn: item.title,
          titleAr: item.title,
          descEn: item.issuer
            ? `${isIso ? 'Issued by' : 'Issuer / Project'}: ${item.issuer} (${item.year || '2026'})`
            : 'Official accredited certification document.',
          descAr: item.issuer
            ? `${isIso ? 'الجهة المانحة' : 'الجهة / المشروع'}: ${item.issuer} (${item.year || '2026'})`
            : 'مستند اعتماد رسمي وموثق.',
          // إذا كان ملف PDF مرفوعاً من الداش بورد على سوبابيس نستخدم أيقونة المعاينة بدلاً من رابط .webp غير موجود
          img: isSupabasePdf ? '' : rawUrl ? rawUrl.replace(/\.pdf$/i, '.webp') : '/Image/ISO-9001-2015.webp',
          file: rawUrl || null,
          category: isIso ? 'iso' : 'approval',
          isDynamic: true,
        };
      });

    // 3. شهادات الأيزو الثابتة الأساسية
    const defaultIso = [
      {
        id: 'iso-9001',
        code: 'ISO 9001:2015',
        titleEn: 'Quality Management System',
        titleAr: 'نظام إدارة الجودة العالمي',
        descEn: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
        descAr: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والدرفلة.',
        img: '/Image/ISO-9001-2015.webp',
        file: '/Image/ISO-9001-2015.webp',
        category: 'iso',
      },
      {
        id: 'iso-14001',
        code: 'ISO 14001:2015',
        titleEn: 'Environmental Management System',
        titleAr: 'نظام الإدارة البيئية',
        descEn: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
        descAr: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
        img: '/Image/ISO-14001-2015.webp',
        file: '/Image/ISO-14001-2015.webp',
        category: 'iso',
      },
      {
        id: 'iso-45001',
        code: 'ISO 45001:2018',
        titleEn: 'Occupational Health & Safety',
        titleAr: 'إدارة السلامة والصحة المهنية',
        descEn: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
        descAr: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
        img: '/Image/ISO-45001-2018.webp',
        file: '/Image/ISO-45001-2018.webp',
        category: 'iso',
      },
    ].filter((item) => !deletedCertIds.includes(String(item.id)));

    // وضع المضاف حديثاً من الداش بورد في المقدمة يليه الاعتمادات الأصلية وشهادات الأيزو
    return [...dynamicCerts, ...localCertsFormatted, ...defaultIso];
  }, [dbCertifications, deletedCertIds]);

  const [autoplay] = useState(() => Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', direction: isAr ? 'rtl' : 'ltr' },
    reduce ? [] : [autoplay]
  );
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === 'Escape' && setZoom(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]);

  const Prev = isAr ? ChevronRight : ChevronLeft;
  const Next = isAr ? ChevronLeft : ChevronRight;
  
  const sectionBg = darkMode ? 'bg-[#061024] border-blue-900/40' : 'bg-slate-100 border-slate-300';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const arrowCls = darkMode 
    ? 'grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 cursor-pointer min-h-[44px] min-w-[44px]'
    : 'grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-slate-400 text-slate-800 transition-colors hover:bg-slate-200 cursor-pointer min-h-[44px] min-w-[44px]';

  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl';
  const titleColor = darkMode ? 'text-white' : 'text-slate-900';
  const descColor = darkMode ? 'text-slate-300' : 'text-slate-600';
  const btnPdfCls = darkMode 
    ? 'w-full text-center py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-[#C9252C] hover:text-white transition-all text-xs font-semibold min-h-[44px] cursor-pointer'
    : 'w-full text-center py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 transition-all text-xs font-semibold min-h-[44px] cursor-pointer';

  const isPdfUrl = (url) => Boolean(url && /\.pdf(\?|$)/i.test(String(url)));

  return (
    <section
      className={`border-y py-12 sm:py-20 transition-colors duration-300 ${sectionBg}`}
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8 sm:mb-10 text-center sm:text-start"
        >
          <div className="max-w-2xl px-2">
            <div className="flex justify-center sm:justify-start">
              <SectionHeading themeColor={themeColor} darkMode={darkMode}>
                {isAr ? 'الاعتمادات وشهادات الأيزو' : 'Accreditations & ISO Certificates'}
              </SectionHeading>
            </div>
            <p className={`mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
              {isAr
                ? 'اعتمادات وشهادات رسمية من جهات قياسية تؤكد جودة منتجات كيانكو وسجل خبرتنا في كبرى المشاريع.'
                : 'Certificates from recognised bodies that back up our product quality and project track record.'}
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button type="button" onClick={() => emblaApi?.scrollPrev()} className={arrowCls} aria-label={isAr ? 'السابق' : 'Previous'}>
              <Prev className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => emblaApi?.scrollNext()} className={arrowCls} aria-label={isAr ? 'التالي' : 'Next'}>
              <Next className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex -ms-4 sm:-ms-5">
            {certificates.map((c) => {
              const title = isAr ? (c.titleAr || c.titleEn) : (c.titleEn || c.titleAr);
              const desc = isAr ? (c.descAr || c.descEn) : (c.descEn || c.descAr);
              const fileUrl = c.file;
              const code = c.code || 'ISO';
              const previewImg = c.img;

              return (
                <div key={c.id || c.titleEn} className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 ps-4 sm:ps-5">
                  <div className={`h-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border transition-all duration-300 group ${cardBg}`}>
                    
                    <button
                      type="button"
                      onClick={() => setZoom({ ...c, img: previewImg, title })}
                      className="relative rounded-xl overflow-hidden border h-60 sm:h-64 flex items-center justify-center shadow-inner cursor-pointer p-2 bg-white w-full"
                      aria-label={`${title} — ${isAr ? 'تكبير' : 'enlarge'}`}
                    >
                      {previewImg ? (
                        <img 
                          src={previewImg} 
                          alt={title} 
                          loading="lazy" 
                          decoding="async" 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`absolute inset-0 bg-slate-900/95 flex-col items-center justify-center gap-3 text-white p-4 ${
                          previewImg ? 'hidden' : 'flex'
                        }`}
                      >
                        {c.category === 'iso' ? (
                          <ShieldCheck className="w-14 h-14 text-amber-500" />
                        ) : (
                          <FileText className="w-14 h-14 text-red-500" />
                        )}
                        <span className="text-xs font-bold text-center line-clamp-2 px-2">{title}</span>
                        <span className="text-[11px] text-slate-300 px-3 py-1 rounded-full bg-white/10">
                          {isAr ? 'انقر للمعاينة أو التحميل' : 'Click to preview'}
                        </span>
                      </div>
                    </button>

                    <div className="space-y-2 text-start">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs"
                          style={{ backgroundColor: c.category === 'iso' ? '#d97706' : themeColor }}
                        >
                          {code}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {c.category === 'iso'
                            ? (isAr ? 'شهادة أيزو' : 'ISO Cert')
                            : (isAr ? 'اعتماد رسمي' : 'Official Approval')}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold line-clamp-1 ${titleColor}`}>
                        {title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${descColor}`}>
                        {desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/20 flex items-center justify-between text-xs font-bold">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`${btnPdfCls} flex items-center justify-center`}
                        >
                          {isAr ? 'معاينة / تحميل المستند' : 'View / Download Certificate'}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setZoom({ ...c, img: previewImg, title })}
                          className={btnPdfCls}
                        >
                          {isAr ? 'معاينة المستند' : 'View Certificate'}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* مؤشرات التنقل المتقاربة */}
        <div className="mt-8 flex justify-center items-center gap-0 flex-wrap px-4" role="tablist" aria-label={isAr ? 'أزرار التنقل' : 'Pagination'}>
          {certificates.map((c, i) => (
            <button
              key={c.id || i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={isAr ? `الانتقال للشهادة ${i + 1}` : `Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="flex items-center justify-center h-8 px-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
            >
              <span
                className="block h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{
                  width: i === selected ? 28 : 8,
                  backgroundColor: i === selected ? themeColor : (darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'),
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* نافذة التكبير تدعم الصور وملفات الـ PDF معاً بدون أي صورة مكسورة */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-3xl p-4 sm:p-6 space-y-4 border shadow-2xl ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-700/40">
                <h3 className={`text-sm sm:text-base font-bold truncate max-w-[85%] ${titleColor}`}>
                  {zoom.code} — {zoom.title || (isAr ? zoom.titleAr : zoom.titleEn)}
                </h3>
                <button
                  type="button"
                  onClick={() => setZoom(null)}
                  aria-label={isAr ? 'إغلاق التكبير' : 'Close Zoom'}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white p-2 rounded-2xl max-h-[68vh] overflow-y-auto flex items-center justify-center">
                {!zoom.img && isPdfUrl(zoom.file) ? (
                  <iframe
                    src={zoom.file}
                    title={zoom.code}
                    className="w-full h-[60vh] rounded-xl border-0"
                  />
                ) : (
                  <img
                    src={zoom.img || zoom.file}
                    alt={zoom.title}
                    className="max-h-[62vh] max-w-full rounded-xl object-contain"
                  />
                )}
              </div>

              {(zoom.file || zoom.img) && (
                <div className="flex justify-end gap-3 pt-1 flex-wrap">
                  <a
                    href={zoom.file || zoom.img}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isAr ? 'فتح في نافذة جديدة' : 'Open in New Tab'}</span>
                  </a>
                  <a
                    href={zoom.file || zoom.img}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تحميل المستند' : 'Download'}</span>
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}