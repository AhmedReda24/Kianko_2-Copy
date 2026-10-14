import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const faqs = [
  {
    qEn: 'What types of steel products does KIANKO specialize in?',
    qAr: 'ما هي المنتجات الرئيسية التي تتخصص فيها كيانكو؟',
    aEn: 'We specialize in heavy-duty Cable Management Systems, Rebar Rolling, Plaster Profiles, and Hot-Dip Galvanizing tailored for major infrastructure projects.',
    aAr: 'نتخصص في تصنيع أنظمة إدارة الكابلات الثقيلة، تدلفين حديد التسليح، مقاطع المحارة والمباني، وتوفير خدمات الجلفنة على الساخن للمشاريع الكبرى.',
  },
  {
    qEn: 'Are KIANKO products certified to international quality standards?',
    qAr: 'هل منتجات كيانكو معتمدة ومطابقة للمواصفات العالمية؟',
    aEn: 'Yes, all our manufacturing facilities operate under strict ISO certifications (ISO 9001, 14001, 45001) and meet global ASTM and BS standards.',
    aAr: 'نعم، تعمل جميع مصانعنا وفق أعلى معايير الأيزو العالمية (ISO 9001, 14001, 45001) وتطابق المواصفات القياسية الأمريكية (ASTM) والبريطانية (BS).',
  },
  {
    qEn: 'Do you offer custom steel fabrication and engineering support?',
    qAr: 'هل تقدمون خدمات التصنيع المخصص والدعم الهندسي للمشاريع؟',
    aEn: 'Absolutely. Our engineering team works directly with consultants and contractors to review specifications and produce custom sizes and finishes.',
    aAr: 'بالتأكيد، يقدم فريقنا الهندسي الدعم الشامل للمكاتب الاستشارية والمقاولين لتعديل المخططات وتصنيع المقاسات الخاصة حسب متطلبات الموقع.',
  },
  {
    qEn: 'What is the standard delivery timeframe across the MENA region?',
    qAr: 'ما هي مدد التوريد والشحن للمشاريع داخل وخارج الدولة؟',
    aEn: 'Delivery schedules depend on order volume, but our strategic distribution hubs in Egypt and KSA ensure rapid dispatch for urgent project timelines.',
    aAr: 'تعتمد المواعيد على حجم الطلب، ولكن بفضل شبكة فروعنا ومصانعنا نضمن أسرع معدلات توريد للمشاريع الإقليمية.',
  },
];

export default function FaqSection({ isAr, themeColor }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-start">
      <div className="max-w-2xl mb-10">
        <SectionHeading themeColor={themeColor}>
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </SectionHeading>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          {isAr ? 'إجابات سريعة على أهم استفسارات المهندسين والمقاولين.' : 'Quick answers to common engineering and procurement queries.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-blue-900/50 bg-[#0B1B3A]/60 hover:border-blue-700 transition-all duration-300 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                  <span className="font-extrabold text-base sm:text-lg text-white">
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 text-slate-400 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm sm:text-base leading-relaxed border-t border-blue-900/40 text-slate-300">
                  {isAr ? faq.aAr : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}