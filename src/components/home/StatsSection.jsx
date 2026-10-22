import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import AnimatedCounter from '../AnimatedCounter';
import TiltCard from '../ui/TiltCard';

const stats = [
  {
    value: 3,
    prefix: '+',
    title: 'Locations & Hubs',
    titleAr: 'مواقع ومراكز إقليمية',
    subtitle: 'Jeddah & Riyadh — Across the Region',
    subtitleAr: 'جدة والرياض — تغطية شاملة في المنطقة',
    img: '/Image/stats-locations.webp',
    fallbackImg: '/Image/factory-main.webp',
  },
  {
    value: 300,
    prefix: '+',
    title: 'Building Solutions',
    titleAr: 'منتج وحل هندسي',
    subtitle: 'Engineered Steel & Cable Systems',
    subtitleAr: 'أنظمة حوامل كابلات ومقاطع حديدية هندسية',
    img: '/Image/stats-solutions.webp',
    fallbackImg: '/Image/basket.webp',
  },
  {
    value: 3,
    prefix: '',
    title: 'Main Activities',
    titleAr: 'أنشطة صناعية رئيسية',
    subtitle: 'Design, Manufacture, & Supply',
    subtitleAr: 'التصميم الهندسي، التصنيع، والتوريد',
    img: '/Image/stats-activities.webp',
    fallbackImg: '/Image/ladder.webp',
  },
  {
    value: 14,
    prefix: '+',
    title: 'Major Approvals & Projects',
    titleAr: 'اعتماداً ومشروعاً استراتيجياً',
    subtitle: 'Across Saudi Arabia & MENA Region',
    subtitleAr: 'في المملكة العربية السعودية والشرق الأوسط',
    img: '/Image/stats-projects.webp',
    fallbackImg: '/Image/channels.webp',
  },
];

export default function StatsSection({ isAr, lang, themeColor = '#C9252C', darkMode = true }) {
  const isArabic = typeof isAr === 'boolean' ? isAr : lang === 'ar';
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

  const overlayGradient = darkMode
    ? 'bg-gradient-to-t from-[#050D1E] via-[#061024]/75 to-black/35'
    : 'bg-gradient-to-t from-slate-950 via-slate-900/70 to-black/25';

  const subtitleColor = darkMode ? 'text-blue-200' : 'text-slate-200';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard
              className={`relative isolate h-52 sm:h-60 lg:h-64 rounded-2xl overflow-hidden group shadow-2xl select-none ${
                darkMode ? 'bg-[#07132B]' : 'bg-slate-900'
              }`}
            >
              {/* طبقة الصورة مثبتة على dir="ltr" وممتدة بـ 8px خارج الحواف لمنع ظهور أي خط أبيض عند الـ Hover */}
              <div dir="ltr" className="absolute inset-0 overflow-hidden rounded-2xl">
                <img
                  src={item.img}
                  alt={isArabic ? item.titleAr : item.title}
                  width="600"
                  height="400"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (item.fallbackImg) e.currentTarget.src = item.fallbackImg;
                  }}
                  className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] max-w-none object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* طبقة التعتيم والتدرج اللوني */}
              <div className={`pointer-events-none absolute -inset-1 z-10 ${overlayGradient}`} />

              {/* طوق داخلي يغلق حواف الكارت بالكامل */}
              <div
                className={`pointer-events-none absolute inset-0 z-20 rounded-2xl border ${
                  darkMode
                    ? 'border-blue-900/70 shadow-[inset_0_0_0_1px_#061024]'
                    : 'border-slate-300/80 shadow-[inset_0_0_0_1px_#0f172a]'
                }`}
              />

              {/* الشريط السفلي المتحرك عند الوقوف على الكارت */}
              <div
                className="pointer-events-none absolute bottom-0 inset-x-0 h-1 origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-30"
                style={{ backgroundColor: themeColor }}
              />

              {/* محتوى الرقم والنص متجاوب مع شاشات الفون والتابلت واللابتوب */}
              <div
                dir={isArabic ? 'rtl' : 'ltr'}
                className="absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 z-30 text-start"
              >
                <h3 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-white">
                  <span
                    dir="ltr"
                    className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-none drop-shadow-md inline-block"
                    style={{ color: '#ffffff' }}
                  >
                    <AnimatedCounter value={item.value} prefix={item.prefix} />
                  </span>
                  <span className="text-base sm:text-xl lg:text-2xl font-extrabold drop-shadow-md leading-snug">
                    {isArabic ? item.titleAr : item.title}
                  </span>
                </h3>

                <p className={`mt-1 sm:mt-1.5 text-xs sm:text-sm font-medium drop-shadow leading-relaxed ${subtitleColor}`}>
                  {isArabic ? item.subtitleAr : item.subtitle}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}