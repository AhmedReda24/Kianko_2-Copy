import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { MotionConfig, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import BackToTop from './components/ui/BackToTop';
import { ROUTES, PAGE_TITLES, pageKeyFromPath } from './routes';
import ChatWidget from './components/ChatWidget';

// كل صفحة في ملف لوحدها وبتتحمّل عند الحاجة فقط (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const OurStoryPage = lazy(() => import('./pages/OurStoryPage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const ValuesPage = lazy(() => import('./pages/ValuesPage'));
const GovernanceQualityPage = lazy(() => import('./pages/GovernanceQualityPage'));
const IsoCertificationsPage = lazy(() => import('./pages/IsoCertificationsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
import AdminDashboard from './pages/AdminDashboard';

// مكون إرجاع الصفحة للأعلى عند تغيير الـ Path أو الـ Refresh
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function PageLoader({ themeColor }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div
        className="h-10 w-10 rounded-full border-4 border-white/10 animate-spin"
        style={{ borderTopColor: themeColor }}
      />
    </div>
  );
}

export default function App() {
  // قراءة اللغة المخزنة من الlocalStorage مسبقاً، أو الافتراضي 'en' لو أول مرة يفتح
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('kian_lang') || 'en';
  });
  
  const [darkMode, setDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState('#C9252C'); // Kianko Red

  const { pathname } = useLocation();
  const pageKey = pageKeyFromPath(pathname);

  // دالة مخصصة لتحديث الحفظ في الlocalStorage مع الState لتجنب أي مشاكل
  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('kian_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const [en, ar] = PAGE_TITLES[pageKey ?? 'notFound'];
    document.title = lang === 'ar' ? ar : en;
  }, [pageKey, lang]);

  const pageProps = { lang, themeColor };
  const isAr = lang === 'ar';

  return (
    <MotionConfig reducedMotion="user">
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#07132B] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <ScrollToTop />
      <ScrollProgress themeColor={themeColor} />
      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />

      <main className="pb-12">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
        <Suspense fallback={<PageLoader themeColor={themeColor} />}>
          <Routes>
            <Route path={ROUTES.home} element={<Home {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.story} element={<OurStoryPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.overview} element={<OverviewPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.values} element={<ValuesPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.quality} element={<GovernanceQualityPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.iso} element={<IsoCertificationsPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.careers} element={<CareersPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.projects} element={<ProjectsPage {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.products} element={<Products {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.contact} element={<Contact {...pageProps} isAr={isAr} />} />
            <Route path={ROUTES.locations} element={<LocationsPage {...pageProps} isAr={isAr} />} />
            
            {/* تم نقل مسار الأدمن قبل مسار الـ NotFound (*) */}
            <Route path={ROUTES.admin || '/admin'} element={<AdminDashboard themeColor={themeColor} />} />

            {/* مسار الصفحة غير الموجودة هو الأخير دائماً */}
            <Route path="*" element={<NotFoundPage {...pageProps} isAr={isAr} />} />
          </Routes>
        </Suspense>
        </motion.div>
      </main>

      <Footer lang={lang} themeColor={themeColor} />
      <BackToTop themeColor={themeColor} isAr={isAr} />
      <ChatWidget />
    </div>
    </MotionConfig>
  );
}