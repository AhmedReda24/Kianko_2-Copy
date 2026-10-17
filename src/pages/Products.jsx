import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Download, Search, X } from 'lucide-react';
import { useProducts } from '../hooks/useContent';
import { supabase } from "../lib/supabase";// تأكد أن مسار الـ supabase client صحيح عندك في المشروع
import SpotlightCard from '../components/ui/SpotlightCard';

const SUPABASE_BUCKET_URL = 'https://ohvjwenkocfragysvowp.supabase.co/storage/v1/object/public/datasheets';

const customImages = [
  '/Image/basket.jpg',
  '/Image/ladder.jpg',
  '/Image/tray.jpg',
  '/Image/trunking.jpg',
  '/Image/channels.jpg',
  '/Image/plastering.jpg',
  '/Image/Management Brackets.jpg',
  '/Image/C-Channels.jpg',
  '/Image/Corner.jpg',
  '/Image/Drywall.jpg',
  '/Image/wire mesh.jpg',
  '/Image/heavy-duty beam clamps and spring .jpg',
  '/Image/steel angle beads and expanded metal mesh.jpg',
];

const customNames = [
  { id: 'basket-tray', name: 'Basket Type Cable Trays', nameAr: 'حوامل الكابلات الشبكية', pdfName: 'basket-datasheet.pdf' },
  { id: 'cable-ladder', name: 'Heavy Duty Cable Ladders', nameAr: 'سلم الكابلات الثقيل', pdfName: 'ladder-datasheet.pdf' },
  { id: 'perforated-tray', name: 'Perforated Cable Trays', nameAr: 'حوامل الكابلات المثقبة', pdfName: 'tray-datasheet.pdf' },
  { id: 'cable-trunking', name: 'Cable Trunking Systems', nameAr: 'أنظمة ترنونج الكابلات', pdfName: 'trunking-datasheet.pdf' },
  { id: 'channels-system', name: 'Channels & Supports System', nameAr: 'أنظمة القطاعات والتدعيم', pdfName: 'channels-datasheet.pdf' },
  { id: 'plastering-acc', name: 'Plastering & Blockworks Accessories', nameAr: 'ملحقات المحارة والبلوك', pdfName: 'plastering-datasheet.pdf' },
  { id: 'mgmt-brackets', name: 'Management Brackets', nameAr: 'كتائب وحوامل الإدارة', pdfName: 'basket-datasheet.pdf' },
  { id: 'c-channels', name: 'C-Channels', nameAr: 'قطاعات C-Channels', pdfName: 'channels-datasheet.pdf' },
  { id: 'corner-beads', name: 'Corner Beads & Profiles', nameAr: 'زوايا ومقاطع المحارة', pdfName: 'plastering-datasheet.pdf' },
  { id: 'drywall-framing', name: 'Drywall Framing Systems', nameAr: 'أنظمة هياكل الجبس بورد', pdfName: 'trunking-datasheet.pdf' },
  { id: 'wire-mesh-tray', name: 'Wire Mesh Basket Cable Trays', nameAr: 'حوامل كابلات شبكية بسلك معدني', pdfName: 'basket-datasheet.pdf' },
  { id: 'beam-clamps', name: 'Heavy-Duty Beam Clamps & Springs', nameAr: 'مشابك الكمرات الثقيلة واليايات', pdfName: 'channels-datasheet.pdf' },
  { id: 'steel-angle-mesh', name: 'Steel Angle Beads & Expanded Mesh', nameAr: 'زوايا فولاذية وشبك ممدد', pdfName: 'plastering-datasheet.pdf' },
];

export default function Products({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const rawProducts = useProducts();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  // دالة تسجيل وتتبع التحميل في سوبابيس في الخلفية
  const handleDownload = async (productId, datasheetUrl) => {
  try {
    const { error } = await supabase.rpc('increment_downloads', { p_product_id: productId });
    if (error) console.error('RPC Error:', error);
  } catch (err) {
    console.error('Failed to track download count:', err);
  }
  window.open(datasheetUrl, '_blank');
};

  const products = useMemo(() => {
    const updated = rawProducts.map((p, index) => {
      if (index < 10 && customNames[index]) {
        return {
          ...p,
          id: customNames[index].id,
          name: customNames[index].name,
          nameAr: customNames[index].nameAr,
          image: customImages[index],
          datasheet: `${SUPABASE_BUCKET_URL}/${customNames[index].pdfName}`,
        };
      }
      return p;
    });

    const extraItems = customNames.slice(10).map((item, idx) => {
      const realIdx = idx + 10;
      return {
        id: item.id,
        name: item.name,
        nameAr: item.nameAr,
        category: idx === 0 ? 'management' : 'building',
        badge: idx === 0 ? 'Telecom' : idx === 1 ? 'Accessory' : 'Building',
        badgeAr: idx === 0 ? 'اتصالات' : idx === 1 ? 'ملحقات' : 'بناء',
        desc: 'High-grade industrial Kianko structural component engineered for maximum durability.',
        descAr: 'مكون إنشائي صناعي عالي الجودة من كيانكو مصمم لأقصى متانة.',
        image: customImages[realIdx],
        specs: ['Industrial grade steel', 'Corrosion resistant', 'High load capacity'],
        specsAr: ['صلب صناعي عالي الجودة', 'مقاوم للتآكل', 'قدرة تحمل عالية'],
        datasheet: `${SUPABASE_BUCKET_URL}/${item.pdfName}`,
      };
    });

    return [...updated, ...extraItems];
  }, [rawProducts]);

  const filters = [
    { id: 'all', label: pick(`All Products (${products.length})`, `كل المنتجات (${products.length})`) },
    { id: 'management', label: pick('Cable Management Systems', 'أنظمة إدارة الكابلات') },
    { id: 'building', label: pick('Building & Plaster Profiles', 'مقاطع المباني والمحارة') },
  ];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return [p.name, p.nameAr, p.desc, p.descAr, ...(p.specs ?? []), ...(p.specsAr ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [products, category, query]);

  const btnCls =
    'relative inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-lg cursor-pointer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-start">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          KIANKO <span style={{ color: themeColor }}>{pick('Product Catalog', 'كتالوج المنتجات')}</span>
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto font-medium text-sm sm:text-base">
          {pick(
            `Explore our portfolio of ${products.length} steel lines, cable management systems, and building profiles.`,
            `تعرّف على ${products.length} خطوط إنتاج من حوامل الكابلات والمقاطع المعدنية.`
          )}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={pick('Search products', 'ابحث في المنتجات')}
            placeholder={pick('Search products…', 'ابحث في المنتجات…')}
            className="w-full ps-11 pe-10 py-3 rounded-xl bg-[#0A1832] border border-blue-900/60 text-white text-sm placeholder:text-slate-500 focus:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={pick('Clear search', 'مسح البحث')}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-3 flex-wrap" role="tablist">
          {filters.map((f) => {
            const on = category === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setCategory(f.id)}
                className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  on ? 'text-white border-transparent' : 'bg-[#0A1832] text-slate-300 hover:bg-[#10244A] border-blue-900/60'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl shadow-lg"
                    style={{ backgroundColor: themeColor }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400" role="status" aria-live="polite">
          {pick(`${list.length} product(s)`, `${list.length} منتج`)}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-900/70 p-12 text-center space-y-4">
          <p className="text-slate-300">{pick('No products match your search.', 'مفيش منتجات مطابقة للبحث.')}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="text-sm font-bold text-white underline underline-offset-4 hover:opacity-80"
          >
            {pick('Reset filters', 'إعادة ضبط الفلاتر')}
          </button>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((p) => {
              const isAccessory = p.image?.includes('plastering');

              return (
                <motion.div
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <SpotlightCard
                    as="article"
                    className="group h-full bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl hover:border-slate-500 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className={`relative overflow-hidden h-52 sm:h-56 ${isAccessory ? 'bg-[#061022] p-1.5 flex items-center justify-center' : 'bg-[#0A1832]'}`}>
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={pick(p.name, p.nameAr)}
                            className={`w-full h-full ${isAccessory ? 'object-contain rounded-lg' : 'object-cover'}`}
                          />
                        ) : null}

                        <span className="absolute top-4 start-4 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg z-25 backdrop-blur-md bg-opacity-90" style={{ backgroundColor: themeColor }}>
                          {pick(p.badge, p.badgeAr)}
                        </span>
                      </div>

                      <div className="relative p-5 sm:p-6 space-y-4">
                        <h2 
                          className="text-lg sm:text-xl font-bold text-white transition-colors duration-300"
                          onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                          {pick(p.name, p.nameAr)}
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{pick(p.desc, p.descAr)}</p>

                        <div className="space-y-2 pt-2">
                          <h3 className="text-xs font-bold text-slate-400">{pick('Technical Specs', 'المواصفات الفنية')}</h3>
                          {(isAr ? p.specsAr : p.specs)?.map((spec) => (
                            <div key={spec} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative p-5 sm:p-6 pt-0">
                      <button 
                        type="button"
                        onClick={() => handleDownload(p.id, p.datasheet)}
                        className={btnCls}
                        style={{ backgroundColor: themeColor }}
                      >
                        <Download className="w-4 h-4" />
                        <span>{pick('Download Datasheet', 'تحميل الداتا شيت')}</span>
                      </button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}