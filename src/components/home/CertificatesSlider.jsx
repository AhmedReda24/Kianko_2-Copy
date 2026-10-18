import { useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { useCertificates } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

export default function CertificatesSlider({ isAr, themeColor = '#C9252C' }) {
  const reduce = useReducedMotion();
  const rawCertificates = useCertificates();

  // دمج صور الـ ISO الثلاث الحقيقية في أول ثلاثة كروت مع الحفاظ على باقي الكروت
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

  // إعداد التشغيل التلقائي (Autoplay) ليعمل بسلاسة
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
  const arrowCls = "grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 cursor-pointer";

  return (
    <section className="bg-[#061024] border-y border-blue-900/40 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        
        {/* تم تسنطير العنوان والوصف على الموبايل، ووضع الأسهم في مكان متناسق */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8 sm:mb-10 text-center sm:text-start">
          <div className="max-w-2xl px-2">
            <div className="flex justify-center sm:justify-start">
              <SectionHeading themeColor={themeColor}>
                {isAr ? 'الاعتمادات وشهادات الخبرة' : 'Accreditations & Experience Certificates'}
              </SectionHeading>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-slate-300 max-w-prose mx-auto sm:mx-0">
              {isAr
                ? 'اعتمادات وشهادات من جهات معتمدة تؤكد جودة منتجاتنا وسجل خبرتنا في المشاريع.'
                : 'Certificates from recognised bodies that back up our product quality and project track record.'}
            </p>
          </div>
          
          {/* أسهم التنقل متناسقة */}
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
              const Icon = c.type === 'experience' ? FileText : Award;
              const typeLabel =
                c.type === 'experience' ? (isAr ? 'شهادة خبرة' : 'Experience') : isAr ? 'اعتماد' : 'Accreditation';
              const title = isAr ? c.titleAr : c.title;

              return (
                <div key={c.id} className="min-w-0 shrink-0 grow-0 basis-[75%] sm:basis-1/2 lg:basis-1/4 ps-4 sm:ps-5">
                  {c.img ? (
                    <button
                      type="button"
                      onClick={() => setZoom(c)}
                      className="block w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg border border-blue-900/60 hover:-translate-y-1 transition-transform duration-300 cursor-pointer p-2"
                      aria-label={`${title} — ${isAr ? 'تكبير' : 'enlarge'}`}
                    >
                      <img src={c.img} alt={title} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                    </button>
                  ) : (
                    <div className="aspect-[3/4] rounded-2xl border border-blue-900/70 bg-[#0B1B3A] p-3 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                      <div className="h-full rounded-xl border border-dashed border-blue-400/30 flex flex-col items-center justify-center gap-4 px-4 text-center">
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: themeColor }} />
                        <span className="font-bold text-sm sm:text-base leading-snug text-white">{title}</span>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-xs sm:text-sm font-semibold text-blue-300">{typeLabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist">
          {certificates.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === selected}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === selected ? 28 : 8,
                backgroundColor: i === selected ? themeColor : 'rgba(255,255,255,0.25)',
              }}
            />
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
              src={zoom.img}
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
              className="absolute top-5 end-5 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}