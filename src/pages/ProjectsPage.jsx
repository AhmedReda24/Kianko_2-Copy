import { Link } from 'react-router';
import { useProjects } from '../hooks/useContent';
import { ROUTES } from '../routes';

export default function ProjectsPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const projects = useProjects();

  // الألوان المتكيفة مع الثيم
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-400' : 'text-slate-600';
  const emptyBox = darkMode ? 'border-dashed border-blue-900/70 text-slate-300' : 'border-dashed border-slate-300 text-slate-700 bg-white shadow-md';
  const cardBg = darkMode ? 'border-blue-900/60 bg-[#0A1832] text-white' : 'border-slate-200 bg-white text-slate-900 shadow-xl';
  const subText = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start">
      <div className="max-w-2xl space-y-3">
        <h1 className={`text-4xl sm:text-5xl font-black ${textTitle}`}>{isAr ? 'المشاريع الإقليمية' : 'Regional Projects'}</h1>
        <p className={textDesc}>
          {isAr ? 'مشاريع نفّذناها في الشرق الأوسط وشمال إفريقيا.' : 'Projects we have supplied across the MENA region.'}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center space-y-4 ${emptyBox}`}>
          <p>
            {isAr ? 'قايمة المشاريع هتتضاف هنا قريباً.' : 'The project list will be added here soon.'}
          </p>
          <Link to={ROUTES.contact} className="inline-block text-white font-bold px-6 py-3 rounded-xl shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
            {isAr ? 'اسأل عن مشروع معين' : 'Ask about a specific project'}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id} className={`rounded-2xl overflow-hidden border transition-all duration-300 ${cardBg}`}>
              {p.img && <img src={p.img} alt="" loading="lazy" className="h-48 w-full object-cover" />}
              <div className="p-5 space-y-1">
                <h2 className={`font-bold ${textTitle}`}>{isAr ? p.nameAr : p.name}</h2>
                <p className={`text-sm ${subText}`}>{isAr ? p.locationAr : p.location} · {p.year}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}