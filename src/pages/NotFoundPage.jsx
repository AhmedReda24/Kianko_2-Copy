import { Link } from 'react-router';
import { ROUTES } from '../routes';

export default function NotFoundPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  return (
    <section className="max-w-3xl mx-auto px-4 py-32 text-center space-y-6">
      <p className="text-7xl font-black" style={{ color: themeColor }} dir="ltr">404</p>
      <h1 className="text-3xl font-extrabold text-white">
        {isAr ? 'الصفحة دي مش موجودة' : 'This page does not exist'}
      </h1>
      <p className="text-slate-400">
        {isAr ? 'اللينك ممكن يكون اتغيّر أو اتكتب غلط.' : 'The link may have changed or been typed incorrectly.'}
      </p>
      <Link
        to={ROUTES.home}
        className="inline-block text-white font-bold px-8 py-3.5 rounded-xl"
        style={{ backgroundColor: themeColor }}
      >
        {isAr ? 'ارجع للرئيسية' : 'Back to Home'}
      </Link>
    </section>
  );
}
