import { useEffect } from 'react';
import { useLocation } from 'react-router';

// بيرجّع الصفحة لأولها كل ما المسار يتغيّر
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
