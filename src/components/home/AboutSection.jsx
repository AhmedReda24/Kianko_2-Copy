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

export default function AboutSection({ isAr, themeColor = '#C9252C' }) {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-10 sm:space-y-14">
      
      {/* تم إضافة كلاسات التسنطير للشاشات الصغيرة والمحاذاة للشاشات الكبيرة */}
      <div className="flex justify-center sm:justify-start">
        <SectionHeading themeColor={themeColor}>{isAr ? 'من نحن' : 'About Us'}</SectionHeading>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* حاوية صورة المصنع بتناسق كامل */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/60 bg-[#07132B] group w-full aspect-[4/3] sm:aspect-auto sm:h-[400px] lg:h-[450px]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/Image/factory-main.jpg"
            alt="Kianko Factory"
            className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* التفاصيل والأزرار متسنطرة في الموبايل ومحاذية في الشاشات الكبيرة */}
        <div className="space-y-4 sm:space-y-6 text-center sm:text-start">
          <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            KIANKO COMPANY
          </h3>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0">
            {isAr
              ? 'باعتبارها الرائدة في تصنيع وتشكيل الصُلب بدقة عالية، تقدم كيانكو حوامل وسلالم الكابلات الهندسية ومقاطع المحارة وأنظمة الجلفنة على الساخن المصممة خصيصاً لتلبي احتياجات المشاريع الكبرى.'
              : 'As the manufacturing leader in precision steel fabrication, Kianko delivers engineered cable management trays, heavy-duty ladders, hot-dip galvanization, and plaster profile systems engineered to satisfy modern construction specifications.'}
          </p>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0">
            {isAr
              ? 'تعمل كيانكو وفق المعايير الدولية لترسيخ مكانتها كشريك موثوق للحلول الهيكلية عالية الأداء في كافة التطبيقات الصناعية والتجارية.'
              : 'Operating to global standards, Kianko reinforces its position as a trusted partner for durable, high-performance structural solutions across major commercial and industrial developments.'}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row justify-center sm:justify-start gap-3 sm:gap-4">
            <CtaLink to={ROUTES.story} themeColor={themeColor}>
              {isAr ? 'اقرأ قصتنا' : 'Read Our Story'}
            </CtaLink>
            <CtaLink to={ROUTES.contact} variant="glass" arrow={false}>
              {isAr ? 'تواصل مع كيانكو' : 'Reach KIANKO'}
            </CtaLink>
          </div>
        </div>
      </div>

      {/* كروت الركائز الثلاث متسنطرة ومتناسقة 100% للموبايل */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map(({ icon: Icon, t, tAr, d, dAr }) => (
          <SpotlightCard
            as="article"
            key={t}
            className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-slate-600 shadow-lg"
          >
            <span
              className="relative grid place-items-center h-12 w-12 rounded-xl text-white shrink-0 shadow-md transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:-rotate-6"
              style={{ backgroundColor: themeColor }}
            >
              <Icon className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-bold text-white">
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