import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. إيقاف ذكاء المتصفح في استرجاع السكرول القديم
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. الصعود لأعلى نقطة فوراً
    window.scrollTo(0, 0);

    // 3. السر هنا: تثبيت السكرول في الأعلى لمدة نصف ثانية (500ms)
    // لتغطية فترة تحميل الصفحة الكسول (Lazy Loading) بالكامل
    const lockScroll = setInterval(() => {
      window.scrollTo(0, 0);
    }, 20);

    // 4. تحرير السكرول بعد اكتمال رسم الصفحة
    const unlockTimer = setTimeout(() => {
      clearInterval(lockScroll);
    }, 500);

    // تنظيف المؤقتات عند الانتقال لصفحة أخرى
    return () => {
      clearInterval(lockScroll);
      clearTimeout(unlockTimer);
    };
  }, [pathname]);

  return null;
}