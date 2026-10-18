import { Link } from 'react-router';
import { ROUTES } from '../routes';
import logoImg from "../../assets/logo.png";
import SocialLinks from './SocialLinks';

export default function Footer({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  
  // تنسيق الروابط بحيث يتغير لونها للثيم ويظهر تحتها خط عند الـ hover في الدارك واللايت
  const linkCls = `block w-fit transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1 hover:underline underline-offset-4 ${
    darkMode 
      ? 'text-slate-300 hover:text-white' 
      : 'text-slate-700 hover:text-slate-950'
  } font-medium`;

  return (
    <footer 
      className={`pt-12 sm:pt-16 pb-8 sm:pb-10 border-t relative z-30 transition-colors duration-300 ${
        darkMode 
          ? 'bg-[#050C1E] text-slate-300 border-blue-950' 
          : 'bg-slate-100 text-slate-800 border-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* شبكة متجاوبة: عمود واحد للموبايل، عمودين للتابلت، 4 أعمدة للشاشات الكبيرة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-start">
          
          {/* قسم اللوجو والوصف */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to={ROUTES.home} className="flex items-center gap-3 group">
              {/* نفس تدوير وإطار الناف بار المطابق 100% */}
              <div 
                className={`p-2.5 rounded-3xl border transition-all duration-300 group-hover:scale-105 shrink-0 ${
                  darkMode ? 'bg-slate-900/90 border-blue-900/60 shadow-md' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <img 
                  src={logoImg} 
                  alt="Kianko Logo" 
                  className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(201,37,44,0.3)]" 
                />
              </div>
              <div>
                <h3 className={`font-extrabold text-base sm:text-lg tracking-wider ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  KIANKO <span style={{ color: themeColor }}>COMPANY</span>
                </h3>
                <p className={`text-[10px] font-semibold ${
                  darkMode ? 'text-blue-300' : 'text-slate-600'
                }`}>
                  {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
                </p>
              </div>
            </Link>
            
            <p className={`text-xs leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {isAr
                ? 'حلول هندسية وتشكيل معادن فائقة الدقة في الشرق الأوسط.'
                : 'Precision engineering and steel manufacturing solutions across the MENA region.'}
            </p>
            
            <SocialLinks themeColor={themeColor} isAr={isAr} />
          </div>

          {/* قائمة الشركة */}
          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الشركة' : 'Company'}>
            <h4 className={`font-bold text-sm mb-2 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isAr ? 'الشركة' : 'Company'}
            </h4>
            <Link to={ROUTES.story} className={linkCls} style={{ '--hover-color': themeColor }} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'قصتنا' : 'Our Story'}</Link>
            <Link to={ROUTES.overview} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'نظرة عامة' : 'Overview'}</Link>
            <Link to={ROUTES.locations} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الفروع والمكتب' : 'Branches & Office'}</Link>
          </nav>

          {/* قائمة الجودة والحوكمة */}
          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الجودة والحوكمة' : 'Compliance'}>
            <h4 className={`font-bold text-sm mb-2 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isAr ? 'الجودة والحوكمة' : 'Compliance'}
            </h4>
            <Link to={ROUTES.quality} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الحوكمة والجودة' : 'Governance & Quality'}</Link>
            <Link to={ROUTES.iso} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'شهادات الأيزو' : 'ISO Certifications'}</Link>
            <Link to={ROUTES.careers} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'الوظائف' : 'Careers'}</Link>
          </nav>

          {/* قائمة المشاريع والتواصل */}
          <nav className="space-y-3 text-xs" aria-label={isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}>
            <h4 className={`font-bold text-sm mb-2 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}
            </h4>
            <Link to={ROUTES.projects} className={linkCls} onMouseEnter={(e) => e.target.style.color = themeColor} onMouseLeave={(e) => e.target.style.color = ''}>{isAr ? 'المشاريع الإقليمية' : 'Regional Projects'}</Link>
            <div className="pt-1">
              <Link
                to={ROUTES.contact}
                className="text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md inline-block hover:opacity-90 active:scale-95"
                style={{ backgroundColor: themeColor }}
              >
                {isAr ? 'تواصل معنا الآن' : 'Contact Us'}
              </Link>
            </div>
          </nav>

        </div>

        {/* حقوق النشر والتذييل السفلي */}
        <div className={`pt-6 sm:pt-8 border-t text-center text-[11px] sm:text-xs font-medium ${
          darkMode 
            ? 'border-blue-950/80 text-slate-400' 
            : 'border-slate-300 text-slate-600'
        }`}>
          <p>All rights reserved to KIANKO COMPANY . ©{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}