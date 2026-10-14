import { Globe2, ShieldCheck, Truck, Users } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const highlights = [
  { icon: Globe2, val: 'MENA Region', valAr: 'الشرق الأوسط وشمال إفريقيا', label: 'Export Coverage', labelAr: 'تغطية التصدير' },
  { icon: Truck, val: '24/7 Logistics', valAr: 'شحن ولوجستيات مستمرة', label: 'On-Time Delivery', labelAr: 'التزام تام بالمواعيد' },
  { icon: ShieldCheck, val: '100% Quality', valAr: 'جودة واختبارات 100%', label: 'ASTM & BS Compliant', labelAr: 'مطابقة للمواصفات' },
  { icon: Users, val: '+500 Clients', valAr: '+500 عميل إستراتيجي', label: 'Trusted Partners', labelAr: 'شركاء النجاح' },
];

export default function MenaReachSection({ isAr, themeColor }) {
  return (
    <section className="py-16 sm:py-20 border-y border-blue-900/40 bg-[#061024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start space-y-12">
        <div className="max-w-3xl">
          <SectionHeading themeColor={themeColor}>
            {isAr ? 'الانتشار والتوريد الإقليمي' : 'Regional Presence & MENA Reach'}
          </SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            {isAr
              ? 'تمتد خدمات كيانكو لتغطي كبرى المشاريع العمرانية والصناعية في مصر والشرق الأوسط، محققة أطول فترة استدامة وأعلى معايير أمان الهياكل الإنشائية.'
              : 'KIANKO supplies steel and cable management solutions to iconic developments across Egypt and the MENA region with unmatched reliability.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg transition-transform hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl mb-1 text-white">
                  {isAr ? h.valAr : h.val}
                </h3>
                <p className="text-xs font-bold text-blue-300">
                  {isAr ? h.labelAr : h.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}