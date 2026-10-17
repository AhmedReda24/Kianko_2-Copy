<div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group">
  <div className="space-y-4">
    {/* معاينة الصفحة الأولى من الـ PDF مباشرة داخل الكارد */}
    <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 h-60 sm:h-64 flex items-center justify-center shadow-inner">
      <iframe
        src={`${cert.file || item.file}#page=1&view=FitH&toolbar=0&navpanes=0`}
        title={cert.name || item.name}
        className="w-full h-full pointer-events-none scale-105"
      />
    </div>

    {/* تفاصيل الكارد */}
    <div className="space-y-2 text-start">
      <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white bg-[#C9252C] inline-block shadow-xs">
        {cert.code || item.code}
      </span>
      <h3 className="text-lg font-bold text-slate-900">
        {lang === 'ar' ? (cert.titleAr || item.titleAr) : (cert.titleEn || item.titleEn)}
      </h3>
      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
        {lang === 'ar' ? (cert.descAr || item.descAr) : (cert.descEn || item.descEn)}
      </p>
    </div>
  </div>

  {/* زر التحميل */}
  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
    <a
      href={cert.file || item.file}
      target="_blank"
      rel="noreferrer"
      download
      className="w-full text-center py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-[#0A1832] hover:text-white transition-all text-xs font-semibold"
    >
      {lang === 'ar' ? 'تحميل المستند' : 'Download Certificate'}
    </a>
  </div>
</div>