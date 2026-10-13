import { Phone } from 'lucide-react';
import { ROUTES } from '../../routes';
import CtaLink from '../ui/CtaLink';
import { useLocations } from '../../hooks/useContent';

export default function CtaSection({ isAr, themeColor }) {
  const locations = useLocations();
  const phone = (locations.find((l) => l.type === 'company') ?? locations[0]).phone;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div
        className="rounded-3xl px-8 py-12 sm:px-14 flex flex-wrap items-center justify-between gap-8 text-start"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-xl">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {isAr ? 'عندك مشروع محتاج حديد؟' : 'Have a project that needs steel?'}
          </h2>
          <p className="mt-3 text-white/90">
            {isAr ? 'ابعتلنا المواصفات ونرد عليك بعرض سعر.' : 'Send us your specifications and we will reply with a quotation.'}
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="mt-4 inline-flex items-center gap-2 font-bold text-white hover:underline underline-offset-4"
          >
            <Phone className="w-5 h-5" />
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
