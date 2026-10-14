import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useLocations } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

const TYPE = {
  company: { icon: Building2, label: 'Main Company', labelAr: 'الشركة الرئيسية' },
  branch: { icon: MapPin, label: 'Branch', labelAr: 'فرع' },
};

export default function LocationsSection({ isAr, themeColor, asPage = false }) {
  const rawLocations = useLocations();
  const locations = rawLocations.filter((l) => l.type !== 'office');
  
  const [activeId, setActiveId] = useState(locations[0]?.id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];
  const pick = (en, ar) => (isAr ? ar : en);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${active?.name ?? ''} ${active?.address ?? ''}`
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-start">
      <div className="max-w-2xl mb-8 sm:mb-10">
        <SectionHeading as={asPage ? 'h1' : 'h2'} themeColor={themeColor}>
          {pick('Our Company & Branches', 'الشركة الرئيسية والفروع')}
        </SectionHeading>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
          {pick(
            'One main head office & factory and two branches — pick a location to see how to reach it.',
            'المقر الرئيسي والمصنع بالإضافة للفرعين — اختر الموقع للوصول إلى تفاصيله.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-2.5" role="tablist" aria-orientation="vertical">
          {locations.map((l) => {
            const meta = TYPE[l.type] ?? TYPE.branch;
            const Icon = meta.icon;
            const isActive = l.id === activeId;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(l.id)}
                className={`flex items-center gap-4 text-start p-4 rounded-2xl border-s-4 transition-all duration-300 shadow-sm ${
                  isActive
                    ? 'bg-white/10 text-white border-slate-300'
                    : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
                }`}
                style={{ borderColor: isActive ? themeColor : 'transparent' }}
              >
                <span
                  className="relative grid place-items-center h-11 w-11 rounded-xl shrink-0 text-white shadow-md transition-colors"
                  style={{ backgroundColor: isActive ? themeColor : 'rgba(255,255,255,0.1)' }}
                >
                  <Icon className="relative w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-blue-300">
                    {pick(meta.label, meta.labelAr)}
                  </span>
                  <span className="block font-extrabold leading-snug text-sm sm:text-base text-white">{pick(l.name, l.nameAr)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#0B1B3A] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id}
              initial={{ opacity: 0, x: isAr ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative h-56 sm:h-64 bg-slate-900">
                {active?.mapEmbed ? (
                  <iframe
                    title={pick(active.name, active.nameAr)}
                    src={active.mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    <img src={active?.img} alt="" loading="lazy" className="w-full h-full object-cover brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] to-transparent" />
                  </>
                )}
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {pick(active?.name, active?.nameAr)}
                  </h3>
                  <p className="text-blue-300 text-xs sm:text-sm font-semibold mt-1">{pick(active?.city, active?.cityAr)}</p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span>{pick(active?.address, active?.addressAr)}</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`tel:${active?.phone?.replace(/\s/g, '')}`} dir="ltr" className="hover:underline font-bold text-white">{active?.phone}</a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`mailto:${active?.email}`} className="hover:underline">{active?.email}</a>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span>{pick(active?.hours, active?.hoursAr)}</span>
                  </li>
                </ul>

                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  <MapPin className="w-4 h-4" />
                  {pick('Open in Google Maps', 'افتح في خرائط جوجل')}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}