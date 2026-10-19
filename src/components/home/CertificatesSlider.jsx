import { useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { useCertificates } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

export default function CertificatesSlider({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const reduce = useReducedMotion();
  const rawCertificates = useCertificates();

  const certificates = useMemo(() => {
    const isoImages = [
      '/Image/ISO-9001-2015.webp',
      '/Image/ISO-14001-2015.webp',
      '/Image/ISO-45001-2018.webp',
    ];

    return rawCertificates.map((cert, index) => {
      if (index < 3 && isoImages[index]) {
        return {
          ...cert,
          img: isoImages[index],
        };
      }
      return cert;
    });
  }, [rawCertificates]);

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
    : 'w-full text-center py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-[#C9252C] hover:text-white transition-all text-xs font-semibold min-h-[44px]';

  return (
    <section className={`border-y py-12 sm:py-20 transition-colors duration-300 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8 sm:mb-10 text-center sm:text-start">
          <div className="max-w-2xl px-2">
            <div className="flex justify-center sm:justify-start">
              <SectionHeading themeColor={themeColor} darkMode={darkMode}>
                {isAr ? 'الاعتمادات وشهادات الخبرة' : 'Accreditations & Experience Certificates'}
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
              const title = isAr ? (c.titleAr || c.nameAr) : (c.titleEn || c.name);
              const desc = isAr ? (c.descAr || c.summaryAr) : (c.descEn || c.summaryEn);
              const fileUrl = c.file || c.datasheet;
              const code = c.code || 'ISO';

              const previewImg = c.img || (fileUrl ? fileUrl.replace(/\.pdf$/i, '.webp') : null);

              return (
                <div key={c.id || c.title} className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 ps-4 sm:ps-5">
                  <div className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border transition-all duration-300 group ${cardBg}`}>
                    
                    {/* زرار معاينة مع معالجة ذكية لو الصورة مش موجودة */}
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
                          // لو صورة الـ webp مش موجودة في السيرفر، اخفي الصورة وعرض أيقونة مستند راقية بدلها
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      {/* واجهة بديلة تظهر فوراً لو الصورة فشلت في التحميل عشان ميبانش شكل تالف */}
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
                        {desc || (isAr ? 'مستند اعتماد رسمي وموثق للمشاريع.' : 'Official accreditation and project document.')}
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

        <div className="mt-8 flex justify-center gap-1.5" role="tablist" aria-label={isAr ? 'أزرار التنقل' : 'Pagination'}>
          {certificates.map((c, i) => (
            <button
              key={c.id || i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={isAr ? `الانتقال للشهادة ${i + 1}` : `Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="flex items-center justify-center h-10 min-w-[44px] px-2 cursor-pointer"
            >
              <span
                className="block h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === selected ? 28 : 8,
                  backgroundColor: i === selected ? themeColor : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'),
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
              alt={isAr ? zoom.titleAr : zoom.title}
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