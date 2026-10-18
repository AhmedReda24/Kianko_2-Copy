import React, { useState } from 'react';
import { Award, FileCheck, ExternalLink, X, Download, FileText } from 'lucide-react';
import { accreditations } from '../data/accreditations';

export default function CertificationsGrid({
  lang = 'en',
  themeColor = '#C9252C',
  badge,
  darkMode = true
}) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  const [selectedPdf, setSelectedPdf] = useState(null);

  // المتغيرات المتكيفة مع الثيم
  const pageBg = darkMode ? 'bg-[#07132B] text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const badgeBg = darkMode ? 'bg-white/10 text-emerald-400 border-white/10' : 'bg-slate-200 text-slate-800 border-slate-300';
  const frameBg = darkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-100 border-slate-300';
  const dividerColor = darkMode ? 'border-blue-900/40' : 'border-slate-200';
  const downloadBtn = darkMode 
    ? 'bg-white/10 text-white hover:bg-white/20' 
    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300';
  const modalBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/60' : 'bg-white text-slate-900 border-slate-300';

  return (
    <div className={`min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-start dir-rtl transition-colors duration-300 ${pageBg}`}>
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          {badge && (
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-sm ${badgeBg}`}>
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{badge}</span>
            </span>
          )}
          
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight flex items-center justify-center gap-2 flex-wrap ${textTitle}`}>
            <span>{pick('Accreditations & Quality at', 'الاعتمادات والجودة في')}</span>
            <span style={{ color: themeColor }}>
              {pick('KIANKO', 'كيانكو')}
            </span>
          </h1>

          <p className={`font-medium text-xs sm:text-base leading-relaxed max-w-2xl mx-auto ${textDesc}`}>
            {pick(
              'The systems, standards, and official accreditations we work to, so quality stays consistent at every stage of manufacturing.',
              'الأنظمة والمعايير والاعتمادات الرسمية التي نعمل بها لضمان جودة ثابتة في كل مرحلة تصنيع.'
            )}
          </p>
        </div>

        {/* 2. Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {accreditations.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 group border shadow-lg ${cardBg}`}
            >
              <div className="space-y-4">
                
                {/* إطار معاينة صورة الشهادة */}
                <div 
                  className={`relative rounded-xl overflow-hidden border h-52 sm:h-64 flex items-center justify-center cursor-pointer group/frame shadow-md ${frameBg}`}
                  onClick={() => setSelectedPdf(item)}
                >
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name || 'Cert'} 
                      loading="eager"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/frame:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full p-4 bg-white flex flex-col justify-between select-none relative overflow-hidden text-slate-800">
                      <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                          KIANKO CERTIFIED
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                      </div>
                      <div className="my-auto text-center space-y-2 py-2">
                        <FileText className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="text-xs font-bold text-slate-800 line-clamp-2">
                          {pick(item.titleEn, item.titleAr)}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 text-center">
                        PDF DOCUMENT
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#0A1832]/85 opacity-0 group-hover/frame:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <span>{pick('Click to Preview Full PDF', 'انقر لمعاينة المستند الكامل')}</span>
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
                  <h3 className={`text-lg font-bold transition-colors leading-snug ${textTitle}`}>
                    {pick(item.titleEn, item.titleAr)}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${textDesc}`}>
                    {pick(item.descEn, item.descAr)}
                  </p>
                </div>
              </div>

              {/* أسفل الكارد */}
              <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold ${dividerColor}`}>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>{pick('Verified Approval', 'اعتماد موثق')}</span>
                </span>

                <a
                  href={item.file}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${downloadBtn}`}
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
            <div className={`relative rounded-2xl p-4 sm:p-6 max-w-5xl w-full space-y-4 shadow-2xl border ${modalBg}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${darkMode ? 'border-blue-900/50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: themeColor }}>
                    {selectedPdf.code}
                  </span>
                  <h3 className={`text-sm sm:text-lg font-bold truncate ${textTitle}`}>
                    {pick(selectedPdf.titleEn, selectedPdf.titleAr)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'bg-white/15 text-slate-200 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white rounded-xl h-[70vh] w-full overflow-hidden border border-slate-300 shadow-inner">
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