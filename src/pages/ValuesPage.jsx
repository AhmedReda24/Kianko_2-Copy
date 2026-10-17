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

export default function ValuesPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  // القيم الأربعة الرئيسية
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

  // فلسفة العمل والتطبيق الميداني
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20 text-start overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#0A1832] border border-blue-900/80 shadow-md">
          <Sparkles className="w-4 h-4" style={{ color: themeColor }} />
          <span>{pick('CORE GUIDING PRINCIPLES', 'المبادئ والمحركات الأساسية')}</span>
        </span>
        <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight">
          {pick('Our Core Values', 'قيمنا ومبادئنا الراسخة')}
        </h1>
        <p className="text-slate-300 font-medium text-xs sm:text-lg leading-relaxed">
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
            className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-4 sm:gap-6 bg-[#0A1832] p-5 sm:p-8 rounded-3xl border border-blue-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 shadow-xl group"
          >
            <span
              className="relative grid place-items-center h-14 w-14 sm:h-14 sm:w-14 rounded-2xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              <Icon className="w-7 h-7 sm:w-7 sm:h-7" />
            </span>
            <div className="space-y-1.5 sm:space-y-2">
              <h2 
                className="text-xl sm:text-2xl font-bold text-white transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.color = themeColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                {pick(t, tAr)}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{pick(d, dAr)}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* 3. Vision & Mission Section */}
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">
        <div className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-6 sm:p-10 space-y-4 sm:space-y-5 shadow-2xl relative overflow-hidden group hover:border-slate-500 transition-all text-center sm:text-start flex flex-col items-center sm:items-start">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900 border border-blue-900/80">
            <Eye className="w-6 h-6" style={{ color: themeColor }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {pick('Our Vision', 'رؤيتنا المستقبليّة')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            {pick(
              'To be the undisputed MENA region leader in precision cable management systems and structural steel components, recognized for quality, reliability, and engineering innovation.',
              'أن نكون الخيار الأول والقيادي في الشرق الأوسط وشمال أفريقيا لأنظمة إدارة الكابلات والقطاعات المعدنية الهندسية، والمثال المحتذى به في الجودة والابتكار.'
            )}
          </p>
        </div>

        <div className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-6 sm:p-10 space-y-4 sm:space-y-5 shadow-2xl relative overflow-hidden group hover:border-slate-500 transition-all text-center sm:text-start flex flex-col items-center sm:items-start">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900 border border-blue-900/80">
            <Compass className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {pick('Our Mission', 'رسالتنا اليومية')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            {pick(
              'Delivering world-class steel solutions that empower national infrastructure, strictly adhering to global quality codes while fostering long-term trust with our technical partners.',
              'تقديم حلول فولاذية مطابقة لأعلى المعايير العالمية التي تدعم المشاريع القومية، مع وبناء شراكات دائمة قائمة على الثقة والالتزام التام.'
            )}
          </p>
        </div>
      </div>

      {/* 4. Engineering Culture & Philosophy */}
      <div className="space-y-8 sm:space-y-12 pt-2 sm:pt-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2 flex flex-col items-center">
          {/* سنترة تامة وصريحة للعنوان ليتوسط الشاشة على سطر واحد تماماً */}
          <h2 className="text-base sm:text-2xl font-black text-white whitespace-nowrap text-center w-full block">
            {pick('Applied Engineering Ethics', 'تطبيق القيم في مواقع العمل')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            {pick('How we translate our core principles into daily manufacturing operations.', 'كيف نترجم قيمنا ومبادئنا إلى واقع ملموس في خطوط الإنتاج يومياً.')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {philosophyPillars.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-6 sm:p-8 space-y-3 sm:space-y-4 shadow-xl hover:border-slate-500 transition-all text-center sm:text-start flex flex-col items-center sm:items-start"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-blue-900/80 shadow-inner">
                  <IconComponent className="w-6 h-6" style={{ color: themeColor }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{pick(p.titleEn, p.titleAr)}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{pick(p.descEn, p.descAr)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CTA / Partner With Kianko */}
      <div className="bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border border-blue-900/60 rounded-3xl p-6 sm:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl">
        <h2 className="text-xl sm:text-4xl font-extrabold text-white">
          {pick('Build Your Next Landmark with Kianko Values', 'ابنِ مشروعك القادم بصلابة قيم كيانكو')}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
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