import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { ROUTES } from '../routes';

import logoImg from "../../assets/logo.webp";

const pages = {
  home: { en: 'Home', ar: 'الرئيسية' },
  story: { en: 'Our Story', ar: 'قصتنا' },
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  values: { en: 'Our Values', ar: 'قيمنا' },
  quality: { en: 'Governance & Quality', ar: 'الحوكمة والجودة' },
  iso: { en: 'ISO Certifications', ar: 'شهادات الأيزو' },
  locations: { en: 'Branches & Office', ar: 'الفروع والمكتب' },
  careers: { en: 'Careers', ar: 'الوظائف' },
  projects: { en: 'Regional Projects', ar: 'المشاريع الإقليمية' },
  products: { en: 'Products', ar: 'المنتجات' },
  contact: { en: 'Contact Us', ar: 'تواصل معنا' },
};

const before = ['home', 'story', 'overview', 'values'];
const group = ['quality', 'iso', 'locations', 'careers', 'projects'];
const after = ['products', 'contact'];
const allIds = [...before, ...group, ...after];

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';
const popIn = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
  transition: { duration: 0.18 },
};

export default function Navbar({ lang, setLang, darkMode, setDarkMode, themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const t = (id) => (isAr ? pages[id].ar : pages[id].en);
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  const groupActive = group.some((id) => ROUTES[id] === pathname);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen]);

  const panel = darkMode ? 'bg-[#061024] border-blue-900 text-white' : 'bg-white border-slate-200 text-slate-800';
  const iconBtn = darkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-700';

  const Underline = () => (
    <motion.span
      layoutId="nav-underline"
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full pointer-events-none"
      style={{ backgroundColor: themeColor }}
      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
    />
  );

  const desktopLink = (id) => (
    <NavLink
      key={id}
      to={ROUTES[id]}
      end={id === 'home'}
      style={({ isActive }) => ({ color: isActive ? themeColor : undefined })}
      className={({ isActive }) =>
        `relative py-2 px-1 transition-colors cursor-pointer ${focusRing} ${
          isActive
            ? ''
            : 'hover:opacity-90 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left rtl:after:origin-right after:scale-x-0 after:bg-current after:opacity-50 after:transition-transform after:duration-300 hover:after:scale-x-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {t(id)}
          {isActive && <Underline />}
        </>
      )}
    </NavLink>
  );

  return (
    <nav
      aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'shadow-2xl backdrop-blur-md' : 'shadow-lg'
      } ${
        darkMode
          ? `${scrolled ? 'bg-[#0A1832]/90' : 'bg-[#0A1832]'} border-blue-900/40 text-white`
          : `${scrolled ? 'bg-white/90' : 'bg-white'} border-slate-200 text-slate-800`
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          
          <Link to={ROUTES.home} className={`flex items-center gap-2 sm:gap-3 group py-2 cursor-pointer shrink-0 ${focusRing}`} aria-label={isAr ? 'الرئيسية - شركة كيانكو' : 'Home - KIANKO COMPANY'}>
            
            <div className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 ${
              darkMode 
                ? 'bg-slate-900/60 border border-slate-700/50 shadow-inner' 
                : 'bg-slate-50 border border-slate-200/80 shadow-sm'
            }`}>
              <img 
                src={logoImg} 
                alt={isAr ? "شعار شركة كيانكو" : "KIANKO Logo"}
                width="150"
                height="45" 
                className={`w-auto object-contain rounded-lg transition-[height] duration-300 ${scrolled ? 'h-7 sm:h-9' : 'h-8 sm:h-11'}`} 
                style={{
                  filter: `drop-shadow(0px 2px 6px rgba(201, 37, 44, 0.35))`
                }}
              />
            </div>

            <div className="text-start leading-tight">
             <span className={`block font-black tracking-wider text-sm sm:text-xl drop-shadow-md transition-[font-size] duration-300 ${scrolled ? 'sm:text-xl' : 'sm:text-2xl'}`} style={{ color: themeColor }}>
                KIANKO <span className={darkMode ? 'text-white' : 'text-slate-900'}>COMPANY</span>
              </span>
              <span className={`hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-semibold transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-4 opacity-100'}`}>
                {isAr ? 'شركة كيان لمنتجات الحديد' : 'KIAN IRON PRODUCTS COMPANY'}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs font-bold">
            {before.map(desktopLink)}

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={`relative flex items-center gap-1 py-2 px-1 cursor-pointer hover:opacity-90 ${focusRing}`}
                style={{ color: groupActive ? themeColor : undefined }}
              >
                <span>{isAr ? 'الشركة والجودة' : 'Company & Quality'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                {groupActive && <Underline />}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div {...popIn} className={`absolute top-full start-0 mt-3 w-56 border rounded-xl shadow-2xl py-2 z-50 origin-top ${panel}`}>
                    {group.map((id) => (
                      <NavLink
                        key={id}
                        to={ROUTES[id]}
                        onClick={() => setDropdownOpen(false)}
                        style={({ isActive }) => ({ color: isActive ? themeColor : undefined })}
                        className={`block text-start px-4 py-3 text-xs font-semibold cursor-pointer transition-all hover:ps-5 ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} ${focusRing}`}
                      >
                        {t(id)}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {after.map(desktopLink)}

            <div className="h-6 w-px bg-slate-400/40 mx-1 pointer-events-none" />

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')}
              className={`p-2 rounded-xl hover:scale-110 cursor-pointer transition-transform min-h-[36px] min-w-[36px] flex items-center justify-center ${iconBtn} ${focusRing}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={darkMode ? 'sun' : 'moon'}
                  className="block"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {darkMode ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              aria-label={isAr ? 'التغيير إلى اللغة الإنجليزية' : 'Switch to Arabic'}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl shadow-md cursor-pointer hover:opacity-90 hover:-translate-y-0.5 transition-all min-h-[36px] ${focusRing}`}
              style={{ backgroundColor: themeColor }}
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={`p-2 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${focusRing}`}
              aria-label={isOpen ? (isAr ? 'إغلاق القائمة' : 'Close menu') : (isAr ? 'فتح القائمة' : 'Open menu')}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-7 h-7" aria-hidden="true" /> : <Menu className="w-7 h-7" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={`border-t px-4 py-6 space-y-4 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto ${
                darkMode ? 'bg-[#061024] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex flex-col space-y-2">
                {allIds.map((id) => (
                  <NavLink
                    key={id}
                    to={ROUTES[id]}
                    end={id === 'home'}
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => ({ backgroundColor: isActive ? themeColor : undefined })}
                    className={({ isActive }) =>
                      `text-start px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors flex items-center justify-between min-h-[44px] ${focusRing} ${
                        isActive ? 'text-white shadow-md' : darkMode ? 'text-gray-300 hover:bg-slate-800/80 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{t(id)}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              <div className={`pt-4 border-t flex flex-col sm:flex-row items-stretch justify-between gap-3 ${darkMode ? 'border-blue-900/50' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label={darkMode ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold cursor-pointer min-h-[44px] ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} ${focusRing}`}
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />}
                  <span>{darkMode ? (isAr ? 'الوضع الفاتح' : 'Light Mode') : isAr ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang(isAr ? 'en' : 'ar');
                    setIsOpen(false);
                  }}
                  aria-label={isAr ? 'التغيير إلى اللغة الإنجليزية' : 'Switch to Arabic'}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-bold shadow cursor-pointer min-h-[44px] ${focusRing}`}
                  style={{ backgroundColor: themeColor }}
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  <span>{isAr ? 'English' : 'العربية'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}