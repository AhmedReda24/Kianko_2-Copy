import { Link } from 'react-router';
import { useProjects } from '../hooks/useContent';
import { ROUTES } from '../routes';

export default function ProjectsPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const projects = useProjects();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-white">{isAr ? 'المشاريع الإقليمية' : 'Regional Projects'}</h1>
        <p className="text-slate-400">
          {isAr ? 'مشاريع نفّذناها في الشرق الأوسط وشمال إفريقيا.' : 'Projects we have supplied across the MENA region.'}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-900/70 p-12 text-center space-y-4">
          <p className="text-slate-300">
            {isAr ? 'قايمة المشاريع هتتضاف هنا قريباً.' : 'The project list will be added here soon.'}
          </p>
          <Link to={ROUTES.contact} className="inline-block text-white font-bold px-6 py-3 rounded-xl" style={{ backgroundColor: themeColor }}>
            {isAr ? 'اسأل عن مشروع معين' : 'Ask about a specific project'}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id} className="rounded-2xl overflow-hidden border border-blue-900/60 bg-[#0A1832]">
              {p.img && <img src={p.img} alt="" loading="lazy" className="h-48 w-full object-cover" />}
              <div className="p-5 space-y-1">
                <h2 className="font-bold text-white">{isAr ? p.nameAr : p.name}</h2>
                <p className="text-sm text-slate-400">{isAr ? p.locationAr : p.location} · {p.year}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
