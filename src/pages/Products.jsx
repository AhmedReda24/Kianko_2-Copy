import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Download, Search, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useProducts } from '../hooks/useContent';
import { supabase } from "../lib/supabase";
import SpotlightCard from '../components/ui/SpotlightCard';

const SUPABASE_BUCKET_URL = 'https://ohvjwenkocfragysvowp.supabase.co/storage/v1/object/public/datasheets';
const PRODUCTS_PER_PAGE = 6;

export const customImages = [
  '/Image/basket.webp',
  '/Image/ladder.webp',
  '/Image/tray.webp',
  '/Image/trunking.webp',
  '/Image/channels.webp',
  '/Image/plastering.webp',
  '/Image/Management Brackets.webp',
  '/Image/C-Channels.webp',
  '/Image/Corner.webp',
  '/Image/Drywall.webp',
  '/Image/wire mesh.webp',
  '/Image/heavy-duty beam clamps and spring .webp',
  '/Image/steel angle beads and expanded metal mesh.webp',
];

export const customNames = [
  { id: 'basket-tray', name: 'Basket Type Cable Trays', nameAr: 'حوامل الكابلات الشبكية', pdfName: 'basket-datasheet.pdf' },
  { id: 'cable-ladder', name: 'Heavy Duty Cable Ladders', nameAr: 'سلم الكابلات الثقيل', pdfName: 'ladder-datasheet.pdf' },
  { id: 'perforated-tray', name: 'Perforated Cable Trays', nameAr: 'حوامل الكابلات المثقبة', pdfName: 'tray-datasheet.pdf' },
  { id: 'cable-trunking', name: 'Cable Trunking Systems', nameAr: 'أنظمة ترنكنج الكابلات', pdfName: 'trunking-datasheet.pdf' },
  { id: 'channels-system', name: 'Channels & Supports System', nameAr: 'أنظمة القطاعات والتدعيم', pdfName: 'channels-datasheet.pdf' },
  { id: 'plastering-acc', name: 'Plastering & Blockworks Accessories', nameAr: 'ملحقات المحارة والبلوك', pdfName: 'plastering-datasheet.pdf' },
  { id: 'mgmt-brackets', name: 'Management Brackets', nameAr: 'كتائب وحوامل الإدارة', pdfName: 'basket-datasheet.pdf' },
  { id: 'c-channels', name: 'C-Channels', nameAr: 'قطاعات سي شانل المعدنية', pdfName: 'channels-datasheet.pdf' },
  { id: 'corner-beads', name: 'Corner Beads & Profiles', nameAr: 'زوايا ومقاطع المحارة', pdfName: 'plastering-datasheet.pdf' },
  { id: 'drywall-framing', name: 'Drywall Framing Systems', nameAr: 'أنظمة هياكل الجبس بورد', pdfName: 'trunking-datasheet.pdf' },
  { id: 'wire-mesh-tray', name: 'Wire Mesh Basket Cable Trays', nameAr: 'حوامل كابلات شبكية بسلك معدني', pdfName: 'basket-datasheet.pdf' },
  { id: 'beam-clamps', name: 'Heavy-Duty Beam Clamps & Springs', nameAr: 'مشابك الكمرات الثقيلة واليايات', pdfName: 'channels-datasheet.pdf' },
  { id: 'steel-angle-mesh', name: 'Steel Angle Beads & Expanded Mesh', nameAr: 'زوايا فولاذية وشبك ممدد', pdfName: 'plastering-datasheet.pdf' },
];

export default function Products({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const rawProducts = useProducts();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const catalogTopRef = useRef(null);

  // حالات المنتجات المضافة أو المحذوفة من لوحة تحكم الأدمن
  const [adminAddedProducts, setAdminAddedProducts] = useState([]);
  const [deletedProductIds, setDeletedProductIds] = useState([]);

  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60' : 'bg-white border-slate-200';
  const innerImgBg = darkMode ? 'bg-[#061022]' : 'bg-slate-100';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400';

  // تحميل وتطبيق خط IBM Plex Sans Arabic تلقائياً عند تفعيل اللغة العربية
  useEffect(() => {
    const fontId = 'ibm-plex-sans-arabic-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    if (isAr) {
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', sans-serif";
    } else {
      document.body.style.fontFamily = '';
    }
  }, [isAr]);

  // إعادة الصفحة إلى 1 عند تغيير التصنيف أو البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [category, query]);

  // جلب المنتجات المضافة أو المحذوفة بواسطة الأدمن من Supabase و LocalStorage
  useEffect(() => {
    const fetchAdminCustomizations = async () => {
      let hiddenList = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('kianko_deleted_items') || '{}');
        hiddenList = (parsed.products || []).map(String);
      } catch {
        hiddenList = [];
      }

      try {
        const addedList = [];

        // 1. فحص جدول products إن وجد
        const { data: prodTableData, error: prodErr } = await supabase.from('products').select('*');
        if (!prodErr && Array.isArray(prodTableData)) {
          prodTableData.forEach((row) => {
            const isBuilding = String(row.category || '').includes('مباني') || String(row.category || '').toLowerCase().includes('building');
            addedList.push({
              id: `db_prod_${row.id}`,
              rawId: String(row.id),
              name: row.name_en || row.name || row.title || 'Kianko Product',
              nameAr: row.name || row.name_ar || row.title || 'منتج كيانكو',
              category: isBuilding ? 'building' : 'management',
              badge: row.code || 'New',
              badgeAr: row.code || 'جديد',
              desc: row.description_en || row.description || 'High-grade industrial Kianko structural component.',
              descAr: row.description || 'مكون صناعي عالي الجودة من شركة كيانكو للصناعات الحديدية.',
              image: row.image_url || row.image || '/Image/basket.webp',
              specs: ['Industrial grade steel', 'Corrosion resistant', 'High load capacity'],
              specsAr: ['صلب صناعي عالي الجودة', 'مقاوم للتآكل والصدأ', 'مطابق للمواصفات القياسية'],
              datasheet: row.file_url || `${SUPABASE_BUCKET_URL}/basket-datasheet.pdf`,
            });
          });
        }

        // 2. فحص المنتجات المحفوظة في جدول certifications (تحت تصنيف product أو catalog أو deleted_product)
        const { data: certProds } = await supabase.from('certifications').select('*');
        if (Array.isArray(certProds)) {
          certProds.forEach((c) => {
            const cat = String(c.category || '').toLowerCase();
            if (cat === 'deleted_product' && c.code) {
              hiddenList.push(String(c.code));
            } else if (cat === 'product' || cat === 'catalog') {
              let meta = {};
              try {
                if (c.year && String(c.year).startsWith('{')) {
                  meta = JSON.parse(c.year);
                }
              } catch {
                meta = {};
              }
              const isBuilding = String(c.issuer || '').includes('مباني') || String(c.issuer || '').toLowerCase().includes('building');
              const imgUrl = meta.image_url || (c.file_url && /\.(png|jpg|jpeg|webp|gif)$/i.test(c.file_url) ? c.file_url : '/Image/basket.webp');
              const pdfUrl = meta.file_url || (c.file_url && /\.pdf$/i.test(c.file_url) ? c.file_url : `${SUPABASE_BUCKET_URL}/basket-datasheet.pdf`);

              addedList.push({
                id: `cert_prod_${c.id}`,
                rawId: String(c.id),
                name: meta.name_en || c.title,
                nameAr: c.title,
                category: isBuilding ? 'building' : 'management',
                badge: c.code || 'KIANKO',
                badgeAr: meta.badge_ar || c.code || 'منتج معتمد',
                desc: meta.description || `${c.title} - ${c.issuer || 'Kianko Steel Industries'}`,
                descAr: meta.description || `${c.title} - ${c.issuer || 'شركة كيانكو للصناعات الحديدية'}`,
                image: imgUrl,
                specs: meta.specs?.length ? meta.specs : ['Industrial grade steel', 'Corrosion resistant', 'High load capacity'],
                specsAr: meta.specsAr?.length ? meta.specsAr : ['صلب صناعي عالي الجودة', 'مقاوم للتآكل والصدأ', 'مطابق للمواصفات القياسية'],
                datasheet: pdfUrl,
              });
            }
          });
        }

        // 3. فحص أي منتجات مضافة محلياً
        try {
          const localCustom = JSON.parse(localStorage.getItem('kianko_custom_products') || '[]');
          localCustom.forEach((lp) => {
            const isBuilding = String(lp.category || '').includes('مباني');
            addedList.push({
              id: String(lp.id),
              rawId: String(lp.id),
              name: lp.name,
              nameAr: lp.name,
              category: isBuilding ? 'building' : 'management',
              badge: lp.code || 'KIANKO',
              badgeAr: lp.code || 'جديد',
              desc: lp.description || 'High-grade industrial Kianko structural component.',
              descAr: lp.description || 'مكون صناعي عالي الجودة من كيانكو.',
              image: lp.image_url || '/Image/basket.webp',
              specs: ['Industrial grade steel', 'Corrosion resistant', 'High load capacity'],
              specsAr: ['صلب صناعي عالي الجودة', 'مقاوم للتآكل والصدأ', 'قدرة تحمل عالية'],
              datasheet: lp.file_url || `${SUPABASE_BUCKET_URL}/basket-datasheet.pdf`,
            });
          });
        } catch {
          // ignore
        }

        setDeletedProductIds(Array.from(new Set(hiddenList)));
        setAdminAddedProducts(addedList);
      } catch (err) {
        console.error('Error syncing products:', err);
      }
    };

    fetchAdminCustomizations();
  }, []);

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

    const base13 = [...updated, ...extraItems].filter(
      (item) => !deletedProductIds.includes(String(item.id))
    );

    const validAdded = adminAddedProducts.filter(
      (item) => !deletedProductIds.includes(String(item.id)) && !deletedProductIds.includes(String(item.rawId))
    );

    return [...base13, ...validAdded];
  }, [rawProducts, adminAddedProducts, deletedProductIds]);

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

  // حسابات تقسيم الصفحات (6 منتجات فقط في كل صفحة)
  const totalPages = Math.max(1, Math.ceil(list.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = list.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const btnCls =
    'relative inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer';

  return (
    <div
      ref={catalogTopRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-start scroll-mt-24"
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      {/* العنوان الرئيسي يظهر بالعربية بالكامل عند اختيار اللغة العربية */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center space-y-4"
      >
        <h1 className={`text-3xl sm:text-5xl font-extrabold ${textTitle}`}>
          {pick('KIANKO', 'كيانكو')}{' '}
          <span style={{ color: themeColor }}>{pick('Product Catalog', 'كتالوج المنتجات')}</span>
        </h1>
        <p className={`max-w-xl mx-auto font-medium text-sm sm:text-base ${textDesc}`}>
          {pick(
            `Explore our portfolio of ${products.length} steel lines, cable management systems, and building profiles.`,
            `تعرّف على ${products.length} خطوط إنتاج من حوامل الكابلات والمقاطع المعدنية.`
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={pick('Search products', 'ابحث في المنتجات')}
            placeholder={pick('Search products…', 'ابحث في المنتجات…')}
            className={`w-full ps-11 pe-10 py-3 rounded-xl border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${inputBg}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={pick('Clear search', 'مسح البحث')}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-slate-400 hover:text-white cursor-pointer"
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
                className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 border cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  on ? 'text-white border-transparent' : `${cardBg}${textDesc} hover:opacity-90`
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
          {pick(
            `Showing ${paginatedProducts.length} of ${list.length} product(s) — Page ${safePage} of ${totalPages}`,
            `عرض ${paginatedProducts.length} من أصل ${list.length} منتج — صفحة ${safePage} من ${totalPages}`
          )}
        </p>
      </motion.div>

      {list.length === 0 ? (
        <div className={`rounded-2xl border border-dashed p-12 text-center space-y-4 ${cardBg}`}>
          <p className={textDesc}>{pick('No products match your search.', 'لا توجد منتجات مطابقة للبحث.')}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className={`text-sm font-bold underline underline-offset-4 hover:opacity-80 cursor-pointer ${textTitle}`}
          >
            {pick('Reset filters', 'إعادة ضبط الفلاتر')}
          </button>
        </div>
      ) : (
        <>
          {/* شبكة المنتجات (6 منتجات في الصفحة) مع أنيميشن ظهور تدريجي أثناء السكرول */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((p, index) => {
                const isAccessory = p.image?.includes('plastering');
                const colDelay = (index % 3) * 0.1;

                return (
                  <motion.div
                    key={`${p.id}_${safePage}`}
                    initial={{ opacity: 0, y: 45, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: false, amount: 0.15, margin: "0px 0px -30px 0px" }}
                    transition={{ duration: 0.5, delay: colDelay, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    <SpotlightCard
                      as="article"
                      className={`group h-full rounded-2xl border shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden ${cardBg}`}
                    >
                      <div>
                        {/* أنيميشن ظهور الصورة عند السكرول */}
                        <div className={`relative overflow-hidden h-52 sm:h-56 ${isAccessory ? `${innerImgBg} p-1.5 flex items-center justify-center` : innerImgBg}`}>
                          {p.image ? (
                            <motion.img
                              initial={{ scale: 1.08, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.2 }}
                              transition={{ duration: 0.6, delay: colDelay + 0.05 }}
                              src={p.image}
                              alt={pick(p.name, p.nameAr)}
                              className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${isAccessory ? 'object-contain rounded-lg' : 'object-cover'}`}
                            />
                          ) : null}

                          <span
                            className="absolute top-4 start-4 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg z-25 backdrop-blur-md bg-opacity-90"
                            style={{ backgroundColor: themeColor }}
                          >
                            {pick(p.badge, p.badgeAr)}
                          </span>
                        </div>

                        {/* أنيميشن ظهور الكلام والمواصفات عند السكرول */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.2 }}
                          transition={{ duration: 0.45, delay: colDelay + 0.12 }}
                          className="relative p-5 sm:p-6 space-y-4"
                        >
                          <h2 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${textTitle}`}>
                            {pick(p.name, p.nameAr)}
                          </h2>
                          <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                            {pick(p.desc, p.descAr)}
                          </p>

                          <div className="space-y-2 pt-2">
                            <h3 className="text-xs font-bold text-slate-400">
                              {pick('Technical Specs', 'المواصفات الفنية')}
                            </h3>
                            {(isAr ? p.specsAr : p.specs)?.map((spec) => (
                              <div key={spec} className={`flex items-center gap-2 text-xs font-medium ${textDesc}`}>
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
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
          </div>

          {/* شريط التنقل بين الصفحات (Pagination Bar) - يظهر عندما يكون هناك أكثر من 6 منتجات */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2 pt-6 flex-wrap"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${cardBg} ${textTitle} hover:border-red-500`}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{pick('Previous', 'السابق')}</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActivePage = safePage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    style={{ backgroundColor: isActivePage ? themeColor : undefined }}
                    className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      isActivePage
                        ? 'text-white shadow-lg scale-105 border-transparent'
                        : `border ${cardBg}${textTitle} hover:border-red-500`
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${cardBg} ${textTitle} hover:border-red-500`}
              >
                <span>{pick('Next', 'التالي')}</span>
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}