import { useMemo } from 'react';
import { Link } from 'react-router';
import { 
  Cog, 
  Leaf, 
  ShieldCheck, 
  Target, 
  Eye, 
  Compass, 
  Award, 
  Users, 
  Recycle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '../routes';
import SpotlightCard from '../components/ui/SpotlightCard';

export default function ValuesPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const cardBg = darkMode 
    ? 'bg-gradient-to-b from-[#0e1d3e] to-[#081226] border-blue-900/50' 
    : 'bg-white border-slate-200 shadow-lg';
    
  const visionCardBg = darkMode 
    ? 'bg-gradient-to-b from-[#0d1c3a] to-[#071124] border-blue-900/60' 
    : 'bg-white border-slate-200 shadow-xl';

  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const iconBoxBg = darkMode ? 'bg-slate-900/85 border-blue-900/80' : 'bg-slate-100 border-slate-200';

  const values = useMemo(() => [
    { 
      icon: Cog, 
      t: 'Engineering Accuracy', 
      tAr: 'الدقة الهندسية', 
      d: 'Every profile is engineered to exact project specs with continuous technological investment.', 
      dAr: 'كل قطاع يتصنع وفقاً للمواصفات الهندسية الدقيقة مع استثمار مستمر في التكنولوجيا.' 
    },
    { 
      icon: Target, 
      t: 'Consistent Quality', 
      tAr: 'جودة ثابتة وموثوقة', 
      d: 'Rigorous quality control across all manufacturing stages, backed by in-house testing labs.', 
      dAr: 'رقابة صارمة على الجودة في كل مرحلة تصنيع، مدعومة بمختبرات فحص داخلية.' 
    },
    { 
      icon: ShieldCheck, 
      t: 'Safety First Culture', 
      tAr: 'السلامة أولاً', 
      d: 'Protecting our workforce and operating within strict zero-harm industrial environments.', 
      dAr: 'حماية كوادرنا الفنية وتطبيق أعلى معايير الأمان في بيئة العمل الصناعية.' 
    },
    { 
      icon: Leaf, 
      t: 'Sustainable Production', 
      tAr: 'تصنيع مستدام بيئياً', 
      d: 'Eco-conscious manufacturing processes that minimize carbon footprint and raw waste.', 
      dAr: 'عمليات تصنيع مسؤولة تقلل الأثر البيئي وتُعيد تدوير المواد الخام.' 
    },
  ], []);

  const philosophyPillars = [
    {
      icon: Users,
      titleEn: 'People-First Leadership',
      titleAr: 'تمكين الكوادر الفنية',
      descEn: 'Empowering engineers and technicians with continuous safety and skills training.',
      descAr: 'تطوير وتدريب المهندسين والفنيين باستمرار على أحدث تقنيات السلامة والتدلفين.',
    },
    {
      icon: Award,
      titleEn: 'Uncompromising Integrity',
      titleAr: 'النزاهة والالتزام الفني',
      descEn: 'Transparent steel grading, certified material sources, and honest client communication.',
      descAr: 'شفافية كاملة في درجات الصلب، واعتماد خام حديدي موثوق المصدر 100%.',
    },
    {
      icon: Recycle,
      titleEn: 'Circular Manufacturing',
      titleAr: 'إعادة التدوير والكفاءة',
      descEn: 'Zero-waste scrap metal recovery and energy-efficient galvanization processes.',
      descAr: 'استعادة واستغلال خردة المعادن وإعادة تدوير أحماض الجلفنة بكفاءة عالية.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-16 text-start overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-2">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-md ${darkMode ? 'bg-[#0A1832] text-white border-blue-900/80' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
          <Sparkles className="w-4 h-4" style={{ color: themeColor }} />
          <span>{pick('CORE GUIDING PRINCIPLES', 'المبادئ والمحركات الأساسية')}</span>
        </span>
        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight ${textTitle}`}>
          {pick('Our Core Values', 'قيمنا ومبادئنا الراسخة')}
        </h1>
        <p className={`font-medium text-xs sm:text-base lg:text-lg leading-relaxed ${textDesc}`}>
          {pick(
            'The foundational ethics and engineering standards driving every Kianko steel component produced.',
            'المبادئ والمعايير الهندسية التي تحكم كل منتج وقطاع فولاذي يخرج من مصانع كيانكو.'
          )}
        </p>
      </div>

      {/* 2. Values Grid */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {values.map(({ icon: Icon, t, tAr, d, dAr }) => (
          <SpotlightCard
            as="article"
            key={t}
            className={`relative p-5 sm:p-7 rounded-2xl border transition-all duration-300 shadow-xl group overflow-hidden ${cardBg}`}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: themeColor }}
            />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className="relative grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <h2 className={`text-base sm:text-xl font-bold transition-colors duration-300 leading-snug ${textTitle}`}>
                  {pick(t, tAr)}
                </h2>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>{pick(d, dAr)}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* 3. Vision & Mission Section */}
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">
        {/* Our Vision Card */}
        <div className={`relative border rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4 shadow-2xl transition-all duration-300 group overflow-hidden ${visionCardBg}`}>
          <div 
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ backgroundColor: themeColor }}
          />

          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform duration-300 shrink-0"
              style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}30` }}
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: themeColor }} />
            </div>
            <h2 className={`text-lg sm:text-2xl font-extrabold tracking-wide ${textTitle}`}>
              {pick('Our Vision', 'رؤيتنا المستقبليّة')}
            </h2>
          </div>

          <p className={`text-xs sm:text-sm lg:text-base leading-relaxed ${textDesc}`}>
            {pick(
              'To be the undisputed MENA region leader in precision cable management systems and structural steel components, recognized for quality, reliability, and engineering innovation.',
              'أن نكون الخيار الأول والقيادي في الشرق الأوسط وشمال أفريقيا لأنظمة إدارة الكابلات والقطاعات المعدنية الهندسية، والمثال المحتذى به في الجودة والابتكار.'
            )}
          </p>
        </div>

        {/* Our Mission Card */}
        <div className={`relative border rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4 shadow-2xl transition-all duration-300 group overflow-hidden ${visionCardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 bg-emerald-500" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <h2 className={`text-lg sm:text-2xl font-extrabold tracking-wide ${textTitle}`}>
              {pick('Our Mission', 'رسالتنا اليومية')}
            </h2>
          </div>

          <p className={`text-xs sm:text-sm lg:text-base leading-relaxed ${textDesc}`}>
            {pick(
              'Delivering world-class steel solutions that empower national infrastructure, strictly adhering to global quality codes while fostering long-term trust with our technical partners.',
              'تقديم حلول فولاذية مطابقة لأعلى المعايير العالمية التي تدعم المشاريع القومية، مع وبناء شراكات دائمة قائمة على الثقة والالتزام التام.'
            )}
          </p>
        </div>
      </div>

      {/* 4. Engineering Culture & Philosophy */}
      <div className="space-y-6 sm:space-y-8 pt-2 sm:pt-4">
        <div className="text-center space-y-2 max-w-2xl mx-auto px-2 flex flex-col items-center">
          <h2 className={`text-xl sm:text-3xl font-black tracking-tight ${textTitle}`}>
            {pick('Applied Engineering Ethics', 'تطبيق القيم في مواقع العمل')}
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base ${textDesc}`}>
            {pick('How we translate our core principles into daily manufacturing operations.', 'كيف نترجم قيمنا ومبادئنا إلى واقع ملموس في خطوط الإنتاج يومياً.')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {philosophyPillars.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div 
                key={idx} 
                className={`relative border rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl transition-all duration-300 group overflow-hidden ${visionCardBg}`}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: themeColor }}
                />

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform duration-300 shrink-0 ${iconBoxBg}`}>
                    <IconComponent className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold ${textTitle}`}>{pick(p.titleEn, p.titleAr)}</h3>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>{pick(p.descEn, p.descAr)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CTA / Partner With Kianko */}
      <div className={`relative border rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border-blue-900/60' : 'bg-slate-100 border-slate-300'}`}>
        <h2 className={`text-xl sm:text-3xl lg:text-4xl font-extrabold ${textTitle}`}>
          {pick('Build Your Next Landmark with Kianko Values', 'ابنِ مشروعك القادم بصلابة قيم كيانكو')}
        </h2>
        <p className={`max-w-xl mx-auto text-xs sm:text-sm lg:text-base leading-relaxed ${textDesc}`}>
          {pick(
            'Partner with a manufacturer that prioritizes your project timelines, safety codes, and exact technical specifications.',
            'تعاون مع مصنع يضع مواعيد مشروعك، وأكواد الأمان، والمواصفات الهندسية الدقيقة في مقدمة أولوياته.'
          )}
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to={ROUTES.contact}
            className="inline-flex items-center justify-center gap-3 py-3.5 px-6 sm:px-8 rounded-xl font-bold text-xs sm:text-base text-white shadow-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Start a Partnered Project', 'تواصل مع فريقنا الهندسي')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </Link>
        </div>
      </div>

    </div>
  );
}