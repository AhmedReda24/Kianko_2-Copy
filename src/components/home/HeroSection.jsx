import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Award, Layers, MapPin } from 'lucide-react';
import heroVideo from "../../../assets/hero.mp4";
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import Sparks from './Sparks';

const LETTERS = 'KIANKO'.split('');
const EASE = [0.22, 1, 0.36, 1];

export default function HeroSection({ isAr, themeColor }) {
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

  const quickLinks = [
    { to: ROUTES.products, icon: Layers, t: 'Our Solutions', tAr: 'منتجاتنا', s: 'Cable trays, rebar, profiles', sAr: 'حوامل كابلات، حديد تسليح، مقاطع' },
    { to: ROUTES.iso, icon: Award, t: 'Accreditations', tAr: 'الاعتمادات', s: 'Certified quality', sAr: 'جودة معتمدة' },
    { to: ROUTES.locations, icon: MapPin, t: 'Branches & Office', tAr: 'الفروع والمكتب', s: 'Where to find us', sAr: 'أماكن تواجدنا' },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[720px] sm:min-h-[680px] lg:h-[760px] flex flex-col justify-center border-b border-blue-900/40 bg-slate-950 pb-28 sm:pb-24"
    >
      {/* خلفية الفيديو */}
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
          className="w-full h-full object-cover brightness-[0.45]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#07132B]/95 via-[#07132B]/85 to-[#07132B]/50 z-10" />
      <Sparks />

      {/* المحتوى الرئيسي مع ضبط التوسيط التام للشاشات الصغيرة */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-12 pb-16 text-center sm:text-start flex flex-col items-center sm:items-start"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          {...fade(0.1)}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider uppercase shadow-2xl mb-2"
          style={{ backgroundColor: themeColor }}
        >
          {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
        </motion.div>

        {/* العنوان الرئيسي */}
        <h1 className="mt-2 sm:mt-4 font-display font-black text-white leading-[0.95] tracking-tight text-[3.8rem] sm:text-[6.5rem] lg:text-[9rem] drop-shadow-2xl">
          <span dir="ltr" className="inline-flex justify-center sm:justify-start" aria-label="KIANKO">
            {LETTERS.map((l, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em]">
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
            : 'Precision Steel Fabrication, Rebar Rolling, and Heavy Duty Cable Management Manufacturing.'}
        </motion.p>

        {/* الأزرار مع توسيطها وفصلها عن الكروت السفلية */}
        <motion.div {...fade(1.25)} className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3.5 w-full sm:w-auto">
          <CtaLink to={ROUTES.products} themeColor={themeColor} className="w-full sm:w-auto justify-center">
            {isAr ? 'تصفح المنتجات' : 'Explore Products'}
          </CtaLink>
          <CtaLink to={ROUTES.locations} variant="glass" arrow={false} className="w-full sm:w-auto justify-center">
            {isAr ? 'فروعنا ومكاتبنا' : 'Our Locations'}
          </CtaLink>
        </motion.div>
      </motion.div>

      {/* شريط الكروت السفلية الثلاثة - مع مسافة احترافية ومظهر متناسق */}
      <motion.nav
        {...fade(1.5)}
        aria-label={isAr ? 'روابط سريعة' : 'Quick links'}
        className="absolute bottom-0 inset-x-0 z-20 border-t border-white/15 bg-[#07132B]/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
          {quickLinks.map(({ to, icon: Icon, t, tAr, s, sAr }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center justify-start gap-4 px-5 sm:px-6 py-3.5 sm:py-4 transition-colors duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              <span
                className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 text-start">
                <span className="block font-bold text-white text-xs sm:text-sm">{isAr ? tAr : t}</span>
                <span className="block text-[11px] sm:text-xs text-blue-200/80 truncate mt-0.5">{isAr ? sAr : s}</span>
              </span>
            </Link>
          ))}
        </div>
      </motion.nav>
    </section>
  );
}