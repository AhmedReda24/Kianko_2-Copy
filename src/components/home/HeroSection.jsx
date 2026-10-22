import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import {
  Award, Layers, MapPin, Building2, ShieldCheck,
  CheckCircle2, ArrowUpLeft, ArrowUpRight
} from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import Sparks from './Sparks';

const EASE = [0.22, 1, 0.36, 1];
const LETTERS = 'KIANKO'.split('');

export default function HeroSection({ isAr, lang, themeColor = '#C9252C', darkMode = true }) {
  const isArabic = typeof isAr === 'boolean' ? isAr : lang === 'ar';
  const pick = (en, ar) => (isArabic ? ar : en);

  const ref = useRef(null);
  const reduce = useReducedMotion();

  // تحميل وتطبيق خط IBM Plex Sans Arabic تلقائياً
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

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  const trustHighlights = [
    {
      en: 'ISO 9001 • 14001 • 45001 Certified',
      ar: 'حاصلون على شهادات ISO 9001 • 14001 • 45001',
    },
    {
      en: '13 Specialized Production Lines',
      ar: '13 خط إنتاج صناعي وهندسي متكامل',
    },
    {
      en: 'Approved in KSA Mega Projects',
      ar: 'معتمدون في كبرى مشاريع المملكة ورؤية 2030',
    },
  ];

  const quickLinks = [
    {
      to: ROUTES.products,
      icon: Layers,
      t: 'Our Solutions (13 Lines)',
      tAr: 'منتجاتنا (13 خط إنتاج)',
      s: 'Cable trays, ladders & building profiles',
      sAr: 'حوامل وسلالم الكابلات والمقاطع المعدنية',
    },
    {
      to: ROUTES.iso,
      icon: Award,
      t: 'ISO & Accreditations',
      tAr: 'الشهادات والاعتمادات',
      s: 'Certified global quality & PQL',
      sAr: 'شهادات أيزو واعتمادات رسمية موثقة',
    },
    {
      to: ROUTES.projects,
      icon: Building2,
      t: 'Regional Projects',
      tAr: 'المشاريع الإقليمية',
      s: 'NEOM, Aramco & mega developments',
      sAr: 'سجل التوريد في نيوم وأرامكو والمشاريع الكبرى',
    },
    {
      to: ROUTES.locations,
      icon: MapPin,
      t: 'Branches & Offices',
      tAr: 'الفروع والمكاتب',
      s: 'Jeddah Head Office & Riyadh Branch',
      sAr: 'المكتب الرئيسي بجدة وفرع الرياض',
    },
  ];

  const heroOverlay = darkMode
    ? 'from-[#050E22]/95 via-[#07132B]/85 to-[#07132B]/55'
    : 'from-slate-950/90 via-slate-900/75 to-slate-900/45';

  const navBg = darkMode
    ? 'border-white/15 bg-[#07132B]/92 text-white'
    : 'border-slate-300 bg-white/95 text-slate-900 shadow-lg';

  const navItemHover = darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100';
  const divideCls = darkMode ? 'divide-white/10' : 'divide-slate-200';
  const subTextColor = darkMode ? 'text-blue-200/80' : 'text-slate-600';
  const mainLinkTitle = darkMode ? 'text-white' : 'text-slate-900';
  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      ref={ref}
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className={`relative overflow-hidden min-h-[calc(100vh-5rem)] flex flex-col justify-between border-b transition-colors duration-300 ${
        darkMode ? 'border-blue-900/40 bg-slate-950' : 'border-slate-300 bg-slate-900'
      }`}
    >
      {/* خلفية الفيديو */}
      <motion.div
        className="absolute inset-0 z-0 scale-[1.08]"
        style={reduce ? undefined : { y: videoY }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.webp"
          className={`w-full h-full object-cover transition-all duration-500 ${
            darkMode ? 'brightness-[0.42]' : 'brightness-[0.52]'
          }`}
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* التدرج اللوني فوق الفيديو لضمان وضوح النصوص 100% */}
      <div
        className={`absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l ${heroOverlay} z-10 transition-all duration-300 pointer-events-none`}
      />
      <Sparks />

      {/* المحتوى الرئيسي للهيرو (يتوسط المساحة المتاحة بأمان دون أن يصطدم بالشريط السفلي) */}
      <div className="relative z-20 flex-1 flex items-center w-full py-10 sm:py-14 lg:py-16">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-start flex flex-col items-center sm:items-start"
          style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          {/* شارة اسم الشركة العلوية */}
          <motion.div
            {...fade(0.1)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white font-bold text-xs sm:text-sm tracking-wide shadow-2xl mb-3 border border-white/15"
            style={{ backgroundColor: themeColor }}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              {pick(
                'KIANKO STEEL INDUSTRIES — SAUDI ARABIA',
                'شركة كيانكو للصناعات الحديدية — المملكة العربية السعودية'
              )}
            </span>
          </motion.div>

          {/* العنوان الرئيسي الضخم (متجاوب على الموبايل والتابلت واللابتوب بدون قص للنقاط العربية) */}
          <h1 className="mt-1 font-black tracking-tight text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white drop-shadow-2xl">
            {isArabic ? (
              <motion.span
                className="inline-block leading-[1.18] py-1"
                initial={reduce ? false : { clipPath: 'inset(-15% -5% -15% 100%)', opacity: 0, y: 14 }}
                animate={{ clipPath: 'inset(-15% -5% -15% 0%)', opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
              >
                كيانكو
              </motion.span>
            ) : (
              <span dir="ltr" className="inline-flex justify-center sm:justify-start relative leading-none">
                <span className="sr-only">KIANKO</span>
                <span aria-hidden="true" className="flex">
                  {LETTERS.map((l, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                      <motion.span
                        className="inline-block"
                        initial={reduce ? false : { y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}
                      >
                        {l}
                      </motion.span>
                    </span>
                  ))}
                </span>
              </span>
            )}
          </h1>

          {/* الخط الأحمر الفاصل */}
          <motion.div
            className="h-1.5 w-28 sm:w-44 rounded-full my-3 sm:my-4"
            style={{ backgroundColor: themeColor }}
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.85, delay: 0.75, ease: 'easeOut' }}
          />

          {/* الوصف الهندسي الدقيق */}
          <motion.p
            {...fade(0.9)}
            className="mt-1 sm:mt-2 text-sm sm:text-xl lg:text-2xl text-slate-100 font-semibold max-w-3xl leading-relaxed drop-shadow-lg px-1 sm:px-0"
          >
            {pick(
              'Precision Steel Manufacturing, Heavy-Duty Cable Management Systems (Cable Trays, Ladders & Trunking), Structural C-Channels, and Plastering & Blockwork Accessories.',
              'ريادة صناعية وهندسية في تصنيع ودرفلة أنظمة حوامل وسلالم الكابلات، مجاري الترنكنج، القطاعات المعدنية (C-Channels)، وهياكل الجبس بورد وملحقات المحارة والبلوك بأعلى معايير الجودة العالمية.'
            )}
          </motion.p>

          {/* شارات الثقة والاعتماد السريعة */}
          <motion.div
            {...fade(1.05)}
            className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3"
          >
            {trustHighlights.map((item) => (
              <span
                key={item.en}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/65 border border-white/15 text-slate-100 text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{pick(item.en, item.ar)}</span>
              </span>
            ))}
          </motion.div>

          {/* أزرار الدعوة لاتخاذ إجراء (CTA Buttons) */}
          <motion.div
            {...fade(1.2)}
            className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3.5 w-full sm:w-auto"
          >
            <CtaLink
              to={ROUTES.products}
              themeColor={themeColor}
              darkMode={darkMode}
              className="w-full sm:w-auto justify-center"
            >
              {pick('Explore Products (13 Lines)', 'تصفح كتالوج المنتجات')}
            </CtaLink>
            <CtaLink
              to={ROUTES.contact}
              variant="glass"
              darkMode={darkMode}
              arrow={false}
              className="w-full sm:w-auto justify-center"
            >
              {pick('Request Project Quotation', 'اطلب عرض سعر لمشروعك')}
            </CtaLink>
          </motion.div>
        </motion.div>
      </div>

      {/* الشريط السفلي للروابط السريعة (يستقر في أسفل السكشن بدون أن يغطي المحتوى في الموبايل) */}
      <motion.nav
        {...fade(1.35)}
        aria-label={pick('Quick links', 'روابط سريعة')}
        className={`relative z-20 w-full mt-auto border-t backdrop-blur-md transition-colors duration-300 ${navBg}`}
      >
        <div
          className={`max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse ${divideCls}`}
        >
          {quickLinks.map(({ to, icon: Icon, t, tAr, s, sAr }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${navItemHover}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0 text-start">
                  <span className={`block font-extrabold text-xs sm:text-sm truncate ${mainLinkTitle}`}>
                    {pick(t, tAr)}
                  </span>
                  <span className={`block text-[11px] sm:text-xs truncate mt-0.5 ${subTextColor}`}>
                    {pick(s, sAr)}
                  </span>
                </span>
              </div>
              <ArrowIcon className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
            </Link>
          ))}
        </div>
      </motion.nav>
    </section>
  );
}