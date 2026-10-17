import { useState, useEffect, useRef } from 'react';
import { Award, FileCheck, ZoomIn, X, Download, FileText, Loader2 } from 'lucide-react';
import { accreditations } from '../data/accreditations'; // استيراد الـ 14 اعتماداً من ملف الـ js
import * as pdfjsLib from 'pdfjs-dist';

// إعداد worker المكتبة لرسم الـ PDF
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * مكون خفيف لرسم الصفحة الأولى من ملف الـ PDF كصورة معاينة داخل الكارد الفاتح
 */
function PdfFirstPageThumbnail({ pdfUrl }) {
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-4 text-center">
        <FileText className="w-10 h-10 text-slate-400" />
        <span className="text-xs font-medium">معاينة غير متاحة</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-50">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#0A1832]" />
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-xs" />
    </div>
  );
}

export default function AccreditationsPage({ lang = 'ar', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. عنوان الصفحة */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0A1832]">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('OFFICIAL ACCREDITATIONS', 'اعتمادات المشاريع')}</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {pick('Approved Project Submittals', 'اعتمادات كيانكو للمشاريع الكبرى')}
        </h1>
        <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
          {pick(
            'Official material submittals and approved vendor certificates for major projects.',
            'استعرض اعتمادات المواد والموردين المعتمدة لمشاريع كيانكو الكبرى.'
          )}
        </p>
      </div>

      {/* 2. شبكة الكروت الفاتحة متناسبة مع هوية كيانكو */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accreditations.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
          >
            <div className="space-y-4">
              {/* المعاينة المباشرة للصفحة الأولى من الـ PDF */}
              <div 
                className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200 h-56 flex items-center justify-center cursor-pointer group/img"
                onClick={() => setSelectedItem(item)}
              >
                <PdfFirstPageThumbnail pdfUrl={item.file} />

                <div className="absolute inset-0 bg-[#0A1832]/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-xl">
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
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0A1832] transition-colors">
                  {pick(item.titleEn, item.titleAr)}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {pick(item.descEn, item.descAr)}
                </p>
              </div>
            </div>

            {/* زر التحميل والتأكيد */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{pick('Verified', 'اعتماد موثق')}</span>
              </span>

              <a
                href={item.file}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#0A1832] hover:text-white transition-all text-xs"
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
          <div className="relative bg-white border border-slate-200 rounded-2xl p-4 max-w-4xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: themeColor }}>
                {selectedItem.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 truncate">
                {pick(selectedItem.titleEn, selectedItem.titleAr)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-slate-100 rounded-xl h-[70vh] w-full overflow-hidden border border-slate-200">
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