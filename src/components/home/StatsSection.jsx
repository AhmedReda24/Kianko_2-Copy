import AnimatedCounter from '../AnimatedCounter';
import TiltCard from '../ui/TiltCard';

const stats = [
  {
    value: 3, prefix: '+',
    title: 'Locations', titleAr: 'مواقع ومجمعات',
    subtitle: 'Across the Region', subtitleAr: 'في جميع أنحاء المنطقة',
    img: '/Image/stats-locations.webp',
  },
  {
    value: 300, prefix: '+',
    title: 'Building Solutions', titleAr: 'حل إجمالي',
    subtitle: 'Engineered Steel Products', subtitleAr: 'منتجات حديدية هندسية',
    img: '/Image/stats-solutions.webp',
  },
  {
    value: 3, prefix: '',
    title: 'Main Activities', titleAr: 'أنشطة رئيسية',
    subtitle: 'Design, Manufacture, & Supply', subtitleAr: 'التصميم، التصنيع، والتوريد',
    img: '/Image/stats-activities.webp',
  },
  {
    value: 14, prefix: '+',
    title: 'Projects', titleAr: 'مشروع',
    subtitle: 'Across the MENA Region', subtitleAr: 'في الشرق الأوسط وشمال إفريقيا',
    img: '/Image/stats-projects.webp',
  },
];

export default function StatsSection({ isAr, themeColor = '#C9252C', darkMode = true }) {
  const cardBorder = darkMode ? 'border-blue-900/65' : 'border-slate-300 shadow-xl';
  const overlayGradient = darkMode 
    ? 'bg-gradient-to-t from-[#061024] via-[#061024]/50 to-transparent' 
    : 'bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent';
  const subtitleColor = darkMode ? 'text-blue-300' : 'text-slate-200';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-6">
        {stats.map((item, index) => {
          const isLCP = index < 2;

          return (
            <TiltCard
              key={item.title}
              className={`h-56 sm:h-64 rounded-2xl overflow-hidden border group shadow-2xl text-start ${cardBorder}`}
            >
              <img
                src={item.img}
                alt=""
                width="600"
                height="400"
                loading={isLCP ? "eager" : "lazy"}
                fetchpriority={isLCP ? "high" : "auto"}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                  darkMode ? 'brightness-[0.55]' : 'brightness-[0.7]'
                }`}
              />
              <div className={`absolute inset-0 ${overlayGradient}`} />
              <div
                className="absolute bottom-0 inset-x-0 h-1 origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"
                style={{ backgroundColor: themeColor }}
              />
              <div className="absolute bottom-6 start-6 end-6 z-10">
                <h3 className="flex items-baseline gap-3 text-white">
                  <span className="font-display text-4xl sm:text-6xl font-black leading-none drop-shadow-md">
                    <AnimatedCounter value={item.value} prefix={item.prefix} />
                  </span>
                  <span className="text-lg sm:text-2xl font-extrabold drop-shadow-md">{isAr ? item.titleAr : item.title}</span>
                </h3>
                <p className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium drop-shadow ${subtitleColor}`}>
                  {isAr ? item.subtitleAr : item.subtitle}
                </p>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}