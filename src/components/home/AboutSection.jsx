import { motion, useReducedMotion } from 'motion/react';
import { Factory, PencilRuler, Truck } from 'lucide-react';
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

export default function AboutSection({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const reduce = useReducedMotion();

  // ألوان متكيفة ديناميكياً مع الثيم
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = darkMode ? 'border-slate-800 bg-slate-900/60 text-white' : 'border-slate-200 bg-white shadow-md text-slate-900';
  const cardTextDesc = darkMode ? 'text-slate-400' : 'text-slate-600';
  const factoryImgBg = darkMode ? 'border-blue-900/60 bg-[#07132B]' : 'border-slate-200 bg-slate-100 shadow-xl';

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-10 sm:space-y-14">
      
      {/* عنوان القسم */}
      <div className="flex justify-center sm:justify-start">
        <SectionHeading themeColor={themeColor} darkMode={darkMode}>{isAr ? 'من نحن' : 'About Us'}</SectionHeading>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* حاوية صورة المصنع */}
        <motion.div
          className={`relative rounded-3xl overflow-hidden border group w-full aspect-[4/3] sm:aspect-auto sm:h-[400px] lg:h-[450px] ${factoryImgBg}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/Image/factory-main.webp"
            alt="Kianko Factory"
            className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-[#07132B] via-transparent to-transparent opacity-80' : 'from-black/40 via-transparent to-transparent opacity-50'}`} />
        </motion.div>

        {/* التفاصيل والوصف */}
        <div className="space-y-4 sm:space-y-6 text-center sm:text-start">
          <h3 className={`font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${textTitle}`}>
            KIANKO COMPANY
          </h3>

          <p className={`text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
            {isAr
              ? 'باعتبارها الرائدة في تصنيع وتشكيل الصُلب بدقة عالية، تقدم كيانكو حوامل وسلالم الكابلات الهندسية ومقاطع المحارة وأنظمة الجلفنة على الساخن المصممة خصيصاً لتلبي احتياجات المشاريع الكبرى.'
              : 'As the manufacturing leader in precision steel fabrication, Kianko delivers engineered cable management trays, heavy-duty ladders, hot-dip galvanization, and plaster profile systems engineered to satisfy modern construction specifications.'}
          </p>

          <p className={`text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
            {isAr
              ? 'تعمل كيانكو وفق المعايير الدولية لترسيخ مكانتها كشريك موثوق للحلول الهيكلية عالية الأداء في كافة التطبيقات الصناعية والتجارية.'
              : 'Operating to global standards, Kianko reinforces its position as a trusted partner for durable, high-performance structural solutions across major commercial and industrial developments.'}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row justify-center sm:justify-start gap-3 sm:gap-4">
            <CtaLink to={ROUTES.story} themeColor={themeColor}>
              {isAr ? 'اقرأ قصتنا' : 'Read Our Story'}
            </CtaLink>
            <CtaLink to={ROUTES.contact} variant="glass" arrow={false} darkMode={darkMode}>
              {isAr ? 'تواصل مع كيانكو' : 'Reach KIANKO'}
            </CtaLink>
          </div>
        </div>
      </div>

      {/* كروت الركائز الثلاث */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map(({ icon: Icon, t, tAr, d, dAr }) => (
          <SpotlightCard
            as="article"
            key={t}
            darkMode={darkMode}
            className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border transition-all duration-300 shadow-lg ${cardBg}`}
          >
            <span
              className="relative grid place-items-center h-12 w-12 rounded-xl text-white shrink-0 shadow-md transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:-rotate-6"
              style={{ backgroundColor: themeColor }}
            >
              <Icon className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className={`text-base sm:text-xl font-bold ${textTitle}`}>
                {isAr ? tAr : t}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${cardTextDesc}`}>
                {isAr ? dAr : d}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}