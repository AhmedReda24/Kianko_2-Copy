import { useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { accreditations as localAccreditations } from '../../data/accreditations'; // ملف الاعتمادات الأصلي بتاعك
import SectionHeading from '../ui/SectionHeading';

export default function CertificatesSlider({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const reduce = useReducedMotion();
  const [dbCertifications, setDbCertifications] = useState([]);

  // جلب البيانات من سوبابيس (لوالديناميكي)
  useEffect(() => {
    async function loadCerts() {
      try {
        const { data } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          setDbCertifications(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
    loadCerts();
  }, []);

  const certificates = useMemo(() => {
    // 1. تحويل الاعتمادات الأصلية (اللي ملفاتها PDF أو صور) لتظهر في السلايدر
    const localCertsFormatted = (localAccreditations || []).map(item => ({
      id: item.id || Math.random(),
      code: item.code || 'APPROVE',
      titleEn: item.titleEn,
      titleAr: item.titleAr,
      descEn: item.descEn,
      descAr: item.descAr,
      img: item.file ? item.file.replace(/\.pdf$/i, '.webp') : '/Image/ISO-9001-2015.webp',
      file: item.file // ملف الـ PDF الأصلي
    }));

    // 2. مستندات قاعدة البيانات المضافة من لوحة التحكم
    const dynamicCerts = dbCertifications.map(item => ({
      id: item.id,
      code: item.code || 'APPROVE',
      titleEn: item.title,
      titleAr: item.title,
      descEn: item.issuer ? `Issuer/Project: ${item.issuer}` : 'Official project approval submittal.',
      descAr: item.issuer ? `الجهة / المشروع: ${item.issuer}` : 'اعتماد رسمي وموثق للمشروع.',
      img: item.file_url ? item.file_url.replace(/\.pdf$/i, '.webp') : '/Image/ISO-9001-2015.webp',
      file: item.file_url // رابط ملف الـ PDF أو الصورة
    }));

    // 3. شهادات الأيزو الثابتة الأساسية
    const defaultIso = [
      {
        id: 'iso-9001',
        code: 'ISO 9001:2015',
        titleEn: 'Quality Management System',
        titleAr: 'نظام إدارة الجودة العالمي',
        descEn: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
        descAr: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والتدلفين.',
        img: '/Image/ISO-9001-2015.webp',
        file: null
      },
      {
        id: 'iso-14001',
        code: 'ISO 14001:2015',
        titleEn: 'Environmental Management System',
        titleAr: 'نظام الإدارة البيئية',
        descEn: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
        descAr: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
        img: '/Image/ISO-14001-2015.webp',
        file: null
      },
      {
        id: 'iso-45001',
        code: 'ISO 45001:2018',
        titleEn: 'Occupational Health & Safety',
        titleAr: 'إدارة السلامة والصحة المهنية',
        descEn: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
        descAr: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
        img: '/Image/ISO-45001-2018.webp',
        file: null
      },
    ];

    // دمج الكل معاً (اعتماداتك الأصلية + اعتمادات قاعدة البيانات + الأيزو)
    return [...localCertsFormatted, ...dynamicCerts, ...defaultIso];
  }, [dbCertifications]);

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
    ? 'w-full text-center py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-[#C9252C] hover:text-white transition-all text-xs font-semibold min-h-[44px]'
    : 'w-full text-center py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 transition-all text-xs font-semibold min-h-[44px]';

  return (
    <section className={`border-y py-12 sm:py-20 transition-colors duration-300 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8 sm:mb-10 text-center sm:text-start">
          <div className="max-w-2xl px-2">
            <div className="flex justify-center sm:justify-start">
              <SectionHeading themeColor={themeColor} darkMode={darkMode}>
                {isAr ? 'الاعتمادات وشهادات الأيزو' : 'Accreditations & ISO Certificates'}
              </SectionHeading>
            </div>
            <p className={`mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
              {isAr
                ? 'اعتمادات وشهادات من جهات معتمدة تؤكد جودة منتجاتنا وسجل خبرتنا في المشاريع.'
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
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ms-4 sm:-ms-5">
            {certificates.map((c) => {
              const title = isAr ? (c.titleAr || c.titleEn) : (c.titleEn || c.titleAr);
              const desc = isAr ? (c.descAr || c.descEn) : (c.descEn || c.descAr);
              const fileUrl = c.file;
              const code = c.code || 'ISO';
              const previewImg = c.img;

              return (
                <div key={c.id || c.titleEn} className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 ps-4 sm:ps-5">
                  <div className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border transition-all duration-300 group ${cardBg}`}>
                    
                    <button
                      type="button"
                      onClick={() => setZoom({ ...c, img: previewImg })}
                      className="relative rounded-xl overflow-hidden border h-60 sm:h-64 flex items-center justify-center shadow-inner cursor-pointer p-2 bg-white w-full"
                      aria-label={`${title} — ${isAr ? 'تكبير' : 'enlarge'}`}
                    >
                      <img 
                        src={previewImg} 
                        alt={title} 
                        loading="lazy" 
                        decoding="async" 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/90 flex-col items-center justify-center gap-2 text-white p-4 hidden">
                        <FileText className="w-12 h-12 text-red-500" />
                        <span className="text-xs font-bold text-center">{title}</span>
                        <span className="text-[10px] text-slate-400">{isAr ? 'انقر للمعاينة أو التحميل' : 'Click to view'}</span>
                      </div>
                    </button>

                    <div className="space-y-2 text-start">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white bg-[#C9252C] inline-block shadow-xs">
                        {code}
                      </span>
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
                          onClick={() => setZoom({ ...c, img: previewImg })}
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
        </div>

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

      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
          >
            <motion.img
              src={zoom.img || (zoom.file ? zoom.file.replace(/\.pdf$/i, '.webp') : '')}
              alt={isAr ? zoom.titleAr : zoom.titleEn}
              className="max-h-[88vh] max-w-full rounded-lg bg-white object-contain shadow-2xl"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setZoom(null)}
              aria-label={isAr ? 'إغلاق التكبير' : 'Close Zoom'}
              className="absolute top-5 end-5 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}