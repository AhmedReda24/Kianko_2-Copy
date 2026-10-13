import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Award, Layers, MapPin, Phone } from 'lucide-react';
import heroVideo from "../../../assets/hero.mp4";
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import Sparks from './Sparks';
import { useLocations } from '../../hooks/useContent';

const LETTERS = 'KIANKO'.split('');
const EASE = [0.22, 1, 0.36, 1];

export default function HeroSection({ isAr, themeColor }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const locations = useLocations();
  const phone = (locations.find((l) => l.type === 'company') ?? locations[0]).phone;

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
      className="relative overflow-hidden h-[680px] lg:h-[740px] flex items-center border-b border-blue-900/40 bg-slate-950"
    >
      {/* الفيديو مع Parallax خفيف */}
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
          className="w-full h-full object-cover brightness-[0.5]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#07132B] via-[#07132B]/80 to-[#07132B]/30 z-10" />
      <Sparks />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pb-28 text-start"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          {...fade(0.1)}
          className="inline-flex items-center px-3.5 py-1.5 rounded-md text-white font-bold text-xs tracking-wider uppercase shadow-2xl"
          style={{ backgroundColor: themeColor }}
        >
          {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
        </motion.div>

        {/* اللحظة المميزة: الحروف بتطلع واحد ورا التاني وخط أحمر بيتمدد تحتها */}
        <h1 className="mt-6 font-display font-black text-white leading-[0.95] tracking-tight text-[4.5rem] sm:text-[7rem] lg:text-[9.5rem] drop-shadow-2xl">
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
          className="h-1.5 w-44 origin-left rtl:origin-right rounded-full"
          style={{ backgroundColor: themeColor }}
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
        />

        <motion.p
          {...fade(1.1)}
          className="mt-6 text-xl sm:text-2xl text-slate-100 font-medium max-w-2xl leading-relaxed drop-shadow-lg"
        >
          {isAr
            ? 'تصنيع وتدلفين حديد التسليح، وحوامل وسلالم الكابلات والمقاطع المعدنية بأعلى جودة.'
            : 'Precision Steel Fabrication, Rebar Rolling, and Heavy Duty Cable Management Manufacturing.'}
        </motion.p>

        <motion.div {...fade(1.25)} className="pt-8 flex flex-wrap items-center gap-4">
          <CtaLink to={ROUTES.products} themeColor={themeColor}>
            {isAr ? 'تصفح المنتجات' : 'Explore Products'}
          </CtaLink>
          <CtaLink to={ROUTES.locations} variant="glass" arrow={false}>
            {isAr ? 'فروعنا ومكاتبنا' : 'Our Locations'}
          </CtaLink>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="group inline-flex items-center gap-3 text-white font-bold px-2 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-colors duration-300 group-hover:border-transparent" style={{ '--c': themeColor }}>
              <Phone className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" style={{ color: themeColor }} />
            </span>
            <span dir="ltr" className="underline-offset-4 group-hover:underline">{phone}</span>
          </a>
        </motion.div>
      </motion.div>

      {/* شريط روابط سريعة أسفل الهيرو (زي موقع Unitech) */}
      <motion.nav
        {...fade(1.5)}
        aria-label={isAr ? 'روابط سريعة' : 'Quick links'}
        className="absolute bottom-0 inset-x-0 z-20 border-t border-white/15 bg-[#07132B]/75 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
          {quickLinks.map(({ to, icon: Icon, t, tAr, s, sAr }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 px-6 py-4 transition-colors duration-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              <span
                className="grid place-items-center h-11 w-11 rounded-lg text-white shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: themeColor }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 hidden sm:block">
                <span className="block font-bold text-white text-sm">{isAr ? tAr : t}</span>
                <span className="block text-xs text-blue-200/80 truncate">{isAr ? sAr : s}</span>
              </span>
              <span className="font-bold text-white text-sm sm:hidden">{isAr ? tAr : t}</span>
            </Link>
          ))}
        </div>
      </motion.nav>
    </section>
  );
}
