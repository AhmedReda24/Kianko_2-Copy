import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Factory, PencilRuler, Truck, ShieldCheck,
  CheckCircle2, Award, Layers
} from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import SectionHeading from '../ui/SectionHeading';
import SpotlightCard from '../ui/SpotlightCard';

const pillars = [
  {
    icon: PencilRuler,
    step: '01',
    t: 'Engineering & Design',
    tAr: 'التصميم والدعم الهندسي',
    d: 'Technical engineering support that transforms project specifications and BOQs into buildable, standards-compliant steel solutions.',
    dAr: 'دعم هندسي وفني متكامل يحوّل مواصفات المشروع وجداول الكميات إلى حلول صلب قياسية قابلة للتنفيذ.',
  },
  {
    icon: Factory,
    step: '02',
    t: 'Precision Manufacturing',
    tAr: 'التصنيع والدرفلة الدقيقة',
    d: 'CNC punching, cold roll forming, and hot-dip galvanizing for cable management systems and building profiles under one roof.',
    dAr: 'تشكيل بالدرفلة على البارد، تثقيب رقمي دقيق (CNC)، وجلفنة بالغمس الساخن لحوامل الكابلات والمقاطع المعدنية تحت سقف واحد.',
  },
  {
    icon: Truck,
    step: '03',
    t: 'Reliable Regional Supply',
    tAr: 'التوريد اللوجستي المعتمد',
    d: 'Scheduled, reliable delivery of cable trays, ladders, trunking, and plastering profiles to major projects across KSA and MENA.',
    dAr: 'توريد منتظم وموثوق لأنظمة حوامل وسلالم الكابلات ومقاطع المحارة والجبس بورد لكبرى المشاريع في المملكة والمنطقة.',
  },
];

const highlights = [
  {
    en: 'Compliant with ASTM, BS & SASO Standards',
    ar: 'مطابقة تامة للمواصفات القياسية العالمية والسعودية (ASTM & SASO)',
  },
  {
    en: 'Hot-Dip Galvanized & Pre-Galvanized Steel',
    ar: 'صلب مجلفن بالغمس الساخن ومجلفن مسبقاً لمقاومة التآكل والصدأ',
  },
  {
    en: 'Approved Vendor for Giga & Industrial Projects',
    ar: 'مورد معتمد لدى كبرى المشاريع الاستراتيجية والصناعية بالمملكة',
  },
  {
    en: 'Direct Engineering Support in Jeddah & Riyadh',
    ar: 'دعم فني وتوريد مباشر عبر فروعنا في جدة والرياض',
  },
];

export default function AboutSection({ isAr, lang, themeColor = '#C9252C', darkMode = true }) {
  const isArabic = typeof isAr === 'boolean' ? isAr : lang === 'ar';
  const pick = (en, ar) => (isArabic ? ar : en);
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

  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-200' : 'text-slate-700';
  const cardBg = darkMode
    ? 'border-blue-900/60 bg-[#0A1832]/90 text-white shadow-xl'
    : 'border-slate-200 bg-white shadow-lg text-slate-900';
  const cardTextDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const badgeOverlayBg = darkMode
    ? 'bg-[#061024]/92 border-blue-800/70 text-white'
    : 'bg-white/95 border-slate-200 text-slate-900';

  return (
    <section
      id="about"
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 sm:space-y-14 text-start overflow-x-hidden"
    >
      {/* عنوان القسم */}
      <div className="flex justify-center sm:justify-start">
        <SectionHeading themeColor={themeColor} darkMode={darkMode}>
          {pick('About KIANKO', 'من نحن')}
        </SectionHeading>
      </div>

      {/* الشبكة الرئيسية: صورة المصنع + النص التعريفي */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* 1. حاوية الصورة مثبتة على dir="ltr" لمنع خطأ المتصفح في الـ RTL مع تمديد الصورة خارج الحواف */}
        <motion.div
          dir="ltr"
          className={`relative isolate rounded-3xl overflow-hidden group w-full aspect-[4/3] sm:aspect-auto sm:h-[400px] lg:h-[460px] shadow-2xl select-none ${
            darkMode ? 'bg-[#07132B]' : 'bg-slate-900'
          }`}
          style={{
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* الصورة ممتدة بـ 12px خارج الإطار من جميع الجهات حتى يستحيل ظهور أي خط أبيض على الحافة */}
          <img
            src="/Image/factory-main.webp"
            alt={pick('KIANKO Steel Industries Factory', 'مصنع شركة كيانكو للصناعات الحديدية')}
            width="800"
            height="600"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/Image/ladder.webp';
            }}
            className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] max-w-none object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* طبقة التدرج اللوني فوق الصورة */}
          <div
            className={`pointer-events-none absolute -inset-1 z-10 bg-gradient-to-t ${
              darkMode
                ? 'from-[#050E22] via-[#050E22]/30 to-transparent opacity-90'
                : 'from-slate-950/75 via-transparent to-transparent opacity-80'
            }`}
          />

          {/* طوق داخلي (Inset Shield) يغلق حواف الزوايا الدائرية بالكامل */}
          <div
            className={`pointer-events-none absolute inset-0 z-20 rounded-3xl border-2 ${
              darkMode
                ? 'border-blue-900/80 shadow-[inset_0_0_0_2px_#07132B]'
                : 'border-slate-300 shadow-[inset_0_0_0_2px_#0f172a]'
            }`}
          />

          {/* شارة الأيزو العلوية (تتحول تلقائياً يميناً في العربي ويساراً في الإنجليزي) */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className={`absolute top-4 z-30 ${isArabic ? 'right-4' : 'left-4'}`}
          >
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{pick('ISO 9001 • 14001 • 45001', 'شهادات أيزو 9001 • 14001 • 45001')}</span>
            </span>
          </div>

          {/* شريط الطاقة الإنتاجية السفلي
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="absolute bottom-4 inset-x-4 z-30"
          >
            <div className={`p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 shadow-xl ${badgeOverlayBg}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-start">
                  <p className="text-xs sm:text-sm font-black truncate">
                    {pick('13 Integrated Production Lines', '13 خط إنتاج صناعي وهندسي متكامل')}
                  </p>
                  <p className={`text-[11px] truncate ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {pick('Jeddah & Riyadh — Kingdom of Saudi Arabia', 'جدة والرياض — المملكة العربية السعودية')}
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 hidden xs:block" />
            </div>
          </div> */}
        </motion.div>

        {/* 2. المحتوى النصي التعريفي والقدرات التصنيعية */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 sm:space-y-5 text-center sm:text-start"
        >
          <div className="space-y-1.5">
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-wider inline-block"
              style={{ color: themeColor }}
            >
              {pick('INDUSTRIAL EXCELLENCE IN SAUDI ARABIA', 'الريادة في الصناعات الحديدية والحلول الهندسية')}
            </span>
            <h3 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${textTitle}`}>
              {isArabic ? (
                <>
                  شركة <span style={{ color: themeColor }}>كيانكو</span> للصناعات الحديدية
                </>
              ) : (
                <>
                  <span style={{ color: themeColor }}>KIANKO</span> STEEL INDUSTRIES
                </>
              )}
            </h3>
          </div>

          <p className={`text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
            {pick(
              'As a premier industrial leader in precision steel fabrication, KIANKO delivers engineered cable management systems (perforated trays, wire mesh baskets, heavy-duty ladders, and trunking), structural C-channels, and plastering & blockwork accessories tailored for mega construction projects.',
              'باعتبارها رائدة في تصنيع وتشكيل الصُلب بدقة هندسية فائقة، تقدم شركة كيانكو للصناعات الحديدية منظومة متكاملة من حوامل وسلالم الكابلات، أنظمة الترنكنج، قطاعات السي شانل (C-Channels)، وهياكل الجبس بورد ومقاطع المحارة والبلوك المصممة خصيصاً لتلبية متطلبات المشاريع الكبرى.'
            )}
          </p>

          <p className={`text-xs sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
            {pick(
              'Operating in strict accordance with international quality frameworks (ISO & ASTM), KIANKO stands as a trusted manufacturing partner for high-performance structural and electrical support solutions across industrial, energy, and urban developments.',
              'تعمل كيانكو وفق أعلى معايير الجودة العالمية (ISO & ASTM) لترسيخ مكانتها كشريك صناعي موثوق للحلول الإنشائية والكهربائية عالية الأداء في كافة القطاعات الصناعية والتجارية ومشاريع البنية التحتية.'
            )}
          </p>

          {/* قائمة المزايا الهندسية الـ 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-start">
            {highlights.map((item) => (
              <div
                key={item.en}
                className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-bold ${
                  darkMode
                    ? 'bg-[#0A1832]/70 border-blue-900/50 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{pick(item.en, item.ar)}</span>
              </div>
            ))}
          </div>

          {/* أزرار الانتقال السريع */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <CtaLink
              to={ROUTES.story}
              themeColor={themeColor}
              darkMode={darkMode}
              className="w-full sm:w-auto justify-center"
            >
              {pick('Read Our Story', 'اقرأ قصتنا')}
            </CtaLink>
            <CtaLink
              to={ROUTES.contact}
              variant="glass"
              arrow={false}
              darkMode={darkMode}
              className="w-full sm:w-auto justify-center"
            >
              {pick('Reach KIANKO Team', 'تواصل مع كيانكو')}
            </CtaLink>
          </div>
        </motion.div>
      </div>

      {/* الركائز الـ 3 الأساسية (التصميم • التصنيع • التوريد) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map(({ icon: Icon, step, t, tAr, d, dAr }, idx) => {
          const isThirdOnTablet = idx === 2;
          return (
            <motion.div
              key={t}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={isThirdOnTablet ? 'sm:col-span-2 md:col-span-1' : ''}
            >
              <SpotlightCard
                as="article"
                darkMode={darkMode}
                className={`h-full flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${cardBg}`}
              >
                <span
                  className="relative grid place-items-center h-12 w-12 rounded-xl text-white shrink-0 shadow-md transition-transform duration-300 group-hover/spot:scale-110"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon className="w-6 h-6" />
                </span>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-between gap-2">
                    <h3 className={`text-base sm:text-lg font-extrabold ${textTitle}`}>
                      {pick(t, tAr)}
                    </h3>
                    <span className="hidden sm:inline-block font-mono text-xs font-black opacity-40">
                      {step}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${cardTextDesc}`}>
                    {pick(d, dAr)}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}