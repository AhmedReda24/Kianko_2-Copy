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
  
  const locations = rawLocations.slice(0, 3).map((l, index) => {
    if (index === 0) {
      return {
        ...l,
        name: 'Kianko Company — Head Office & Factory',
        nameAr: 'شركة كيانكو — المقر الرئيسي والمصنع',
        city: 'Riyadh, Saudi Arabia',
        cityAr: 'الرياض، المملكة العربية السعودية',
        address: 'Al-Kharj Industrial City, Riyadh, Saudi Arabia',
        addressAr: 'مدينة الخرج الصناعية، الرياض، المملكة العربية السعودية',
        phone: '+966 11 234 5678',
        email: 'info@kianko-company.com',
        hours: 'Sun – Thu, 8:00 – 17:00',
        hoursAr: 'الأحد - الخميس، 8:00 صباحاً - 5:00 مساءً',
      };
    } else if (index === 1) {
      return {
        ...l,
        name: 'Jeddah Branch & Logistics Hub',
        nameAr: 'فرع جدة ومركز الخدمات اللوجستية',
        city: 'Jeddah, Saudi Arabia',
        cityAr: 'جدة، المملكة العربية السعودية',
        address: 'Phase 4, Industrial Area, Jeddah, Saudi Arabia',
        addressAr: 'المرحلة الرابعة، المنطقة الصناعية، جدة، المملكة العربية السعودية',
        phone: '+966 12 345 6789',
        email: 'jeddah@kianko-company.com',
        hours: 'Sun – Thu, 8:00 – 17:00',
        hoursAr: 'الأحد - الخميس، 8:00 صباحاً - 5:00 مساءً',
      };
    } else {
      return {
        ...l,
        name: 'Riyadh Sales & Support Branch',
        nameAr: 'فرع المبيعات والدعم الفني - الرياض',
        city: 'Riyadh, Saudi Arabia',
        cityAr: 'الرياض، المملكة العربية السعودية',
        address: 'Al-Malaz District, Riyadh, Saudi Arabia',
        addressAr: 'حي الملز، الرياض، المملكة العربية السعودية',
        phone: '+966 11 456 7890',
        email: 'riyadh.branch@kianko-company.com',
        hours: 'Sun – Thu, 8:00 – 17:00',
        hoursAr: 'الأحد - الخميس، 8:00 صباحاً - 5:00 مساءً',
      };
    }
  });

  const [activeId, setActiveId] = useState(locations[0]?.id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];
  const pick = (en, ar) => (isAr ? ar : en);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${active?.name ?? ''} ${active?.address ?? ''}`
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-start">
      
      <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-8 sm:mb-10 px-2">
        <div className="flex justify-center sm:justify-start">
          <div className="text-lg sm:text-3xl font-black tracking-tight text-white whitespace-nowrap">
            <SectionHeading as={asPage ? 'h1' : 'h2'} themeColor={themeColor}>
              {pick('Our Company & Branches', 'الشركة الرئيسية والفروع')}
            </SectionHeading>
          </div>
        </div>
        {/* تم ضبط النص واختصاره قليلاً ليظهر منسقاً وبدون تقطيع سيء */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-slate-300 max-w-lg mx-auto sm:mx-0">
          {pick(
            'Head office, factory and branches across Saudi Arabia — choose a location to explore.',
            'المقر الرئيسي والمصنع وفروعنا بالمملكة العربية السعودية — اختر الموقع لاستعراض التفاصيل.'
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
                className={`flex items-center gap-4 text-start p-4 rounded-2xl border-s-4 transition-all duration-300 shadow-sm cursor-pointer shrink-0 ${
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

              <div className="p-6 sm:p-8 space-y-6 text-center sm:text-start flex flex-col items-center sm:items-start">
                <div>
                  <h3 className="text-base sm:text-2xl font-extrabold text-white leading-snug">
                    {pick(active?.name, active?.nameAr)}
                  </h3>
                  <p className="text-blue-300 text-xs sm:text-sm font-semibold mt-1">{pick(active?.city, active?.cityAr)}</p>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-200 w-full max-w-md sm:max-w-none">
                  <li className="flex items-start sm:items-center justify-start gap-3.5">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" style={{ color: themeColor }} />
                    <span className="text-start">{pick(active?.address, active?.addressAr)}</span>
                  </li>
                  <li className="flex items-center justify-start gap-3.5">
                    <Phone className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`tel:${active?.phone?.replace(/\s/g, '')}`} dir="ltr" className="hover:underline font-bold text-white">{active?.phone}</a>
                  </li>
                  <li className="flex items-center justify-start gap-3.5">
                    <Mail className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <a href={`mailto:${active?.email}`} className="hover:underline">{active?.email}</a>
                  </li>
                  <li className="flex items-center justify-start gap-3.5">
                    <Clock className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span>{pick(active?.hours, active?.hoursAr)}</span>
                  </li>
                </ul>

                <div className="w-full sm:w-auto flex justify-center sm:justify-start pt-2">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-opacity hover:opacity-90 w-full sm:w-auto text-xs sm:text-base"
                    style={{ backgroundColor: themeColor }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{pick('Open in Google Maps', 'افتح في خرائط جوجل')}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}