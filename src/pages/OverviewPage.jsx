import { useMemo } from 'react';
import { Link } from 'react-router';
import { 
  Factory, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Workflow, 
  Zap
} from 'lucide-react';
import { ROUTES } from '../routes';
import SpotlightCard from '../components/ui/SpotlightCard';

export default function OverviewPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  // 1. القدرات الإنتاجية الـ 6 الرئيسية لمصنع كيانكو بمسارات الصور الجديدة المباشرة
  const capabilities = useMemo(() => [
    {
      id: 'roll-forming',
      titleEn: 'Automated Roll Forming',
      titleAr: 'خطوط التدلفين الآلي',
      descEn: 'High-speed automated continuous cold-rolling mills engineered for ultimate dimensional precision.',
      descAr: 'ماكينات تدلفين آلي عالية السرعة مصممة لأقصى درجات الدقة الهندسية للقطاعات.',
      img: '/Image/overview-roll-forming.jpg',
      badgeEn: 'Precision',
      badgeAr: 'دقة فائقة',
    },
    {
      id: 'hot-dip-galv',
      titleEn: 'Hot-Dip Galvanizing Plant',
      titleAr: 'مجمع الجلفنة على الساخن',
      descEn: 'Heavy-duty zinc bath galvanization strictly adhering to ASTM A123 & ISO corrosion protection standards.',
      descAr: 'أحواض جلفنة بالزنك للخدمة الشاقة مطابقة تماماً لمعايير ASTM A123 لمقاومة التآكل.',
      img: '/Image/overview-galvanizing.jpg',
      badgeEn: 'ISO/ASTM',
      badgeAr: 'معايير عالمية',
    },
    {
      id: 'cnc-punching',
      titleEn: 'High-Speed CNC Punching',
      titleAr: 'التثقيب والتشكيل بـ CNC',
      descEn: 'Automated high-speed punching lines for custom slot patterns in cable trays and strut channels.',
      descAr: 'خطوط تثقيب برمجية عالية السرعة لعمل الفتحات المخصصة في حوامل الكابلات والقطاعات.',
      img: '/Image/overview-cnc-punching.jpg',
      badgeEn: 'Automated',
      badgeAr: 'آلي بالكامل',
    },
    {
      id: 'testing-lab',
      titleEn: 'QA/QC Testing Labs',
      titleAr: 'معامل الفحص والجودة',
      descEn: 'In-house tensile strength testing, zinc coating thickness measurement, and load verification.',
      descAr: 'اختبارات إجهاد الشد الداخلية، وقياس سمك طلاء الزنك وتأكيد قدرة تحمل الأحمال.',
      img: '/Image/overview-quality-lab.jpg',
      badgeEn: 'Inspection',
      badgeAr: 'فحص مائة بالمائة',
    },
    {
      id: 'powder-coating',
      titleEn: 'Electrostatic Powder Coating',
      titleAr: 'الطلاء الحراري بالبودر كوتنج',
      descEn: 'Advanced electrostatic powder coating lines providing superior aesthetic finish and weather resistance.',
      descAr: 'خطوط طلاء إلكتروستاتيكي حراري توفر مظهراً جمالياً رائعاً ومقاومة فائقة للعوامل الجوية.',
      img: '/Image/overview-powder-coating.jpg',
      badgeEn: 'Protection',
      badgeAr: 'حماية مضاعفة',
    },
    {
      id: 'logistics-warehouse',
      titleEn: 'Logistics & Supply Hub',
      titleAr: 'المستودعات والخدمات اللوجستية',
      descEn: 'Extensive storage facility ensuring rapid dispatch and continuous supply to regional megaprojects.',
      descAr: 'مستودعات ضخمة توفر السرعة في الشحن والتوريد المستمر لأضخم المشاريع الإقليمية.',
      img: '/Image/overview-warehouse.jpg',
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
    'relative inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 text-start">
      
      {/* 1. Page Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0A1832] border border-blue-900/80 shadow-md">
          <Factory className="w-4 h-4" style={{ color: themeColor }} />
          <span>{pick('INDUSTRIAL INFRASTRUCTURE', 'البنية التحتية الصناعية')}</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          {pick('Manufacturing Overview', 'نظرة عامة على القدرات الإنتاجية')}
        </h1>
        <p className="text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
          {pick(
            'State-of-the-art automated cold-rolling, high-speed punching, and hot-dip galvanizing facilities powered by Kianko engineering.',
            'خطوط إنتاج آلية بالكامل ومصانع جلفنة حديثة مدعومة بأحدث تقنيات الهندسة وتشكيل المعادن.'
          )}
        </p>
      </div>

      {/* 2. Main Capabilities Grid (الكروت الـ 6 بتعديل لون الـ Hover للأحمر القرمزي) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {capabilities.map((card) => (
          <SpotlightCard
            as="article"
            key={card.id}
            className="group bg-[#0A1832] rounded-3xl border border-blue-900/60 shadow-xl overflow-hidden flex flex-col justify-between hover:border-slate-500 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500"
          >
            <div>
              {/* حاوية الصورة */}
              <div className="relative overflow-hidden h-52 bg-[#061022]">
                <img
                  src={card.img}
                  alt={pick(card.titleEn, card.titleAr)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute top-4 start-4 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md backdrop-blur-md bg-opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  {pick(card.badgeEn, card.badgeAr)}
                </span>
              </div>

              {/* تفاصيل الكارد مع لون الهفر المظبوط الهوية */}
              <div className="p-6 space-y-3">
                <h3 
                  className="text-xl font-bold text-white transition-colors duration-300"
                  onMouseEnter={(e) => (e.currentTarget.style.color = themeColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                >
                  {pick(card.titleEn, card.titleAr)}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pick(card.descEn, card.descAr)}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-2 border-t border-blue-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{pick('ISO Certified Process', 'عملية معتمدة بجودة ISO')}</span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* 3. Technical Metrics Bar */}
      <div className="bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border border-blue-900/60 rounded-3xl p-8 shadow-2xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-blue-900/60">
          <div className="space-y-2 pt-4 sm:pt-0">
            <span className="text-3xl font-black text-white">50,000+</span>
            <p className="text-xs font-bold text-slate-300">{pick('Tons Annual Capacity', 'طاقة إنتاجية سنوية (طن)')}</p>
          </div>
          <div className="space-y-2 pt-4 sm:pt-0">
            <span className="text-3xl font-black" style={{ color: themeColor }}>100%</span>
            <p className="text-xs font-bold text-slate-300">{pick('ASTM A123 Compliance', 'مطابقة لمعايير الجلفنة')}</p>
          </div>
          <div className="space-y-2 pt-4 sm:pt-0">
            <span className="text-3xl font-black text-white">1.0 - 3.0mm</span>
            <p className="text-xs font-bold text-slate-300">{pick('Steel Sheet Thickness', 'نطاق سُمك الصُلب المعالج')}</p>
          </div>
          <div className="space-y-2 pt-4 sm:pt-0">
            <span className="text-3xl font-black" style={{ color: themeColor }}>24/7</span>
            <p className="text-xs font-bold text-slate-300">{pick('Automated Operations', 'تشغيل خطوط الإنتاج')}</p>
          </div>
        </div>
      </div>

      {/* 4. Manufacturing Workflow Steps */}
      <div className="space-y-12 pt-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0A1832] border border-blue-900/80">
            <Workflow className="w-4 h-4 text-emerald-400" />
            <span>{pick('PRODUCTION PROCESS', 'مراحل التصنيع')}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {pick('Precision Engineering Workflow', 'خطوات دورة الإنتاج الفولاذية')}
          </h2>
          <p className="text-slate-300 text-sm">
            {pick('From raw coil inspection to hot-dip galvanizing and heavy packaging.', 'من فحص الفولاذ الخام وحتى الجلفنة والتغليف للمنشآت.')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((st) => (
            <div
              key={st.step}
              className="bg-[#0A1832] border border-blue-900/60 rounded-2xl p-6 space-y-4 relative shadow-xl hover:border-slate-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black opacity-30 text-white">{st.step}</span>
                <div className="p-2 rounded-lg bg-slate-900 border border-blue-900/80">
                  <Zap className="w-4 h-4" style={{ color: themeColor }} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{pick(st.titleEn, st.titleAr)}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{pick(st.descEn, st.descAr)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quality & Environmental Standards Section */}
      <div className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-800 border border-blue-900/80">
              {pick('SUSTAINABILITY & SAFETY', 'السلامة والاستدامة')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {pick('Eco-Friendly & Safe Manufacturing', 'تصنيع صديق للبيئة وآمن بالكامل')}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {pick(
                'Our plants utilize zero-waste acid treatment recycling systems, eco-friendly zinc filtering, and strict worker safety protocol complying with international OSHA standards.',
                'تعتمد مصانعنا على أنظمة إعادة تدوير الأحماض لمنع التلوث، وفلاتر الزنك البيئية، مع تطبيق معايير OSHA العالمية لسلامة الكوادر الفنية.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { titleEn: 'Zero Acid Waste System', titleAr: 'نظام التدوير الكامل للأحماض' },
              { titleEn: 'OSHA Safety Protocol', titleAr: 'مطابقة معايير السلامة OSHA' },
              { titleEn: 'Zinc Fume Filtration', titleAr: 'فلاتر احتجاز أدخنة الزنك' },
              { titleEn: 'Energy Efficient Machinery', titleAr: 'ماكينات موفرة للطاقة الكهربائية' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-blue-900/40">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">{pick(item.titleEn, item.titleAr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Call to Action */}
      <div className="bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border border-blue-900/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          {pick('Need Custom Steel Fabrication Specifications?', 'تحتاج مواصفات تصنيع صُلب مخصصة لمشروعك؟')}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
          {pick(
            'Our engineering team provides dedicated consultation for load calculations, custom profile rolling, and galvanizing requirements.',
            'يقدم فريقنا الهندسي استشارات مخصصة لحسابات الأحمال، وتشكيل القطاعات، ومواصفات الجلفنة لمشروعك.'
          )}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link
            to={ROUTES.contact}
            className={btnCls}
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Request Technical Consultation', 'اطلب استشارة هندسية')}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
          <Link
            to={ROUTES.products}
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all hover:scale-105 border border-blue-900/80"
          >
            <span>{pick('Explore Product Line', 'استكشف المنتجات')}</span>
          </Link>
        </div>
      </div>

    </div>
  );
}