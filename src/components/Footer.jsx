import { Link } from 'react-router';
import { ROUTES } from '../routes';

import logoImg from "../../assets/logo.webp";
import SocialLinks from './SocialLinks';

export default function Footer({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  
  const linkCls = `block w-fit py-2 px-1 transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1 hover:underline underline-offset-4 font-bold ${
    darkMode 
      ? 'text-slate-300 hover:text-white' 
      : 'text-slate-800 hover:text-black' 
  }`;

  return (
    <footer 
      className={`pt-12 sm:pt-16 pb-8 sm:pb-10 border-t relative z-30 transition-colors duration-300 ${
        darkMode 
          ? 'bg-[#050C1E] text-slate-300 border-blue-950' 
          : 'bg-slate-50 text-slate-900 border-slate-300' 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-start">
          
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to={ROUTES.home} className="flex items-center gap-2 sm:gap-3 group py-2">
              <div 
                className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-900/60 border border-slate-700/50 shadow-inner' 
                    : 'bg-slate-50 border border-slate-200/80 shadow-sm'
                }`}
              >
                <img 
                  src={logoImg} 
                  alt={isAr ? "شعار شركة كيانكو" : "Kianko Logo"}
                  width="150"
                  height="45"
                  className="h-8 sm:h-11 w-auto object-contain rounded-lg" 
                  style={{
                    filter: `drop-shadow(0px 2px 6px rgba(201, 37, 44, 0.35))`
                  }}
                />
              </div>
              <div className="leading-tight">
                <h3 className={`font-extrabold text-base sm:text-lg tracking-wider drop-shadow-sm ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  KIANKO <span style={{ color: themeColor }}>COMPANY</span>
                </h3>
                <p className={`text-[10px] font-bold mt-0.5 uppercase tracking-widest ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
                </p>
              </div>
            </Link>
            
            <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-700' 
            }`}>
              {isAr
                ? 'حلول هندسية وتشكيل معادن فائقة الدقة في الشرق الأوسط.'
                : 'Precision engineering and steel manufacturing solutions across the MENA region.'}
            </p>
            
            <SocialLinks themeColor={themeColor} isAr={isAr} darkMode={darkMode} />
          </div>

          <nav className="space-y-1 text-xs sm:text-sm" aria-label={isAr ? 'الشركة' : 'Company'}>
            <h4 className={`font-black text-sm sm:text-base mb-3 px-1 ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              {isAr ? 'الشركة' : 'Company'}
            </h4>
            <Link to={ROUTES.story} className={linkCls} style={{ '--hover-color': themeColor }} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'قصتنا' : 'Our Story'}</Link>
            <Link to={ROUTES.overview} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'نظرة عامة' : 'Overview'}</Link>
            <Link to={ROUTES.locations} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الفروع والمكتب' : 'Branches & Office'}</Link>
          </nav>

          <nav className="space-y-1 text-xs sm:text-sm" aria-label={isAr ? 'الجودة والحوكمة' : 'Compliance'}>
            <h4 className={`font-black text-sm sm:text-base mb-3 px-1 ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              {isAr ? 'الجودة والاعتمادات' : 'Compliance'}
            </h4>
            <Link to={ROUTES.quality} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الجودة والاعتمادات' : 'Quality and Accreditations'}</Link>
            <Link to={ROUTES.iso} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'شهادات الأيزو' : 'ISO Certifications'}</Link>
            <Link to={ROUTES.careers} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الوظائف' : 'Careers'}</Link>
          </nav>

          <nav className="space-y-1 text-xs sm:text-sm" aria-label={isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}>
            <h4 className={`font-black text-sm sm:text-base mb-3 px-1 ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              {isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}
            </h4>
            <Link to={ROUTES.projects} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'المشاريع الإقليمية' : 'Regional Projects'}</Link>
            <div className="pt-3">
              <Link
                to={ROUTES.contact}
                className="text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg inline-flex items-center justify-center min-h-[44px] hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                style={{ backgroundColor: themeColor }}
                aria-label={isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
              >
                {isAr ? 'تواصل معنا الآن' : 'Contact Us'}
              </Link>
            </div>
          </nav>

        </div>

        <div className={`pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm font-bold tracking-wide ${
          darkMode 
            ? 'border-blue-950/80 text-slate-300' 
            : 'border-slate-300 text-slate-700'
        }`}>
          <p>All rights reserved to KIANKO COMPANY . ©{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}