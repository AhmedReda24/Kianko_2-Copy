import { Link } from 'react-router';
import { ROUTES } from '../routes';
import logoImg from '../../assets/logo.png';
import SocialLinks from './SocialLinks';

export default function Footer({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const linkCls = 'block w-fit hover:text-white transition-all duration-300 hover:translate-x-1 rtl:hover:-translate-x-1';

  return (
    <footer className="bg-[#050C1E] text-slate-300 pt-16 pb-10 border-t border-blue-950 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link to={ROUTES.home} className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl shadow-md border border-slate-200">
                <img src={logoImg} alt="Kianko Logo" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-wider">
                  KIANKO <span style={{ color: themeColor }}>COMPANY</span>
                </h3>
                <p className="text-[10px] text-blue-300 font-semibold">
                  {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
                </p>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'حلول هندسية وتشكيل معادن فائقة الدقة في الشرق الأوسط.'
                : 'Precision engineering and steel manufacturing solutions across the MENA region.'}
            </p>
            <SocialLinks themeColor={themeColor} isAr={isAr} />
          </div>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الشركة' : 'Company'}>
            <h4 className="font-bold text-white text-sm mb-2">{isAr ? 'الشركة' : 'Company'}</h4>
            <Link to={ROUTES.story} className={linkCls}>{isAr ? 'قصتنا' : 'Our Story'}</Link>
            <Link to={ROUTES.overview} className={linkCls}>{isAr ? 'نظرة عامة' : 'Overview'}</Link>
            <Link to={ROUTES.locations} className={linkCls}>{isAr ? 'الفروع والمكتب' : 'Branches & Office'}</Link>
          </nav>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'الجودة والحوكمة' : 'Compliance'}>
            <h4 className="font-bold text-white text-sm mb-2">{isAr ? 'الجودة والحوكمة' : 'Compliance'}</h4>
            <Link to={ROUTES.quality} className={linkCls}>{isAr ? 'الحوكمة والجودة' : 'Governance & Quality'}</Link>
            <Link to={ROUTES.iso} className={linkCls}>{isAr ? 'شهادات الأيزو' : 'ISO Certifications'}</Link>
            <Link to={ROUTES.careers} className={linkCls}>{isAr ? 'الوظائف' : 'Careers'}</Link>
          </nav>

          <nav className="space-y-3 text-xs" aria-label={isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}>
            <h4 className="font-bold text-white text-sm mb-2">{isAr ? 'المشاريع والتواصل' : 'Projects & Contact'}</h4>
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

        <div className="pt-8 border-t border-blue-950/80 text-center text-xs text-slate-500 font-medium">
          <p>All rights reserved to KIANKO COMPANY . ©{new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
