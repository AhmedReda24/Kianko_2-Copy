import { Download, ShieldCheck } from 'lucide-react';
import { useAccreditations } from '../hooks/useContent';
import SpotlightCard from './ui/SpotlightCard';

export default function CertificationsGrid({ lang = 'en', themeColor = '#C9252C', badge, title, intro }) {
  const isAr = lang === 'ar';
  const accreditations = useAccreditations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start">
      <div className="text-center space-y-3">
        <span className="px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase shadow-lg inline-block" style={{ backgroundColor: themeColor }}>
          {badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">{title}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">{intro}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accreditations.map((c) => (
          <SpotlightCard
            as="article"
            key={c.id}
            className="bg-[#0A1832] rounded-3xl p-6 border border-blue-900/60 shadow-2xl flex flex-col justify-between space-y-6 group hover:border-slate-500 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-900 via-[#0B1E3D] to-slate-950 p-6 h-56 flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between items-start">
                <p className="text-xs text-slate-300 font-bold">{isAr ? 'اعتماد' : 'ACCREDITATION'}</p>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="text-center space-y-2" dir="ltr">
                <h2 className="text-2xl font-black text-white tracking-wider group-hover:scale-105 transition-transform">{c.name}</h2>
                <p className="text-xs text-blue-300 font-semibold">{c.titleEn}</p>
              </div>
              <div />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white" dir="ltr">{c.name}</h3>
              <h4 className="text-xs font-bold text-slate-300">{isAr ? c.titleAr : c.titleEn}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{isAr ? c.descAr : c.descEn}</p>
            </div>

            {c.file && (
              <a
                href={c.file}
                download
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-bold transition-colors border border-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل ملف الشهادة' : 'Download Certificate'}</span>
              </a>
            )}
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
