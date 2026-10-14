import { motion, useReducedMotion } from 'motion/react';
import { Factory, PencilRuler, Truck } from 'lucide-react';
import logoImg from "../../../assets/logo.png";
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import SectionHeading from '../ui/SectionHeading';
import SpotlightCard from '../ui/SpotlightCard';

const pillars = [
  {
    icon: PencilRuler,
    t: 'Design', tAr: 'التصميم',
    d: 'Engineering support that turns project specifications into buildable steel solutions.',
    dAr: 'دعم هندسي يحوّل مواصفات المشروع إلى حلول صلب قابلة للتنفيذ.',
  },
  {
    icon: Factory,
    t: 'Manufacture', tAr: 'التصنيع',
    d: 'Precision fabrication, rebar rolling and hot-dip galvanizing under one roof.',
    dAr: 'تصنيع دقيق وتدلفين حديد التسليح وجلفنة على الساخن في مكان واحد.',
  },
  {
    icon: Truck,
    t: 'Supply', tAr: 'التوريد',
    d: 'Reliable delivery of cable management, plaster profiles and structural products.',
    dAr: 'توريد منتظم لأنظمة الكابلات ومقاطع المحارة والمنتجات الإنشائية.',
  },
];

export default function AboutSection({ isAr, themeColor }) {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-start space-y-12 sm:space-y-14">
      <SectionHeading themeColor={themeColor}>{isAr ? 'من نحن' : 'About Us'}</SectionHeading>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/60 bg-slate-900 group"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Kianko Factory"
            loading="lazy"
            className="w-full h-[280px] sm:h-[400px] lg:h-[450px] object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 start-4 sm:top-6 sm:start-6 bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-200">
            <img src={logoImg} alt="Kianko Logo" className="h-9 sm:h-12 w-auto object-contain" />
          </div>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            KIANKO COMPANY
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-prose">
            {isAr
              ? 'باعتبارها الرائدة في تصنيع وتشكيل الصُلب بدقة عالية، تقدم كيانكو حوامل وسلالم الكابلات الهندسية ومقاطع المحارة وأنظمة الجلفنة على الساخن المصممة خصيصاً لتلبي احتياجات المشاريع الكبرى.'
              : 'As the manufacturing leader in precision steel fabrication, Kianko delivers engineered cable management trays, heavy-duty ladders, hot-dip galvanization, and plaster profile systems engineered to satisfy modern construction specifications.'}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-prose">
            {isAr
              ? 'تعمل كيانكو وفق المعايير الدولية لترسيخ مكانتها كشريك موثوق للحلول الهيكلية عالية الأداء في كافة التطبيقات الصناعية والتجارية.'
              : 'Operating to global standards, Kianko reinforces its position as a trusted partner for durable, high-performance structural solutions across major commercial and industrial developments.'}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap gap-4">
            <CtaLink to={ROUTES.story} themeColor={themeColor}>
              {isAr ? 'اقرأ قصتنا' : 'Read Our Story'}
            </CtaLink>
            <CtaLink to={ROUTES.contact} variant="glass" arrow={false}>
              {isAr ? 'تواصل مع كيانكو' : 'Reach KIANKO'}
            </CtaLink>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map(({ icon: Icon, t, tAr, d, dAr }) => (
          <SpotlightCard
            as="article"
            key={t}
            className="flex gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-slate-600 shadow-lg"
          >
            <span
              className="relative grid place-items-center h-12 w-12 rounded-xl text-white shrink-0 shadow-md transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:-rotate-6"
              style={{ backgroundColor: themeColor }}
            >
              <Icon className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {isAr ? tAr : t}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {isAr ? dAr : d}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}