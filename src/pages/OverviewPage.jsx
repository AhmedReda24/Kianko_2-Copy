import { useMemo } from 'react';
import { Link } from 'react-router';
import { 
  Factory, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Workflow, 
  Zap,
  Scale,
  Award,
  Layers,
  Clock
} from 'lucide-react';
import { ROUTES } from '../routes';
import SpotlightCard from '../components/ui/SpotlightCard';

export default function OverviewPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  // تحديث كلاسات الألوان الصريحة المباشرة بناءً على حالة darkMode
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60' : 'bg-white border-slate-200';
  const innerCardBg = darkMode ? 'bg-[#061022] border-blue-900/40' : 'bg-slate-100 border-slate-200';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';

  // 1. القدرات الإنتاجية الـ 6 الرئيسية لمصنع كيانكو
  const capabilities = useMemo(() => [
    {
      id: 'roll-forming',
      titleEn: 'Automated Roll Forming',
      titleAr: 'خطوط التدلفين الآلي',
      descEn: 'High-speed automated continuous cold-rolling mills engineered for ultimate dimensional precision.',
      descAr: 'ماكينات تدلفين آلي عالية السرعة مصممة لأقصى درجات الدقة الهندسية للقطاعات.',
      img: '/Image/overview-roll-forming.webp',
      badgeEn: 'Precision',
      badgeAr: 'دقة فائقة',
    },
    {
      id: 'hot-dip-galv',
      titleEn: 'Hot-Dip Galvanizing Plant',
      titleAr: 'مجمع الجلفنة على الساخن',
      descEn: 'Heavy-duty zinc bath galvanization strictly adhering to ASTM A123 & ISO corrosion protection standards.',
      descAr: 'أحواض جلفنة بالزنك للخدمة الشاقة مطابقة تماماً لمعايير ASTM A123 لمقاومة التآكل.',
      img: '/Image/overview-galvanizing.webp',
      badgeEn: 'ISO/ASTM',
      badgeAr: 'معايير عالمية',
    },
    {
      id: 'cnc-punching',
      titleEn: 'High-Speed CNC Punching',
      titleAr: 'التثقيب والتشكيل بـ CNC',
      descEn: 'Automated high-speed punching lines for custom slot patterns in cable trays and strut channels.',
      descAr: 'خطوط تثقيب برمجية عالية السرعة لعمل الفتحات المخصصة في حوامل الكابلات والقطاعات.',
      img: '/Image/overview-cnc-punching.webp',
      badgeEn: 'Automated',
      badgeAr: 'آلي بالكامل',
    },
    {
      id: 'testing-lab',
      titleEn: 'QA/QC Testing Labs',
      titleAr: 'معامل الفحص والجودة',
      descEn: 'In-house tensile strength testing, zinc coating thickness measurement, and load verification.',
      descAr: 'اختبارات إجهاد الشد الداخلية، وقياس سمك طلاء الزنك وتأكيد قدرة تحمل الأحمال.',
      img: '/Image/overview-quality-lab.webp',
      badgeEn: 'Inspection',
      badgeAr: 'فحص مائة بالمائة',
    },
    {
      id: 'powder-coating',
      titleEn: 'Electrostatic Powder Coating',
      titleAr: 'الطلاء الحراري بالبودر كوتنج',
      descEn: 'Advanced electrostatic powder coating lines providing superior aesthetic finish and weather resistance.',
      descAr: 'خطوط طلاء إلكتروستاتيكي حراري توفر مظهراً جمالياً رائعاً ومقاومة فائقة للعوامل الجوية.',
      img: '/Image/overview-powder-coating.webp',
      badgeEn: 'Protection',
      badgeAr: 'حماية مضاعفة',
    },
    {
      id: 'logistics-warehouse',
      titleEn: 'Logistics & Supply Hub',
      titleAr: 'المستودعات والخدمات اللوجستية',
      descEn: 'Extensive storage facility ensuring rapid dispatch and continuous supply to regional megaprojects.',
      descAr: 'مستودعات ضخمة توفر السرعة في الشحن والتوريد المستمر لأضخم المشاريع الإقليمية.',
      img: '/Image/overview-warehouse.webp',
      badgeEn: 'Supply Chain',
      badgeAr: 'سلسلة الإمداد',
    },
  ], []);

  // 2. خطوات دورة التصنيع والإنتاج
  const workflowSteps = [
    {
      step: '01',
      titleEn: 'Raw Steel Coils Selection',
      titleAr: 'فحص واختيار لفائف الصُلب',
      descEn: 'Sourcing premium structural steel coils with verified mill test certificates.',
      descAr: 'استيراد واختيار أفضل لفائف الصُلب الهيكلي مع شهادات الفحص المعتمدة.',
    },
    {
      step: '02',
      titleEn: 'Precision Rolling & Punching',
      titleAr: 'التدلفين والتثقيب الدقيق',
      descEn: 'Cold-roll forming and computer-controlled punching according to client specifications.',
      descAr: 'التشغيل الدقيق والتثقيب بالكمبيوتر حسب الأبعاد والمواصفات الهندسية.',
    },
    {
      step: '03',
      titleEn: 'Hot-Dip Galvanization',
      titleAr: 'الجلفنة وحماية السطح',
      descEn: 'Immersion in molten zinc baths ensuring lifelong anti-corrosion protection.',
      descAr: 'الغمر في أحواض الزنك المنصهر للوصول لدرجة الحماية القصوى ضد الصدأ.',
    },
    {
      step: '04',
      titleEn: 'Quality Testing & Bundling',
      titleAr: 'اختبار الجودة والتغليف',
      descEn: 'Rigorous thickness checking, load testing, and secure industrial packaging.',
      descAr: 'فحص سمك الجلفنة وتحمل الأحمال ثم التغليف الصناعي الآمن للتوريد.',
    },
  ];

  const btnCls =
    'relative inline-flex items-center justify-center gap-2 py-3.5 px-6 sm:px-8 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl text-xs sm:text-base w-full sm:w-auto';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20 text-start overflow-hidden">
      
      {/* 1. Page Header Section */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-2">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-md ${cardBg}`}>
          <Factory className="w-4 h-4" style={{ color: themeColor }} />
          <span className={textTitle}>{pick('INDUSTRIAL INFRASTRUCTURE', 'البنية التحتية الصناعية')}</span>
        </span>
        <h1 className={`text-2xl sm:text-5xl font-black tracking-tight ${textTitle}`}>
          {pick('Manufacturing Overview', 'نظرة عامة على القدرات الإنتاجية')}
        </h1>
        <p className={`font-medium text-xs sm:text-base leading-relaxed ${textDesc}`}>
          {pick(
            'State-of-the-art automated cold-rolling, high-speed punching, and hot-dip galvanizing facilities powered by Kianko engineering.',
            'خطوط إنتاج آلية بالكامل ومصانع جلفنة حديثة مدعومة بأحدث تقنيات الهندسة وتشكيل المعادن.'
          )}
        </p>
      </div>

      {/* 2. Main Capabilities Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {capabilities.map((card) => (
          <SpotlightCard
            as="article"
            key={card.id}
            className={`group rounded-3xl border shadow-xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 ${cardBg}`}
          >
            <div>
              {/* حاوية الصورة */}
              <div className={`relative overflow-hidden h-44 sm:h-52 ${innerCardBg}`}>
                <img
                  src={card.img}
                  alt={pick(card.titleEn, card.titleAr)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 sm:top-4 start-3 sm:start-4 text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-bold shadow-md backdrop-blur-md bg-opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  {pick(card.badgeEn, card.badgeAr)}
                </span>
              </div>

              {/* تفاصيل الكارد */}
              <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                <h3 className={`text-base sm:text-xl font-bold transition-colors duration-300 ${textTitle}`}>
                  {pick(card.titleEn, card.titleAr)}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                  {pick(card.descEn, card.descAr)}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 pt-0">
              <div className={`flex items-center gap-2 text-[11px] sm:text-xs font-bold pt-2 border-t ${textDesc} ${darkMode ? 'border-blue-900/40' : 'border-slate-200'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{pick('ISO Certified Process', 'عملية معتمدة بجودة ISO')}</span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* 3. Technical Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            value: '50,000+',
            labelEn: 'Tons Annual Capacity',
            labelAr: 'طاقة إنتاجية سنوية (طن)',
            icon: Scale,
            isThemeColor: false,
          },
          {
            value: '100%',
            labelEn: 'ASTM A123 Compliance',
            labelAr: 'مطابقة لمعايير الجلفنة',
            icon: Award,
            isThemeColor: true,
          },
          {
            value: '0.35 - 6.0mm',
            labelEn: 'Steel Sheet Thickness',
            labelAr: 'نطاق سُمك الصُلب المعالج',
            icon: Layers,
            isThemeColor: false,
          },
          {
            value: '8/6',
            labelEn: 'Automated Operations',
            labelAr: 'تشغيل خطوط الإنتاج',
            icon: Clock,
            isThemeColor: true,
          },
        ].map((metric, idx) => {
          const IconComp = metric.icon;
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-4 sm:p-6 text-center space-y-2 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center group relative overflow-hidden ${cardBg}`}
            >
              <div className={`p-2 sm:p-2.5 rounded-xl border mb-1 group-hover:scale-110 transition-transform ${innerCardBg}`}>
                <IconComp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: themeColor }} />
              </div>
              <span
                className={`text-base sm:text-2xl font-black tracking-tight whitespace-nowrap block ${textTitle}`}
                style={{ color: metric.isThemeColor ? themeColor : undefined }}
              >
                {metric.value}
              </span>
              <p className={`font-semibold text-[11px] sm:text-xs leading-tight ${textDesc}`}>
                {pick(metric.labelEn, metric.labelAr)}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4. Manufacturing Workflow Steps */}
      <div className="space-y-8 sm:space-y-12 pt-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${cardBg}`}>
            <Workflow className="w-4 h-4 text-emerald-400" />
            <span className={textTitle}>{pick('PRODUCTION PROCESS', 'مراحل التصنيع')}</span>
          </span>
          <h2 className={`text-base sm:text-2xl font-extrabold sm:whitespace-nowrap ${textTitle}`}>
            {pick('Precision Engineering Workflow', 'خطوات دورة الإنتاج الفولاذية')}
          </h2>
          <p className={`text-xs sm:text-sm ${textDesc}`}>
            {pick('From raw coil inspection to hot-dip galvanizing and heavy packaging.', 'من فحص الفولاذ الخام وحتى الجلفنة والتغليف للمنشآت.')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {workflowSteps.map((st) => (
            <div
              key={st.step}
              className={`border rounded-2xl p-5 sm:p-6 space-y-3 text-center sm:text-start relative shadow-xl hover:border-slate-400 transition-all flex flex-col items-center sm:items-start ${cardBg}`}
            >
              <div className="w-full flex items-center justify-between">
                <span className={`text-2xl sm:text-3xl font-black opacity-40 ${textTitle}`}>{st.step}</span>
                <div className={`p-2 rounded-lg border ${innerCardBg}`}>
                  <Zap className="w-4 h-4" style={{ color: themeColor }} />
                </div>
              </div>
              <h3 className={`text-base sm:text-lg font-bold ${textTitle}`}>{pick(st.titleEn, st.titleAr)}</h3>
              <p className={`text-xs leading-relaxed ${textDesc}`}>{pick(st.descEn, st.descAr)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quality & Environmental Standards Section */}
      <div className={`border rounded-3xl p-5 sm:p-12 space-y-6 sm:space-y-8 shadow-2xl transition-colors duration-300 ${cardBg}`}>
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3 sm:space-y-4 text-center sm:text-start">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border inline-block ${innerCardBg} ${textTitle}`}>
              {pick('SUSTAINABILITY & SAFETY', 'السلامة والاستدامة')}
            </span>
            <h2 className={`text-base sm:text-2xl font-extrabold leading-tight sm:whitespace-nowrap ${textTitle}`}>
              {pick('Eco-Friendly & Safe Manufacturing', 'تصنيع صديق للبيئة وآمن بالكامل')}
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
              {pick(
                'Our plants utilize zero-waste acid treatment recycling systems, eco-friendly zinc filtering, and strict worker safety protocol complying with international OSHA standards.',
                'تعتمد مصانعنا على أنظمة إعادة تدوير الأحماض لمنع التلوث، وفلاتر الزنك البيئية، مع تطبيق معايير OSHA العالمية لسلامة الكوادر الفنية.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { titleEn: 'Zero Acid Waste System', titleAr: 'نظام التدوير الكامل للأحماض' },
              { titleEn: 'OSHA Safety Protocol', titleAr: 'مطابقة معايير السلامة OSHA' },
              { titleEn: 'Zinc Fume Filtration', titleAr: 'فلاتر احتجاز أدخنة الزنك' },
              { titleEn: 'Energy Efficient Machinery', titleAr: 'ماكينات موفرة للطاقة الكهربائية' },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-start ${innerCardBg}`}>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className={`text-xs font-bold ${textTitle}`}>{pick(item.titleEn, item.titleAr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Call to Action */}
      <div className={`border rounded-3xl p-6 sm:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl transition-colors duration-300 ${cardBg}`}>
        <h2 className={`text-base sm:text-2xl font-extrabold ${textTitle}`}>
          {pick('Need Custom Steel Fabrication Specifications?', 'تحتاج مواصفات تصنيع صُلب مخصصة لمشروعك؟')}
        </h2>
        <p className={`max-w-xl mx-auto text-xs sm:text-sm leading-relaxed ${textDesc}`}>
          {pick(
            'Our engineering team provides dedicated consultation for load calculations, custom profile rolling, and galvanizing requirements.',
            'يقدم فريقنا الهندسي استشارات مخصصة لحسابات الأحمال، وتشكيل القطاعات، ومواصفات الجلفنة لمشروعك.'
          )}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            to={ROUTES.contact}
            className={btnCls}
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Request Technical Consultation', 'اطلب استشارة هندسية')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </Link>
          <Link
            to={ROUTES.products}
            className={`inline-flex items-center justify-center gap-2 py-3.5 px-6 sm:px-8 rounded-xl font-bold text-xs sm:text-base border transition-all hover:scale-105 w-full sm:w-auto ${innerCardBg} ${textTitle}`}
          >
            <span>{pick('Explore Product Line', 'استكشف المنتجات')}</span>
          </Link>
        </div>
      </div>

    </div>
  );
}