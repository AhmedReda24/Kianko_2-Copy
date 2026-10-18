import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLocations } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

const TYPE = {
  Office: { icon: Building2, label: 'Head_Office', labelAr: 'المكتب الرئيسي' },
  branch: { icon: MapPin, label: 'Branch', labelAr: 'فرع' },
};

const digitsOnly = (v = '') => v.replace(/\D/g, '');
const telHref = (v = '') => `tel:${v.replace(/\s/g, '')}`;

// الأولوية: mapEmbed يدوي ← إحداثيات (lat/lng) ← مفيش خريطة (بنعرض الصورة)
function getEmbedSrc(loc, isAr) {
  if (loc?.mapEmbed) return loc.mapEmbed;
  if (loc?.lat != null && loc?.lng != null) {
    return `https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=16&hl=${isAr ? 'ar' : 'en'}&output=embed`;
  }
  return '';
}

function getMapsLink(loc) {
  if (loc?.mapLink) return loc.mapLink;
  if (loc?.lat != null && loc?.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${loc?.name ?? ''} ${loc?.address ?? ''}`
  )}`;
}

const focusCls =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const actionBase = `inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0 ${focusCls}`;

export default function LocationsSection({ isAr, themeColor, asPage = false }) {
  const locations = useLocations();
  const pick = (en, ar) => (isAr ? ar : en);

  const [activeId, setActiveId] = useState(locations[0]?.id);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];

  if (!active) return null;

  const embedSrc = getEmbedSrc(active, isAr);
  const mapsLink = getMapsLink(active);
  const waNumber = digitsOnly(active.whatsapp);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-start">
      <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-8 sm:mb-10 px-2">
        <div className="flex justify-center sm:justify-start">
          <div className="text-xl sm:text-3xl font-black tracking-tight text-white">
            <SectionHeading as={asPage ? 'h1' : 'h2'} themeColor={themeColor}>
              {pick('Our Locations', 'مواقعنا')}
            </SectionHeading>
          </div>
        </div>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate-300 max-w-lg mx-auto sm:mx-0">
          {pick(
            'Our branches across Saudi Arabia — choose a location to see the map and contact details.',
            'فروعنا في المملكة العربية السعودية — اختر الموقع لعرض الخريطة وبيانات التواصل.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* قائمة الفروع */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 content-start" role="tablist">
          {locations.map((l) => {
            const meta = TYPE[l.type] ?? TYPE.branch;
            const Icon = meta.icon;
            const isActive = l.id === active.id;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(l.id)}
                className={`flex items-center gap-4 text-start p-4 rounded-2xl border-s-4 transition-all duration-300 shadow-sm cursor-pointer ${focusCls} ${
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
                  <span className="block text-xs font-bold text-blue-300">{pick(meta.label, meta.labelAr)}</span>
                  <span className="block font-extrabold leading-snug text-sm sm:text-base text-white">
                    {pick(l.name, l.nameAr)}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">{pick(l.city, l.cityAr)}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* تفاصيل الفرع */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-blue-900/60 bg-[#0B1B3A] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: isAr ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
            
              <div className="relative h-56 sm:h-72 bg-slate-900">
                {embedSrc ? (
                  <iframe
                    title={pick(active.name, active.nameAr)}
                    src={embedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    <img
                      src={active.img}
                      alt={pick(active.name, active.nameAr)}
                      loading="lazy"
                      className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] to-transparent" />
                    <span
                      className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      <MapPin className="w-4 h-4" />
                      {pick(active.city, active.cityAr)}
                    </span>
                  </>
                )}
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                    {pick(active.name, active.nameAr)}
                  </h3>
                  <p className="text-blue-300 text-xs sm:text-sm font-semibold mt-1">{pick(active.city, active.cityAr)}</p>
                </div>

                <ul className="space-y-4 text-sm text-slate-200">
                  <li className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    <span>{pick(active.address, active.addressAr)}</span>
                  </li>
                  {active.phone && (
                    <li className="flex items-center gap-3.5">
                      <Phone className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                      <a href={telHref(active.phone)} dir="ltr" className="font-bold text-white hover:underline">
                        {active.phone}
                      </a>
                    </li>
                  )}
                  {active.email && (
                    <li className="flex items-center gap-3.5">
                      <Mail className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                      <a href={`mailto:${active.email}`} className="hover:underline break-all">
                        {active.email}
                      </a>
                    </li>
                  )}
                  {(active.hours || active.hoursAr) && (
                    <li className="flex items-center gap-3.5">
                      <Clock className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                      <span>{pick(active.hours, active.hoursAr)}</span>
                    </li>
                  )}
                </ul>

                <div className={`grid grid-cols-1 gap-3 pt-2 ${waNumber ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                  {active.phone && (
                    <a
                      href={telHref(active.phone)}
                      className={`${actionBase} shadow-lg`}
                      style={{ backgroundColor: themeColor }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>{pick('Call Now', 'اتصل الآن')}</span>
                    </a>
                  )}
                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${actionBase} bg-emerald-600 shadow-lg`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{pick('WhatsApp', 'واتساب')}</span>
                    </a>
                  )}
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${actionBase} bg-white/10 border border-white/20`}
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