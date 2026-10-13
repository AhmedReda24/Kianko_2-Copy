import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Download, PackageOpen, Search, X } from 'lucide-react';
import { useProducts } from '../hooks/useContent';
import { ROUTES } from '../routes';
import SpotlightCard from '../components/ui/SpotlightCard';

export default function Products({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const products = useProducts();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

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
    'relative inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-start">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          KIANKO <span style={{ color: themeColor }}>{pick('Product Catalog', 'كتالوج المنتجات')}</span>
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto font-medium">
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
                className={`relative px-6 py-3 rounded-xl font-bold transition-colors duration-300 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
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
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
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
                  className="group h-full bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl hover:border-slate-500 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden h-44 bg-gradient-to-br from-slate-900 via-[#0B1E3D] to-slate-900 p-6 flex flex-col items-center justify-center text-center">
                      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(#C9252C_1px,transparent_1px)] [background-size:12px_12px] transition-transform duration-700 group-hover:scale-110" />
                      <div className="relative p-3 rounded-xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" style={{ backgroundColor: `${themeColor}33` }}>
                        <PackageOpen className="w-8 h-8" style={{ color: themeColor }} />
                      </div>
                      <span className="relative text-white font-bold text-sm tracking-wide">{pick(p.name, p.nameAr)}</span>
                      <span className="absolute top-4 start-4 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md" style={{ backgroundColor: themeColor }}>
                        {pick(p.badge, p.badgeAr)}
                      </span>
                    </div>

                    <div className="relative p-6 space-y-4">
                      <h2 className="text-xl font-bold text-white">{pick(p.name, p.nameAr)}</h2>
                      <p className="text-slate-300 text-sm leading-relaxed">{pick(p.desc, p.descAr)}</p>

                      <div className="space-y-2 pt-2">
                        <h3 className="text-xs font-bold text-slate-400">{pick('Technical Specs', 'المواصفات الفنية')}</h3>
                        {(isAr ? p.specsAr : p.specs).map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 pt-0">
                    {p.datasheet ? (
                      <a href={p.datasheet} download className={`${btnCls} bg-slate-800 hover:bg-slate-700`}>
                        <Download className="w-4 h-4" />
                        <span>{pick('Download Datasheet', 'تحميل الداتا شيت')}</span>
                      </a>
                    ) : (
                      <Link to={ROUTES.contact} className={`${btnCls} hover:opacity-90`} style={{ backgroundColor: themeColor }}>
                        <span>{pick('Request Datasheet', 'اطلب الداتا شيت')}</span>
                      </Link>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
