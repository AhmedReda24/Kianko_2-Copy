import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../routes';
import SectionHeading from '../ui/SectionHeading';

const areas = [
  {
    title: 'Cable Management', titleAr: 'أنظمة إدارة الكابلات',
    text: 'Heavy-duty cable trays, ladders and accessories, fabricated to project specifications.',
    textAr: 'حوامل وسلالم كابلات ثقيلة وملحقاتها، مصنّعة حسب مواصفات كل مشروع.',
    img: 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&fit=crop&fm=webp&q=75&w=1000',
  },
  {
    title: 'Rebar Rolling', titleAr: 'تدلفين حديد التسليح',
    text: 'Rolling and processing of reinforcement steel for structural and infrastructure works.',
    textAr: 'تدلفين ومعالجة حديد التسليح للأعمال الإنشائية ومشاريع البنية التحتية.',
    img: 'https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    title: 'Plaster Profiles', titleAr: 'مقاطع المحارة',
    text: 'Plaster beads and metal profile systems for clean, durable wall and corner finishing.',
    textAr: 'زوايا ومقاطع معدنية للمحارة لتشطيبات نظيفة وطويلة العمر للحوائط والأركان.',
    img: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    title: 'Hot-Dip Galvanizing', titleAr: 'الجلفنة على الساخن',
    text: 'Zinc coating that protects steel against corrosion in demanding environments.',
    textAr: 'طبقة زنك تحمي الصلب من الصدأ في أصعب بيئات التشغيل.',
    img: 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
];

export default function ExpertiseSection({ isAr, themeColor = '#C9252C' }) {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-start">
      <div className="max-w-2xl mb-8 sm:mb-10">
        <SectionHeading themeColor={themeColor}>
          {isAr ? 'مجالات خبرتنا' : 'Areas of Expertise'}
        </SectionHeading>
        <p className="mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base text-slate-300">
          {isAr
            ? 'من حوامل الكابلات إلى حديد التسليح والجلفنة، نغطي ما يحتاجه المشروع من الصلب بجودة ثابتة.'
            : 'From cable trays to rebar and galvanizing, we cover the steel a project needs with consistent quality.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:h-[460px]">
        {areas.map((a, i) => {
          const isActive = active === i;
          return (
            <Link
              key={a.title}
              to={ROUTES.products}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ flexGrow: isActive ? 4 : 1 }}
              className="group relative h-64 lg:h-auto lg:basis-0 min-w-0 overflow-hidden rounded-2xl border border-blue-900/60 shadow-xl transition-[flex-grow] duration-500 ease-out cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <img
                src={a.img}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isActive ? 'brightness-[0.6] scale-100' : 'brightness-[0.4] scale-110'
                } max-lg:brightness-[0.55]`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-[#061024]/40 to-transparent" />
              <span aria-hidden="true" dir="ltr" className="absolute top-4 start-5 font-display text-4xl sm:text-5xl font-black text-white/25 transition-colors duration-500 group-hover:text-white/60">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
                style={{ backgroundColor: themeColor, opacity: isActive ? 1 : 0 }}
              />

              <div className="absolute bottom-0 inset-x-0 p-5 lg:p-6">
                <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-tight">
                  {isAr ? a.titleAr : a.title}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isActive ? 'lg:max-h-40 lg:opacity-100' : 'lg:max-h-0 lg:opacity-0'
                  }`}
                >
                  <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
                    {isAr ? a.textAr : a.text}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                    {isAr ? 'تعرّف على المنتجات' : 'View products'}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}