import { Link } from 'react-router';
import { ROUTES } from '../routes';
import logoImg from "../../assets/logo.png";
import SocialLinks from './SocialLinks';

export default function Footer({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  
  const linkCls = `block w-fit transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1 ${
    darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900 font-semibold'
  }`;

  return (
    <footer className={`pt-16 pb-10 border-t relative z-30 transition-colors duration-300 ${
      darkMode ? 'bg-[#050C1E] text-slate-300 border-blue-950' : 'bg-slate-100 text-slate-700 border-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid md:grid-cols-4 gap-8 text-start">
          <div className="space-y-4 md:col-span-1">
            <Link to={ROUTES.home} className="flex items-center gap-3 group">
              {/* تم إزالة الخلفية البيضاء والإطار لتصبح الصورة منسجمة مع الهيدر */}
              <div className="p-1 transition-transform duration-300 group-hover:scale-105">
                <img src={logoImg} alt="Kianko Logo" className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(201,37,44,0.3)]" />
              </div>
              <div>
                <h3 className={`font-extrabold text-lg tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  KIANKO <span style={{ color: themeColor }}>COMPANY</span>
                </h3>
                <p className={`text-[10px] font-semibold ${darkMode ? 'text-blue-300' : 'text-slate-500'}`}>
                  {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
                </p>
              </div>
            </Link>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {isAr
                ? 'حلول هندسية وتشكيل معادن فائقة الدقة في الشرق الأوسط.'
                : 'Precision engineering and steel manufacturing solutions across the MENA region.'}
            </p>
            <SocialLinks themeColor={themeColor} isAr= {isAr} />
          </div>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الشركة' : 'Company'}>
            <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{isAr ? 'الشركة' : 'Company'}</h4>
            <Link to={ROUTES.story} className={linkCls}>{isAr ? 'قصتنا' : 'Our Story'}</Link>
            <Link to={ROUTES.overview} className={linkCls}>{isAr ? 'نظرة عامة' : 'Overview'}</Link>
            <Link to={ROUTES.locations} className={linkCls}>{isAr ? 'الفروع والمكتب' : 'Branches & Office'}</Link>
          </nav>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الجودة والحوكمة' : 'Compliance'}>
            <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{isAr ? 'الجودة والحوكمة' : 'Compliance'}</h4>
            <Link to={ROUTES.quality} className={linkCls}>{isAr ? 'الحوكمة والجودة' : 'Governance & Quality'}</Link>
            <Link to={ROUTES.iso} className={linkCls}>{isAr ? 'شهادات الأيزو' : 'ISO Certifications'}</Link>
            <Link to={ROUTES.careers} className={linkCls}>{isAr ? 'الوظائف' : 'Careers'}</Link>
          </nav>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}>
            <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}</h4>
            <Link to={ROUTES.projects} className={linkCls}>{isAr ? 'المشاريع الإقليمية' : 'Regional Projects'}</Link>
            <Link
              to={ROUTES.contact}
              className="mt-2 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md inline-block hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              {isAr ? 'تواصل معنا الآن' : 'Contact Us'}
            </Link>
          </nav>
        </div>

        <div className={`pt-8 border-t text-center text-xs font-medium ${
          darkMode ? 'border-blue-950/80 text-slate-500' : 'border-slate-300 text-slate-500'
        }`}>
          <p>All rights reserved to KIANKO COMPANY . ©{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}