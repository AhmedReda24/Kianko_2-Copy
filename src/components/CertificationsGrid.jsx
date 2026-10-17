import React, { useState } from 'react';
import { Award, FileCheck, ExternalLink, X, Download } from 'lucide-react';
import { accreditations } from '../data/accreditations';

export default function CertificationsGrid({
  lang = 'en',
  themeColor = '#C9252C',
  badge
}) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div className="min-h-screen bg-[#07132B] text-slate-100 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-start dir-rtl">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          {badge && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{badge}</span>
            </span>
          )}
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight flex items-center justify-center gap-2 flex-wrap">
            <span>{pick('Accreditations & Quality at', 'الاعتمادات والجودة في')}</span>
            <span style={{ color: themeColor }}>
              {pick('KIANKO', 'كيانكو')}
            </span>
          </h1>

          <p className="text-slate-300 font-medium text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            {pick(
              'The systems, standards, and official accreditations we work to, so quality stays consistent at every stage of manufacturing.',
              'الأنظمة والمعايير والاعتمادات الرسمية التي نعمل بها لضمان جودة ثابتة في كل مرحلة تصنيع.'
            )}
          </p>
        </div>

        {/* 2. Dark Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {accreditations.map((item) => (
            <div
              key={item.id}
              className="bg-[#0A1832] border border-blue-900/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xl hover:border-blue-700/60 transition-all duration-300 group"
            >
              <div className="space-y-4">
                
                {/* إطار معاينة الشهادة (متجاوب مع الموبايل واللابتوب) */}
                <div 
                  className="relative rounded-xl overflow-hidden bg-white border border-slate-200 h-52 sm:h-64 flex items-center justify-center cursor-pointer group/frame shadow-md"
                  onClick={() => setSelectedPdf(item)}
                >
                  {/* المعاينة الحية تعمل بسلاسة على شاشات اللابتوب والكمبيوتر */}
                  <iframe
                    src={`${item.file}#page=1&view=FitH&toolbar=0&navpanes=0`}
                    title={item.name}
                    className="w-full h-full pointer-events-none scale-105 hidden sm:block"
                  />

                  {/* تصميم بديل ومرتب للغاية يظهر على الهواتف المحمولة */}
                  <div className="sm:hidden flex flex-col items-center justify-center p-4 text-center space-y-2 bg-slate-50 w-full h-full">
                    <div className="w-12 h-12 rounded-full bg-[#C9252C]/10 flex items-center justify-center text-[#C9252C]">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                    <span className="text-[11px] px-3 py-1 rounded-lg bg-[#0A1832] text-white font-semibold shadow-xs">
                      {pick('Tap to View PDF', 'اضغط لمعاينة المستند')}
                    </span>
                  </div>

                  {/* طبقة التفاعل عند المرور بالماوس على الشاشات الكبيرة */}
                  <div className="absolute inset-0 bg-[#0A1832]/75 opacity-0 group-hover/frame:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-xl">
                    <ExternalLink className="w-5 h-5 text-emerald-400" />
                    <span>{pick('Click to Preview PDF', 'انقر لمعاينة ملف الاعتماد')}</span>
                  </div>
                </div>

                {/* تفاصيل الاعتماد */}
                <div className="space-y-2">
                  <span 
                    className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    {item.code}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-slate-200 transition-colors leading-snug">
                    {pick(item.titleEn, item.titleAr)}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {pick(item.descEn, item.descAr)}
                  </p>
                </div>
              </div>

              {/* أسفل الكارد */}
              <div className="pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>{pick('Verified Approval', 'اعتماد موثق')}</span>
                </span>

                <a
                  href={item.file}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pick('View Cert', 'تحميل المستند')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Lightbox Preview Modal */}
        {selectedPdf && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="relative bg-[#0A1832] text-white border border-blue-900/60 rounded-2xl p-4 sm:p-6 max-w-5xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: themeColor }}>
                    {selectedPdf.code}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-white truncate">
                    {pick(selectedPdf.titleEn, selectedPdf.titleAr)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* إطار العرض داخل النافذة المنبثقة */}
              <div className="bg-white rounded-xl h-[70vh] w-full overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  src={`${selectedPdf.file}#toolbar=1`}
                  title={selectedPdf.name}
                  className="w-full h-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <a
                  href={selectedPdf.file}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  <Download className="w-4 h-4" />
                  <span>{pick('Download Full Document', 'تحميل الاعتماد الرسمي كامل')}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}