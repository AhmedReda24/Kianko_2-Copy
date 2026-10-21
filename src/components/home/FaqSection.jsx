import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '../ui/SectionHeading';

const faqs = [
  {
    qEn: 'What types of steel products does KIANKO specialize in?',
    qAr: 'ما هي المنتجات الرئيسية التي تتخصص فيها كيانكو؟',
    aEn: 'We specialize in heavy-duty Cable Management Systems, Plaster Profiles, and Hot-Dip Galvanizing tailored for major infrastructure projects.',
    aAr: 'نتخصص في تصنيع أنظمة إدارة الكابلات الثقيلة، مقاطع المحارة والمباني، وتوفير خدمات الجلفنة على الساخن للمشاريع الكبرى.',
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
    qAr: 'ما هي مدة التوريد والشحن للمشاريع داخل وخارج الدولة؟',
    aEn: 'Delivery schedules depend on order volume, but our strategic distribution hubs in Egypt and KSA ensure rapid dispatch for urgent project timelines.',
    aAr: 'تعتمد المواعيد على حجم الطلب، ولكن بفضل شبكة فروعنا ومصانعنا نضمن أسرع معدلات توريد للمشاريع الإقليمية.',
  },
];

export default function FaqSection({ isAr, themeColor = '#e11d48', darkMode = true }) {
  const [openIndex, setOpenIndex] = useState(0);

  // ألوان متكيفة ديناميكياً مع الثيم
  const textDesc = darkMode ? 'text-slate-400' : 'text-slate-600';
  const cardOpenBg = darkMode 
    ? 'border-red-600/70 bg-[#0b162c] shadow-red-950/25 ring-1 ring-red-500/20 text-white' 
    : 'border-red-500 bg-white shadow-xl ring-1 ring-red-500/20 text-slate-900';
  const cardClosedBg = darkMode 
    ? 'border-blue-900/40 bg-[#091328]/80 hover:border-blue-700/60 hover:bg-[#0b1730] text-white' 
    : 'border-slate-200 bg-white shadow-md hover:border-slate-300 hover:bg-slate-50 text-slate-900';
  
  const questionTitleColor = darkMode ? 'text-white' : 'text-slate-900';
  const answerBg = darkMode ? 'bg-black/15 border-blue-900/30 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <section 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-start"
    >
      {/* هيدر القسم موحد باستخدام SectionHeading */}
      <div className="mb-8 sm:mb-10 max-w-3xl space-y-3">
        <SectionHeading themeColor={themeColor} darkMode={darkMode}>
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </SectionHeading>
        <p className={`text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed ltr:pl-3.5 rtl:pr-3.5 sm:ltr:pl-4 sm:rtl:pr-4 ${textDesc}`}>
          {isAr
            ? 'إجابات سريعة على أهم استفسارات المهندسين والمقاولين.'
            : 'Quick answers to common engineering and procurement queries.'}
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-3.5 sm:space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl sm:rounded-2xl border transition-colors duration-300 overflow-hidden shadow-lg ${
                isOpen ? cardOpenBg : cardClosedBg
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 text-start focus:outline-none cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 ${
                    isOpen ? 'bg-red-500/10 text-red-500' : (darkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-500')
                  }`}>
                    <HelpCircle 
                      className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-colors duration-300" 
                      style={{ color: isOpen ? '#ef4444' : themeColor || '#ef4444' }} 
                    />
                  </div>
                  <span className={`font-bold text-sm sm:text-base lg:text-lg leading-snug ${questionTitleColor}`}>
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                </div>

                {/* حركة دوران السهم السلسة */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isOpen ? 'text-red-500' : (darkMode ? 'text-slate-400' : 'text-slate-500')
                    }`}
                  />
                </motion.div>
              </button>

              {/* تحريك فتح وغلق المحتوى */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
                      opacity: { duration: 0.25, delay: 0.05 }
                    }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 sm:px-5 lg:px-6 pb-5 pt-2 sm:pt-3 text-xs sm:text-sm lg:text-base leading-relaxed border-t ${answerBg}`}>
                      <p className="border-r-2 border-red-500/50 rtl:pr-3 ltr:border-r-0 ltr:border-l-2 ltr:pl-3">
                        {isAr ? faq.aAr : faq.aEn}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}