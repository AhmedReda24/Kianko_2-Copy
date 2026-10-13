import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { useCertificates } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

export default function CertificatesSlider({ isAr, themeColor }) {
  const reduce = useReducedMotion();
  const certificates = useCertificates();
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
  const arrowCls =
    'grid place-items-center h-11 w-11 rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <section className="bg-[#061024] border-y border-blue-900/40 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <SectionHeading themeColor={themeColor}>
              {isAr ? 'الاعتمادات وشهادات الخبرة' : 'Accreditations & Experience Certificates'}
            </SectionHeading>
            <p className="mt-4 text-slate-300 leading-relaxed">
              {isAr
                ? 'اعتمادات وشهادات من جهات معتمدة تؤكد جودة منتجاتنا وسجل خبرتنا في المشاريع.'
                : 'Certificates from recognised bodies that back up our product quality and project track record.'}
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => emblaApi?.scrollPrev()} className={arrowCls} aria-label={isAr ? 'السابق' : 'Previous'}>
              <Prev className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => emblaApi?.scrollNext()} className={arrowCls} aria-label={isAr ? 'التالي' : 'Next'}>
              <Next className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ms-5">
            {certificates.map((c) => {
              const Icon = c.type === 'experience' ? FileText : Award;
              const typeLabel =
                c.type === 'experience' ? (isAr ? 'شهادة خبرة' : 'Experience') : isAr ? 'اعتماد' : 'Accreditation';
              const title = isAr ? c.titleAr : c.title;

              return (
                <div key={c.id} className="min-w-0 shrink-0 grow-0 basis-[80%] sm:basis-1/2 lg:basis-1/4 ps-5">
                  {c.img ? (
                    <button
                      type="button"
                      onClick={() => setZoom(c)}
                      className="block w-full aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-xl border border-blue-900/60 hover:-translate-y-1 transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`${title} — ${isAr ? 'تكبير' : 'enlarge'}`}
                    >
                      <img src={c.img} alt={title} loading="lazy" className="w-full h-full object-contain" />
                    </button>
                  ) : (
                    <div className="aspect-[3/4] rounded-xl bg-[#0B1B3A] border border-blue-900/70 p-3 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-500 hover:shadow-2xl">
                      <div className="h-full rounded-lg border border-dashed border-blue-400/30 flex flex-col items-center justify-center gap-4 px-6 text-center">
                        <Icon className="w-12 h-12" style={{ color: themeColor }} />
                        <span className="font-bold text-white leading-snug">{title}</span>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-sm font-semibold text-blue-300">{typeLabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label={isAr ? 'الشرائح' : 'Slides'}>
          {certificates.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`${i + 1} / ${certificates.length}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-2 rounded-full transition-all duration-300"
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
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? zoom.titleAr : zoom.title}
          >
            <motion.img
              src={zoom.img}
              alt={isAr ? zoom.titleAr : zoom.title}
              className="max-h-[88vh] max-w-full rounded-lg bg-white object-contain"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setZoom(null)}
              className="absolute top-5 end-5 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
