import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Briefcase, Building2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useLocations } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

const TYPE = {
  company: { icon: Building2, label: 'Main Company', labelAr: 'الشركة الرئيسية' },
  branch: { icon: MapPin, label: 'Branch', labelAr: 'فرع' },
  office: { icon: Briefcase, label: 'Office', labelAr: 'مكتب' },
};

export default function LocationsSection({ isAr, themeColor, asPage = false }) {
  const locations = useLocations();
  const [activeId, setActiveId] = useState(locations[0].id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];
  const pick = (en, ar) => (isAr ? ar : en);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${active.name} ${active.address}`
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-start">
      <div className="max-w-2xl mb-10">
        <SectionHeading as={asPage ? 'h1' : 'h2'} themeColor={themeColor}>
          {pick('Our Company, Branches & Office', 'الشركة والفروع والمكتب')}
        </SectionHeading>
        <p className="mt-4 text-slate-300 leading-relaxed">
          {pick(
            'One company, two branches and an office — pick a location to see how to reach it.',
            'شركة وفرعين ومكتب — اختار المكان عشان تشوف تفاصيل الوصول إليه.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-2" role="tablist" aria-orientation="vertical">
          {locations.map((l) => {
            const meta = TYPE[l.type];
            const Icon = meta.icon;
            const isActive = l.id === activeId;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(l.id)}
                className={`flex items-center gap-4 text-start p-4 rounded-xl border-s-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive ? 'bg-white/10' : 'bg-white/[0.03] hover:bg-white/[0.07]'
                }`}
                style={{ borderColor: isActive ? themeColor : 'transparent' }}
              >
                <span
                  className="relative grid place-items-center h-11 w-11 rounded-lg shrink-0 text-white"
                  style={{ backgroundColor: isActive ? themeColor : 'rgba(255,255,255,0.1)' }}
                >
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-0 rounded-lg animate-ping opacity-30" style={{ backgroundColor: themeColor }} />
                  )}
                  <Icon className="relative w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-blue-300">{pick(meta.label, meta.labelAr)}</span>
                  <span className="block font-bold text-white leading-snug">{pick(l.name, l.nameAr)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#0B1B3A] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: isAr ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative h-64 bg-slate-900">
                {active.mapEmbed ? (
                  <iframe
                    title={pick(active.name, active.nameAr)}
                    src={active.mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    <img src={active.img} alt="" loading="lazy" className="w-full h-full object-cover brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] to-transparent" />
                  </>
                )}
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{pick(active.name, active.nameAr)}</h3>
                  <p className="text-blue-300 text-sm font-medium mt-1">{pick(active.city, active.cityAr)}</p>
                </div>

                <ul className="space-y-3 text-slate-200 text-sm">
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span>{pick(active.address, active.addressAr)}</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`tel:${active.phone.replace(/\s/g, '')}`} dir="ltr" className="hover:underline">{active.phone}</a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`mailto:${active.email}`} className="hover:underline">{active.email}</a>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span>{pick(active.hours, active.hoursAr)}</span>
                  </li>
                </ul>

                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
