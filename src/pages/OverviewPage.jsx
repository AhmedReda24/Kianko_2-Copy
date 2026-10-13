import SpotlightCard from '../components/ui/SpotlightCard';

const cards = [
  { titleAr: 'خطوط التدلفين الآلي', titleEn: 'Roll Forming Lines', descAr: 'دقة فائقة في تشكيل وتدلفين الصُلب بقدرات إنتاجية ضخمة.', descEn: 'High-speed automated continuous roll forming machinery.', img: 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { titleAr: 'مجمع الجلفنة على الساخن', titleEn: 'Hot-Dip Galvanizing', descAr: 'حماية متكاملة ضد التآكل والصدأ وفق معايير ASTM A123.', descEn: 'Continuous hot-dip galvanization strictly adhering to ASTM standards.', img: 'https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { titleAr: 'معامل الفحص والجودة', titleEn: 'Testing Laboratories', descAr: 'مختبرات قياس إجهاد الشد والسمك بدقة متناهية.', descEn: 'In-house physical tensile testing and coating thickness labs.', img: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export default function OverviewPage({ lang = 'en' }) {
  const isAr = lang === 'ar';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-start">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black">
          {isAr ? 'نظرة عامة على القدرات الإنتاجية' : 'Manufacturing Overview'}
        </h1>
        <p className="text-slate-400 font-medium text-lg">
          {isAr
            ? 'خطوط إنتاج آلية بالكامل مع مصانع جلفنة حديثة'
            : 'State-of-the-art automated cold-rolling, punching, and hot-dip galvanizing plants.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <SpotlightCard as="article" key={card.titleEn} className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl space-y-4 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl">
            <div className="relative overflow-hidden rounded-2xl"><img src={card.img} alt="" loading="lazy" className="w-full h-48 object-cover transition-transform duration-700 group-hover/spot:scale-110" /></div>
            <div className="p-2 space-y-2">
              <h3 className="text-xl font-bold text-white">{isAr ? card.titleAr : card.titleEn}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{isAr ? card.descAr : card.descEn}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
