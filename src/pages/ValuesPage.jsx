import { Cog, Leaf, ShieldCheck, Target } from 'lucide-react';
import SpotlightCard from '../components/ui/SpotlightCard';

// القيم مبنية على نفس الصياغات الموجودة في صفحاتك (الدقة الهندسية، الجودة، السلامة، الاستدامة)
const values = [
  { icon: Cog, t: 'Engineering accuracy', tAr: 'الدقة الهندسية', d: 'Every profile is made to the project specification, with continuous investment in technology.', dAr: 'كل قطاع بيتصنّع حسب مواصفات المشروع، مع استثمار مستمر في التكنولوجيا.' },
  { icon: Target, t: 'Consistent quality', tAr: 'جودة ثابتة', d: 'Quality control across every stage of manufacturing, backed by in-house testing.', dAr: 'ضبط جودة في كل مراحل التصنيع، مدعوم بفحص داخلي.' },
  { icon: ShieldCheck, t: 'Safety first', tAr: 'السلامة أولاً', d: 'Protecting people and the working environment in an industrial setting.', dAr: 'حماية العاملين وبيئة العمل الصناعية.' },
  { icon: Leaf, t: 'Sustainable production', tAr: 'تصنيع مستدام', d: 'Responsible manufacturing that limits environmental impact.', dAr: 'تصنيع مسؤول يقلل الأثر البيئي.' },
];

export default function ValuesPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-white">{isAr ? 'قيمنا' : 'Our Values'}</h1>
        <p className="text-slate-400">
          {isAr ? 'المبادئ اللي بنشتغل بيها في كل مشروع.' : 'The principles we work by on every project.'}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {values.map(({ icon: Icon, t, tAr, d, dAr }) => (
          <SpotlightCard as="article" key={t} className="flex gap-5 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600">
            <span className="relative grid place-items-center h-12 w-12 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:-rotate-6" style={{ backgroundColor: themeColor }}>
              <Icon className="w-6 h-6" />
            </span>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{isAr ? tAr : t}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{isAr ? dAr : d}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
