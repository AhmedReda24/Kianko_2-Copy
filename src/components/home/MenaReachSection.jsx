import { Globe2, ShieldCheck, Truck, Users } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const highlights = [
  { icon: Globe2, val: 'MENA Region', valAr: 'الشرق الأوسط وشمال إفريقيا', label: 'Export Coverage', labelAr: 'تغطية التصدير' },
  { icon: Truck, val: '8/6 Logistics', valAr: 'شحن ولوجستيات مستمرة', label: 'On-Time Delivery', labelAr: 'التزام تام بالمواعيد' },
  { icon: ShieldCheck, val: '100% Quality', valAr: 'جودة واختبارات 100%', label: 'ASTM & BS Compliant', labelAr: 'مطابقة للمواصفات' },
  { icon: Users, val: '+500 Clients', valAr: '+500 عميل إستراتيجي', label: 'Trusted Partners', labelAr: 'شركاء النجاح' },
];

export default function MenaReachSection({ isAr, themeColor = '#C9252C', darkMode = true }) {
  // ألوان متكيفة بسلاسة بين الوضعين الفاتح والداكن
  const sectionBg = darkMode ? 'bg-[#061024] border-blue-900/40' : 'bg-slate-100 border-slate-300';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';

  const cardBg = darkMode
    ? 'border-slate-800 bg-slate-900/70 text-white'
    : 'border-slate-300 bg-white text-slate-900 shadow-xl';

  const valColor = darkMode ? 'text-white' : 'text-slate-900';
  const labelColor = darkMode ? 'text-blue-300' : 'text-blue-600';

  return (
    <section className={`py-10 sm:py-16 lg:py-20 border-y transition-colors duration-300 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start space-y-8 sm:space-y-10 lg:space-y-12">

        {/* عنوان القسم والوصف */}
        <div className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-start px-2 sm:px-0">
          <div className="flex justify-center sm:justify-start">
            <SectionHeading themeColor={themeColor} darkMode={darkMode}>
              {isAr ? 'الانتشار والتوريد الإقليمي' : 'Regional Presence & MENA Reach'}
            </SectionHeading>
          </div>
          <p className={`mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed max-w-prose mx-auto sm:mx-0 ${textDesc}`}>
            {isAr
              ? 'تمتد خدمات كيانكو لتغطي كبرى المشاريع العمرانية والصناعية في المملكة العربية السعودية والشرق الأوسط، محققة أطول فترة استدامة وأعلى معايير أمان الهياكل الإنشائية.'
              : 'KIANKO supplies steel and cable management solutions to iconic developments across Kingdom Of Saudi Arabia and the MENA region with unmatched reliability.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.val}
                className={`h-full flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 p-4 sm:p-6 rounded-2xl border shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 text-start ${cardBg}`}
              >
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center text-white sm:mb-4 shadow-md"
                  style={{ backgroundColor: themeColor }}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="min-w-0">
                  <h3 className={`font-black text-base sm:text-lg xl:text-xl leading-snug mb-0.5 sm:mb-1 break-words ${valColor}`}>
                    {isAr ? h.valAr : h.val}
                  </h3>
                  <p className={`text-xs font-bold leading-snug ${labelColor}`}>
                    {isAr ? h.labelAr : h.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}