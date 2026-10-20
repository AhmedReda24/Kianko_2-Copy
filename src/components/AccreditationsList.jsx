import { useState, useEffect } from 'react';
import { Award, FileCheck, ZoomIn, X, Download, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { accreditations as localAccreditations } from '../data/accreditations';

export default function AccreditationsPage({ lang = 'ar', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const [selectedItem, setSelectedItem] = useState(null);
  const [accreditations, setAccreditations] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);

  useEffect(() => {
    async function fetchAllApprovals() {
      try {
        setLoadingCerts(true);
        // 1. جلب المستندات المضافة من قاعدة البيانات (إن وجدت)
        const { data } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: false });

        const dbFormatted = (data || []).map(item => ({
          id: item.id,
          code: item.code || 'APPROVE',
          titleEn: item.title,
          titleAr: item.title,
          descEn: item.issuer ? `Issuer/Project: ${item.issuer}` : 'Official project approval submittal.',
          descAr: item.issuer ? `الجهة / المشروع: ${item.issuer}` : 'اعتماد رسمي وموثق للمشروع.',
          file: item.file_url || null,
          image: item.file_url ? item.file_url.replace(/\.pdf$/i, '.webp') : null
        }));

        // 2. دمج الاعتمادات المحلية الموجودة في ملف accreditations.js
        const localFormatted = (localAccreditations || []).map(item => ({
          id: item.id,
          code: item.code,
          titleEn: item.titleEn,
          titleAr: item.titleAr,
          descEn: item.descEn,
          descAr: item.descAr,
          file: item.file,
          image: item.image // استخدام الصورة المباشرة من ملف الـ JS
        }));

        setAccreditations([...dbFormatted, ...localFormatted]);
      } catch (err) {
        console.error('Error fetching accreditations:', err);
      } finally {
        setLoadingCerts(false);
      }
    }
    fetchAllApprovals();
  }, []);

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
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-[#0A1832] text-white border border-blue-950' : 'bg-slate-200 text-slate-800 border border-slate-300'}`}>
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('OFFICIAL ACCREDITATIONS', 'اعتمادات المشاريع')}</span>
        </span>
        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${textTitle}`}>
          {pick('Approved Project Submittals', 'اعتمادات كيانكو للمشاريع الكبرى')}
        </h1>
        <p className={`font-medium text-sm sm:text-base leading-relaxed ${textDesc}`}>
          {pick('Official material submittals and approved vendor certificates for major projects.', 'استعرض اعتمادات المواد والموردين المعتمدة لمشاريع كيانكو الكبرى.')}
        </p>
      </div>

      {loadingCerts ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : accreditations.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${cardBg}`}>
          <p className={`text-sm ${textDesc}`}>{pick('No project approvals added yet.', 'لا توجد اعتمادات مضافة حتى الآن.')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accreditations.map((item, idx) => {
            const title = pick(item.titleEn, item.titleAr);
            return (
              <div
                key={item.id || idx}
                className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-300 group border ${cardBg}`}
              >
                <div className="space-y-4">
                  <div 
                    className={`relative rounded-xl overflow-hidden border h-56 flex items-center justify-center cursor-pointer group/img p-2 bg-white ${thumbWrapper}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* واجهة احتياطية لو الصورة مش موجودة */}
                    <div className="absolute inset-0 bg-slate-900/90 flex-col items-center justify-center gap-2 text-white p-4 hidden">
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                      <span className="text-xs font-bold text-center">{title}</span>
                    </div>

                    <div className="absolute inset-0 bg-[#0A1832]/70 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-xl">
                      <ZoomIn className="w-5 h-5" />
                      <span>{pick('Preview Document', 'معاينة المستند')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-start">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white inline-block shadow-xs" style={{ backgroundColor: themeColor }}>
                      {item.code}
                    </span>
                    <h3 className={`text-lg font-bold transition-colors ${textTitle}`}>
                      {title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${textDesc}`}>
                      {pick(item.descEn, item.descAr)}
                    </p>
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold ${dividerColor}`}>
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <FileCheck className="w-4 h-4 shrink-0" />
                    <span>{pick('Verified', 'اعتماد موثق')}</span>
                  </span>

                  {item.file && (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedItem && selectedItem.file && (
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
                title={selectedItem.code}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}