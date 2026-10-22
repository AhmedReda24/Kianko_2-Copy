import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../routes';
import SectionHeading from '../ui/SectionHeading';

const areas = [
  {
    title: 'Cable Management',
    titleAr: 'أنظمة إدارة الكابلات',
    text: 'Heavy-duty perforated cable trays, wire mesh baskets, ladders, and trunking fabricated to project specifications.',
    textAr: 'حوامل كابلات مثقبة وشبكية، سلالم كابلات ثقيلة، ومجاري ترنكنج مصنّعة حسب مواصفات كل مشروع.',
    img: '/Image/expertise-cable-management.webp',
    fallbackImg: '/Image/ladder.webp',
  },
  {
    title: 'Plastering Profiles',
    titleAr: 'مقاطع وإكسسوارات المحارة',
    text: 'Expanded metal mesh, corner beads, and precision profiles for clean, durable, and crack-resistant wall finishing.',
    textAr: 'شبك معدني ممدد وزوايا ومقاطع محارة قياسية لتشطيبات نظيفة ومقاومة للشروخ للحوائط والأركان.',
    img: '/Image/plastering.webp',
    fallbackImg: '/Image/Corner.webp',
  },
  {
    title: 'Blockwork & Framing',
    titleAr: 'ملحقات البلوك والهياكل المعدنية',
    text: 'Structural C-channels, drywall framing systems, and masonry accessories engineered for high-stability construction.',
    textAr: 'قطاعات سي شانل، هياكل الجبس بورد، وملحقات تقوية وتثبيت المباني والطوب بأعلى دقة هندسية.',
    img: '/Image/expertise-plastering-accessories.webp',
    fallbackImg: '/Image/C-Channels.webp',
  },
  {
    title: 'Hot-Dip Galvanizing',
    titleAr: 'الجلفنة على الساخن',
    text: 'High-durability zinc coating that protects steel systems against corrosion in harsh industrial environments.',
    textAr: 'تغطية بطبقة زنك عالية الكثافة تحمي الأنظمة والقطاعات الفولاذية من الصدأ والتآكل في أصعب بيئات التشغيل.',
    img: '/Image/expertise-galvanizing-plant.webp',
    fallbackImg: '/Image/channels.webp',
  },
];

export default function ExpertiseSection({ isAr, lang, themeColor = '#C9252C', darkMode = true }) {
  const isArabic = typeof isAr === 'boolean' ? isAr : lang === 'ar';
  const pick = (en, ar) => (isArabic ? ar : en);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  // تحميل خط IBM Plex Sans Arabic تلقائياً
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

  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = darkMode ? 'bg-[#061024]' : 'bg-slate-900 shadow-xl';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start overflow-x-hidden"
    >
      {/* ترويسة القسم */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-8 sm:mb-10 px-1"
      >
        <div className="flex justify-center sm:justify-start">
          <SectionHeading themeColor={themeColor} darkMode={darkMode}>
            {pick('Areas of Expertise', 'مجالات خبرتنا')}
          </SectionHeading>
        </div>
        <p className={`mt-3 sm:mt-4 leading-relaxed text-xs sm:text-base max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
          {pick(
            'From cable management systems to plastering profiles, structural framing, and hot-dip galvanizing, we supply the steel solutions major projects demand.',
            'من أنظمة حوامل الكابلات ومقاطع المحارة والبلوك إلى الجلفنة على الساخن، نغطي كافة احتياجات المشاريع من الصُلب بجودة قياسية ثابتة.'
          )}
        </p>
      </motion.div>

      {/* شبكة البطاقات: عمود في الفون، شبكتان 2x2 في التابلت، وأكورديون متمدد في اللابتوب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-3.5 sm:gap-4 lg:h-[460px]">
        {areas.map((a, i) => {
          const isActive = active === i;

          return (
            <Link
              key={a.title}
              to={ROUTES.products}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ flexGrow: isActive ? 3.6 : 1 }}
              aria-label={pick(`Explore ${a.title} products`, `تصفح منتجات ${a.titleAr}`)}
              className={`group relative isolate h-64 sm:h-72 lg:h-auto lg:basis-0 min-w-0 overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${cardBg}`}
            >
              {/* حاوية الصورة مثبتة على dir="ltr" وممتدة بـ 8px خارج الحواف لمنع ظهور أي خط أبيض في الـ RTL */}
              <div dir="ltr" className="absolute inset-0 overflow-hidden rounded-2xl">
                <img
                  src={a.img}
                  alt={pick(a.title, a.titleAr)}
                  width="800"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (a.fallbackImg) e.currentTarget.src = a.fallbackImg;
                  }}
                  className={`absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] max-w-none object-cover object-center transition-transform duration-700 ease-out ${
                    isActive ? 'scale-100' : 'scale-105 group-hover:scale-100'
                  }`}
                />
              </div>

              {/* طبقة التعتيم والتدرج اللوني (بدلاً من فلتر brightness الذي يسبب خط الحافة في Chrome) */}
              <div
                className={`pointer-events-none absolute -inset-1 z-10 transition-colors duration-500 bg-gradient-to-t ${
                  isActive
                    ? 'bg-black/25 from-[#050D1E] via-[#061024]/55 to-transparent'
                    : 'bg-black/50 max-lg:bg-black/30 from-[#050D1E] via-[#061024]/70 to-black/30'
                }`}
              />

              {/* طوق الإطار الداخلي لحماية الزوايا والحواف */}
              <div
                className={`pointer-events-none absolute inset-0 z-20 rounded-2xl border ${
                  darkMode
                    ? 'border-blue-900/70 shadow-[inset_0_0_0_1px_#061024]'
                    : 'border-slate-300/80 shadow-[inset_0_0_0_1px_#0f172a]'
                }`}
              />

              {/* رقم القسم في الأعلى */}
              <span
                aria-hidden="true"
                dir="ltr"
                className={`absolute top-4 start-5 z-20 font-display text-3xl sm:text-4xl lg:text-5xl font-black transition-colors duration-500 ${
                  isActive ? 'text-white/75' : 'text-white/35 group-hover:text-white/70'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* الشريط العلوي المميز للبطاقة النشطة */}
              <div
                className="pointer-events-none absolute top-0 inset-x-0 h-1 z-30 transition-opacity duration-500"
                style={{ backgroundColor: themeColor, opacity: isActive ? 1 : 0 }}
              />

              {/* المحتوى النصي أسفل البطاقة */}
              <div
                dir={isArabic ? 'rtl' : 'ltr'}
                className="absolute bottom-0 inset-x-0 p-4 sm:p-5 lg:p-6 z-30 text-start"
              >
                <h3 className="text-base sm:text-lg lg:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
                  {pick(a.title, a.titleAr)}
                </h3>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isActive
                      ? 'lg:max-h-44 lg:opacity-100'
                      : 'lg:max-h-0 lg:opacity-0'
                  }`}
                >
                  <p className="mt-2 text-xs sm:text-sm text-slate-100 leading-relaxed max-w-md drop-shadow line-clamp-3">
                    {pick(a.text, a.textAr)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white drop-shadow group-hover:underline underline-offset-4">
                    <span>{pick('View Products', 'تعرّف على المنتجات')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" style={{ color: themeColor }} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}