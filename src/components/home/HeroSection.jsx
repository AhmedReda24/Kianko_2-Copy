import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Award, Layers, MapPin } from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import Sparks from './Sparks';

const EASE = [0.22, 1, 0.36, 1];

export default function HeroSection({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  const LETTERS = 'KIANKO'.split('');

  const quickLinks = [
    { to: ROUTES.products, icon: Layers, t: 'Our Solutions', tAr: 'منتجاتنا', s: 'Cable trays, rebar, profiles', sAr: 'حوامل كابلات، حديد تسليح، مقاطع' },
    { to: ROUTES.iso, icon: Award, t: 'Accreditations', tAr: 'الاعتمادات', s: 'Certified quality', sAr: 'جودة معتمدة' },
    { to: ROUTES.locations, icon: MapPin, t: 'Branches & Office', tAr: 'الفروع والمكتب', s: 'Where to find us', sAr: 'أماكن تواجدنا' },
  ];

  const heroOverlay = darkMode 
    ? 'from-[#07132B]/95 via-[#07132B]/85 to-[#07132B]/50'
    : 'from-slate-900/80 via-slate-900/60 to-slate-900/30';

  const heroTitleColor = 'text-white'; 
  const navBg = darkMode 
    ? 'border-white/15 bg-[#07132B]/90 text-white' 
    : 'border-slate-300 bg-slate-100/95 text-slate-900 shadow-md';

  const navItemHover = darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200/60';
  const divideCls = darkMode ? 'divide-white/10' : 'divide-slate-300';
  const subTextColor = darkMode ? 'text-blue-200/80' : 'text-slate-600';
  const mainLinkTitle = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden min-h-[720px] sm:min-h-[680px] lg:h-[760px] flex flex-col justify-center border-b transition-colors duration-300 pb-28 sm:pb-24 ${
        darkMode ? 'border-blue-900/40 bg-slate-950' : 'border-slate-300 bg-slate-200'
      }`}
    >
      <motion.div
        className="absolute inset-0 z-0 scale-[1.12]"
        style={reduce ? undefined : { y: videoY }}
      >
        <video 
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.webp"
          className={`w-full h-full object-cover transition-all duration-500 ${darkMode ? 'brightness-[0.45]' : 'brightness-[0.6]'}`}
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
          <track kind="captions" srcLang="ar" label="بدون صوت" default />
        </video>
      </motion.div>

      <div className={`absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l ${heroOverlay} z-10 transition-all duration-300`} />
      <Sparks />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-12 pb-12 text-center sm:text-start flex flex-col items-center sm:items-start"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          {...fade(0.1)}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider uppercase shadow-2xl mb-2"
          style={{ backgroundColor: themeColor }}
        >
          {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
        </motion.div>

        <h1 className={`mt-2 sm:mt-4 font-display font-black leading-[0.95] tracking-tight text-[3.8rem] sm:text-[6.5rem] lg:text-[9rem] drop-shadow-2xl ${heroTitleColor}`}>
          {isAr ? (
            <motion.span
              className="inline-block"
              initial={reduce ? false : { clipPath: 'inset(0 0 0 100%)', opacity: 0, y: 15 }}
              animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
            >
              كيانكو
            </motion.span>
          ) : (
            <span dir="ltr" className="inline-flex justify-center sm:justify-start relative">
              <span className="sr-only">KIANKO</span>
              <span aria-hidden="true" className="flex">
                {LETTERS.map((l, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.85, delay: 0.25 + i * 0.07, ease: EASE }}
                    >
                      {l}
                    </motion.span>
                  </span>
                ))}
              </span>
            </span>
          )}
        </h1>

        <motion.div
          className="h-1.5 w-28 sm:w-40 rounded-full my-3 sm:my-4"
          style={{ backgroundColor: themeColor }}
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
        />

        <motion.p
          {...fade(1.1)}
          className="mt-2 sm:mt-4 text-base sm:text-2xl text-slate-100 font-medium max-w-2xl leading-relaxed drop-shadow-lg px-2 sm:px-0"
        >
          {isAr
            ? 'تصنيع وتدلفين حديد التسليح، وحوامل وسلالم الكابلات والمقاطع المعدنية بأعلى جودة.'
            : 'Precision Steel Fabrication, Plastering and Block Accessories, and Heavy Duty Cable Management Manufacturing.'}
        </motion.p>

        <motion.div {...fade(1.25)} className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3.5 w-full sm:w-auto">
          <CtaLink to={ROUTES.products} themeColor={themeColor} darkMode={darkMode} className="w-full sm:w-auto justify-center">
            {isAr ? 'تصفح المنتجات' : 'Explore Products'}
          </CtaLink>
          <CtaLink to={ROUTES.locations} variant="glass" darkMode={darkMode} arrow={false} className="w-full sm:w-auto justify-center">
            {isAr ? 'فروعنا ومكاتبنا' : 'Our Locations'}
          </CtaLink>
        </motion.div>
      </motion.div>

      <motion.nav
        {...fade(1.5)}
        aria-label={isAr ? 'روابط سريعة' : 'Quick links'}
        className={`absolute bottom-0 inset-x-0 z-20 border-t backdrop-blur-md transition-colors duration-300 ${navBg}`}
      >
        <div className={`max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse ${divideCls}`}>
          {quickLinks.map(({ to, icon: Icon, t, tAr, s, sAr }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center justify-start gap-4 px-5 sm:px-6 py-3.5 sm:py-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${navItemHover}`}
            >
              <span
                className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 text-start">
                <span className={`block font-bold text-xs sm:text-sm ${mainLinkTitle}`}>{isAr ? tAr : t}</span>
                <span className={`block text-[11px] sm:text-xs truncate mt-0.5 ${subTextColor}`}>{isAr ? sAr : s}</span>
              </span>
            </Link>
          ))}
        </div>
      </motion.nav>
    </section>
  );
}