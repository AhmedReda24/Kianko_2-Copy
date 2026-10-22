import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import {
  Menu, X, Globe, ChevronDown, Sun, Moon,
  ShieldCheck, Award, MapPin, Briefcase, Building2,
  Home, BookOpen, Compass, HeartHandshake, Package, Mail, ArrowUpLeft, ArrowUpRight
} from 'lucide-react';
import { ROUTES } from '../routes';

import logoImg from "../../assets/logo.webp";

const pages = {
  home: { en: 'Home', ar: 'الرئيسية', icon: Home },
  story: { en: 'Our Story', ar: 'قصتنا', icon: BookOpen },
  overview: { en: 'Overview', ar: 'نظرة عامة', icon: Compass },
  values: { en: 'Our Values', ar: 'قيمنا', icon: HeartHandshake },
  quality: { en: 'Governance & Quality', ar: 'الحوكمة والجودة', icon: ShieldCheck, subEn: 'Standards & compliance', subAr: 'المعايير والمطابقة القياسية' },
  iso: { en: 'ISO Certifications', ar: 'شهادات الأيزو', icon: Award, subEn: 'Accredited certificates', subAr: 'شهادات الجودة العالمية' },
  locations: { en: 'Branches & Office', ar: 'الفروع والمكتب', icon: MapPin, subEn: 'Riyadh & Jeddah locations', subAr: 'فروع الرياض وجدة' },
  careers: { en: 'Careers', ar: 'الوظائف', icon: Briefcase, subEn: 'Join our engineering team', subAr: 'انضم لفريقنا الهندسي' },
  projects: { en: 'Regional Projects', ar: 'المشاريع الإقليمية', icon: Building2, subEn: 'Supplied mega projects', subAr: 'سجل التوريدات والمشاريع' },
  products: { en: 'Products', ar: 'المنتجات', icon: Package },
  contact: { en: 'Contact Us', ar: 'تواصل معنا', icon: Mail },
};

const before = ['home', 'story', 'overview', 'values'];
const group = ['quality', 'iso', 'locations', 'careers', 'projects'];
const after = ['products', 'contact'];
const mainMobileIds = [...before, ...after];

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

function NavUnderline({ themeColor }) {
  return (
    <motion.span
      layoutId="nav-underline"
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full pointer-events-none"
      style={{ backgroundColor: themeColor }}
      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
    />
  );
}

export default function Navbar({ lang, setLang, darkMode, setDarkMode, themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const t = (id) => (isAr ? pages[id].ar : pages[id].en);
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const { scrollY } = useScroll();

  // نطاق أمان (Hysteresis) لمنع أي اهتزاز عند السكرول
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled((prev) => {
      if (y > 50 && !prev) return true;
      if (y < 15 && prev) return false;
      return prev;
    });
  });

  const groupActive = group.some((id) => ROUTES[id] === pathname);

  // إغلاق القوائم تلقائياً عند تغيير المسار (الصفحة)
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // تحميل وتطبيق خط IBM Plex Sans Arabic تلقائياً
  useEffect(() => {
    const fontId = 'ibm-plex-sans-arabic-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    if (isAr) {
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }
  }, [isAr]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // إغلاق القائمة المنسدلة أو قائمة الموبايل عند الضغط خارجها أو الضغط على زر Escape
  useEffect(() => {
    if (!dropdownOpen && !isOpen) return;
    const onDown = (e) => {
      if (dropdownOpen && !menuRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (isOpen && !navRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen, isOpen]);

  const handleMouseEnterDropdown = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const panel = darkMode
    ? 'bg-[#071329]/98 border-blue-800/70 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
    : 'bg-white/98 border-slate-200 text-slate-800 shadow-2xl';
  const iconBtn = darkMode
    ? 'bg-slate-800/90 text-amber-400 border border-blue-900/60 hover:bg-slate-700'
    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200';

  const desktopLink = (id) => (
    <NavLink
      key={id}
      to={ROUTES[id]}
      end={id === 'home'}
      style={({ isActive }) => ({ color: isActive ? themeColor : undefined })}
      className={({ isActive }) =>
        `relative py-2 px-1.5 transition-colors cursor-pointer whitespace-nowrap ${focusRing} ${
          isActive
            ? 'font-extrabold'
            : 'hover:opacity-90 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left rtl:after:origin-right after:scale-x-0 after:bg-current after:opacity-50 after:transition-transform after:duration-300 hover:after:scale-x-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {t(id)}
          {isActive && <NavUnderline themeColor={themeColor} />}
        </>
      )}
    </NavLink>
  );

  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

  return (
    <>
      {/* حاجز ارتفاع ثابت لمنع اهتزاز الصفحة أثناء السكرول */}
      <div className="h-20 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      <nav
        ref={navRef}
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
        aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
        className={`fixed top-0 inset-x-0 z-50 border-b transition-[background-color,box-shadow,height] duration-300 ${
          scrolled ? 'h-16 shadow-2xl backdrop-blur-md' : 'h-20 shadow-lg'
        } ${
          darkMode
            ? `${scrolled ? 'bg-[#0A1832]/95' : 'bg-[#0A1832]'} border-blue-900/40 text-white`
            : `${scrolled ? 'bg-white/95' : 'bg-white'} border-slate-200 text-slate-800`
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-2">
            
            {/* الشعار واسم الشركة */}
            <Link
              to={ROUTES.home}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 sm:gap-3 group py-1 cursor-pointer shrink-0 min-w-0 ${focusRing}`}
              aria-label={isAr ? 'الرئيسية - شركة كيانكو' : 'Home - KIANKO COMPANY'}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  scrolled ? 'scale-90' : 'scale-100'
                } ${
                  darkMode 
                    ? 'bg-slate-900/60 border border-slate-700/50 shadow-inner' 
                    : 'bg-slate-50 border border-slate-200/80 shadow-sm'
                }`}
              >
                <img 
                  src={logoImg} 
                  alt={isAr ? "شعار شركة كيانكو" : "KIANKO Logo"}
                  width="150"
                  height="45" 
                  className="w-auto h-7 sm:h-10 object-contain rounded-lg" 
                  style={{
                    filter: `drop-shadow(0px 2px 6px rgba(201, 37, 44, 0.35))`
                  }}
                />
              </div>

              <div className={`text-start leading-tight transition-transform duration-300 origin-right rtl:origin-right ltr:origin-left truncate ${scrolled ? 'scale-95' : 'scale-100'}`}>
                <span className="block font-black tracking-wider text-xs sm:text-xl lg:text-2xl drop-shadow-md truncate" style={{ color: themeColor }}>
                  {isAr ? (
                    <>كيانكو <span className={darkMode ? 'text-white' : 'text-slate-900'}>للصناعات الحديدية</span></>
                  ) : (
                    <>KIANKO <span className={darkMode ? 'text-white' : 'text-slate-900'}>COMPANY</span></>
                  )}
                </span>
                <span
                  className={`hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-semibold transition-opacity duration-200 ${
                    scrolled ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-4'
                  }`}
                >
                  {isAr ? 'KIANKO STEEL INDUSTRIES — SAUDI ARABIA' : 'KIAN IRON PRODUCTS COMPANY'}
                </span>
              </div>
            </Link>

            {/* ==================== القائمة العلوية للابتوب والشاشات الكبيرة (Desktop) ==================== */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs font-bold">
              {before.map(desktopLink)}

              {/* القائمة المنسدلة الاحترافية للابتوب */}
              <div
                className="relative"
                ref={menuRef}
                onMouseEnter={handleMouseEnterDropdown}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className={`relative flex items-center gap-1.5 py-2 px-2 rounded-lg cursor-pointer transition-colors ${
                    dropdownOpen ? (darkMode ? 'bg-white/10' : 'bg-slate-100') : 'hover:opacity-90'
                  } ${focusRing}`}
                  style={{ color: groupActive ? themeColor : undefined }}
                >
                  <span>{isAr ? 'الشركة والجودة' : 'Company & Quality'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-[#C9252C]' : ''}`} aria-hidden="true" />
                  {groupActive && <NavUnderline themeColor={themeColor} />}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className={`absolute top-full start-0 mt-2.5 w-72 border rounded-2xl p-2 z-50 backdrop-blur-xl origin-top ${panel}`}
                    >
                      <div className="space-y-1">
                        {group.map((id) => {
                          const PageIcon = pages[id].icon;
                          const subLabel = isAr ? pages[id].subAr : pages[id].subEn;
                          return (
                            <NavLink
                              key={id}
                              to={ROUTES[id]}
                              onClick={() => setDropdownOpen(false)}
                              className={({ isActive }) =>
                                `group/item flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${focusRing} ${
                                  isActive
                                    ? darkMode
                                      ? 'bg-red-600/20 text-white border border-red-500/30'
                                      : 'bg-red-50 text-slate-900 border border-red-200'
                                    : darkMode
                                    ? 'hover:bg-white/10 text-slate-200'
                                    : 'hover:bg-slate-100 text-slate-800'
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className={`p-2 rounded-xl shrink-0 transition-transform duration-200 group-hover/item:scale-110 ${
                                        isActive
                                          ? 'text-white shadow-md'
                                          : darkMode
                                          ? 'bg-slate-800 text-slate-300 group-hover/item:text-white'
                                          : 'bg-slate-200/80 text-slate-700'
                                      }`}
                                      style={{ backgroundColor: isActive ? themeColor : undefined }}
                                    >
                                      <PageIcon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 text-start">
                                      <p
                                        className="text-xs font-extrabold truncate"
                                        style={{ color: isActive ? themeColor : undefined }}
                                      >
                                        {t(id)}
                                      </p>
                                      {subLabel && (
                                        <p className={`text-[10px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                          {subLabel}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <ArrowIcon className="w-3.5 h-3.5 opacity-0 -translate-x-1 rtl:translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0 text-red-500" />
                                </>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {after.map(desktopLink)}

              <div className="h-6 w-px bg-slate-400/40 mx-1 pointer-events-none" />

              {/* زر الوضع الفاتح / الداكن للابتوب */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={darkMode ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')}
                className={`p-2 rounded-xl hover:scale-105 cursor-pointer transition-all min-h-[38px] min-w-[38px] flex items-center justify-center ${iconBtn} ${focusRing}`}
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

              {/* زر تغيير اللغة للابتوب */}
              <button
                type="button"
                onClick={() => setLang(isAr ? 'en' : 'ar')}
                aria-label={isAr ? 'التغيير إلى اللغة الإنجليزية' : 'Switch to Arabic'}
                className={`flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-xl shadow-md cursor-pointer hover:opacity-90 hover:-translate-y-0.5 transition-all min-h-[38px] ${focusRing}`}
                style={{ backgroundColor: themeColor }}
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? 'English' : 'العربية'}</span>
              </button>
            </div>

            {/* ==================== أزرار الشريط العلوي للموبايل والتابلت (الترجمة + الإضاءة + القائمة) ==================== */}
            <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* 1. زر الترجمة ظاهر دائماً في الشريط العلوي للموبايل */}
              <button
                type="button"
                onClick={() => setLang(isAr ? 'en' : 'ar')}
                aria-label={isAr ? 'التغيير إلى اللغة الإنجليزية' : 'Switch to Arabic'}
                className={`flex items-center justify-center gap-1 text-[11px] sm:text-xs font-extrabold text-white px-2.5 sm:px-3 py-2 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all min-h-[38px] ${focusRing}`}
                style={{ backgroundColor: themeColor }}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{isAr ? 'EN' : 'عربي'}</span>
              </button>

              {/* 2. زر الوضع الفاتح / الداكن ظاهر دائماً في الشريط العلوي للموبايل */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={darkMode ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')}
                className={`p-2 rounded-xl cursor-pointer active:scale-95 transition-all min-h-[38px] min-w-[38px] flex items-center justify-center ${iconBtn} ${focusRing}`}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />}
              </button>

              {/* 3. زر فتح وإغلاق القائمة */}
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`p-2 rounded-xl border cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors ${
                  isOpen
                    ? 'bg-red-600 text-white border-red-500'
                    : darkMode
                    ? 'bg-slate-800/90 border-blue-900/60 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                } ${focusRing}`}
                aria-label={isOpen ? (isAr ? 'إغلاق القائمة' : 'Close menu') : (isAr ? 'فتح القائمة' : 'Open menu')}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>

          </div>
        </div>

        {/* ==================== قائمة الموبايل والتابلت الذكية (بدون أي سكرول طويل) ==================== */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="lg:hidden overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div
                className={`border-t px-3.5 py-4 space-y-4 shadow-2xl max-h-[calc(100vh-4.2rem)] overflow-y-auto ${
                  darkMode ? 'bg-[#061024]/98 border-blue-900/50 text-white backdrop-blur-xl' : 'bg-white/98 border-slate-200 text-slate-800 backdrop-blur-xl'
                }`}
              >
                {/* القسم الأول: الصفحات الأساسية (شبكة من عمودين لتوفير المساحة ومنع السكرول) */}
                <div className="space-y-2">
                  <span className={`block px-1 text-[11px] font-extrabold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isAr ? 'التنقل السريع' : 'Quick Navigation'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {mainMobileIds.map((id) => {
                      const PageIcon = pages[id].icon;
                      return (
                        <NavLink
                          key={id}
                          to={ROUTES[id]}
                          end={id === 'home'}
                          onClick={() => setIsOpen(false)}
                          style={({ isActive }) => ({ backgroundColor: isActive ? themeColor : undefined })}
                          className={({ isActive }) =>
                            `text-start px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 min-h-[42px] border ${focusRing} ${
                              isActive
                                ? 'text-white border-transparent shadow-md'
                                : darkMode
                                ? 'bg-[#0A1832]/90 border-blue-900/50 text-slate-200 hover:bg-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <PageIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-red-500'}`} />
                              <span className="truncate">{t(id)}</span>
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>

                {/* القسم الثاني: الشركة والجودة والاعتمادات */}
                <div className="space-y-2 pt-1 border-t border-blue-900/30">
                  <span className={`block px-1 text-[11px] font-extrabold uppercase tracking-wider ${darkMode ? 'text-amber-400' : 'text-red-600'}`}>
                    {isAr ? 'الشركة والجودة والاعتمادات' : 'Company, Quality & Projects'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {group.map((id, idx) => {
                      const PageIcon = pages[id].icon;
                      const isLastOdd = idx === group.length - 1 && group.length % 2 !== 0;
                      return (
                        <NavLink
                          key={id}
                          to={ROUTES[id]}
                          onClick={() => setIsOpen(false)}
                          style={({ isActive }) => ({ backgroundColor: isActive ? themeColor : undefined })}
                          className={({ isActive }) =>
                            `${isLastOdd ? 'col-span-2' : ''} text-start px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 min-h-[42px] border ${focusRing} ${
                              isActive
                                ? 'text-white border-transparent shadow-md'
                                : darkMode
                                ? 'bg-[#0A1832]/90 border-blue-900/50 text-slate-200 hover:bg-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <PageIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                              <span className="truncate">{t(id)}</span>
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>

                {/* أزرار سريعة إضافية في أسفل القائمة */}
                <div className={`pt-3 border-t grid grid-cols-2 gap-2.5 ${darkMode ? 'border-blue-900/50' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[42px] border ${
                      darkMode ? 'bg-slate-800 border-blue-900/60 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    } ${focusRing}`}
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
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold shadow cursor-pointer min-h-[42px] ${focusRing}`}
                    style={{ backgroundColor: themeColor }}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    <span>{isAr ? 'English' : 'اللغة العربية'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}