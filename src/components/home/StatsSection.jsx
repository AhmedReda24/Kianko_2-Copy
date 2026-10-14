import AnimatedCounter from '../AnimatedCounter';
import TiltCard from '../ui/TiltCard';

const stats = [
  {
    value: 50, prefix: '+',
    title: 'Locations', titleAr: 'موقعاً',
    subtitle: 'Across the Region', subtitleAr: 'في جميع أنحاء المنطقة',
    img: 'https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    value: 100, prefix: '+',
    title: 'Building Solutions', titleAr: 'حل إجمالي',
    subtitle: 'Engineered Steel Products', subtitleAr: 'منتجات حديدية هندسية',
    img: 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    value: 3, prefix: '',
    title: 'Main Activities', titleAr: 'أنشطة رئيسية',
    subtitle: 'Design, Manufacture, & Supply', subtitleAr: 'التصميم، التصنيع، والتوريد',
    img: 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    value: 10000, prefix: '+',
    title: 'Projects', titleAr: 'مشروع',
    subtitle: 'Across the MENA Region', subtitleAr: 'في الشرق الأوسط وشمال إفريقيا',
    img: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function StatsSection({ isAr, themeColor }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-6">
        {stats.map((item) => (
          <TiltCard
            key={item.title}
            className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-blue-900/60 group shadow-2xl text-start"
          >
            <img
              src={item.img}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.55] group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-[#061024]/50 to-transparent" />
            <div
              className="absolute bottom-0 inset-x-0 h-1 origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ backgroundColor: themeColor }}
            />
            <div className="absolute bottom-6 start-6 end-6">
              <h3 className="flex items-baseline gap-3 text-white">
                <span className="font-display text-4xl sm:text-6xl font-black leading-none">
                  <AnimatedCounter value={item.value} prefix={item.prefix} />
                </span>
                <span className="text-lg sm:text-2xl font-extrabold">{isAr ? item.titleAr : item.title}</span>
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-300 font-medium">{isAr ? item.subtitleAr : item.subtitle}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}