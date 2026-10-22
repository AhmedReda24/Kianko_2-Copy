import { useEffect } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, ShieldCheck, ArrowUpLeft, ArrowUpRight, Package } from 'lucide-react';
import { ROUTES } from '../routes';

import logoImg from "../../assets/logo.webp";
import SocialLinks from './SocialLinks';

export default function Footer({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

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

  const linkCls = `group/link flex items-center gap-1.5 w-fit py-1.5 px-1 text-xs sm:text-sm transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 font-bold ${
    darkMode
      ? 'text-slate-300 hover:text-white'
      : 'text-slate-700 hover:text-slate-950'
  }`;

  const headingCls = `font-black text-sm sm:text-base mb-3.5 pb-2 border-b inline-block ${
    darkMode ? 'text-white border-blue-900/60' : 'text-slate-900 border-slate-300'
  }`;

  return (
    <footer
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        '--theme-color': themeColor,
        fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined,
      }}
      className={`pt-12 sm:pt-16 pb-20 sm:pb-12 border-t relative z-30 transition-colors duration-300 overflow-x-hidden ${
        darkMode
          ? 'bg-[#050C1E] text-slate-300 border-blue-950'
          : 'bg-slate-50 text-slate-900 border-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* الشبكة الرئيسية للفوتر — تقسيم 12 عموداً يمنع أي تداخل بين اللوجو والروابط */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-start items-start">
          
          {/* 1. عمود الهوية واللوجو ومواقع الفروع (يأخذ 4 أعمدة كاملة في اللابتوب وعمودين في التابلت) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5 min-w-0">
            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-3 group py-1 max-w-full"
              aria-label={pick('KIANKO Home', 'الرئيسية - شركة كيانكو للصناعات الحديدية')}
            >
              <div
                className={`p-1.5 rounded-2xl overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-900/80 border border-slate-700/60 shadow-inner'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                <img
                  src={logoImg}
                  alt={pick('Kianko Logo', 'شعار شركة كيانكو')}
                  width="150"
                  height="45"
                  className="h-9 sm:h-11 w-auto object-contain rounded-lg"
                  style={{
                    filter: 'drop-shadow(0px 2px 6px rgba(201, 37, 44, 0.35))',
                  }}
                />
              </div>

              <div className="leading-snug min-w-0">
                <h3
                  className={`font-black text-base sm:text-xl tracking-wide truncate ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {isAr ? (
                    <>
                      <span style={{ color: themeColor }}>كيانكو</span> للصناعات الحديدية
                    </>
                  ) : (
                    <>
                      <span style={{ color: themeColor }}>KIANKO</span> COMPANY
                    </>
                  )}
                </h3>
                <p
                  className={`text-[10px] sm:text-[11px] font-bold mt-0.5 uppercase tracking-wider truncate ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {pick('KIAN IRON PRODUCTS COMPANY', 'شركة كيان لمنتجات الحديد — السعودية')}
                </p>
              </div>
            </Link>

            <p
              className={`text-xs sm:text-sm font-medium leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              {pick(
                'Precision engineering, cable management systems, and structural steel manufacturing solutions across Saudi Arabia and the MENA region.',
                'حلول هندسية متكاملة لتصنيع أنظمة حوامل الكابلات والمقاطع المعدنية وتشكيل المعادن فائقة الدقة في المملكة العربية السعودية والشرق الأوسط.'
              )}
            </p>

            {/* شارات الفروع السريعة */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  darkMode ? 'bg-[#0A1832] border-blue-900/60 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                <span>{pick('Jeddah (Head Office)', 'جدة (المكتب الرئيسي)')}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  darkMode ? 'bg-[#0A1832] border-blue-900/60 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                <span>{pick('Riyadh Branch', 'فرع الرياض')}</span>
              </span>
            </div>

            {/* أيقونات التواصل الاجتماعي مع هامش أمان يمنع تغطيتها بأيقونة الشات */}
            <div className="pt-1 pe-14 sm:pe-0">
              <SocialLinks themeColor={themeColor} isAr={isAr} darkMode={darkMode} />
            </div>
          </div>

          {/* 2. عمود الشركة (عمودان في اللابتوب) */}
          <nav className="lg:col-span-2 space-y-1" aria-label={pick('Company', 'الشركة')}>
            <h4 className={headingCls}>{pick('Company', 'الشركة')}</h4>
            <Link to={ROUTES.home} className={linkCls}>
              <span>{pick('Home', 'الرئيسية')}</span>
            </Link>
            <Link to={ROUTES.story} className={linkCls}>
              <span>{pick('Our Story', 'قصتنا')}</span>
            </Link>
            <Link to={ROUTES.overview} className={linkCls}>
              <span>{pick('Overview', 'نظرة عامة')}</span>
            </Link>
            <Link to={ROUTES.values} className={linkCls}>
              <span>{pick('Our Values', 'قيمنا')}</span>
            </Link>
            <Link to={ROUTES.locations} className={linkCls}>
              <span>{pick('Branches & Office', 'الفروع والمكتب')}</span>
            </Link>
          </nav>

          {/* 3. عمود الجودة والاعتمادات (3 أعمدة في اللابتوب) */}
          <nav className="lg:col-span-3 space-y-1" aria-label={pick('Compliance & Quality', 'الجودة والاعتمادات')}>
            <h4 className={headingCls}>{pick('Quality & Accreditations', 'الجودة والاعتمادات')}</h4>
            <Link to={ROUTES.quality} className={linkCls}>
              <span>{pick('Governance & Quality', 'الحوكمة والجودة')}</span>
            </Link>
            <Link to={ROUTES.iso} className={linkCls}>
              <span>{pick('ISO Certifications', 'شهادات الأيزو')}</span>
            </Link>
            <Link to={ROUTES.projects} className={linkCls}>
              <span>{pick('Regional Projects', 'المشاريع الإقليمية')}</span>
            </Link>
            <Link to={ROUTES.careers} className={linkCls}>
              <span>{pick('Careers at KIANKO', 'الوظائف الهندسية')}</span>
            </Link>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {['ISO 9001', 'ISO 14001', 'ISO 45001'].map((iso) => (
                <span
                  key={iso}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                    darkMode
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span>{iso}</span>
                </span>
              ))}
            </div>
          </nav>

          {/* 4. عمود المنتجات والتواصل المباشر (3 أعمدة في اللابتوب) */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <h4 className={headingCls}>{pick('Products & Direct Contact', 'المنتجات والتواصل')}</h4>

            <div className="space-y-2">
              <Link
                to={ROUTES.products}
                className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all hover:border-red-500 ${
                  darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                  <span>{pick('Product Catalog (13 Lines)', 'كتالوج المنتجات (13 خط إنتاج)')}</span>
                </span>
                <ArrowIcon className="w-4 h-4 shrink-0 opacity-75" />
              </Link>

              <Link
                to={ROUTES.contact}
                className="w-full text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 min-h-[46px] hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                style={{ backgroundColor: themeColor }}
                aria-label={pick('Contact Us Now', 'تواصل معنا الآن')}
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{pick('Request Quotation / Contact Us', 'تواصل معنا الآن')}</span>
              </Link>
            </div>

            <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {pick(
                'Need official submittals, PQL files, or BOQ pricing? Our engineering team responds promptly.',
                'تحتاج ملفات الاعتماد الرسمي (PQL & Submittals) أو تسعير مقاولات؟ فريقنا الهندسي في خدمتك.'
              )}
            </p>
          </div>

        </div>

        {/* الشريط السفلي لحقوق الملكية (مترجم بالكامل عربي / إنجليزي) */}
        <div
          className={`pt-6 sm:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start text-xs font-bold px-10 sm:px-0 ${
            darkMode
              ? 'border-blue-950/80 text-slate-400'
              : 'border-slate-300 text-slate-600'
          }`}
        >
          <p>
            {pick(
              `© ${new Date().getFullYear()} KIANKO Steel Industries. All rights reserved.`,
              `© ${new Date().getFullYear()} جميع الحقوق محفوظة لشركة كيانكو للصناعات الحديدية.`
            )}
          </p>
          <p className="text-[11px] opacity-80">
            {pick(
              'Kingdom of Saudi Arabia — Jeddah & Riyadh',
              'المملكة العربية السعودية — جدة والرياض'
            )}
          </p>
        </div>

      </div>
    </footer>
  );
}