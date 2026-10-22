import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2, Clock, Mail, MapPin, MessageCircle,
  Phone, Copy, Check, ExternalLink, Navigation
} from 'lucide-react';
import { useLocations } from '../../hooks/useContent';
import SectionHeading from '../ui/SectionHeading';

const TYPE = {
  office: { icon: Building2, label: 'Head Office', labelAr: 'المكتب الرئيسي' },
  branch: { icon: MapPin, label: 'Regional Branch', labelAr: 'فرع إقليمي' },
};

function getBranchTypeMeta(typeValue) {
  const norm = String(typeValue || '').toLowerCase();
  if (norm === 'office' || norm === 'head' || norm === 'main' || norm.includes('head')) {
    return TYPE.office;
  }
  return TYPE.branch;
}

const telHref = (v = '') => `tel:${v.replace(/\s/g, '')}`;

function formatWhatsAppNumber(raw = '') {
  let digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('05') && digits.length === 10) {
    digits = '966' + digits.slice(1);
  } else if (digits.startsWith('01') && digits.length === 11) {
    digits = '2' + digits;
  }
  return digits;
}

function getEmbedSrc(loc, isAr) {
  if (loc?.mapEmbed) return loc.mapEmbed;
  if (loc?.lat != null && loc?.lng != null) {
    return `https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=16&hl=${isAr ? 'ar' : 'en'}&output=embed`;
  }
  const queryAddress = isAr ? (loc?.addressAr || loc?.address) : (loc?.address || loc?.addressAr);
  if (queryAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(queryAddress)}&z=15&hl=${isAr ? 'ar' : 'en'}&output=embed`;
  }
  return '';
}

function getMapsLink(loc, isAr) {
  if (loc?.mapLink) return loc.mapLink;
  if (loc?.lat != null && loc?.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
  }
  const queryStr = isAr
    ? `${loc?.nameAr || loc?.name || ''} ${loc?.addressAr || loc?.address || ''}`
    : `${loc?.name || ''} ${loc?.address || ''}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr.trim())}`;
}

const focusCls =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function LocationsSection({ isAr, lang, themeColor = '#C9252C', asPage = false, darkMode = true }) {
  const isArabic = typeof isAr === 'boolean' ? isAr : lang === 'ar';
  const locations = useLocations();
  const pick = (en, ar) => (isArabic ? ar : en);

  const [activeId, setActiveId] = useState(locations[0]?.id);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const detailCardRef = useRef(null);

  const active = locations.find((l) => l.id === activeId) ?? locations[0];

  // تحميل وتطبيق خط IBM Plex Sans Arabic تلقائياً عند اختيار اللغة العربية
  useEffect(() => {
    const fontId = 'ibm-plex-sans-arabic-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    if (isArabic && asPage) {
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', sans-serif";
    }
  }, [isArabic, asPage]);

  if (!active) return null;

  const embedSrc = getEmbedSrc(active, isArabic);
  const mapsLink = getMapsLink(active, isArabic);
  const waNumber = formatWhatsAppNumber(active.whatsapp || active.phone);
  const activeMeta = getBranchTypeMeta(active.type);

  const activeName = pick(active.name, active.nameAr);
  const activeCity = pick(active.city || 'Saudi Arabia', active.cityAr || 'المملكة العربية السعودية');
  const activeAddress = pick(active.address, active.addressAr);
  const activeHours = pick(
    active.hours || 'Sun – Thu: 8:00 AM – 5:00 PM',
    active.hoursAr || 'الأحد – الخميس: 8:00 صباحاً – 5:00 مساءً'
  );

  const waMessage = encodeURIComponent(
    isArabic
      ? `مرحباً شركة كيانكو للصناعات الحديدية (${activeName})، أود الاستفسار عن منتجاتكم وطلب عرض سعر.`
      : `Hello KIANKO Steel Industries (${activeName}), I would like to inquire about your products.`
  );

  const handleSelectBranch = (id) => {
    setActiveId(id);
    setCopiedAddress(false);
    // في شاشات الموبايل فقط، التمرير الناعم لبطاقة تفاصيل الخريطة عند اختيار فرع
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && detailCardRef.current) {
      setTimeout(() => {
        detailCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleCopyAddress = () => {
    if (!activeAddress) return;
    navigator.clipboard.writeText(`${activeName} - ${activeAddress}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-700';
  const tabActiveBg = darkMode
    ? 'bg-[#0B1B3A] text-white border-blue-800 shadow-xl ring-1 ring-white/10'
    : 'bg-slate-100 text-slate-900 border-slate-400 shadow-md';
  const tabInactiveBg = darkMode
    ? 'bg-[#0A1832]/60 text-slate-300 hover:bg-[#0A1832] border border-blue-900/40'
    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm';
  const detailBoxBg = darkMode
    ? 'bg-[#0B1B3A] border-blue-900/60 text-white'
    : 'bg-white border-slate-200 shadow-2xl text-slate-800';

  const mapBtnStyle = darkMode
    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
    : 'bg-slate-100 border border-slate-300 text-slate-900 hover:bg-slate-200 font-bold';

  const actionBase = `inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0 cursor-pointer ${focusCls}`;

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ fontFamily: isArabic ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-start overflow-x-hidden"
    >
      {/* ترويسة القسم */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-start mb-8 sm:mb-12 px-1"
      >
        <div className="flex justify-center sm:justify-start">
          <div className={`text-xl sm:text-3xl font-black tracking-tight ${textTitle}`}>
            <SectionHeading as={asPage ? 'h1' : 'h2'} themeColor={themeColor} darkMode={darkMode}>
              <span className={textTitle}>
                {pick('KIANKO Branches & Offices', 'فروع ومكاتب كيانكو')}
              </span>
            </SectionHeading>
          </div>
        </div>
        <p className={`mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed max-w-xl mx-auto sm:mx-0 ${textDesc}`}>
          {pick(
            'Our regional offices and branches across the Kingdom of Saudi Arabia — select a branch to view the interactive map, working hours, and direct contact channels.',
            'فروعنا ومكاتبنا الإقليمية في المملكة العربية السعودية (جدة والرياض) — اختر الفرع لعرض الخريطة التفاعلية ومواعيد العمل وقنوات التواصل المباشر.'
          )}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start">
        {/* القائمة الجانبية لاختيار الفرع (متجاوبة على الفون والتابلت واللابتوب) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 content-start"
          role="tablist"
          aria-label={pick('Company Branches', 'فروع الشركة')}
        >
          {locations.map((l) => {
            const meta = getBranchTypeMeta(l.type);
            const Icon = meta.icon;
            const isActive = l.id === active.id;
            const branchCity = pick(l.city || 'Saudi Arabia', l.cityAr || 'المملكة العربية السعودية');

            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectBranch(l.id)}
                className={`flex items-center gap-3.5 sm:gap-4 text-start p-4 sm:p-5 rounded-2xl border-s-4 transition-all duration-300 cursor-pointer min-h-[76px] ${focusCls} ${
                  isActive ? tabActiveBg : tabInactiveBg
                }`}
                style={{ borderStartColor: isActive ? themeColor : 'transparent' }}
              >
                <span
                  className="relative grid place-items-center h-12 w-12 rounded-xl shrink-0 text-white shadow-md transition-transform duration-300"
                  style={{
                    backgroundColor: isActive
                      ? themeColor
                      : darkMode
                      ? 'rgba(255,255,255,0.08)'
                      : '#64748b',
                  }}
                >
                  <Icon className="relative w-5 h-5 text-white" />
                </span>

                <span className="min-w-0 flex-1 space-y-0.5">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      {pick(meta.label, meta.labelAr)}
                    </span>
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: themeColor }}
                      />
                    )}
                  </span>

                  <span className={`block font-extrabold leading-snug text-sm sm:text-base truncate ${isActive ? textTitle : darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {pick(l.name, l.nameAr)}
                  </span>

                  <span className={`block text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {branchCity}
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* بطاقة الخريطة وتفاصيل الفرع المختار */}
        <motion.div
          ref={detailCardRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className={`lg:col-span-3 rounded-3xl overflow-hidden border shadow-2xl ${detailBoxBg}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* الخريطة التفاعلية أو صورة الموقع */}
              <div className="relative h-60 sm:h-72 md:h-80 bg-slate-900 overflow-hidden">
                {embedSrc ? (
                  <iframe
                    title={activeName}
                    src={embedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    {active.img && (
                      <img
                        src={active.img}
                        alt={activeName}
                        loading="lazy"
                        className="w-full h-full object-cover brightness-75"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] to-transparent" />
                  </>
                )}

                {/* شارة المدينة أعلى/أسفل الخريطة */}
                <span
                  className="absolute bottom-3.5 start-3.5 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeCity}</span>
                </span>
              </div>

              {/* بيانات الفرع التفصيلية */}
              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 border-blue-900/30">
                  <div>
                    <span className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-red-600'}`}>
                      {pick(activeMeta.label, activeMeta.labelAr)}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-extrabold leading-snug mt-0.5 ${textTitle}`}>
                      {activeName}
                    </h3>
                    <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      {activeCity}
                    </p>
                  </div>

                  {/* زر نسخ العنوان السريع */}
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${mapBtnStyle}`}
                    title={pick('Copy Branch Address', 'نسخ عنوان الفرع')}
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{pick('Copied!', 'تم النسخ!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{pick('Copy Address', 'نسخ العنوان')}</span>
                      </>
                    )}
                  </button>
                </div>

                <ul className={`space-y-3.5 text-xs sm:text-sm ${textDesc}`}>
                  <li className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: themeColor }} />
                    <span className={`leading-relaxed font-medium ${textTitle}`}>{activeAddress}</span>
                  </li>

                  {active.phone && (
                    <li className="flex items-center gap-3.5">
                      <Phone className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                      <a
                        href={telHref(active.phone)}
                        dir="ltr"
                        className={`font-bold hover:underline min-h-[40px] flex items-center ${textTitle}`}
                      >
                        {active.phone}
                      </a>
                    </li>
                  )}

                  {active.email && (
                    <li className="flex items-center gap-3.5">
                      <Mail className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                      <a
                        href={`mailto:${active.email}`}
                        dir="ltr"
                        className={`hover:underline break-all min-h-[40px] flex items-center font-mono text-xs sm:text-sm ${textTitle}`}
                      >
                        {active.email}
                      </a>
                    </li>
                  )}

                  <li className="flex items-center gap-3.5">
                    <Clock className="w-5 h-5 shrink-0" style={{ color: themeColor }} />
                    <span className={`min-h-[40px] flex items-center font-medium ${textTitle}`}>
                      {activeHours}
                    </span>
                  </li>
                </ul>

                {/* أزرار الإجراءات السريعة (اتصال + واتساب + خرائط جوجل) متجاوبة بالكامل */}
                <div className={`grid grid-cols-1 gap-3 pt-2 ${waNumber ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                  {active.phone && (
                    <a
                      href={telHref(active.phone)}
                      className={`${actionBase} text-white shadow-lg`}
                      style={{ backgroundColor: themeColor }}
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{pick('Call Branch', 'اتصل بالفرع')}</span>
                    </a>
                  )}

                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${actionBase} text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg`}
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>{pick('WhatsApp', 'تواصل واتساب')}</span>
                    </a>
                  )}

                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${actionBase} ${mapBtnStyle}`}
                  >
                    <Navigation className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                    <span>{pick('Google Maps', 'فتح في الخرائط')}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}