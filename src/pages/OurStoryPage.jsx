import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Factory, Cpu, ArrowRight, CheckCircle2, History, Play, Pause, Download } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../routes';

// مكون العداد المتحرك (Animated Counter)
function Counter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function OurStoryPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  // مرجع لتشغيل وإيقاف الفيديو يدوياً
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // بيانات المحطات الزمنية
  const timelineEvents = [
    {
      year: '1998',
      titleEn: 'Foundation & Steel Fabrication',
      titleAr: 'التأسيس وانطلاق تشكيل الصلب',
      descEn: 'Started operations with localized steel profile rolling and manual fabrication.',
      descAr: 'بدء العمليات بتصنيع وتشكيل قطاعات الصُلب وتلبية احتياجات السوق المحلي.',
    },
    {
      year: '2010',
      titleEn: 'Automated Cable Management Lines',
      titleAr: 'تدشين خطوط الكابلات الآلية',
      descEn: 'Introduced high-speed automated punching & rolling for cable trays and ladders.',
      descAr: 'إدخال ماكينات التثقيب والتدلفين الآلية لإنتاج حوامل وسلالم الكابلات.',
    },
    {
      year: '2018',
      titleEn: 'Hot-Dip Galvanization Facility',
      titleAr: 'مجمع الجلفنة على الساخن',
      descEn: 'Expanded capacity with in-house hot-dip galvanizing lines ensuring ISO corrosion protection.',
      descAr: 'التوسع بإنشاء خطوط الجلفنة على الساخن لضمان أقصى درجات الحماية من التآكل.',
    },
    {
      year: '2026',
      titleEn: 'Regional Megaprojects Leadership',
      titleAr: 'الريادة في المشاريع القومية الإقليمية',
      descEn: 'Supplying high-grade structural steel and cable systems to major MENA developments.',
      descAr: 'توريد أنظمة الصلب وحوامل الكابلات لأكبر كبرى المشاريع بالشرق الأوسط.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 text-center sm:text-start overflow-hidden">
      
      {/* 1. Header & Banner Section */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center bg-[#0A1832] border border-blue-900/60 rounded-3xl p-5 sm:p-10 shadow-2xl">
        <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
          <span className="px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase inline-block" style={{ backgroundColor: themeColor }}>
            {isAr ? 'قصتنا وتأسيسنا' : 'OUR HERITAGE'}
          </span>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight">
            {isAr ? 'عقود من التميز والصناعة الثقيلة' : 'Decades of Industrial Steel Leadership'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-prose mx-auto sm:mx-0 text-center sm:text-start">
            {isAr
              ? 'نروي قصة ريادة امتدت لعقود في ابتكار وتصنيع أنظمة الصلب وحوامل الكابلات، لنكون الشريك الأساسي في أضخم المشاريع الإنشائية والصناعية بالمنطقة.'
              : 'We pioneer decades of excellence in manufacturing advanced steel structures and cable systems, empowering major regional infrastructure.'}
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-blue-900/60 shadow-xl bg-[#061022] w-full aspect-[4/3] sm:aspect-auto sm:h-80">
          <img
            src="/Image/Our Story.jpg"
            alt="Kianko Steel History"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* 2. Main Content Section (Story + Video Player) */}
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="space-y-4 sm:space-y-6 leading-relaxed text-sm sm:text-base flex flex-col items-center sm:items-start text-center sm:text-start">
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-snug">
            {isAr ? 'تاريخ ممتد في تشكيل المعادن وتلبية المشاريع' : 'Building Strong Foundations Across the Region'}
          </h2>

          <p className="text-slate-300 font-medium text-xs sm:text-sm">
            {isAr
              ? 'تأسست كيانكو للصناعات الحديدية كأحد الصروح الصناعية الرائدة المتخصصة في إنتاج وتشكيل قطاعات الصُلب، وحوامل الكابلات الهندسية، والسلالم المعدنية الفولاذية بمختلف المواصفات.'
              : 'Kianko For Steel Industries was established to pioneer precision steel fabrication, cable management systems, and heavy structural profiles engineered to world-class standards.'}
          </p>

          <p className="text-slate-300 font-medium text-xs sm:text-sm">
            {isAr
              ? 'نمضي بخطى ثابتة نحو تطوير خطوط الإنتاج والاعتماد على أحدث ماكينات التدلفين الدقيق والجلفنة على الساخن لتقديم حلول متكاملة تُنفذ في كبرى المشاريع بالشرق الأوسط.'
              : 'Our commitment to engineering accuracy and continuous technological investment has secured Kianko as a cornerstone partner for major national infrastructure developments.'}
          </p>
        </div>

        {/* تم سنترة مشغل الفيديو وضبطه تماماً */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/60 bg-slate-900 w-full max-w-lg mx-auto aspect-video sm:aspect-auto sm:h-80 flex items-center justify-center group">
          <video
            ref={videoRef}
            src="/Image/OurStory.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={toggleVideoPlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="p-3 sm:p-4 rounded-full bg-black/60 text-white backdrop-blur-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:scale-110 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />}
            </button>
          </div>
          <span className="absolute bottom-3 start-3 bg-black/70 text-white px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold backdrop-blur-md pointer-events-none">
            {isAr ? 'خطوط إنتاج كيانكو' : 'Kianko Production Lines'}
          </span>
        </div>
      </div>

      {/* 3. Dynamic Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {[
          { target: 25, suffix: '+', labelEn: 'Years of Experience', labelAr: 'سنوات من الخبرة الريادية' },
          { target: 500, suffix: '+', labelEn: 'Major Projects Delivered', labelAr: 'مشروع قومي وصناعي منجز' },
          { target: 100, suffix: '%+', labelEn: 'Quality Compliance', labelAr: 'مطابقة تامة للمواصفات العالمية' },
          { target: 10, suffix: '+', labelEn: 'Export Countries', labelAr: 'دولة تصل إليها منتجاتنا' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A1832] border border-blue-900/60 rounded-2xl p-4 sm:p-6 text-center space-y-1.5 sm:space-y-2 shadow-xl hover:border-slate-500 transition-colors flex flex-col justify-center items-center">
            <h3 className="text-2xl sm:text-4xl font-black" style={{ color: themeColor }}>
              <Counter target={stat.target} suffix={stat.suffix} />
            </h3>
            <p className="text-slate-300 font-semibold text-xs sm:text-sm">{pick(stat.labelEn, stat.labelAr)}</p>
          </div>
        ))}
      </div>

      {/* 4. Timeline Section */}
      <div className="space-y-8 sm:space-y-12 pt-4 sm:pt-8 flex flex-col items-center">
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto px-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-800 border border-blue-900/80">
            <History className="w-4 h-4 text-red-500" />
            <span>{pick('OUR JOURNEY', 'رحلة التطور')}</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            {pick('Key Milestones in Our Evolution', 'محطات رئيسية في مسيرة نمونا')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative w-full text-center sm:text-start">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="bg-[#0A1832] border border-blue-900/60 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl hover:border-slate-400 transition-all flex flex-col items-center sm:items-start">
              <span className="text-xl sm:text-2xl font-black px-3 py-1 rounded-lg bg-slate-900 border border-blue-900/80 inline-block" style={{ color: themeColor }}>
                {evt.year}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">{pick(evt.titleEn, evt.titleAr)}</h3>
              <p className="text-slate-300 text-xs leading-relaxed text-center sm:text-start">{pick(evt.descEn, evt.descAr)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Core Pillars Section */}
      <div className="space-y-8 sm:space-y-12 pt-4 flex flex-col items-center">
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto px-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            {pick('Our Core Manufacturing Pillars', 'ركائز التصنيع الأساسية لدينا')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            {pick(
              'Driven by innovation, precision engineering, and uncompromising safety standards.',
              'مدفوعون بالابتكار، الهندسة الدقيقة، ومعايير السلامة التي لا تقبل التنازل.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 w-full text-center sm:text-start">
          {[
            {
              icon: Factory,
              titleEn: 'Advanced Production Lines',
              titleAr: 'خطوط إنتاج متطورة',
              descEn: 'State-of-the-art rolling, punching, and automated coating lines ensuring absolute structural uniformity.',
              descAr: 'خطوط تدلفين وتثقب وتغطية آلية حديثة تضمن التناسق الهيكلي المطلق.',
            },
            {
              icon: ShieldCheck,
              titleEn: 'Rigorous Quality Testing',
              titleAr: 'اختبارات جودة صارمة',
              descEn: 'Every batch undergoes strict load-bearing, galvanization thickness, and corrosion resistance testing.',
              descAr: 'تخضع كل دفعة لاختبارات صارمة لتحمل الأحمال وسمك الجلفنة ومقاومة التآكل.',
            },
            {
              icon: Cpu,
              titleEn: 'Engineering Precision',
              titleAr: 'دقة هندسية عالية',
              descEn: 'Computer-aided design and automated fabrication tailored for complex electrical and mechanical layouts.',
              descAr: 'تصميم بمساعدة الحاسوب وتصنيع آلي مخصص للتمديدات الكهربائية والميكانيكية المعقدة.',
            },
          ].map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div key={idx} className="bg-[#0A1832] border border-blue-900/60 rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4 shadow-xl hover:border-slate-500 transition-all flex flex-col items-center sm:items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-blue-900/80 shadow-inner">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: themeColor }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{pick(pillar.titleEn, pillar.titleAr)}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-center sm:text-start">{pick(pillar.descEn, pillar.descAr)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Quality & Compliance Section */}
      <div className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-5 sm:p-12 space-y-6 sm:space-y-8 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3 sm:space-y-4 flex flex-col items-center sm:items-start text-center sm:text-start">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-800 border border-blue-900/80 inline-block">
              {pick('GLOBAL STANDARDS', 'المعايير الدولية')}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
              {pick('Certified Excellence & Compliance', 'اعتمادات جودة موثوقة ومطابقة')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {pick(
                'Our manufacturing facility complies with international ISO standards and regional electrical coding guidelines.',
                'تلتزم جميع منتجاتنا وخطوط الإنتاج بأعلى معايير ISO العالمية وأكواد السلامة الميكانيكية والكهربائية.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { titleEn: 'ISO 9001 Certified', titleAr: 'شهادة إدارة الجودة ISO 9001' },
              { titleEn: 'ASTM Galvanizing Specs', titleAr: 'مطابقة مواصفات الجلفنة ASTM' },
              { titleEn: 'NEMA VE-1 Compliant', titleAr: 'معايير NEMA VE-1 لحوامل الكابلات' },
              { titleEn: '100% Load-Tested Steel', titleAr: 'صلب مفحوص 100% لتحمل الأحمال' },
            ].map((cert, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 text-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">{pick(cert.titleEn, cert.titleAr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Call to Action Section */}
      <div className="bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border border-blue-900/60 rounded-3xl p-6 sm:p-12 text-center space-y-5 sm:space-y-6 shadow-2xl flex flex-col items-center">
        <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-snug max-w-2xl mx-auto px-2">
          {pick('Ready to Explore Our Advanced Product Lines?', 'هل أنت مستعد لاستعراض خطوط إنتاجنا؟')}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm">
          {pick(
            'Discover our comprehensive catalog of cable management systems, steel channels, and building accessories.',
            'اكتشف كتالوجنا الشامل لأنظمة إدارة الكابلات، القطاعات المعدنية، وملحقات البناء.'
          )}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
          <Link
            to={ROUTES.products}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('View Product Catalog', 'عرض كتالوج المنتجات')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </Link>
          <a
            href="/Image/Kianko-Profile.pdf" 
            download
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 shadow-xl transition-all hover:scale-105 border border-blue-900/80"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{pick('Download Company Profile', 'تحميل بروفايل الشركة')}</span>
          </a>
        </div>
      </div>

    </div>
  );
}