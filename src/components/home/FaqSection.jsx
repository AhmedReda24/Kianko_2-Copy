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

export default function FaqSection({ isAr, themeColor = '#e11d48' }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start"
    >
      {/* هيدر القسم مع الشريط العمودي الأحمر الجانبي المتناسق مع تصميم التصريحات والتراخيص */}
      <div className="mb-8 sm:mb-10 max-w-3xl">
        <div className="ltr:border-l-4 rtl:border-r-4 border-red-600 ltr:pl-3.5 rtl:pr-3.5 sm:ltr:pl-4 sm:rtl:pr-4 py-0.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
        </div>
        <p className="mt-3 text-xs sm:text-sm lg:text-base text-slate-400 max-w-2xl leading-relaxed ltr:pl-3.5 rtl:pr-3.5 sm:ltr:pl-4 sm:rtl:pr-4">
          {isAr
            ? 'إجابات سريعة على أهم استفسارات المهندسين والمقاولين.'
            : 'Quick answers to common engineering and procurement queries.'}
        </p>
      </div>

      {/* قائمة الكروت - متجاوبة ومطابقة لتصميم البطاقات العلوية */}
      <div className="w-full max-w-5xl mx-auto space-y-3.5 sm:space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                isOpen 
                  ? 'border-red-600/60 bg-[#0b162c] shadow-red-950/10' 
                  : 'border-blue-900/40 bg-[#091328]/80 hover:border-blue-700/60 hover:bg-[#0b1730]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 text-start focus:outline-none cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <HelpCircle 
                    className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-colors duration-300" 
                    style={{ color: isOpen ? '#ef4444' : themeColor || '#ef4444' }} 
                  />
                  <span className="font-bold text-sm sm:text-base lg:text-lg text-white leading-snug">
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 text-slate-400 ${
                    isOpen ? 'rotate-180 text-red-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 lg:px-6 pb-5 pt-1 sm:pt-2 text-xs sm:text-sm lg:text-base leading-relaxed border-t border-blue-900/30 text-slate-300 bg-black/10">
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