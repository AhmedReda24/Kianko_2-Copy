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

// ⚠️ صور مؤقتة — بدّلها بصور منتجاتك (يفضل خلفية شفافة أو بيضاء)
const items = [
  {
    t: 'Cable Management Systems', tAr: 'أنظمة إدارة الكابلات',
    img: 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    t: 'Building & Plaster Profiles', tAr: 'مقاطع المباني والمحارة',
    img: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    t: 'Rebar Rolling', tAr: 'تدلفين حديد التسليح',
    img: 'https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
];

export default function FacilitiesSection({ isAr, themeColor }) {
  const frame = '#4B5B7A';

  return (
    <section className="bg-[#061024] border-y border-blue-900/40 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-16 items-start text-start">
        {/* العمود الأيسر: صورة بإطار + الالتزام */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute top-20 bottom-0 start-0 w-[88%] border-4"
            style={{ borderColor: frame }}
          />
          <img
            src="https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt=""
            loading="lazy"
            className="relative z-10 ms-11 w-[calc(100%-2.75rem)] h-64 object-cover brightness-90"
          />
          <div className="relative z-10 ms-11 me-[calc(12%+1.5rem)] pt-8 pb-10 space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              {isAr ? 'التزامنا بالتميّز' : 'Our Commitment to Excellence'}
            </h2>
            <p className="text-sm text-slate-300">
              {isAr ? 'نسعى للتميّز من خلال الاهتمام بـ:' : 'We strive for excellence by caring for:'}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-300 list-disc ps-5 marker:text-slate-500">
              {commitments.map((c) => (
                <li key={c.en}>{isAr ? c.ar : c.en}</li>
              ))}
            </ul>
          </div>

          <Link
            to={ROUTES.contact}
            className="absolute z-10 bottom-8 end-[2%] flex flex-col items-center gap-2 text-xs font-bold tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ color: themeColor }}
          >
            <span className="[writing-mode:vertical-rl] rotate-180">{isAr ? 'تواصل معنا' : 'Get in touch'}</span>
            <ArrowUp className="w-4 h-4" />
          </Link>
        </div>

        {/* العمود الأيمن: المرافق الإنتاجية */}
        <div className="space-y-10">
          <div className="space-y-6">
            <SectionHeading themeColor={themeColor}>
              {isAr ? 'مرافقنا الإنتاجية' : 'Production Facilities'}
            </SectionHeading>
            <p className="text-slate-300 leading-relaxed max-w-prose">
              {isAr
                ? 'كيانكو من منتجي منتجات الصلب الإنشائية، ونخدم قطاع التشييد من خلال مصانع وماكينات متطورة. منتجاتنا تلبي المعايير الدولية وتُصمَّم لتناسب متطلبات كل مشروع.'
                : 'Kianko manufactures steel construction products and serves the construction sector through advanced facilities and machinery. Our products meet international standards and are tailored to the requirements of each project.'}
            </p>
          </div>

          <ul className="grid sm:grid-cols-3 gap-8">
            {items.map((it) => (
              <li key={it.t}>
                <Link to={ROUTES.products} className="group block text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <span className="relative block aspect-square overflow-hidden rounded-2xl border border-blue-900/60 bg-slate-900 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:border-slate-500">
                    <img
                      src={it.img}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover brightness-90 group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8 text-xs font-bold text-white transition-transform duration-500 group-hover:translate-y-0">
                      {isAr ? 'عرض المنتجات' : 'View products'}
                    </span>
                  </span>
                  <span className="mt-4 block text-lg font-bold text-white leading-snug group-hover:underline underline-offset-4 decoration-2" style={{ textDecorationColor: themeColor }}>
                    {isAr ? it.tAr : it.t}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={ROUTES.products}
            className="inline-block text-white text-sm font-bold tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:opacity-95 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ backgroundColor: themeColor }}
          >
            {isAr ? 'الكتالوجات' : 'Catalogues'}
          </Link>
        </div>
      </div>
    </section>
  );
}
