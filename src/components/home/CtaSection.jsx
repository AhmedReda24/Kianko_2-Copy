import { Phone } from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';

export default function CtaSection({ isAr, themeColor = '#C9252C' }) {
  // تثبيت رقم سعودي رسمي ومتسق مع بيانات فروع السعودية
  const phone = '+966 50 557 0663';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        className="rounded-3xl p-6 sm:p-14 flex flex-wrap items-center justify-between gap-8 text-start shadow-2xl"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-xl space-y-3 sm:space-y-4">
          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {isAr ? 'عندك مشروع محتاج حلول الصلب والحديد؟' : 'Have a project that needs steel solutions?'}
          </h2>
          <p className="text-xs sm:text-base text-white/90 leading-relaxed">
            {isAr ? 'ابعتلنا المواصفات ونرد عليك بعرض سعر.' : 'Send us your specifications and we will reply with a quotation.'}
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="pt-1 sm:pt-2 inline-flex items-center gap-2.5 font-extrabold text-white hover:underline underline-offset-4 text-xs sm:text-base cursor-pointer"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{isAr ? 'أو اتصل بنا:' : 'Or call us:'}</span>
            <span dir="ltr">{phone}</span>
          </a>
        </div>
        <div className="w-full sm:w-auto">
          <CtaLink to={ROUTES.contact} variant="light" className="w-full sm:w-auto justify-center text-xs sm:text-sm py-3 px-6">
            {isAr ? 'اطلب عرض سعر' : 'Request a quote'}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}