import { useState, useEffect, useRef } from 'react';
import { Award, FileCheck, ZoomIn, X, Download, FileText, Loader2 } from 'lucide-react';
import { accreditations } from '../data/accreditations';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

function PdfFirstPageThumbnail({ pdfUrl, darkMode = true }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPdfFirstPage() {
      try {
        setLoading(true);
        setError(false);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isMounted) return;

        const viewport = page.getViewport({ scale: 0.8 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    if (pdfUrl) loadPdfFirstPage();
    return () => { isMounted = false; };
  }, [pdfUrl]);

  const thumbBg = darkMode ? 'bg-[#061022]' : 'bg-slate-100';
  const loaderBg = darkMode ? 'bg-slate-900/80' : 'bg-slate-200/80';

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-4 text-center ${thumbBg}`}>
        <FileText className="w-10 h-10 text-slate-400" />
        <span className="text-xs font-medium">معاينة غير متاحة</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${thumbBg}`}>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 ${loaderBg}`}>
          <Loader2 className="w-6 h-6 animate-spin text-[#0A1832]" />
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-xs" />
    </div>
  );
}

export default function AccreditationsPage({ lang = 'ar', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const [selectedItem, setSelectedItem] = useState(null);

  // ألوان متكيفة تماماً حسب الثيم (داكن أو فاتح)
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 shadow-xl' : 'bg-white border-slate-200 shadow-lg';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const thumbWrapper = darkMode ? 'bg-[#061022] border-blue-950' : 'bg-slate-100 border-slate-200';
  const dividerColor = darkMode ? 'border-blue-900/40' : 'border-slate-200';
  const downloadBtn = darkMode 
    ? 'bg-slate-900 text-slate-200 hover:bg-[#0A1832] hover:text-white border border-blue-900/60' 
    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-950 border border-slate-300';
  const modalBg = darkMode ? 'bg-[#0A1832] border-blue-900/80 text-white' : 'bg-white border-slate-300 text-slate-900';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. عنوان الصفحة */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-[#0A1832] text-white border border-blue-950' : 'bg-slate-200 text-slate-800 border border-slate-300'}`}>
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('OFFICIAL ACCREDITATIONS', 'اعتمادات المشاريع')}</span>
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${textTitle}`}>
          {pick('Approved Project Submittals', 'اعتمادات كيانكو للمشاريع الكبرى')}
        </h1>
        <p className={`font-medium text-sm sm:text-base leading-relaxed ${textDesc}`}>
          {pick(
            'Official material submittals and approved vendor certificates for major projects.',
            'استعرض اعتمادات المواد والموردين المعتمدة لمشاريع كيانكو الكبرى.'
          )}
        </p>
      </div>

      {/* 2. شبكة الكروت */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accreditations.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-300 group border ${cardBg}`}
          >
            <div className="space-y-4">
              {/* المعاينة المباشرة */}
              <div 
                className={`relative rounded-xl overflow-hidden border h-56 flex items-center justify-center cursor-pointer group/img ${thumbWrapper}`}
                onClick={() => setSelectedItem(item)}
              >
                <PdfFirstPageThumbnail pdfUrl={item.file} darkMode={darkMode} />

                <div className="absolute inset-0 bg-[#0A1832]/70 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-xl">
                  <ZoomIn className="w-5 h-5" />
                  <span>{pick('Preview PDF', 'معاينة الملف')}</span>
                </div>
              </div>

              {/* تفاصيل الاعتماد */}
              <div className="space-y-2 text-start">
                <span 
                  className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs"
                  style={{ backgroundColor: themeColor }}
                >
                  {item.code}
                </span>
                <h3 className={`text-lg font-bold transition-colors ${textTitle}`}>
                  {pick(item.titleEn, item.titleAr)}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-2 ${textDesc}`}>
                  {pick(item.descEn, item.descAr)}
                </p>
              </div>
            </div>

            {/* زر التحميل والتأكيد */}
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold ${dividerColor}`}>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{pick('Verified', 'اعتماد موثق')}</span>
              </span>

              <a
                href={item.file}
                target="_blank"
                rel="noreferrer"
                download
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${downloadBtn}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{pick('Download', 'تحميل')}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 3. نافذة منبثقة (Modal) لمشاهدة الملف عند الضغط */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`relative rounded-2xl p-4 max-w-4xl w-full space-y-4 shadow-2xl border ${modalBg}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${darkMode ? 'border-blue-900/60' : 'border-slate-200'}`}>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: themeColor }}>
                {selectedItem.code}
              </span>
              <h3 className={`text-base font-bold truncate ${textTitle}`}>
                {pick(selectedItem.titleEn, selectedItem.titleAr)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className={`p-1.5 rounded-xl transition-colors ${darkMode ? 'bg-slate-900 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`rounded-xl h-[70vh] w-full overflow-hidden border ${darkMode ? 'bg-slate-950 border-blue-950' : 'bg-slate-100 border-slate-300'}`}>
              <iframe
                src={`${selectedItem.file}#toolbar=0`}
                title={selectedItem.name}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}