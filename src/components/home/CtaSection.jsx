import { Phone } from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import { useLocations } from '../../hooks/useContent';

export default function CtaSection({ isAr, themeColor }) {
  const locations = useLocations();
  const phone = (locations.find((l) => l.type === 'company') ?? locations[0])?.phone ?? '+201234567890';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        className="rounded-3xl p-8 sm:p-14 flex flex-wrap items-center justify-between gap-8 text-start shadow-2xl"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-xl space-y-2 sm:space-y-3">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {isAr ? 'عندك مشروع محتاج حديد؟' : 'Have a project that needs steel?'}
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {isAr ? 'ابعتلنا المواصفات ونرد عليك بعرض سعر.' : 'Send us your specifications and we will reply with a quotation.'}
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="pt-2 inline-flex items-center gap-2.5 font-extrabold text-white hover:underline underline-offset-4 text-sm sm:text-base"
          >
            <Phone className="w-5 h-5 shrink-0" />
            <span>{isAr ? 'أو اتصل بنا:' : 'Or call us:'}</span>
            <span dir="ltr">{phone}</span>
          </a>
        </div>
        <CtaLink to={ROUTES.contact} variant="light">
          {isAr ? 'اطلب عرض سعر' : 'Request a quote'}
        </CtaLink>
      </div>
    </section>
  );
}