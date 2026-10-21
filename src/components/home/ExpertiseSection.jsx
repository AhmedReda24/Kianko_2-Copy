import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../routes';
import SectionHeading from '../ui/SectionHeading';

const areas = [
  {
    title: 'Cable Management', titleAr: 'أنظمة إدارة الكابلات',
    text: 'Heavy-duty cable trays, ladders and accessories, fabricated to project specifications.',
    textAr: 'حوامل وسلالم كابلات ثقيلة، مصنّعة حسب مواصفات كل مشروع.',
    img: '/Image/expertise-cable-management.webp',
  },
  {
    title: 'Plastering', titleAr: 'بناء الطوب',
    text: 'Essential metal mesh profiles for solid plastering finishing.',
    textAr: 'شبكات أساسية في أعمال بناء الطوب بدقة.',
    img: '/Image/expertise-plastering-accessories.webp',
  },
  {
    title: 'Blockworks Accessories', titleAr: 'إكسسورات المحارة',
    text: 'Premium plaster beads and metal profiles for clean, durable, and precise wall and corner finishing.',
    textAr: 'زوايا ومقاطع معدنية للمحارة لتشطيبات نظيفة وطويلة العمر للحوائط والأركان.',
    img: '/Image/plastering.webp',
  },
  {
    title: 'Hot-Dip Galvanizing', titleAr: 'الجلفنة على الساخن',
    text: 'Zinc coating that protects steel against corrosion in demanding environments.',
    textAr: 'طبقة زنك تحمي الصلب من الصدأ في أصعب بيئات التشغيل.',
    img: '/Image/expertise-galvanizing-plant.webp',
  },
];

export default function ExpertiseSection({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const [active, setActive] = useState(0);

  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  
  const cardStyle = darkMode 
    ? 'border-blue-900/60 bg-[#061024]' 
    : 'border-slate-300 bg-white shadow-xl';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start">
      
      <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-8 sm:mb-10 px-2">
        <div className="flex justify-center sm:justify-start">
          <SectionHeading themeColor={themeColor} darkMode={darkMode}>
            {isAr ? 'مجالات خبرتنا' : 'Areas of Expertise'}
          </SectionHeading>
        </div>
        <p className={`mt-3 sm:mt-4 leading-relaxed text-xs sm:text-base max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
          {isAr
            ? 'من حوامل الكابلات وإكسسوارات المحارة إلى الجلفنة، نغطي ما يحتاجه المشروع من الصلب بجودة ثابتة.'
            : 'From cable trays to plastering accessories and galvanizing, we cover the steel a project needs with consistent quality.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:h-[460px]">
        {areas.map((a, i) => {
          const isActive = active === i;
          const isLCP = i < 2; // أولوية لأول صورتين
          return (
            <Link
              key={a.title}
              to={ROUTES.products}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ flexGrow: isActive ? 4 : 1 }}
              aria-label={isAr ? `تصفح منتجات ${a.titleAr}` : `Explore ${a.title} products`}
              className={`group relative h-64 lg:h-auto lg:basis-0 min-w-0 overflow-hidden rounded-2xl border transition-[flex-grow] duration-500 ease-out cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${cardStyle}`}
            >
              <img
                src={a.img}
                alt=""
                width="800"
                height="600"
                loading={isLCP ? "eager" : "lazy"} // إعطاء أولوية
                fetchpriority={isLCP ? "high" : "auto"}
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isActive ? 'brightness-[0.7] scale-100' : 'brightness-[0.45] scale-110'
                } max-lg:brightness-[0.6]`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                darkMode 
                  ? 'from-[#061024] via-[#061024]/40 to-transparent' 
                  : 'from-slate-950 via-slate-900/50 to-transparent'
              }`} />

              <span aria-hidden="true" dir="ltr" className={`absolute top-4 start-5 font-display text-4xl sm:text-5xl font-black transition-colors duration-500 ${darkMode ? 'text-white/30 group-hover:text-white/80' : 'text-white/50 group-hover:text-white'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
                style={{ backgroundColor: themeColor, opacity: isActive ? 1 : 0 }}
              />

              <div className="absolute bottom-0 inset-x-0 p-5 lg:p-6">
                <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                  {isAr ? a.titleAr : a.title}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isActive ? 'lg:max-h-40 lg:opacity-100' : 'lg:max-h-0 lg:opacity-0'
                  }`}
                >
                  <p className="mt-2 text-xs sm:text-sm text-slate-100 leading-relaxed max-w-md drop-shadow">
                    {isAr ? a.textAr : a.text}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white drop-shadow">
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