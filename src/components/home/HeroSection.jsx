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
      className="relative overflow-hidden min-h-[620px] lg:h-[740px] flex items-center border-b border-blue-900/40 bg-slate-950"
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
          className="w-full h-full object-cover brightness-[0.45]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#07132B]/95 via-[#07132B]/80 to-[#07132B]/40 z-10" />
      <Sparks />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-16 pb-32 sm:pb-28 text-start"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          {...fade(0.1)}
          className="inline-flex items-center px-3.5 py-1.5 rounded-md text-white font-bold text-xs tracking-wider uppercase shadow-2xl"
          style={{ backgroundColor: themeColor }}
        >
          {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
        </motion.div>

        <h1 className="mt-4 sm:mt-6 font-display font-black text-white leading-[0.95] tracking-tight text-[3.8rem] sm:text-[7rem] lg:text-[9.5rem] drop-shadow-2xl">
          <span dir="ltr" className="inline-flex" aria-label="KIANKO">
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
          className="h-1.5 w-32 sm:w-44 origin-left rtl:origin-right rounded-full"
          style={{ backgroundColor: themeColor }}
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
        />

        <motion.p
          {...fade(1.1)}
          className="mt-4 sm:mt-6 text-lg sm:text-2xl text-slate-100 font-medium max-w-2xl leading-relaxed drop-shadow-lg"
        >
          {isAr
            ? 'تصنيع وتدلفين حديد التسليح، وحوامل وسلالم الكابلات والمقاطع المعدنية بأعلى جودة.'
            : 'Precision Steel Fabrication, Rebar Rolling, and Heavy Duty Cable Management Manufacturing.'}
        </motion.p>

        <motion.div {...fade(1.25)} className="pt-6 sm:pt-8 flex flex-wrap items-center gap-4">
          <CtaLink to={ROUTES.products} themeColor={themeColor}>
            {isAr ? 'تصفح المنتجات' : 'Explore Products'}
          </CtaLink>
          <CtaLink to={ROUTES.locations} variant="glass" arrow={false}>
            {isAr ? 'فروعنا ومكاتبنا' : 'Our Locations'}
          </CtaLink>
        </motion.div>
      </motion.div>

      <motion.nav
        {...fade(1.5)}
        aria-label={isAr ? 'روابط سريعة' : 'Quick links'}
        className="absolute bottom-0 inset-x-0 z-20 border-t border-white/15 bg-[#07132B]/85 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
          {quickLinks.map(({ to, icon: Icon, t, tAr, s, sAr }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3.5 px-4 sm:px-6 py-3.5 sm:py-4 transition-colors duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              <span
                className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 flex-1">
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