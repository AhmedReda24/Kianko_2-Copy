import { Link } from 'react-router';
import { ArrowUp } from 'lucide-react';
import { ROUTES } from '../../routes';
import SectionHeading from '../ui/SectionHeading';

const commitments = [
  { en: 'Customer satisfaction', ar: 'رضا العملاء' },
  { en: 'Developing and retaining our people', ar: 'تطوير فريق العمل والحفاظ عليه' },
  { en: 'Strong partner and supplier relationships', ar: 'علاقات قوية مع الشركاء والموردين' },
  { en: 'Positive impact on society and the environment', ar: 'أثر إيجابي على المجتمع والبيئة' },
];

export default function FacilitiesSection({ isAr, themeColor }) {
  return (
    <section className="bg-[#061024] border-y border-blue-900/40 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 sm:gap-16 items-center text-start">
        
        {/* القسم الأيسر: الصورة والإطار والالتزامات */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute top-16 sm:top-20 bottom-0 start-0 w-[88%] border-4 border-[#4B5B7A] rounded-2xl"
          />
          <img
            src="/Image/factory-main.webp"
            alt="Kianko Facility"
            loading="lazy"
            className="relative z-10 ms-6 sm:ms-11 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.75rem)] h-52 sm:h-64 object-cover brightness-90 rounded-2xl shadow-xl"
          />
          <div className="relative z-10 ms-6 sm:ms-11 me-[calc(12%+1rem)] sm:me-[calc(12%+1.5rem)] pt-6 sm:pt-8 pb-8 space-y-3 sm:space-y-4">
            <h2 className="font-display text-xl sm:text-4xl font-extrabold leading-tight text-white">
              {isAr ? 'التزامنا بالتميّز' : 'Our Commitment to Excellence'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isAr ? 'نسعى للتميّز من خلال الاهتمام بـ:' : 'We strive for excellence by caring for:'}
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 list-disc ps-5 marker:text-slate-500">
              {commitments.map((c) => (
                <li key={c.en}>{isAr ? c.ar : c.en}</li>
              ))}
            </ul>
          </div>

          <Link
            to={ROUTES.contact}
            className="absolute z-10 bottom-6 end-[2%] flex flex-col items-center gap-2 text-xs font-bold tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ color: themeColor }}
          >
            <span className="[writing-mode:vertical-rl] rotate-180">{isAr ? 'تواصل معنا' : 'Get in touch'}</span>
            <ArrowUp className="w-4 h-4" />
          </Link>
        </div>

        {/* القسم الأيمن: العنوان والنبذة عن المرافق والكتالوجات (متسنطر على الموبايل) */}
        <div className="space-y-6 sm:space-y-10 text-center sm:text-start">
          <div className="space-y-3 sm:space-y-6">
            <div className="flex justify-center sm:justify-start">
              <SectionHeading themeColor={themeColor}>
                {isAr ? 'مرافقنا الإنتاجية' : 'Production Facilities'}
              </SectionHeading>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-base max-w-prose mx-auto sm:mx-0">
              {isAr
                ? 'كيانكو من رُوّاد منتجي منتجات الصلب الإنشائية، ونخدم قطاع التشييد من خلال مصانع وماكينات متطورة بالكامل. منتجاتنا تلبي المعايير الدولية وتُصمَّم لتناسب أشد متطلبات كل مشروع.'
                : 'Kianko manufactures advanced steel construction products, serving the construction sector through state-of-the-art facilities and machinery. Our products meet international standards and are tailored to the precise requirements of each megaproject.'}
            </p>
          </div>

          <div className="pt-2 flex justify-center sm:justify-start">
            <Link
              to={ROUTES.products}
              className="inline-flex items-center justify-center text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:opacity-95 w-full sm:w-auto"
              style={{ backgroundColor: themeColor }}
            >
              {isAr ? 'تصفح الكتالوجات' : 'Explore Catalogues'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}