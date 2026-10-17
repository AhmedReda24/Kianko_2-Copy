import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-start">
      
      {/* عنوان بحجم مصغر ومضبوط ليبقى الكلام بجانب بعضه بشكل ممتاز */}
      <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-10 sm:mb-12 px-2">
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h2>
        <p className="mt-2.5 text-xs sm:text-base text-slate-300 max-w-prose mx-auto sm:mx-0 leading-relaxed">
          {isAr ? 'إجابات سريعة على أهم استفسارات المهندسين والمقاولين.' : 'Quick answers to common engineering and procurement queries.'}
        </p>
      </div>

      {/* مسافات مريحة وواسعة بين الكروت */}
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-blue-900/50 bg-[#0B1B3A]/60 hover:border-blue-700 transition-all duration-300 overflow-hidden shadow-md"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-start focus:outline-none cursor-pointer"
              >
                <span className="flex items-center gap-2.5 sm:gap-3">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: themeColor }} />
                  <span className="font-extrabold text-sm sm:text-lg text-white leading-snug">
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 text-slate-400 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 sm:pt-2 text-xs sm:text-base leading-relaxed border-t border-blue-900/40 text-slate-300">
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