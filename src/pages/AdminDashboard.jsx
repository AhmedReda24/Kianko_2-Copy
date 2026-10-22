import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { accreditations as localAccreditations } from '../data/accreditations';
import { useJobs } from '../hooks/useContent';
import { 
  BarChart3, Download, RefreshCw, FileText, 
  LogOut, KeyRound, Mail, MessageSquare, FileDown, 
  Briefcase, Award, Plus, Trash2, Eye, EyeOff, ShieldCheck, Upload,
  Package, BookOpen, AlertCircle, Search, Edit3, CheckCircle2,
  ExternalLink, Users, FolderOpen, X, Copy, ChevronRight, ChevronLeft
} from 'lucide-react';

const SUPABASE_DATASHEETS_URL = 'https://ohvjwenkocfragysvowp.supabase.co/storage/v1/object/public/datasheets';

// الـ 6 كتالوجات الفنية الأساسية باللغتين العربية والإنجليزية
const DEFAULT_KIANKO_CATALOGS = [
  {
    product_id: 'basket-tray',
    file_name: 'basket-datasheet.pdf',
    name_ar: 'حوامل الكابلات الشبكية (Basket Cable Tray)',
    name_en: 'Basket Cable Tray',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-BASKET'
  },
  {
    product_id: 'perforated-tray',
    file_name: 'tray-datasheet.pdf',
    name_ar: 'حوامل الكابلات المثقبة (Perforated Cable Tray)',
    name_en: 'Perforated Cable Tray',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-TRAY'
  },
  {
    product_id: 'cable-ladder',
    file_name: 'ladder-datasheet.pdf',
    name_ar: 'سلالم الكابلات المعدنية (Cable Ladder)',
    name_en: 'Cable Ladder',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-LADDER'
  },
  {
    product_id: 'corner-beads',
    file_name: 'plastering-datasheet.pdf',
    name_ar: 'زوايا اللياسة وشبك التمدد (Plastering & Corner Beads)',
    name_en: 'Plastering & Corner Beads',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-PLASTER'
  },
  {
    product_id: 'strut-channels',
    file_name: 'channels-datasheet.pdf',
    name_ar: 'قنوات التثبيت والدعامات (Strut Channels)',
    name_en: 'Strut Channels',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-CHANNEL'
  },
  {
    product_id: 'cable-trunking',
    file_name: 'trunking-datasheet.pdf',
    name_ar: 'مجاري الكابلات المغلقة (Cable Trunking)',
    name_en: 'Cable Trunking',
    category_ar: 'كتالوج فني معتمد',
    category_en: 'Technical Datasheet',
    code: 'CAT-TRUNK'
  }
];

// الـ 13 منتج الأساسية باللغتين العربية والإنجليزية بالكامل
const INITIAL_WEBSITE_PRODUCTS = [
  {
    id: 'basket-tray',
    name_ar: 'حوامل الكابلات الشبكية',
    name_en: 'Basket Type Cable Trays',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'الأكثر مبيعاً',
    badge_en: 'Best Seller',
    desc_ar: 'حوامل كابلات شبكية عالية التحمل لتهوية وتمرير الكابلات بكفاءة.',
    desc_en: 'High-capacity wire mesh basket cable trays for optimal ventilation and routing.',
    code: 'KIAN-BT-01',
    image_url: '/Image/basket.webp',
    file_name: 'basket-datasheet.pdf'
  },
  {
    id: 'cable-ladder',
    name_ar: 'سلم الكابلات الثقيل',
    name_en: 'Heavy Duty Cable Ladders',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'صناعي',
    badge_en: 'Industrial',
    desc_ar: 'سلالم كابلات معدنية للأحمال الثقيلة والمشاريع الصناعية الكبرى.',
    desc_en: 'Heavy-duty metallic cable ladders engineered for major industrial projects.',
    code: 'KIAN-CL-02',
    image_url: '/Image/ladder.webp',
    file_name: 'ladder-datasheet.pdf'
  },
  {
    id: 'perforated-tray',
    name_ar: 'حوامل الكابلات المثقبة',
    name_en: 'Perforated Cable Trays',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'اتصالات',
    badge_en: 'Telecom',
    desc_ar: 'حوامل كابلات مثقبة مجلفنة لتمديدات الكهرباء والاتصالات.',
    desc_en: 'Galvanized perforated cable trays for electrical and telecom installations.',
    code: 'KIAN-PT-03',
    image_url: '/Image/tray.webp',
    file_name: 'tray-datasheet.pdf'
  },
  {
    id: 'cable-trunking',
    name_ar: 'أنظمة ترنكنج الكابلات',
    name_en: 'Cable Trunking Systems',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'ملحقات',
    badge_en: 'Accessories',
    desc_ar: 'أغطية ومجاري حماية مغلقة تحمي الكابلات من العوامل الخارجية والأتربة.',
    desc_en: 'Enclosed protective cable trunking systems shielding cables from dust and weather.',
    code: 'KIAN-CT-04',
    image_url: '/Image/trunking.webp',
    file_name: 'trunking-datasheet.pdf'
  },
  {
    id: 'channels-system',
    name_ar: 'أنظمة القطاعات والتدعيم',
    name_en: 'Channels & Supports System',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'تجاري',
    badge_en: 'Commercial',
    desc_ar: 'قنوات تثبيت ودعامات معدنية للتمديدات التجارية والصناعية.',
    desc_en: 'Structural support channels and framing systems for commercial and industrial use.',
    code: 'KIAN-SC-05',
    image_url: '/Image/channels.webp',
    file_name: 'channels-datasheet.pdf'
  },
  {
    id: 'plastering-acc',
    name_ar: 'ملحقات المحارة والبلوك',
    name_en: 'Plastering & Blockworks Accessories',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'مباني',
    badge_en: 'Building',
    desc_ar: 'شبك معدني مفرود وإكسسوارات لتقوية أعمال المحارة ومنع شروخ الحوائط.',
    desc_en: 'Expanded metal mesh and blockwork accessories for crack-resistant plastering.',
    code: 'KIAN-PB-06',
    image_url: '/Image/plastering.webp',
    file_name: 'plastering-datasheet.pdf'
  },
  {
    id: 'mgmt-brackets',
    name_ar: 'كتائب وحوامل الإدارة',
    name_en: 'Management Brackets',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'مباني',
    badge_en: 'Building',
    desc_ar: 'حوامل وكتائب تثبيت من الصلب المجلفن عالية المتانة ومقاومة للصدمات.',
    desc_en: 'High-strength galvanized steel mounting brackets engineered for heavy loads.',
    code: 'KIAN-BR-07',
    image_url: '/Image/Management Brackets.webp',
    file_name: 'basket-datasheet.pdf'
  },
  {
    id: 'c-channels',
    name_ar: 'قطاعات سي شانل المعدنية',
    name_en: 'C-Channels',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'هياكل',
    badge_en: 'Structural',
    desc_ar: 'عناصر هيكلية من صلب مجلفن عالي الشد للقواطع والأسقف المعلقة.',
    desc_en: 'High-tensile galvanized steel C-channels for partitions and suspended ceilings.',
    code: 'KIAN-CC-08',
    image_url: '/Image/C-Channels.webp',
    file_name: 'channels-datasheet.pdf'
  },
  {
    id: 'corner-beads',
    name_ar: 'زوايا ومقاطع المحارة',
    name_en: 'Corner Beads & Profiles',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'دعم',
    badge_en: 'Support',
    desc_ar: 'قطاعات وزوايا معدنية مخرمة ومصمتة لحماية الأركان وضبط اللياسة.',
    desc_en: 'Perforated and solid metal corner beads for sharp, impact-resistant wall edges.',
    code: 'KIAN-CB-09',
    image_url: '/Image/Corner.webp',
    file_name: 'plastering-datasheet.pdf'
  },
  {
    id: 'drywall-framing',
    name_ar: 'أنظمة هياكل الجبس بورد',
    name_en: 'Drywall Framing Systems',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'مباني',
    badge_en: 'Building',
    desc_ar: 'قطاعات وهياكل معدنية قياسية لتركيب ألواح الجبس بورد والقواطع الداخلية.',
    desc_en: 'Precision metallic studs and tracks for drywall partitions and interior framing.',
    code: 'KIAN-DF-10',
    image_url: '/Image/Drywall.webp',
    file_name: 'trunking-datasheet.pdf'
  },
  {
    id: 'wire-mesh-tray',
    name_ar: 'حوامل كابلات شبكية بسلك معدني',
    name_en: 'Wire Mesh Basket Cable Trays',
    category_ar: 'أنظمة إدارة الكابلات',
    category_en: 'Cable Management Systems',
    badge_ar: 'اتصالات',
    badge_en: 'Telecom',
    desc_ar: 'حوامل كابلات شبكية مرنة لتمديدات مراكز البيانات والاتصالات.',
    desc_en: 'Flexible wire mesh cable trays ideal for data centers and telecom routing.',
    code: 'KIAN-WM-11',
    image_url: '/Image/wire mesh.webp',
    file_name: 'basket-datasheet.pdf'
  },
  {
    id: 'beam-clamps',
    name_ar: 'مشابك الكمرات الثقيلة واليايات',
    name_en: 'Heavy-Duty Beam Clamps & Springs',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'ملحقات',
    badge_en: 'Accessory',
    desc_ar: 'مشابك تثبيت فولاذية ويايات صامولة لتعليق الأنظمة بدون لحام أو ثقب.',
    desc_en: 'Heavy-duty steel beam clamps and spring nuts for weld-free structural mounting.',
    code: 'KIAN-BC-12',
    image_url: '/Image/heavy-duty beam clamps and spring .webp',
    file_name: 'channels-datasheet.pdf'
  },
  {
    id: 'steel-angle-mesh',
    name_ar: 'زوايا فولاذية وشبك ممدد',
    name_en: 'Steel Angle Beads & Expanded Mesh',
    category_ar: 'مقاطع المباني والمحارة',
    category_en: 'Building & Plaster Profiles',
    badge_ar: 'بناء',
    badge_en: 'Building',
    desc_ar: 'زوايا فولاذية مجلفنة وشبك ممدد لتسليح اللياسة وتقوية الأركان.',
    desc_en: 'Galvanized steel angle beads and expanded metal mesh for plaster reinforcement.',
    code: 'KIAN-SA-13',
    image_url: '/Image/steel angle beads and expanded metal mesh.webp',
    file_name: 'plastering-datasheet.pdf'
  }
];

// شهادات الأيزو الـ 3 الأساسية باللغتين
const DEFAULT_ISO_CERTIFICATES = [
  {
    id: 'iso-9001',
    title_ar: 'نظام إدارة الجودة العالمي (ISO 9001:2015)',
    title_en: 'Quality Management System (ISO 9001:2015)',
    issuer_ar: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والدرفلة.',
    issuer_en: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
    code: 'ISO 9001:2015',
    year: '2026',
    category: 'iso',
    file_url: '/Image/ISO-9001-2015.webp',
    _source: 'default_iso'
  },
  {
    id: 'iso-14001',
    title_ar: 'نظام الإدارة البيئية (ISO 14001:2015)',
    title_en: 'Environmental Management System (ISO 14001:2015)',
    issuer_ar: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
    issuer_en: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
    code: 'ISO 14001:2015',
    year: '2026',
    category: 'iso',
    file_url: '/Image/ISO-14001-2015.webp',
    _source: 'default_iso'
  },
  {
    id: 'iso-45001',
    title_ar: 'إدارة السلامة والصحة المهنية (ISO 45001:2018)',
    title_en: 'Occupational Health & Safety (ISO 45001:2018)',
    issuer_ar: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
    issuer_en: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
    code: 'ISO 45001:2018',
    year: '2026',
    category: 'iso',
    file_url: '/Image/ISO-45001-2018.webp',
    _source: 'default_iso'
  }
];

// قاموس ترجمة ذكي لجميع الاعتمادات والشهادات المخزنة بالإنجليزية لتحويلها للعربية تلقائياً في الوضع العربي
const CERT_TRANSLATIONS_MAP = [
  {
    match: 'material approval',
    title_ar: 'اعتماد المواد وفحص الجودة الرسمي',
    title_en: 'Material Approval',
    desc_ar: 'شهادة اعتماد المواد الرسمية ومطابقة الفحص والجودة للمشاريع.',
    desc_en: 'Official material approval and quality inspection certificate.'
  },
  {
    match: 'approval water',
    title_ar: 'اعتماد مشروع المياه الوطني',
    title_en: 'Approval Water',
    desc_ar: 'اعتماد رسمي لتوريد المواد والقطاعات لمشروع المياه.',
    desc_en: 'Official material approval for Water project.'
  },
  {
    match: 'approval seven',
    title_ar: 'اعتماد مشاريع شركة سفن (SEVEN)',
    title_en: 'Approval Seven',
    desc_ar: 'اعتماد رسمي لتقديم وتوريد المواد لمشاريع شركة مشاريع الترفيه السعودية (سفن).',
    desc_en: 'Official material submittal approval for Seven entertainment projects.'
  },
  {
    match: 'hill international',
    title_ar: 'اعتماد استشاري هيل إنترناشونال (كود B)',
    title_en: 'Hill International Response Code B',
    desc_ar: 'اعتماد شركة هيل إنترناشونال لملحقات البلوك وأعمال المحارة.',
    desc_en: 'Hill International response approval for block & plastering accessories.'
  },
  {
    match: 'modern metal pql',
    title_ar: 'اعتماد التأهيل المسبق لشركة المعادن الحديثة (PQL)',
    title_en: 'Modern Metal PQL Approval',
    desc_ar: 'اعتماد قائمة الموردين المؤهلين لشركة صناعات المعادن الحديثة.',
    desc_en: 'PQL approval for Modern Metal Industries Company.'
  },
  {
    match: 'block & plastering accessories',
    title_ar: 'اعتماد ملحقات البلوك والمحارة',
    title_en: 'Block & Plastering Accessories Submittal',
    desc_ar: 'اعتماد المواد والداتا شيت لملحقات البلوك وأعمال اللياسة.',
    desc_en: 'Material submittal and data sheet for block & plastering accessories.'
  },
  {
    match: 'masar makkah',
    title_ar: 'اعتماد مشروع وجهة مسار مكة',
    title_en: 'Masar Makkah Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشروع وجهة مسار مكة المكرمة.',
    desc_en: 'Official material approval for Masar Makkah project.'
  },
  {
    match: 'neom approval',
    title_ar: 'اعتماد مشروع نيوم (NEOM)',
    title_en: 'Neom Approval',
    desc_ar: 'اعتماد رسمي لتقديم وتوريد المواد لمشاريع مدينة نيوم.',
    desc_en: 'Official material submittal approval for Neom projects.'
  },
  {
    match: 'aramco approval',
    title_ar: 'اعتماد أرامكو السعودية (Saudi Aramco)',
    title_en: 'Aramco Approval',
    desc_ar: 'اعتماد رسمي للمواد وسجل الموردين لدى شركة أرامكو السعودية.',
    desc_en: 'Official Aramco material and vendor approval.'
  },
  {
    match: 'prime approval',
    title_ar: 'اعتماد مشاريع برايم (Prime)',
    title_en: 'Prime Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشاريع شركة برايم.',
    desc_en: 'Official material approval for Prime projects.'
  },
  {
    match: 'new murabba',
    title_ar: 'اعتماد مشروع المربع الجديد (New Murabba)',
    title_en: 'New Murabba Approval',
    desc_ar: 'شهادة اعتماد رسمية لتوريد المواد لمشروع المربع الجديد بالرياض.',
    desc_en: 'Official approval certificate for New Murabba project.'
  },
  {
    match: 'king salman park',
    title_ar: 'اعتماد مشروع حديقة الملك سلمان',
    title_en: 'King Salman Park Approval',
    desc_ar: 'اعتماد رسمي لتقديم وتوريد المواد لمشروع حديقة الملك سلمان.',
    desc_en: 'Official material submittal approval for King Salman Park.'
  },
  {
    match: 'red sea',
    title_ar: 'اعتماد مشروع البحر الأحمر (Red Sea Global)',
    title_en: 'Red Sea Project Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشاريع البحر الأحمر الدولية.',
    desc_en: 'Official material submittal approval for Red Sea projects.'
  },
  {
    match: 'qiddiya',
    title_ar: 'اعتماد مشروع القدية (Qiddiya)',
    title_en: 'Qiddiya Project Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشروع القدية.',
    desc_en: 'Official material approval for Qiddiya project.'
  },
  {
    match: 'roshn',
    title_ar: 'اعتماد مجموعة روشن (ROSHN)',
    title_en: 'Roshn Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشاريع مجموعة روشن العقارية.',
    desc_en: 'Official material approval for Roshn projects.'
  },
  {
    match: 'diriyah',
    title_ar: 'اعتماد مشروع بوابة الدرعية',
    title_en: 'Diriyah Gate Approval',
    desc_ar: 'اعتماد رسمي لتوريد المواد لمشروع تطوير بوابة الدرعية.',
    desc_en: 'Official material approval for Diriyah Gate project.'
  }
];

// دالة مساعدة لإرجاع العنوان والوصف المترجم لأي شهادة أو اعتماد حسب اللغة الحالية
const resolveCertText = (cert, isAr) => {
  const rawTitle = String(cert.title || cert.name || cert.titleEn || cert.titleAr || '').trim();
  const rawIssuer = String(cert.issuer || cert.desc || cert.descEn || cert.descAr || '').trim();
  const lowerTitle = rawTitle.toLowerCase();

  // 1. إذا كان الكائن يحتوي مسبقاً على النصوص العربية والإنجليزية بشكل منفصل
  if (cert.title_ar && cert.title_en) {
    return {
      title: isAr ? cert.title_ar : cert.title_en,
      issuer: isAr ? (cert.issuer_ar || rawIssuer) : (cert.issuer_en || rawIssuer)
    };
  }

  // 2. البحث في قاموس الاعتمادات المعروفة لترجمتها تلقائياً
  const matchedEntry = CERT_TRANSLATIONS_MAP.find((item) => lowerTitle.includes(item.match));
  if (matchedEntry) {
    return {
      title: isAr ? matchedEntry.title_ar : matchedEntry.title_en,
      issuer: isAr ? matchedEntry.desc_ar : matchedEntry.desc_en
    };
  }

  // 3. ترجمة ذكية لأي شهادة أو اعتماد جديد يحتوي على كلمات إنجليزية شائعة عند العرض بالعربية
  if (isAr) {
    const translatedTitle = rawTitle
      .replace(/Official Approval/gi, 'اعتماد رسمي')
      .replace(/Approval/gi, 'اعتماد')
      .replace(/Submittal/gi, 'تقديم مواد')
      .replace(/Certificate/gi, 'شهادة')
      .replace(/Project/gi, 'مشروع');

    const translatedIssuer = rawIssuer
      .replace(/Official material submittal approval for/gi, 'اعتماد رسمي لتقديم المواد لمشروع')
      .replace(/Official material approval for/gi, 'اعتماد رسمي للمواد لمشروع')
      .replace(/Official approval certificate for/gi, 'شهادة اعتماد رسمية لمشروع')
      .replace(/Official/gi, 'رسمي')
      .replace(/projects?/gi, 'مشاريع');

    return {
      title: cert.titleAr || translatedTitle || 'مستند معتمد',
      issuer: cert.descAr || translatedIssuer || 'شركة كيانكو للصناعات الحديدية'
    };
  }

  return {
    title: cert.titleEn || rawTitle || 'Official Document',
    issuer: cert.descEn || rawIssuer || 'KIANKO Steel Industries'
  };
};

// دالة مساعدة لإرجاع نصوص المنتج حسب اللغة الحالية (عربي / إنجليزي)
const resolveProductText = (prod, isAr) => {
  const catRaw = String(prod.category_ar || prod.category || '');
  const isBuilding = catRaw.includes('مباني') || catRaw.includes('محارة') || catRaw.toLowerCase().includes('building');

  const categoryText = isAr
    ? (prod.category_ar || (isBuilding ? 'مقاطع المباني والمحارة' : 'أنظمة إدارة الكابلات'))
    : (prod.category_en || (isBuilding ? 'Building & Plaster Profiles' : 'Cable Management Systems'));

  const nameText = isAr
    ? (prod.name_ar || prod.name || prod.title || 'منتج كيانكو')
    : (prod.name_en || prod.name || prod.title || 'Kianko Product');

  const badgeText = isAr
    ? (prod.badge_ar || prod.badge || '')
    : (prod.badge_en || prod.badge || '');

  const descText = isAr
    ? (prod.desc_ar || prod.description || `${nameText} - شركة كيانكو للصناعات الحديدية`)
    : (prod.desc_en || prod.description_en || `${nameText} - KIANKO Steel Industries`);

  return {
    name: nameText,
    category: categoryText,
    badge: badgeText,
    description: descText
  };
};

const normalizeSearchText = (text) => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '');
};

export default function AdminDashboard({ themeColor = '#C9252C', lang = 'ar', darkMode = true }) {
  const isAr = lang === 'ar';
  const staticJobsList = useJobs();
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth_kianko') === 'true';
  });
  const [activeTab, setActiveTab] = useState('overview_content'); 
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Data States
  const [analytics, setAnalytics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [storageFiles, setStorageFiles] = useState([]);
  const [realVisitsCount, setRealVisitsCount] = useState(() => {
    return Number(localStorage.getItem('kianko_real_visits_count') || 1);
  });
  const [liveOnlineUsers, setLiveOnlineUsers] = useState(1);
  const [loading, setLoading] = useState(true);

  // Pagination States للرسائل
  const [currentMsgPage, setCurrentMsgPage] = useState(1);
  const [msgsPerPage, setMsgsPerPage] = useState(8);

  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kianko_deleted_items') || '{"messages":[],"jobs":[],"certs":[],"products":[],"storage":[]}');
    } catch {
      return { messages: [], jobs: [], certs: [], products: [], storage: [] };
    }
  });

  // Admin Helper States
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('all'); 
  const [certSubFilter, setCertSubFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);

  // Validation Error Messages
  const [jobFormError, setJobFormError] = useState('');
  const [certFormError, setCertFormError] = useState('');
  const [productFormError, setProductFormError] = useState('');

  // Forms State
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', description: '' });
  const [newCert, setNewCert] = useState({ 
    title: '', 
    issuer: '', 
    year: '2026', 
    file_url: '', 
    category: 'approval', 
    code: 'ASTM-01' 
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'أنظمة إدارة الكابلات',
    code: '',
    description: '',
    image_url: '',
    file_url: ''
  });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [uploadingProductPdf, setUploadingProductPdf] = useState(false);

  // Styling Variables
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-md';
  const subBg = darkMode ? 'bg-[#061022] border-blue-900/60 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500';
  const textMain = darkMode ? 'text-white' : 'text-slate-900 font-extrabold';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-600 font-semibold';
  const textSub = darkMode ? 'text-slate-300' : 'text-slate-800 font-bold';
  const borderCol = darkMode ? 'border-blue-900/60' : 'border-slate-300';
  const divideCol = darkMode ? 'divide-blue-900/40' : 'divide-slate-200';
  const rowHover = darkMode ? 'hover:bg-blue-950/40' : 'hover:bg-slate-100';
  const tableHeadBg = darkMode ? 'bg-[#061022] text-slate-300' : 'bg-slate-200 text-slate-900 font-black';

  // تحميل خط IBM Plex Sans Arabic تلقائياً
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

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const askConfirm = (title, message, onConfirm) => {
    setConfirmDialog({ title, message, onConfirm });
  };

  const markItemDeletedLocally = (type, idVal) => {
    setHiddenIds(prev => {
      const updated = {
        ...prev,
        [type]: Array.from(new Set([...(prev[type] || []), String(idVal)]))
      };
      localStorage.setItem('kianko_deleted_items', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    document.title = isAr ? 'كيانكو | لوحة التحكم الآمنة' : 'KIANKO | Secure Admin Portal';
  }, [isAr]);

  useEffect(() => {
    setCurrentMsgPage(1);
  }, [searchQuery, msgsPerPage]);

  // تتبع المتواجدين الآن بشكل آمن
 // تتبع المتواجدين الآن بدون تحذير WebSocket في وضع React StrictMode
  useEffect(() => {
    let channelInstance = null;
    let isMounted = true;

    const timer = setTimeout(() => {
      if (!isMounted) return;
      try {
        const visitorId =
          sessionStorage.getItem('kianko_visitor_session_id') || `user_${Date.now()}`;
        sessionStorage.setItem('kianko_visitor_session_id', visitorId);

        channelInstance = supabase.channel('kianko_live_room', {
          config: { presence: { key: visitorId } },
        });

        const syncUsersCount = () => {
          try {
            const state = channelInstance.presenceState();
            const count = Object.keys(state || {}).length;
            if (isMounted) setLiveOnlineUsers(Math.max(1, count));
          } catch {
            if (isMounted) setLiveOnlineUsers(1);
          }
        };

        channelInstance
          .on('presence', { event: 'sync' }, syncUsersCount)
          .on('presence', { event: 'join' }, syncUsersCount)
          .on('presence', { event: 'leave' }, syncUsersCount)
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED' && isMounted) {
              try {
                await channelInstance.track({
                  user_id: visitorId,
                  online_at: new Date().toISOString(),
                });
              } catch {
                // ignore
              }
            }
          });
      } catch {
        if (isMounted) setLiveOnlineUsers(1);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (channelInstance && channelInstance.state === 'joined') {
        try {
          supabase.removeChannel(channelInstance);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const sortRecords = (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => {
      if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
      if (typeof a.id === 'number' && typeof b.id === 'number') return b.id - a.id;
      return 0;
    });
  };

  const fetchData = async () => {
    setLoading(true);
    let currentHidden = hiddenIds;
    try {
      currentHidden = JSON.parse(localStorage.getItem('kianko_deleted_items') || '{"messages":[],"jobs":[],"certs":[],"products":[],"storage":[]}');
    } catch {
      // ignore
    }

    try {
      // 1. جلب كافة الملفات المرفوعة في Supabase Storage
      let allStorageFiles = [];
      const bucketsToScan = ['certificates', 'datasheets', 'catalogs', 'products'];
      for (const bucketName of bucketsToScan) {
        const { data: filesList, error: storageErr } = await supabase.storage.from(bucketName).list('', {
          limit: 200,
          sortBy: { column: 'created_at', order: 'desc' }
        });
        if (!storageErr && Array.isArray(filesList) && filesList.length > 0) {
          const mapped = filesList
            .filter(f => f.name && f.name !== '.emptyFolderPlaceholder' && !(currentHidden.storage || []).includes(f.name))
            .map(f => {
              const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(f.name);
              return {
                ...f,
                bucketName,
                publicUrl: urlData?.publicUrl || ''
              };
            });
          allStorageFiles = [...allStorageFiles, ...mapped];
        }
      }
      const uniqueStorageMap = new Map();
      allStorageFiles.forEach(f => {
        if (!uniqueStorageMap.has(f.name)) uniqueStorageMap.set(f.name, f);
      });
      const validFiles = Array.from(uniqueStorageMap.values());
      setStorageFiles(validFiles);

      // 2. جلب تحليلات التحميل للـ 6 كتالوجات
      const { data: analyticsData } = await supabase
        .from('product_analytics')
        .select('*')
        .order('downloads_count', { ascending: false });

      const rawAnalytics = analyticsData || [];
      const dbAnalytics = rawAnalytics.filter(
        a => a.product_id !== '__kianko_site_visits__' && !(currentHidden.products || []).includes(String(a.id))
      );

      const mergedAnalytics = [...dbAnalytics];
      const existingAnalyticsKeys = new Set(dbAnalytics.map(a => String(a.product_id || '').toLowerCase()));

      DEFAULT_KIANKO_CATALOGS.forEach((catItem) => {
        const keyLower = catItem.product_id.toLowerCase();
        const fileKeyLower = catItem.file_name.replace('.pdf', '').toLowerCase();
        const alreadyInAnalytics = existingAnalyticsKeys.has(keyLower) || existingAnalyticsKeys.has(fileKeyLower);

        if (!alreadyInAnalytics && !(currentHidden.products || []).includes(catItem.product_id)) {
          mergedAnalytics.push({
            id: `cat_${catItem.product_id}`,
            product_id: catItem.product_id,
            file_name: catItem.file_name,
            downloads_count: 0,
            updated_at: null,
            _isZeroDownloadCatalog: true
          });
          existingAnalyticsKeys.add(keyLower);
        }
      });

      setAnalytics(mergedAnalytics);

      // بناء قائمة الـ 6 كتالوجات الفنية (تحتفظ بالاسمين العربي والإنجليزي معاً)
      const builtCatalogs = DEFAULT_KIANKO_CATALOGS
        .filter(catItem => !(currentHidden.products || []).includes(catItem.product_id))
        .map(catItem => {
          const analyticsMatch = dbAnalytics.find(
            a => String(a.product_id || '').toLowerCase() === catItem.product_id.toLowerCase()
          );
          const dlCount = analyticsMatch ? (analyticsMatch.downloads_count || 0) : 0;
          return {
            id: catItem.product_id,
            product_id: catItem.product_id,
            file_name: catItem.file_name,
            name_ar: catItem.name_ar,
            name_en: catItem.name_en,
            code: catItem.code,
            downloads_count: dlCount,
            file_url: `${SUPABASE_DATASHEETS_URL}/${catItem.file_name}`,
            updated_at: analyticsMatch?.updated_at || null
          };
        });
      setCatalogs(builtCatalogs);

      // 3. جلب رسائل التواصل
      const { data: messagesData } = await supabase.from('contact_messages').select('*');
      const filteredMsgs = sortRecords(messagesData).filter(m => !(currentHidden.messages || []).includes(String(m.id)));
      setMessages(filteredMsgs);

      // تحديث عداد الزيارات الفعلي
      const realDownloadsSum = dbAnalytics.reduce((acc, c) => acc + (c.downloads_count || 0), 0);
      const savedResetOffset = localStorage.getItem('kianko_visits_reset_mode');
      if (savedResetOffset === 'reset') {
        const currentCount = Number(localStorage.getItem('kianko_real_visits_count') || 1);
        setRealVisitsCount(currentCount);
      } else {
        const calculatedRealVisits = Math.max(1, filteredMsgs.length + realDownloadsSum);
        setRealVisitsCount(calculatedRealVisits);
        localStorage.setItem('kianko_real_visits_count', String(calculatedRealVisits));
      }

      // 4. جلب الوظائف (باللغتين العربية والإنجليزية)
      const { data: jobsData } = await supabase.from('careers').select('*');
      const dbJobsFormatted = sortRecords(jobsData)
        .filter(j => !(currentHidden.jobs || []).includes(String(j.id)))
        .map(j => ({
          ...j,
          title_ar: j.title,
          title_en: j.title_en || j.title,
          dept_ar: j.department || 'الهندسة والتشغيل',
          dept_en: j.department || 'Engineering & Operations',
          loc_ar: j.location || 'الرياض / جدة',
          loc_en: j.location || 'Riyadh / Jeddah',
          _source: 'db'
        }));

      const staticJobsFormatted = (staticJobsList || [])
        .filter(sj => !(currentHidden.jobs || []).includes(String(sj.id)))
        .map(sj => ({
          id: sj.id,
          title: sj.titleAr || sj.titleEn,
          title_ar: sj.titleAr || sj.titleEn,
          title_en: sj.titleEn || sj.titleAr,
          department: sj.dept || 'الهندسة والتشغيل',
          dept_ar: sj.deptAr || sj.dept || 'الهندسة والتشغيل',
          dept_en: sj.deptEn || sj.dept || 'Engineering & Operations',
          location: sj.location || 'الرياض / جدة',
          loc_ar: sj.locationAr || sj.location || 'الرياض / جدة',
          loc_en: sj.locationEn || sj.location || 'Riyadh / Jeddah',
          description: sj.description || '',
          _source: 'static'
        }));

      setJobs([...dbJobsFormatted, ...staticJobsFormatted]);

      // 5. جلب جدول certifications وفصل (الشهادات والاعتمادات) عن (المنتجات)
      const { data: certsData } = await supabase.from('certifications').select('*');
      const allCertRows = sortRecords(certsData);

      // أ) استخراج المنتجات المضافة من الأدمن
      const productsFromCertsTable = allCertRows
        .filter(c => {
          const cat = String(c.category || '').toLowerCase();
          return (cat === 'product' || cat === 'catalog') && !(currentHidden.products || []).includes(String(c.id));
        })
        .map(c => {
          let parsedDesc = '';
          let parsedImg = '';
          let parsedPdf = c.file_url || '';
          try {
            if (c.year && String(c.year).startsWith('{')) {
              const meta = JSON.parse(c.year);
              parsedDesc = meta.description || '';
              parsedImg = meta.image_url || '';
              if (meta.file_url) parsedPdf = meta.file_url;
            }
          } catch {
            // ignore
          }
          const isBuilding = String(c.issuer || '').includes('مباني');
          return {
            id: c.id,
            name: c.title,
            name_ar: c.title,
            name_en: c.title,
            category_ar: isBuilding ? 'مقاطع المباني والمحارة' : 'أنظمة إدارة الكابلات',
            category_en: isBuilding ? 'Building & Plaster Profiles' : 'Cable Management Systems',
            badge_ar: 'جديد',
            badge_en: 'New',
            code: c.code || 'KIAN-NEW',
            desc_ar: parsedDesc || `منتج معتمد - الكود: ${c.code || '—'}`,
            desc_en: parsedDesc || `Certified Product - Code: ${c.code || '—'}`,
            image_url: parsedImg || (c.file_url && /\.(png|jpg|jpeg|webp|gif)$/i.test(c.file_url) ? c.file_url : '/Image/basket.webp'),
            file_url: parsedPdf,
            _source: 'certifications_product'
          };
        });

      // ب) الشهادات والاعتمادات مع حفظ النصوص باللغتين العربية والإنجليزية
      const pureDbCerts = allCertRows
        .filter(c => {
          const cat = String(c.category || '').toLowerCase();
          return (cat === 'iso' || cat === 'approval') && !(currentHidden.certs || []).includes(String(c.id));
        })
        .map(c => ({ ...c, _source: 'certifications' }));

      const activeDefaultIso = DEFAULT_ISO_CERTIFICATES.filter(
        iso => !(currentHidden.certs || []).includes(String(iso.id))
      );

      const activeLocalApprovals = (localAccreditations || [])
        .map((item, idx) => ({
          id: item.id || item.code || `local_acc_${idx}`,
          title: item.titleEn || item.titleAr || item.name,
          titleAr: item.titleAr,
          titleEn: item.titleEn || item.name,
          issuer: item.descEn || item.descAr,
          descAr: item.descAr,
          descEn: item.descEn,
          code: item.code || `APP-${idx + 1}`,
          year: '2026',
          category: 'approval',
          file_url: item.file || item.image || '',
          image_url: item.image || (item.file ? item.file.replace(/\.pdf$/i, '.webp') : ''),
          _source: 'local_accreditation'
        }))
        .filter(item => !(currentHidden.certs || []).includes(String(item.id)));

      setCertifications([...pureDbCerts, ...activeDefaultIso, ...activeLocalApprovals]);

      // 6. بناء قائمة المنتجات الكاملة باللغتين العربية والإنجليزية
      let dbProductsTable = [];
      const { data: productsData, error: prodErr } = await supabase.from('products').select('*');
      if (!prodErr && Array.isArray(productsData) && productsData.length > 0) {
        dbProductsTable = sortRecords(productsData)
          .filter(p => !(currentHidden.products || []).includes(String(p.id)))
          .map(p => ({ ...p, _source: 'products' }));
      }

      let localCustomProducts = [];
      try {
        localCustomProducts = JSON.parse(localStorage.getItem('kianko_custom_products') || '[]');
      } catch {
        localCustomProducts = [];
      }

      const initial13Products = INITIAL_WEBSITE_PRODUCTS
        .filter(p => !(currentHidden.products || []).includes(String(p.id)))
        .map(p => {
          const analyticsMatch = dbAnalytics.find(
            a => String(a.product_id || '').toLowerCase() === p.id.toLowerCase()
          );
          return {
            ...p,
            downloads_count: analyticsMatch ? (analyticsMatch.downloads_count || 0) : 0,
            file_url: `${SUPABASE_DATASHEETS_URL}/${p.file_name}`,
            _source: 'initial_13'
          };
        });

      const combinedProducts = [
        ...dbProductsTable,
        ...productsFromCertsTable,
        ...localCustomProducts.filter(lp => !(currentHidden.products || []).includes(String(lp.id))),
        ...initial13Products
      ];

      const seenProdIds = new Set();
      const uniqueProducts = combinedProducts.filter(p => {
        const key = `${p._source}_${p.id}`;
        if (seenProdIds.has(key)) return false;
        seenProdIds.add(key);
        return true;
      });

      setProducts(uniqueProducts);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetRealVisits = () => {
    askConfirm(
      isAr ? 'إعادة ضبط عداد الزيارات الحقيقي' : 'Reset Visits Counter',
      isAr ? 'هل تريد تصفير عداد الزيارات ليبدأ العد من (1) من هذه اللحظة؟' : 'Reset total website visits counter to 1?',
      async () => {
        localStorage.setItem('kianko_visits_reset_mode', 'reset');
        localStorage.setItem('kianko_real_visits_count', '1');
        setRealVisitsCount(1);
        showToast(isAr ? 'تم تصفير عداد الزيارات إلى (1) بنجاح!' : 'Visits counter reset to 1!');
      }
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');

    const cleanInput = passwordInput.trim();

    try {
      const { data: rpcValid, error: rpcError } = await supabase
        .rpc('verify_admin_password', { input_pass: cleanInput });

      if (!rpcError && rpcValid === true) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth_kianko', 'true');
        return;
      }

      const { data, error } = await supabase.from('admin_settings').select('password_value');
      if (error) {
        setAuthError(isAr ? `خطأ صلاحيات: ${error.message}` : `Error: ${error.message}`);
        return;
      }

      const isMatch = (data || []).some(
        (row) => row.password_value && String(row.password_value).trim() === cleanInput
      );

      if (isMatch) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth_kianko', 'true');
      } else {
        setAuthError(isAr ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.');
      }
    } catch {
      setAuthError(isAr ? 'خطأ في الاتصال بقاعدة البيانات.' : 'Connection error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_kianko');
    setPasswordInput('');
  };

  // ==================== تنسيق روابط الرد السريع (Gmail + WhatsApp) ====================
  const getGmailComposeUrl = (msg) => {
    const email = String(msg?.email || '').trim();
    const clientName = sanitizeText(msg?.name);
    const subject = encodeURIComponent(isAr ? `رد من شركة كيانكو للصناعات الحديدية بخصوص استفساركم` : `Reply from KIANKO Steel Industries`);
    const body = encodeURIComponent(
      isAr
        ? `الأستاذ / ${clientName} المحترم،\nتحية طيبة من شركة كيانكو للصناعات الحديدية (المملكة العربية السعودية)،\n\nنشكركم على تواصلكم معنا بخصوص رسالتكم:\n"${sanitizeText(msg?.message)}"\n\nيسعدنا إفادتكم بالتالي:\n\n\nمع خالص التحية والتقدير،\nإدارة المبيعات والدعم الفني - شركة كيانكو للصناعات الحديدية`
        : `Dear ${clientName},\nGreetings from KIANKO Steel Industries,\n\nThank you for contacting us regarding:\n"${sanitizeText(msg?.message)}"\n\nBest regards,\nKIANKO Team`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
  };

  const getWhatsAppUrl = (msg) => {
    let rawPhone = String(msg?.phone || '').replace(/[^0-9]/g, '');
    if (rawPhone.startsWith('00')) {
      rawPhone = rawPhone.slice(2);
    } else if (rawPhone.startsWith('01') && rawPhone.length === 11) {
      rawPhone = '2' + rawPhone;
    } else if (rawPhone.startsWith('05') && rawPhone.length === 10) {
      rawPhone = '966' + rawPhone.slice(1);
    }
    const text = encodeURIComponent(
      isAr
        ? `مرحباً أستاذ ${sanitizeText(msg?.name)}، معك إدارة شركة كيانكو للصناعات الحديدية بخصوص رسالتكم على موقعنا.`
        : `Hello ${sanitizeText(msg?.name)}, contacting you from KIANKO Steel Industries regarding your inquiry.`
    );
    return `https://wa.me/${rawPhone}?text=${text}`;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(isAr ? `تم نسخ ${label} بنجاح!` : `${label} copied!`);
  };

  // ==================== 1. إدارة الوظائف ====================
  const handleAddOrUpdateJob = async (e) => {
    e.preventDefault();
    setJobFormError('');

    const cleanTitle = newJob.title.trim();
    const cleanDept = newJob.department.trim();
    const cleanLoc = newJob.location.trim();
    const cleanDesc = newJob.description.trim();

    if (cleanTitle.length < 3) {
      setJobFormError(isAr ? 'يرجى إدخال مسمى وظيفي صحيح (3 أحرف على الأقل، ولا تُقبل المسافات الفارغة).' : 'Job title must be at least 3 characters.');
      return;
    }
    if (cleanDept.length < 2) {
      setJobFormError(isAr ? 'يرجى إدخال القسم بشكل صحيح (حرفين على الأقل).' : 'Department must be at least 2 characters.');
      return;
    }
    if (cleanLoc.length < 2) {
      setJobFormError(isAr ? 'يرجى إدخال المدينة/المكان بشكل صحيح مثل: الرياض أو جدة (حرفين على الأقل).' : 'Location must be at least 2 characters.');
      return;
    }
    if (cleanDesc.length < 10) {
      setJobFormError(isAr ? 'يرجى كتابة وصف وظيفي واضح ومختصر (10 أحرف على الأقل).' : 'Description must be at least 10 characters.');
      return;
    }

    const payload = {
      title: cleanTitle,
      department: cleanDept,
      location: cleanLoc,
      description: cleanDesc
    };

    if (editingJobId) {
      const { error } = await supabase.from('careers').update(payload).eq('id', editingJobId);
      if (!error) {
        setNewJob({ title: '', department: '', location: '', description: '' });
        setEditingJobId(null);
        fetchData();
        showToast(isAr ? 'تم تحديث بيانات الوظيفة في قسم الوظائف بنجاح!' : 'Job updated successfully!');
      } else {
        showToast(isAr ? `خطأ أثناء التحديث: ${error.message}` : 'Error updating job', 'error');
      }
    } else {
      const { error } = await supabase.from('careers').insert([payload]);
      if (!error) {
        setNewJob({ title: '', department: '', location: '', description: '' });
        fetchData();
        showToast(isAr ? 'تم نشر الوظيفة في صفحة الوظائف بنجاح!' : 'Job published successfully!');
      } else {
        showToast(isAr ? `خطأ أثناء نشر الوظيفة: ${error.message}` : 'Error publishing job', 'error');
      }
    }
  };

  const startEditJob = (job) => {
    setEditingJobId(job.id);
    setNewJob({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      description: job.description || ''
    });
    setJobFormError('');
    setActiveTab('jobs');
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleDeleteJob = (id) => {
    askConfirm(
      isAr ? 'تأكيد حذف الوظيفة' : 'Delete Career Opening',
      isAr ? 'هل أنت متأكد من حذف هذه الوظيفة نهائياً من الموقع؟' : 'Are you sure you want to delete this job?',
      async () => {
        markItemDeletedLocally('jobs', id);
        setJobs(prev => prev.filter(j => j.id !== id));
        await supabase.from('careers').delete().eq('id', id);
        showToast(isAr ? 'تم حذف الوظيفة بنجاح' : 'Job deleted');
      }
    );
  };

  // ==================== 2. إدارة الشهادات (ISO) والاعتمادات (Approvals) ====================
  const handleAddOrUpdateCert = async (e) => {
    e.preventDefault();
    setCertFormError('');

    const cleanTitle = newCert.title.trim();
    const cleanIssuer = newCert.issuer.trim();
    const cleanCode = newCert.code.trim();
    const cleanYear = String(newCert.year).trim();

    if (cleanTitle.length < 3) {
      setCertFormError(isAr ? 'يرجى إدخال عنوان الشهادة أو الاعتماد بشكل صحيح (3 أحرف على الأقل).' : 'Title must be at least 3 characters.');
      return;
    }
    if (cleanIssuer.length < 2) {
      setCertFormError(isAr ? 'يرجى إدخال الجهة المانحة أو اسم المشروع (حرفين على الأقل).' : 'Issuer must be at least 2 characters.');
      return;
    }
    if (cleanCode.length < 2) {
      setCertFormError(isAr ? 'يرجى إدخال الكود بشكل صحيح (حرفين على الأقل).' : 'Code must be at least 2 characters.');
      return;
    }
    if (!/^\d{4}$/.test(cleanYear)) {
      setCertFormError(isAr ? 'يرجى إدخال سنة صحيحة مكونة من 4 أرقام (مثال: 2026).' : 'Please enter a valid 4-digit year.');
      return;
    }

    const payload = {
      title: cleanTitle,
      issuer: cleanIssuer,
      year: cleanYear,
      file_url: newCert.file_url,
      category: newCert.category === 'iso' ? 'iso' : 'approval',
      code: cleanCode
    };

    if (editingCertId && typeof editingCertId === 'number') {
      const { error } = await supabase.from('certifications').update(payload).eq('id', editingCertId);
      if (!error) {
        setNewCert({ title: '', issuer: '', year: '2026', file_url: '', category: 'approval', code: 'ASTM-01' });
        setEditingCertId(null);
        fetchData();
        showToast(isAr ? 'تم تعديل المستند بنجاح!' : 'Document updated successfully!');
      } else {
        showToast(isAr ? `خطأ أثناء التعديل: ${error.message}` : `Error: ${error.message}`, 'error');
      }
    } else {
      const { error } = await supabase.from('certifications').insert([payload]);
      if (!error) {
        const addedType = payload.category === 'iso'
          ? (isAr ? 'صفحة شهادات الأيزو وسليدر الرئيسية' : 'ISO Page & Home Slider')
          : (isAr ? 'صفحة الاعتمادات وسليدر الرئيسية' : 'Approvals Page & Home Slider');
        setNewCert({ title: '', issuer: '', year: '2026', file_url: '', category: payload.category, code: 'ASTM-01' });
        setEditingCertId(null);
        fetchData();
        showToast(isAr ? `تم النشر في (${addedType}) بنجاح!` : `Published to ${addedType}!`);
      } else {
        showToast(isAr ? `خطأ أثناء النشر: ${error.message}` : `Error: ${error.message}`, 'error');
      }
    }
  };

  const startEditCert = (cert) => {
    const resolved = resolveCertText(cert, isAr);
    setEditingCertId(cert.id);
    setNewCert({
      title: cert.title || resolved.title || '',
      issuer: cert.issuer || resolved.issuer || '',
      year: cert.year || '2026',
      file_url: cert.file_url || '',
      category: cert.category === 'iso' ? 'iso' : 'approval',
      code: cert.code || ''
    });
    setCertFormError('');
    setActiveTab('certifications');
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleDeleteCert = (cert) => {
    const resolved = resolveCertText(cert, isAr);
    askConfirm(
      isAr ? 'تأكيد حذف المستند' : 'Delete Document',
      isAr ? `هل أنت متأكد من حذف "${resolved.title}" من الموقع وسليدر الرئيسية؟` : `Are you sure you want to delete "${resolved.title}"?`,
      async () => {
        markItemDeletedLocally('certs', cert.id);
        setCertifications(prev => prev.filter(c => c.id !== cert.id));
        if (cert._source === 'certifications') {
          await supabase.from('certifications').delete().eq('id', cert.id);
        }
        showToast(isAr ? 'تم حذف المستند بنجاح' : 'Document deleted');
      }
    );
  };

  // ==================== 3. إدارة المنتجات ====================
  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setProductFormError('');

    const cleanName = newProduct.name.trim();
    const cleanCategory = newProduct.category.trim();
    const cleanCode = newProduct.code.trim() || `KIAN-${Date.now().toString().slice(-3)}`;
    const cleanDesc = newProduct.description.trim();

    if (cleanName.length < 3) {
      setProductFormError(isAr ? 'يرجى إدخال اسم المنتج بشكل صحيح (3 أحرف على الأقل).' : 'Product name must be at least 3 characters.');
      return;
    }
    if (cleanCategory.length < 2) {
      setProductFormError(isAr ? 'يرجى إدخال تصنيف المنتج (حرفين على الأقل).' : 'Category must be at least 2 characters.');
      return;
    }
    if (cleanDesc.length < 5) {
      setProductFormError(isAr ? 'يرجى إدخال وصف مختصر للمنتج ومواصفاته (5 أحرف على الأقل).' : 'Description must be at least 5 characters.');
      return;
    }

    const { error: prodTableErr } = await supabase.from('products').insert([{
      name: cleanName,
      category: cleanCategory,
      code: cleanCode,
      description: cleanDesc,
      image_url: newProduct.image_url,
      file_url: newProduct.file_url
    }]);

    if (prodTableErr) {
      const metaYearJson = JSON.stringify({
        description: cleanDesc,
        image_url: newProduct.image_url || '',
        file_url: newProduct.file_url || ''
      });

      const { error: certProdErr } = await supabase.from('certifications').insert([{
        title: cleanName,
        issuer: cleanCategory,
        code: cleanCode,
        year: metaYearJson,
        category: 'product',
        file_url: newProduct.file_url || newProduct.image_url || ''
      }]);

      if (certProdErr) {
        const existingLocal = JSON.parse(localStorage.getItem('kianko_custom_products') || '[]');
        const newLocalProd = {
          id: `custom_${Date.now()}`,
          name: cleanName,
          category: cleanCategory,
          code: cleanCode,
          description: cleanDesc,
          image_url: newProduct.image_url,
          file_url: newProduct.file_url,
          _source: 'local_custom'
        };
        localStorage.setItem('kianko_custom_products', JSON.stringify([newLocalProd, ...existingLocal]));
      }
    }

    setNewProduct({ name: '', category: 'أنظمة إدارة الكابلات', code: '', description: '', image_url: '', file_url: '' });
    await fetchData();
    showToast(isAr ? 'تمت إضافة المنتج في صفحة المنتجات بنجاح!' : 'Product added to Products Page successfully!');
  };

  const handleDeleteProduct = (prod) => {
    const resolved = resolveProductText(prod, isAr);
    askConfirm(
      isAr ? 'تأكيد حذف المنتج' : 'Delete Product',
      isAr ? `هل أنت متأكد من حذف المنتج "${resolved.name}" من كتالوج المنتجات؟` : `Delete "${resolved.name}"?`,
      async () => {
        markItemDeletedLocally('products', prod.id);
        setProducts(prev => prev.filter(p => p.id !== prod.id));

        if (prod._source === 'certifications_product') {
          await supabase.from('certifications').delete().eq('id', prod.id);
        } else if (prod._source === 'products') {
          await supabase.from('products').delete().eq('id', prod.id);
        } else if (prod._source === 'local_custom') {
          const existingLocal = JSON.parse(localStorage.getItem('kianko_custom_products') || '[]');
          localStorage.setItem('kianko_custom_products', JSON.stringify(existingLocal.filter(p => p.id !== prod.id)));
        }
        showToast(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
      }
    );
  };

  // ==================== 4. إدارة الرسائل ====================
  const handleDeleteMessage = (id) => {
    askConfirm(
      isAr ? 'تأكيد حذف الرسالة' : 'Delete Message',
      isAr ? 'هل أنت متأكد من حذف هذه الرسالة نهائياً من سجل الرسائل؟' : 'Are you sure you want to delete this message?',
      async () => {
        markItemDeletedLocally('messages', id);
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        await supabase.from('contact_messages').delete().eq('id', id);
        showToast(isAr ? 'تم حذف الرسالة بنجاح!' : 'Message deleted!');
      }
    );
  };

  const handleCleanTestMessages = () => {
    const testMsgs = messages.filter(m => {
      const combined = `${m.name || ''} ${m.email || ''} ${m.message || ''} ${m.phone || ''}`.toLowerCase();
      return (
        combined.includes('test') ||
        combined.includes('alert(1)') ||
        combined.includes('<script') ||
        combined.includes('<svg') ||
        combined.includes('onmouseover') ||
        !String(m.name || '').trim()
      );
    });

    if (testMsgs.length === 0) {
      showToast(isAr ? 'لا توجد رسائل تجريبية أو فارغة لحذفها!' : 'No test messages found!');
      return;
    }

    askConfirm(
      isAr ? 'تنظيف الرسائل التجريبية' : 'Clean Test Messages',
      isAr ? `تم العثور على (${testMsgs.length}) رسالة تجريبية/اختبارية. هل تريد حذفها جميعاً وتنظيف الجدول؟` : `Delete ${testMsgs.length} test messages?`,
      async () => {
        const ids = testMsgs.map(m => m.id).filter(Boolean);
        ids.forEach(id => markItemDeletedLocally('messages', id));
        setMessages(prev => prev.filter(m => !ids.includes(m.id)));
        setCurrentMsgPage(1);
        if (ids.length > 0) {
          await supabase.from('contact_messages').delete().in('id', ids);
        }
        showToast(isAr ? `تم تنظيف وحذف ${ids.length} رسالة تجريبية بنجاح!` : `Cleaned ${ids.length} test messages!`);
      }
    );
  };

  // ==================== دوال تنظيف وحماية النصوص والتصدير ====================
  const sanitizeText = (text) => {
    if (text === null || text === undefined) return '—';
    const cleaned = String(text).trim();
    return cleaned.length > 0 ? cleaned : '—';
  };

  const escapeHtml = (text) => {
    const raw = sanitizeText(text);
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return isAr ? 'لم يُحمّل بعد' : 'Not downloaded yet';
    try {
      return new Date(dateVal).toLocaleString(isAr ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(dateVal);
    }
  };

  const buildFormattedReportHTML = (dateStr) => {
    const rowsHtml = messages.map((m, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
        <td style="padding: 10px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #0A1832;">${idx + 1}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a; word-break: break-word;">${escapeHtml(m.name)}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-family: monospace; color: #1e40af; direction: ltr; text-align: ${isAr ? 'right' : 'left'}; word-break: break-all;">${escapeHtml(m.email)}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-family: monospace; color: #0f172a; direction: ltr; text-align: center; word-break: break-all;">${escapeHtml(m.phone)}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.5; word-break: break-word;">${escapeHtml(m.message)}</td>
        <td style="padding: 10px 10px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px; color: #475569; white-space: nowrap;">${escapeHtml(formatDate(m.created_at))}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${isAr ? 'تقرير رسائل العملاء - شركة كيانكو للصناعات الحديدية' : 'KIANKO Client Messages Report'}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #0f172a;
            background: #ffffff;
            direction: ${isAr ? 'rtl' : 'ltr'};
          }
          .header-box {
            border: 2px solid #0A1832;
            border-top: 6px solid #C9252C;
            border-radius: 8px;
            padding: 16px 24px;
            margin-bottom: 20px;
            background-color: #f8fafc;
          }
          .company-title {
            margin: 0;
            font-size: 22px;
            font-weight: 900;
            color: #0A1832;
          }
          .company-sub {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #C9252C;
            font-weight: bold;
          }
          .meta-row {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            font-size: 12px;
            color: #475569;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 12.5px;
          }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
          th {
            background-color: #0A1832;
            color: #ffffff;
            padding: 12px 10px;
            border: 1px solid #0A1832;
            font-weight: bold;
            text-align: ${isAr ? 'right' : 'left'};
          }
          .footer-note {
            margin-top: 18px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1 class="company-title">${isAr ? 'شركة كيانكو للصناعات الحديدية | KIANKO STEEL INDUSTRIES' : 'KIANKO STEEL INDUSTRIES'}</h1>
          <p class="company-sub">${isAr ? 'المملكة العربية السعودية (الرياض - جدة) | التقرير الرسمي لرسائل وتواصل العملاء' : 'Kingdom of Saudi Arabia (Riyadh - Jeddah) | Official Client Messages Report'}</p>
          <div class="meta-row">
            <span><strong>${isAr ? 'تاريخ استخراج التقرير:' : 'Report Date:'}</strong> ${dateStr}</span>
            <span> &nbsp;|&nbsp; </span>
            <span><strong>${isAr ? 'إجمالي عدد الرسائل:' : 'Total Messages:'}</strong> ${messages.length}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">#</th>
              <th style="width: 17%;">${isAr ? 'اسم العميل' : 'Client Name'}</th>
              <th style="width: 21%;">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</th>
              <th style="width: 14%; text-align: center;">${isAr ? 'رقم الجوال' : 'Phone Number'}</th>
              <th style="width: 29%;">${isAr ? 'نص الرسالة' : 'Message Details'}</th>
              <th style="width: 14%; text-align: center;">${isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer-note">
          ${isAr ? 'تم استخراج هذا المستند آلياً من لوحة تحكم شركة كيانكو للصناعات الحديدية - المملكة العربية السعودية' : 'Automatically generated by KIANKO Central Admin Portal - Saudi Arabia'}
        </div>
      </body>
      </html>
    `;
  };

  const exportReport = (format) => {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US').replace(/\//g, '-');

    if (format === 'word') {
      const htmlContent = buildFormattedReportHTML(dateStr);
      const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kianko_Messages_Report_${dateStr}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      const excelRows = messages.map((m, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f1f5f9'};">
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${idx + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${escapeHtml(m.name)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${escapeHtml(m.email)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; mso-number-format:'\\@'; text-align: center;">${escapeHtml(m.phone)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${escapeHtml(m.message)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${escapeHtml(formatDate(m.created_at))}</td>
        </tr>
      `).join('');

      const excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40" dir="${isAr ? 'rtl' : 'ltr'}">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>${isAr ? 'رسائل عملاء كيانكو' : 'Kianko Messages'}</x:Name>
                  <x:WorksheetOptions>
                    ${isAr ? '<x:DisplayRightToLeft/>' : ''}
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body style="font-family: Tahoma, Arial, sans-serif;">
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th colspan="6" style="background-color: #0A1832; color: #ffffff; font-size: 16px; padding: 14px; text-align: center;">
                  ${isAr ? 'شركة كيانكو للصناعات الحديدية - المملكة العربية السعودية | تقرير رسائل العملاء' : 'KIANKO STEEL INDUSTRIES - SAUDI ARABIA | Client Messages Report'} (${dateStr})
                </th>
              </tr>
              <tr style="background-color: #C9252C; color: #ffffff; font-weight: bold;">
                <th style="padding: 10px; border: 1px solid #0A1832; width: 50px;">#</th>
                <th style="padding: 10px; border: 1px solid #0A1832; width: 180px;">${isAr ? 'اسم العميل' : 'Name'}</th>
                <th style="padding: 10px; border: 1px solid #0A1832; width: 220px;">${isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th style="padding: 10px; border: 1px solid #0A1832; width: 150px;">${isAr ? 'رقم الجوال' : 'Phone'}</th>
                <th style="padding: 10px; border: 1px solid #0A1832; width: 350px;">${isAr ? 'الرسالة' : 'Message'}</th>
                <th style="padding: 10px; border: 1px solid #0A1832; width: 160px;">${isAr ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              ${excelRows}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kianko_Messages_${dateStr}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);
      const frameDoc = printFrame.contentWindow ? printFrame.contentWindow.document : printFrame.contentDocument;
      if (!frameDoc) return;
      frameDoc.open();
      frameDoc.write(buildFormattedReportHTML(dateStr));
      frameDoc.close();
      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        setTimeout(() => document.body.removeChild(printFrame), 1500);
      }, 500);
    }
  };

  const totalDownloads = analytics.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);
  const isoList = certifications.filter(c => String(c.category || '').toLowerCase() === 'iso');
  const approvalList = certifications.filter(c => String(c.category || '').toLowerCase() !== 'iso');

  // ==================== محرك البحث الشامل (يبحث في النصوص العربية والإنجليزية معاً) ====================
  const qNorm = normalizeSearchText(searchQuery);
  const isSearching = qNorm.length > 0;

  const isMessagesKeyword = isSearching && ['الرسائل', 'رسائل', 'رساله', 'تواصل', 'عملاء', 'messages', 'contact'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isJobsKeyword = isSearching && ['الوظائف', 'وظائف', 'وظيفه', 'توظيف', 'jobs', 'careers'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isCertsKeyword = isSearching && ['الشهادات', 'شهادات', 'شهاده', 'الاعتمادات', 'اعتمادات', 'اعتماد', 'ايزو', 'iso', 'certifications', 'approvals'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isProductsKeyword = isSearching && ['المنتجات', 'منتجات', 'منتج', 'خطوط انتاج', 'products'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isCatalogsKeyword = isSearching && ['الكتالوجات', 'كتالوجات', 'كتالوج', 'داتا شيت', 'catalogs', 'datasheet'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isAnalyticsKeyword = isSearching && ['التحليلات', 'تحليلات', 'تحليل', 'تحميلات', 'analytics', 'downloads'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));
  const isSystemKeyword = isSearching && ['حاله النظام', 'حاله', 'النظام', 'زوار', 'الزوار', 'متواجد', 'نشط', 'system', 'status', 'visits', 'visitors'].some(k => normalizeSearchText(k).includes(qNorm) || qNorm.includes(normalizeSearchText(k)));

  const filteredMessages = messages.filter(m => {
    if (!isSearching) return true;
    if (isMessagesKeyword) return true;
    const text = normalizeSearchText(`${m.name || ''} ${m.email || ''} ${m.phone || ''} ${m.message || ''}`);
    return text.includes(qNorm);
  });

  const filteredProducts = products.filter(p => {
    if (!isSearching) return true;
    if (isProductsKeyword) return true;
    const ar = resolveProductText(p, true);
    const en = resolveProductText(p, false);
    const text = normalizeSearchText(`${ar.name} ${en.name} ${ar.category} ${en.category} ${p.code || ''} ${ar.description} ${en.description}`);
    return text.includes(qNorm);
  });

  const filteredCatalogs = catalogs.filter(c => {
    if (!isSearching) return true;
    if (isCatalogsKeyword) return true;
    const text = normalizeSearchText(`${c.name_ar || ''} ${c.name_en || ''} ${c.product_id || ''} ${c.file_name || ''} ${c.code || ''}`);
    return text.includes(qNorm);
  });

  const filteredCertifications = certifications.filter(c => {
    if (!isSearching) return true;
    if (isCertsKeyword) {
      if (qNorm.includes('ايزو') || qNorm.includes('iso')) return String(c.category || '').toLowerCase() === 'iso';
      if (qNorm.includes('اعتماد')) return String(c.category || '').toLowerCase() !== 'iso';
      return true;
    }
    const ar = resolveCertText(c, true);
    const en = resolveCertText(c, false);
    const text = normalizeSearchText(`${ar.title} ${en.title} ${ar.issuer} ${en.issuer} ${c.code || ''} ${c.year || ''}`);
    return text.includes(qNorm);
  });

  const filteredJobs = jobs.filter(j => {
    if (!isSearching) return true;
    if (isJobsKeyword) return true;
    const text = normalizeSearchText(`${j.title_ar || ''} ${j.title_en || ''} ${j.title || ''} ${j.department || ''} ${j.location || ''} ${j.description || ''}`);
    return text.includes(qNorm);
  });

  const filteredAnalytics = analytics.filter(a => {
    if (!isSearching) return true;
    if (isAnalyticsKeyword || isCatalogsKeyword) return true;
    const matchedDefault = DEFAULT_KIANKO_CATALOGS.find(
      d => d.product_id.toLowerCase() === String(a.product_id || '').toLowerCase()
    );
    const text = normalizeSearchText(`${a.product_id || ''} ${a.file_name || ''} ${matchedDefault?.name_ar || ''} ${matchedDefault?.name_en || ''}`);
    return text.includes(qNorm);
  });

  const systemMatchesCount = isSystemKeyword ? 4 : 0;

  const totalSearchMatches = isSearching
    ? filteredMessages.length +
      filteredProducts.length +
      filteredCatalogs.length +
      filteredCertifications.length +
      filteredJobs.length +
      filteredAnalytics.length +
      systemMatchesCount
    : 0;

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && isSearching) {
      e.preventDefault();
      if (isSystemKeyword) setActiveTab('system');
      else if (isAnalyticsKeyword || isCatalogsKeyword) setActiveTab('analytics');
      else if (isMessagesKeyword) setActiveTab('messages');
      else if (isJobsKeyword) setActiveTab('jobs');
      else if (isCertsKeyword) setActiveTab('certifications');
      else if (isProductsKeyword) setActiveTab('products');
    }
  };

  // حسابات تقسيم صفحات الرسائل
  const totalMsgPages = Math.max(1, Math.ceil(filteredMessages.length / msgsPerPage));
  const safeMsgPage = Math.min(currentMsgPage, totalMsgPages);
  const msgStartIndex = (safeMsgPage - 1) * msgsPerPage;
  const paginatedMessages = filteredMessages.slice(msgStartIndex, msgStartIndex + msgsPerPage);

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center px-4 transition-colors duration-300"
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      >
        <form onSubmit={handleLogin} className={`w-full max-w-md p-8 rounded-2xl border transition-all duration-300 space-y-6 ${cardBg} ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="text-center space-y-2">
            <div className={`inline-flex p-3 rounded-full border ${darkMode ? 'bg-blue-950 text-red-500 border-blue-900' : 'bg-red-50 text-red-600 border-red-200'}`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className={`text-2xl font-bold ${textMain}`}>{isAr ? 'بوابة الإدارة الآمنة' : 'Secure Admin Portal'}</h2>
            <p className={`text-xs ${textMuted}`}>{isAr ? 'أدخل كلمة المرور للوصول إلى لوحة تحكم كيانكو' : 'Enter password to access KIANKO dashboard'}</p>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'كلمة مرور الأدمن' : 'Admin Password'}</label>
            <div className="relative">
              <KeyRound className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoCapitalize="none"
                placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter password...'}
                className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} py-3 border rounded-xl text-sm focus:outline-none focus:border-red-500 transition-colors ${subBg}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${textMuted} cursor-pointer`}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && <p className="text-xs text-red-500 font-bold leading-relaxed">{authError}</p>}
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            {loginLoading ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'دخول اللوحة الآمنة' : 'Access Secure Portal')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 transition-colors duration-300 ${isAr ? 'text-right' : 'text-left'}`}
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white transition-all ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* نافذة تأكيد الحذف المخصصة */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4" onClick={() => setConfirmDialog(null)}>
          <div className={`w-full max-w-md p-6 rounded-2xl border space-y-5 ${cardBg}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/15 text-red-500 border border-red-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-extrabold text-base ${textMain}`}>{confirmDialog.title}</h3>
                <p className={`text-xs mt-1 ${textMuted}`}>{confirmDialog.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${subBg} hover:opacity-80`}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const fn = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  if (fn) await fn();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg cursor-pointer transition-all active:scale-95"
              >
                {isAr ? 'نعم، تأكيد الحذف' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة قراءة الرسالة كاملة */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4" onClick={() => setSelectedMessage(null)}>
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${cardBg}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 border-blue-900/60">
              <h3 className={`font-bold text-lg ${textMain}`}>{isAr ? 'تفاصيل رسالة العميل' : 'Client Message Details'}</h3>
              <button onClick={() => setSelectedMessage(null)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className={textMuted}>{isAr ? 'الاسم:' : 'Name:'}</span>
                <span className={`font-bold ${textMain}`}>{sanitizeText(selectedMessage.name)}</span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className={textMuted}>{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400" dir="ltr">{sanitizeText(selectedMessage.email)}</span>
                  {selectedMessage.email && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedMessage.email, isAr ? 'البريد الإلكتروني' : 'Email')}
                      className="p-1 rounded bg-blue-500/15 text-blue-400 hover:bg-blue-600 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className={textMuted}>{isAr ? 'رقم الجوال:' : 'Phone:'}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold ${textMain}`} dir="ltr">{sanitizeText(selectedMessage.phone)}</span>
                  {selectedMessage.phone && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedMessage.phone, isAr ? 'رقم الجوال' : 'Phone')}
                      className="p-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-600 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={textMuted}>{isAr ? 'التاريخ:' : 'Date:'}</span>
                <span className="text-xs">{formatDate(selectedMessage.created_at)}</span>
              </div>

              <div className={`p-4 rounded-xl border ${subBg} whitespace-pre-wrap leading-relaxed text-sm`}>
                {sanitizeText(selectedMessage.message)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {selectedMessage.phone && (
                <a
                  href={getWhatsAppUrl(selectedMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 text-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {isAr ? 'رد عبر واتساب' : 'Reply via WhatsApp'}
                </a>
              )}
              {selectedMessage.email && (
                <a
                  href={getGmailComposeUrl(selectedMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 text-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isAr ? 'رد عبر الإيميل (Gmail)' : 'Reply via Email (Gmail)'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col lg:flex-row justify-between items-center gap-4 p-6 rounded-2xl border ${cardBg}`}>
        <div>
          <h1 className={`text-2xl font-extrabold flex items-center gap-3 ${textMain}`}>
            <BarChart3 style={{ color: themeColor }} className="w-8 h-8" />
            {isAr ? 'لوحة تحكم كيانكو المركزية' : 'KIANKO Central Dashboard'}
          </h1>
          <p className={`text-sm mt-1 ${textMuted}`}>
            {isAr
              ? `إدارة المنتجات (${products.length})، الكتالوجات (${catalogs.length})، الأيزو (${isoList.length})، الاعتمادات (${approvalList.length})، والوظائف (${jobs.length}) - السعودية`
              : `Manage Products (${products.length}), Catalogs (${catalogs.length}), ISO (${isoList.length}), Approvals (${approvalList.length}), & Careers (${jobs.length})`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-end">
          <div className="relative flex-1 sm:w-72">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-red-500' : textMuted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={isAr ? 'ابحث عن منتج، شهادة، اعتماد، تحليلات، حالة...' : 'Search products, certs, analytics...'}
              className={`w-full ${isAr ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-2.5 border rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all ${
                isSearching ? 'border-red-500 ring-2 ring-red-500/20' : ''
              } ${subBg}`}
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute ${isAr ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode ? 'bg-blue-950/80 hover:bg-blue-900 text-white border-blue-800/50' : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {isAr ? 'تحديث البيانات' : 'Refresh'}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border-red-800/50' : 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isAr ? 'خروج آمن' : 'Logout'}
          </button>
        </div>
      </div>

      {/* شريط إشعار البحث الذكي */}
      {isSearching && (
        <div className={`p-4 rounded-2xl border border-red-500/40 flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Search className="w-4 h-4 text-red-500" />
            <span>
              {isAr
                ? `نتائج البحث الشامل عن "${searchQuery}" (${totalSearchMatches} نتيجة مطابقة):`
                : `Search results for "${searchQuery}" (${totalSearchMatches} matches):`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isSystemKeyword && (
              <button
                type="button"
                onClick={() => setActiveTab('system')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-purple-500/15 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                {isAr ? 'حالة النظام والزوار (4)' : 'System Status (4)'}
              </button>
            )}
            {filteredAnalytics.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-emerald-500/15 text-emerald-400 hover:bg-emerald-600 hover:text-white"
              >
                {isAr ? `تحليلات الكتالوجات (${filteredAnalytics.length})` : `Analytics (${filteredAnalytics.length})`}
              </button>
            )}
            {filteredProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-red-500/15 text-red-400 hover:bg-red-600 hover:text-white"
              >
                {isAr ? `المنتجات (${filteredProducts.length})` : `Products (${filteredProducts.length})`}
              </button>
            )}
            {filteredCertifications.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('certifications')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-amber-500/15 text-amber-400 hover:bg-amber-600 hover:text-white"
              >
                {isAr ? `الشهادات والاعتمادات (${filteredCertifications.length})` : `Certs (${filteredCertifications.length})`}
              </button>
            )}
            {filteredMessages.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-blue-500/15 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                {isAr ? `الرسائل (${filteredMessages.length})` : `Messages (${filteredMessages.length})`}
              </button>
            )}
            {filteredJobs.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer bg-indigo-500/15 text-indigo-400 hover:bg-indigo-600 hover:text-white"
              >
                {isAr ? `الوظائف (${filteredJobs.length})` : `Jobs (${filteredJobs.length})`}
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
            >
              {isAr ? 'إلغاء البحث ✕' : 'Clear ✕'}
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div onClick={() => setActiveTab('system')} className={`p-5 rounded-2xl border space-y-2 cursor-pointer transition-transform hover:scale-[1.01] ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'زيارات وتفاعل الموقع' : 'Real Site Activity'}</span>
            <Eye className="w-5 h-5 text-purple-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{realVisitsCount}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Users className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? `متواجد الآن: ${liveOnlineUsers} ${liveOnlineUsers === 1 ? 'زائر' : 'زوار'} (مباشر)`
                : `${liveOnlineUsers} Online now (Live)`}
            </span>
          </div>
        </div>

        <div onClick={() => setActiveTab('analytics')} className={`p-5 rounded-2xl border space-y-2 cursor-pointer transition-transform hover:scale-[1.01] ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي التحميلات' : 'Total Downloads'}</span>
            <Download className="w-5 h-5 text-emerald-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{totalDownloads}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? `من إجمالي ${catalogs.length} كتالوجات فنية` : `Across ${catalogs.length} catalogs`}</p>
        </div>

        <div onClick={() => setActiveTab('messages')} className={`p-5 rounded-2xl border space-y-2 cursor-pointer transition-transform hover:scale-[1.01] ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'الرسائل الواردة' : 'Incoming Messages'}</span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{messages.length}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'رسائل العملاء وطلبات التوظيف' : 'Contact & CV submissions'}</p>
        </div>

        <div onClick={() => setActiveTab('certifications')} className={`p-5 rounded-2xl border space-y-2 cursor-pointer transition-transform hover:scale-[1.01] ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'الشهادات والاعتمادات' : 'Certs & Approvals'}</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{certifications.length}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? `${isoList.length} شهادة أيزو | ${approvalList.length} اعتماد` : `${isoList.length} ISO | ${approvalList.length} Approvals`}</p>
        </div>

        <div onClick={() => setActiveTab('products')} className={`p-5 rounded-2xl border space-y-2 cursor-pointer transition-transform hover:scale-[1.01] ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'المنتجات والوظائف' : 'Products & Jobs'}</span>
            <Package className="w-5 h-5 text-red-500" />
          </div>
          <div className={`text-2xl font-black ${textMain}`}>
            {isAr ? `${products.length} منتج | ${jobs.length} وظيفة` : `${products.length} Prod | ${jobs.length} Jobs`}
          </div>
          <p className={`text-xs ${textMuted}`}>{isAr ? `${products.length} منتج معروض + ${catalogs.length} كتالوج` : 'Active products & careers'}</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className={`flex flex-wrap border-b gap-2 sm:gap-3 ${borderCol}`}>
        {[
          { id: 'overview_content', label: isAr ? `كل المعروض (${products.length + certifications.length + catalogs.length})` : `All Content (${products.length + certifications.length + catalogs.length})`, icon: FolderOpen },
          { id: 'products', label: isAr ? `إدارة المنتجات (${isSearching ? filteredProducts.length : products.length})` : `Products (${products.length})`, icon: Package },
          { id: 'certifications', label: isAr ? `الأيزو والاعتمادات (${isSearching ? filteredCertifications.length : certifications.length})` : `ISO & Approvals (${certifications.length})`, icon: Award },
          { id: 'jobs', label: isAr ? `الوظائف (${isSearching ? filteredJobs.length : jobs.length})` : `Careers (${jobs.length})`, icon: Briefcase },
          { id: 'messages', label: isAr ? `رسائل التواصل (${isSearching ? filteredMessages.length : messages.length})` : `Messages (${messages.length})`, icon: Mail },
          { id: 'analytics', label: isAr ? `تحليلات الكتالوجات (${isSearching ? filteredAnalytics.length : analytics.length})` : `Analytics (${analytics.length})`, icon: BarChart3 },
          { id: 'system', label: isAr ? 'حالة النظام والزوار' : 'System Status', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 px-3 font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isActive
                  ? `border-[#C9252C] ${darkMode ? 'text-white' : 'text-slate-950 font-black'}`
                  : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950'}`
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 0: كل المعروض بالموقع حالياً (مترجم بالكامل عربي/إنجليزي) ==================== */}
      {activeTab === 'overview_content' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
            <div>
              <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'مركز التحكم الشامل في كل ما هو معروض بالموقع حالياً' : 'All Currently Displayed Website Items'}</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>{isAr ? `يعرض المنتجات (${products.length})، الكتالوجات (${catalogs.length})، شهادات الأيزو (${isoList.length})، والاعتمادات (${approvalList.length})` : 'View, add, edit, or delete any displayed item'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: isAr ? 'عرض الكل' : 'All' },
                { id: 'product', label: isAr ? `المنتجات (${products.length})` : `Products (${products.length})` },
                { id: 'catalog', label: isAr ? `الكتالوجات (${catalogs.length})` : `Catalogs (${catalogs.length})` },
                { id: 'iso', label: isAr ? `شهادات الأيزو (${isoList.length})` : `ISO Certs (${isoList.length})` },
                { id: 'approval', label: isAr ? `الاعتمادات (${approvalList.length})` : `Approvals (${approvalList.length})` },
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => { setContentFilter(btn.id); setSearchQuery(''); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isSearching && contentFilter === btn.id ? 'bg-red-600 text-white shadow-md' : `${subBg} hover:opacity-80`
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {isSearching && isSystemKeyword && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <Eye className="w-5 h-5 text-purple-400" />
                  {isAr ? 'حالة نظام موقع كيانكو وإحصائيات الزوار (نتائج البحث)' : 'System Status & Visitors'}
                </h3>
                <button
                  onClick={() => setActiveTab('system')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'فتح تبويب حالة النظام ←' : 'Open System Tab'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
                  <span className={`text-xs ${textMuted}`}>{isAr ? 'إجمالي زيارات وتفاعل الموقع' : 'Total Site Visits'}</span>
                  <p className="text-2xl font-black text-purple-400">{realVisitsCount}</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
                  <span className={`text-xs ${textMuted}`}>{isAr ? 'الزوار المتواجدون الآن (مباشر)' : 'Live Online Users'}</span>
                  <p className="text-2xl font-black text-emerald-400">{liveOnlineUsers}</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
                  <span className={`text-xs ${textMuted}`}>{isAr ? 'حالة قاعدة البيانات (Supabase)' : 'Database Status'}</span>
                  <p className="text-emerald-500 font-bold">{isAr ? 'متصلة وتعمل بكفاءة (Active)' : 'Connected & Active'}</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
                  <span className={`text-xs ${textMuted}`}>{isAr ? 'الجلسة الحالية للأدمن' : 'Admin Session'}</span>
                  <p className={`font-bold ${textMain}`}>{isAr ? 'آمنة ومؤمنة عبر Supabase' : 'Secured via Supabase'}</p>
                </div>
              </div>
            </div>
          )}

          {isSearching && (isAnalyticsKeyword || filteredAnalytics.length > 0) && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  {isAr ? `تحليلات الكتالوجات والتحميلات المطابقة (${filteredAnalytics.length})` : `Matching Catalog Analytics (${filteredAnalytics.length})`}
                </h3>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'فتح تبويب التحليلات بالكامل ←' : 'Open Full Analytics Tab'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAnalytics.map((item) => {
                  const matchedDefault = DEFAULT_KIANKO_CATALOGS.find(
                    d => d.product_id.toLowerCase() === String(item.product_id || '').toLowerCase()
                  );
                  return (
                    <div key={item.id} className={`p-4 rounded-xl border flex justify-between items-center ${subBg}`}>
                      <div>
                        <p className={`font-bold text-sm ${textMain}`}>{matchedDefault ? (isAr ? matchedDefault.name_ar : matchedDefault.name_en) : item.product_id}</p>
                        <p className="text-xs font-mono text-blue-400">{item.file_name || `${item.product_id}.pdf`}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Download className="w-3.5 h-3.5" /> {item.downloads_count || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isSearching && filteredMessages.length > 0 && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <Mail className="w-5 h-5 text-blue-400" />
                  {isAr ? `رسائل التواصل المطابقة للبحث (${filteredMessages.length})` : `Matching Messages (${filteredMessages.length})`}
                </h3>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'فتح جدول الرسائل بالكامل ←' : 'Open Full Messages Tab'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMessages.slice(0, 6).map((msg, i) => (
                  <div
                    key={msg.id || i}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-4 rounded-xl border space-y-1.5 cursor-pointer transition-all hover:border-blue-500 ${subBg}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-sm ${textMain}`}>{sanitizeText(msg.name)}</span>
                      <span className={`text-[11px] ${textMuted}`}>{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="text-xs text-blue-400 font-mono truncate">{sanitizeText(msg.email)}</p>
                    <p className={`text-xs truncate ${textSub}`}>{sanitizeText(msg.message)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. قسم المنتجات المعروضة بالموقع (يتحول فوراً بين العربية والإنجليزية) */}
          {((!isSearching && (contentFilter === 'all' || contentFilter === 'product')) || (isSearching && filteredProducts.length > 0)) && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <Package className="w-5 h-5 text-red-500" />
                  {isAr ? `المنتجات المعروضة في صفحة المنتجات (${filteredProducts.length} منتج)` : `Displayed Products (${filteredProducts.length})`}
                </h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {isAr ? 'إضافة منتج جديد للمنتجات' : 'Add New Product'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod, idx) => {
                  const localizedProd = resolveProductText(prod, isAr);
                  return (
                    <div key={`${prod._source}_${prod.id || idx}`} className={`flex justify-between items-start p-4 rounded-xl border gap-3 ${subBg}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        {prod.image_url && (
                          <img
                            src={prod.image_url}
                            alt={localizedProd.name}
                            className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-900"
                          />
                        )}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">
                              {localizedProd.category}
                            </span>
                            { prod.code && (
                              <span className="font-mono text-[10px] text-blue-400 font-bold">{prod.code}</span>
                            )}
                          </div>
                          <h4 className={`font-bold text-sm truncate ${textMain}`} title={localizedProd.name}>
                            {localizedProd.name}
                          </h4>
                          {prod.file_url && (
                            <a href={prod.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline mt-0.5 font-bold">
                              <BookOpen className="w-3.5 h-3.5" /> {isAr ? 'معاينة الداتا شيت' : 'Preview Datasheet'}
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        title={isAr ? 'حذف المنتج' : 'Delete Product'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. قسم الكتالوجات الـ 6 الفنية (يتحول فوراً بين العربية والإنجليزية) */}
          {((!isSearching && (contentFilter === 'all' || contentFilter === 'catalog')) || (isSearching && filteredCatalogs.length > 0)) && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  {isAr ? `الكتالوجات الفنية المرفوعة على السيرفر (${filteredCatalogs.length} كتالوجات)` : `Technical Catalogs (${filteredCatalogs.length})`}
                </h3>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'عرض إحصائيات التحميل' : 'View Analytics'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalogs.map((cat) => (
                  <div key={cat.id} className={`p-4 rounded-xl border space-y-2 ${subBg}`}>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                        {cat.file_name}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <Download className="w-3 h-3" /> {cat.downloads_count}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm ${textMain}`}>
                      {isAr ? cat.name_ar : cat.name_en}
                    </h4>
                    {cat.file_url && (
                      <a href={cat.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> {isAr ? `معاينة الكتالوج (${cat.file_name})` : 'Preview Catalog'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. قسم الشهادات (ISO) والاعتمادات (Approvals) (يتحول فوراً بين العربية والإنجليزية) */}
          {((!isSearching && (contentFilter === 'all' || contentFilter === 'approval' || contentFilter === 'iso')) || (isSearching && filteredCertifications.length > 0)) && (
            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className={`text-base font-bold flex items-center gap-2 ${textMain}`}>
                  <Award className="w-5 h-5 text-amber-500" />
                  {isAr ? `شهادات الأيزو والاعتمادات المعروضة (${filteredCertifications.length})` : `Displayed Certifications & Approvals (${filteredCertifications.length})`}
                </h3>
                <button
                  onClick={() => setActiveTab('certifications')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {isAr ? 'إضافة شهادة أيزو أو اعتماد جديد' : 'Add ISO or Approval'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCertifications
                  .filter(c => {
                    if (!isSearching && contentFilter === 'iso') return String(c.category || '').toLowerCase() === 'iso';
                    if (!isSearching && contentFilter === 'approval') return String(c.category || '').toLowerCase() !== 'iso';
                    return true;
                  })
                  .map(cert => {
                    const localizedCert = resolveCertText(cert, isAr);
                    return (
                      <div key={cert.id} className={`flex justify-between items-start p-4 rounded-xl border gap-3 ${subBg}`}>
                        <div className="space-y-1 min-w-0">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black text-white ${
                            cert.category === 'iso' ? 'bg-amber-600' : 'bg-red-600'
                          }`}>
                            {cert.category === 'iso' ? (isAr ? 'شهادة أيزو ISO' : 'ISO Certificate') : (isAr ? 'اعتماد رسمي' : 'Official Approval')}
                          </span>
                          <h4 className={`font-bold text-sm truncate ${textMain}`} title={localizedCert.title}>
                            {localizedCert.title}
                          </h4>
                          <p className={`text-xs line-clamp-1 ${textMuted}`} title={localizedCert.issuer}>
                            <span className="text-amber-500 font-bold">{localizedCert.issuer}</span> | {cert.code || '—'}
                          </p>
                          {cert.file_url && (
                            <a href={cert.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline mt-1 font-bold">
                              <ExternalLink className="w-3.5 h-3.5" /> {isAr ? 'معاينة المستند المرفق' : 'View Attached File'}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {cert._source === 'certifications' && (
                            <button
                              onClick={() => startEditCert(cert)}
                              className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors cursor-pointer"
                              title={isAr ? 'تعديل' : 'Edit'}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCert(cert)}
                            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {isSearching && totalSearchMatches === 0 && (
            <div className={`p-12 rounded-2xl border text-center space-y-3 ${cardBg}`}>
              <Search className="w-10 h-10 text-red-500 mx-auto opacity-80" />
              <h3 className={`text-base font-bold ${textMain}`}>
                {isAr ? `لا توجد أي نتائج مطابقة لـ "${searchQuery}" في جميع أقسام اللوحة` : `No results found for "${searchQuery}"`}
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                {isAr ? 'مسح البحث وعرض الكل' : 'Clear Search'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 1: Analytics ==================== */}
      {activeTab === 'analytics' && (
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`p-6 border-b flex justify-between items-center flex-wrap gap-4 ${borderCol}`}>
            <div>
              <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? `تفاصيل التحميلات حسب الكتالوج (${filteredAnalytics.length} كتالوجات)` : 'Downloads Breakdown by Catalog'}</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>
                {isAr ? 'يعرض جميع الكتالوجات الـ 6 المرفوعة في السيرفر وعدد مرات تحميل كل كتالوج' : 'Shows all 6 uploaded catalogs and download counts'}
              </p>
            </div>
          </div>
          {loading ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'جاري تحميل البيانات...' : 'Loading data...'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} ${textSub}`}>
                <thead className={`text-xs font-bold uppercase border-b ${tableHeadBg} ${borderCol}`}>
                  <tr>
                    <th className="px-6 py-4">{isAr ? 'معرّف الكتالوج (ID)' : 'Catalog ID'}</th>
                    <th className="px-6 py-4">{isAr ? 'اسم ملف الكتالوج في السيرفر' : 'Datasheet File'}</th>
                    <th className="px-6 py-4 text-center">{isAr ? 'عدد التحميلات' : 'Downloads Count'}</th>
                    <th className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'آخر تحميل' : 'Last Download'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divideCol}`}>
                  {filteredAnalytics.map((item) => {
                    const matchedDefault = DEFAULT_KIANKO_CATALOGS.find(
                      d => d.product_id.toLowerCase() === String(item.product_id || '').toLowerCase()
                    );
                    const fileName = item.file_name || matchedDefault?.file_name || `${item.product_id}.pdf`;

                    return (
                      <tr key={item.id} className={`transition-colors ${rowHover}`}>
                        <td className={`px-6 py-4 font-bold ${textMain}`}>
                          <div>{item.product_id}</div>
                          {matchedDefault && (
                            <div className={`text-xs font-normal ${textMuted}`}>
                              {isAr ? matchedDefault.name_ar : matchedDefault.name_en}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-400">{fileName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                            (item.downloads_count || 0) > 0
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                              : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                          }`}>
                            <Download className="w-3.5 h-3.5" />
                            {item.downloads_count || 0}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} text-xs ${textMuted}`}>
                          {formatDate(item.updated_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: Messages ==================== */}
      {activeTab === 'messages' && (
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`p-6 border-b flex justify-between items-center flex-wrap gap-4 ${borderCol}`}>
            <div>
              <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'رسائل التواصل الواردة - شركة كيانكو' : 'Incoming Contact Messages'}</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>
                {isAr
                  ? `إجمالي الرسائل المعروضة (${filteredMessages.length}) - مقسمة على (${totalMsgPages}) صفحات لسهولة التصفح`
                  : `Total (${filteredMessages.length}) messages across (${totalMsgPages}) pages`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCleanTestMessages}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> {isAr ? 'تنظيف الرسائل التجريبية' : 'Clean Test Messages'}
              </button>
              <button
                onClick={() => exportReport('pdf')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <FileDown className="w-4 h-4" /> {isAr ? 'طباعة / PDF رسمي' : 'Print / PDF'}
              </button>
              <button
                onClick={() => exportReport('word')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <FileText className="w-4 h-4" /> {isAr ? 'تصدير Word منسق' : 'Export Word'}
              </button>
              <button
                onClick={() => exportReport('excel')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> {isAr ? 'تصدير Excel جدول' : 'Export Excel'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</div>
          ) : filteredMessages.length === 0 ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'لا توجد رسائل مطابقة للبحث حالياً.' : 'No contact messages found.'}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} ${textSub}`}>
                  <thead className={`text-xs font-bold uppercase border-b ${tableHeadBg} ${borderCol}`}>
                    <tr>
                      <th className="px-4 py-4 text-center">#</th>
                      <th className="px-5 py-4">{isAr ? 'الاسم' : 'Name'}</th>
                      <th className="px-5 py-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                      <th className="px-5 py-4">{isAr ? 'رقم الجوال' : 'Phone'}</th>
                      <th className="px-5 py-4">{isAr ? 'الرسالة' : 'Message'}</th>
                      <th className="px-5 py-4 text-center">{isAr ? 'التاريخ' : 'Date'}</th>
                      <th className="px-5 py-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${divideCol}`}>
                    {paginatedMessages.map((msg, idx) => {
                      const serialNumber = msgStartIndex + idx + 1;
                      return (
                        <tr key={msg.id || serialNumber} className={`transition-colors ${rowHover}`}>
                          <td className={`px-4 py-4 text-center font-bold text-xs ${textMuted}`}>{serialNumber}</td>
                          <td className={`px-5 py-4 font-bold ${textMain}`}>{sanitizeText(msg.name)}</td>
                          <td className={`px-5 py-4 font-mono text-xs ${textSub}`}>{sanitizeText(msg.email)}</td>
                          <td className={`px-5 py-4 font-mono text-xs ${textSub}`} dir="ltr">{sanitizeText(msg.phone)}</td>
                          <td
                            onClick={() => setSelectedMessage(msg)}
                            className={`px-5 py-4 max-w-xs truncate cursor-pointer hover:text-red-400 ${textSub}`}
                          >
                            {sanitizeText(msg.message)}
                          </td>
                          <td className={`px-5 py-4 text-center text-xs whitespace-nowrap ${textMuted}`}>
                            {formatDate(msg.created_at)}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedMessage(msg)}
                                className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${borderCol} ${tableHeadBg}`}>
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <span className={textMuted}>
                    {isAr
                      ? `عرض ${msgStartIndex + 1} إلى ${Math.min(msgStartIndex + msgsPerPage, filteredMessages.length)} من أصل ${filteredMessages.length} رسالة`
                      : `Showing ${msgStartIndex + 1} to ${Math.min(msgStartIndex + msgsPerPage, filteredMessages.length)} of ${filteredMessages.length} messages`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={textMuted}>{isAr ? '| عدد الصفوف:' : '| Rows:'}</span>
                    <select
                      value={msgsPerPage}
                      onChange={(e) => setMsgsPerPage(Number(e.target.value))}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${subBg}`}
                    >
                      <option value={8}>{isAr ? '8 رسائل / صفحة' : '8 / page'}</option>
                      <option value={15}>{isAr ? '15 رسالة / صفحة' : '15 / page'}</option>
                      <option value={30}>{isAr ? '30 رسالة / صفحة' : '30 / page'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    disabled={safeMsgPage <= 1}
                    onClick={() => setCurrentMsgPage(p => Math.max(1, p - 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${subBg} hover:border-red-500`}
                  >
                    {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    <span>{isAr ? 'السابق' : 'Prev'}</span>
                  </button>

                  {Array.from({ length: totalMsgPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentMsgPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        safeMsgPage === pageNum
                          ? 'bg-[#C9252C] text-white shadow-md scale-105'
                          : `border ${subBg} hover:border-red-500`
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeMsgPage >= totalMsgPages}
                    onClick={() => setCurrentMsgPage(p => Math.min(totalMsgPages, p + 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${subBg} hover:border-red-500`}
                  >
                    <span>{isAr ? 'التالي' : 'Next'}</span>
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ==================== TAB 3: Jobs Management ==================== */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
                <Plus className="w-5 h-5 text-red-500" />
                {editingJobId ? (isAr ? 'تعديل الوظيفة المختارة' : 'Edit Career Opening') : (isAr ? 'إضافة وظيفة جديدة (تظهر في صفحة الوظائف)' : 'Add New Career Opening')}
              </h2>
              {editingJobId && (
                <button
                  type="button"
                  onClick={() => { setEditingJobId(null); setNewJob({ title: '', department: '', location: '', description: '' }); }}
                  className="text-xs text-red-400 hover:underline font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
                </button>
              )}
            </div>

            {jobFormError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jobFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddOrUpdateJob} className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isAr ? 'المسمى الوظيفي (مثال: مهندس مبيعات)' : 'Job Title (e.g. Sales Engineer)'}
                value={newJob.title}
                onChange={(e) => { setNewJob({ ...newJob, title: e.target.value }); setJobFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={3}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'القسم (مثال: المبيعات / الهندسة)' : 'Department (e.g. Sales)'}
                value={newJob.department}
                onChange={(e) => { setNewJob({ ...newJob, department: e.target.value }); setJobFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={2}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'المكان (مثال: الرياض / جدة)' : 'Location (e.g. Riyadh / Jeddah)'}
                value={newJob.location}
                onChange={(e) => { setNewJob({ ...newJob, location: e.target.value }); setJobFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={2}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'وصف مختصر (10 أحرف على الأقل)' : 'Brief Description (min 10 chars)'}
                value={newJob.description}
                onChange={(e) => { setNewJob({ ...newJob, description: e.target.value }); setJobFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={10}
                required
              />
              <button type="submit" className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer shadow-lg active:scale-95">
                {editingJobId ? (isAr ? 'حفظ التعديلات على الوظيفة' : 'Save Changes') : (isAr ? 'نشر الوظيفة في صفحة الوظائف' : 'Publish Job')}
              </button>
            </form>
          </div>

          <div className={`rounded-2xl border overflow-hidden p-6 ${cardBg}`}>
            <h2 className={`text-lg font-bold mb-4 ${textMain}`}>{isAr ? `الوظائف الحالية (${filteredJobs.length})` : `Current Careers (${filteredJobs.length})`}</h2>
            {filteredJobs.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>{isAr ? 'لا توجد وظائف مضافة حالياً.' : 'No careers added.'}</p>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => {
                  const jobTitle = isAr ? (job.title_ar || job.title) : (job.title_en || job.title);
                  const jobDept = isAr ? (job.dept_ar || job.department) : (job.dept_en || job.department);
                  const jobLoc = isAr ? (job.loc_ar || job.location) : (job.loc_en || job.location);
                  const isBlankJob = !jobTitle || !String(jobTitle).trim();

                  return (
                    <div key={job.id} className={`flex justify-between items-center p-4 border rounded-xl gap-4 ${subBg}`}>
                      <div className="space-y-1">
                        <h4 className={`font-bold text-sm ${isBlankJob ? 'text-red-400 italic' : textMain}`}>
                          {isBlankJob ? (isAr ? '(وظيفة فارغة بدون عنوان - يُرجى حذفها)' : '(Empty Job Entry - Please Delete)') : jobTitle}
                        </h4>
                        <p className={`text-xs ${textMuted}`}>
                          {sanitizeText(jobDept)} | {sanitizeText(jobLoc)}
                        </p>
                        {job.description && String(job.description).trim() && (
                          <p className={`text-xs ${textSub} opacity-80`}>{job.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {job._source === 'db' && (
                          <button
                            onClick={() => startEditJob(job)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                          >
                            <Edit3 className="w-4 h-4" /> {isAr ? 'تعديل' : 'Edit'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                        >
                          <Trash2 className="w-4 h-4" /> {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: Certifications (ISO) & Approvals (مترجم بالكامل عربي/إنجليزي) ==================== */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
                <Award className="w-5 h-5 text-amber-500" />
                {editingCertId ? (isAr ? 'تعديل بيانات الشهادة / الاعتماد' : 'Edit Document') : (isAr ? 'إضافة شهادة أيزو (ISO) أو اعتماد مشاريع جديد' : 'Add ISO or Approval Document')}
              </h2>
              {editingCertId && (
                <button
                  type="button"
                  onClick={() => { setEditingCertId(null); setNewCert({ title: '', issuer: '', year: '2026', file_url: '', category: 'approval', code: 'ASTM-01' }); }}
                  className="text-xs text-red-400 hover:underline font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء التعديل' : 'Cancel Edit'}
                </button>
              )}
            </div>

            {certFormError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{certFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddOrUpdateCert} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'اختر القسم الذي سيظهر فيه المستند:' : 'Target Section:'}</label>
                <select
                  value={newCert.category}
                  onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-bold ${subBg} cursor-pointer`}
                >
                  <option value="approval">{isAr ? 'قسم اعتمادات المشاريع (يظهر في صفحة الاعتمادات + سليدر الصفحة الرئيسية)' : 'Official Approvals Section & Home Slider'}</option>
                  <option value="iso">{isAr ? 'قسم شهادات الأيزو ISO (يظهر في صفحة الأيزو + سليدر الصفحة الرئيسية)' : 'ISO Certifications Section & Home Slider'}</option>
                </select>
              </div>

              <input
                type="text"
                placeholder={isAr ? 'عنوان الشهادة أو الاعتماد (مثال: شهادة ISO 9001 أو اعتماد أرامكو)' : 'Document Title'}
                value={newCert.title}
                onChange={(e) => { setNewCert({ ...newCert, title: e.target.value }); setCertFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={3}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'الجهة المانحة / المشروع (مثال: أرامكو / سابك / نيوم)' : 'Issuer / Project'}
                value={newCert.issuer}
                onChange={(e) => { setNewCert({ ...newCert, issuer: e.target.value }); setCertFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={2}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'الكود (مثال: ISO-9001 أو APP-01)' : 'Code'}
                value={newCert.code}
                onChange={(e) => { setNewCert({ ...newCert, code: e.target.value }); setCertFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={2}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'السنة (مثال: 2026)' : 'Year'}
                value={newCert.year}
                onChange={(e) => { setNewCert({ ...newCert, year: e.target.value }); setCertFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                maxLength={4}
                required
              />
              
              <div className="sm:col-span-2 space-y-2">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'ملف الـ PDF أو صورة الشهادة / الاعتماد' : 'File'}</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-all hover:border-red-500 ${subBg}`}>
                  <Upload className="w-8 h-8 text-red-500 animate-bounce" />
                  <span className="text-xs font-bold">
                    {newCert.file_url ? (isAr ? '✓ تم تجهيز وربط الملف بنجاح' : '✓ File uploaded successfully') : (isAr ? 'اضغط هنا لرفع ملف PDF أو صورة الشهادة / الاعتماد' : 'Click to upload PDF or image')}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingFile(true);
                      try {
                        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                        const { error } = await supabase.storage.from('certificates').upload(fileName, file);
                        if (error) throw error;
                        const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
                        setNewCert({ ...newCert, file_url: urlData.publicUrl });
                        showToast(isAr ? 'تم رفع الملف بنجاح!' : 'File uploaded successfully!');
                      } catch (err) {
                        showToast(isAr ? `خطأ أثناء رفع الملف: ${err.message}` : 'Error uploading file', 'error');
                      } finally {
                        setUploadingFile(false);
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                {uploadingFile && <p className="text-xs text-amber-500 mt-1 font-bold">{isAr ? 'جاري رفع الملف للسيرفر...' : 'Uploading...'}</p>}
              </div>

              <button type="submit" className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all cursor-pointer shadow-lg active:scale-95">
                {editingCertId
                  ? (isAr ? 'حفظ التعديلات' : 'Update Document')
                  : newCert.category === 'iso'
                  ? (isAr ? 'نشر في صفحة شهادات الأيزو وسليدر الرئيسية' : 'Publish to ISO Page & Home Slider')
                  : (isAr ? 'نشر في صفحة الاعتمادات وسليدر الرئيسية' : 'Publish to Approvals Page & Home Slider')}
              </button>
            </form>
          </div>

          <div className={`rounded-2xl border overflow-hidden p-6 ${cardBg}`}>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? `الشهادات والاعتمادات المعروضة حالياً (${filteredCertifications.length})` : `Current Documents (${filteredCertifications.length})`}</h2>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: isAr ? `الكل (${filteredCertifications.length})` : `All (${filteredCertifications.length})` },
                  { id: 'iso', label: isAr ? `شهادات الأيزو (${isoList.length})` : `ISO Only (${isoList.length})` },
                  { id: 'approval', label: isAr ? `الاعتمادات (${approvalList.length})` : `Approvals Only (${approvalList.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCertSubFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      certSubFilter === tab.id ? 'bg-amber-600 text-white' : `${subBg}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredCertifications.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>{isAr ? 'لا توجد مستندات مطابقة حالياً.' : 'No documents found.'}</p>
            ) : (
              <div className="space-y-3">
                {filteredCertifications
                  .filter(c => {
                    if (certSubFilter === 'iso') return String(c.category || '').toLowerCase() === 'iso';
                    if (certSubFilter === 'approval') return String(c.category || '').toLowerCase() !== 'iso';
                    return true;
                  })
                  .map((cert) => {
                    const cat = String(cert.category || '').toLowerCase();
                    const badgeLabel = cat === 'iso'
                      ? (isAr ? 'شهادة أيزو ISO' : 'ISO Certificate')
                      : (isAr ? 'اعتماد رسمي' : 'Project Approval');
                    const badgeColor = cat === 'iso' ? 'bg-amber-600' : 'bg-red-600';
                    const localizedCert = resolveCertText(cert, isAr);

                    return (
                      <div key={cert.id} className={`flex justify-between items-center p-4 border rounded-xl gap-4 ${subBg}`}>
                        <div className="space-y-1 text-start min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-black text-white shadow-xs ${badgeColor}`}>
                              {badgeLabel}
                            </span>
                            <h4 className={`font-bold text-base truncate ${textMain}`}>{localizedCert.title}</h4>
                          </div>
                          <p className={`text-xs font-semibold ${textMuted}`}>
                            {isAr ? 'الجهة / الوصف: ' : 'Issuer / Details: '}<span className="text-amber-500 font-bold">{localizedCert.issuer}</span> | {isAr ? 'الكود: ' : 'Code: '}<span className="font-mono font-bold">{cert.code || '—'}</span>
                          </p>
                          {cert.file_url && (
                            <a href={cert.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline inline-block mt-1 font-bold">
                              {isAr ? '🔗 معاينة أو تحميل الملف المرفق' : '🔗 View Attached File'}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {cert._source === 'certifications' && (
                            <button
                              onClick={() => startEditCert(cert)}
                              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                            >
                              <Edit3 className="w-4 h-4" /> {isAr ? 'تعديل' : 'Edit'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCert(cert)}
                            className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                          >
                            <Trash2 className="w-4 h-4" /> {isAr ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: Products Management (مترجم بالكامل عربي/إنجليزي) ==================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
              <Package className="w-5 h-5 text-red-500" /> {isAr ? 'إضافة منتج جديد (يُضاف في صفحة المنتجات فقط)' : 'Add New Product (Products Page Only)'}
            </h2>

            {productFormError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{productFormError}</span>
              </div>
            )}

            <form onSubmit={handleAddOrUpdateProduct} className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isAr ? 'اسم المنتج (مثال: حوامل الكابلات الشبكية)' : 'Product Name'}
                value={newProduct.name}
                onChange={(e) => { setNewProduct({ ...newProduct, name: e.target.value }); setProductFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={3}
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => { setNewProduct({ ...newProduct, category: e.target.value }); setProductFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm font-bold cursor-pointer ${subBg}`}
              >
                <option value="أنظمة إدارة الكابلات">{isAr ? 'أنظمة إدارة الكابلات (Cable Management)' : 'Cable Management Systems'}</option>
                <option value="مقاطع المباني والمحارة">{isAr ? 'مقاطع المباني والمحارة (Plastering & Profiles)' : 'Building & Plastering Profiles'}</option>
              </select>
              <input
                type="text"
                placeholder={isAr ? 'كود المنتج أو المواصفة (مثال: ASTM A53 / A20)' : 'Product Code / Standard'}
                value={newProduct.code}
                onChange={(e) => { setNewProduct({ ...newProduct, code: e.target.value }); setProductFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'وصف المنتج ومواصفاته الفنية (5 أحرف على الأقل)' : 'Product Description'}
                value={newProduct.description}
                onChange={(e) => { setNewProduct({ ...newProduct, description: e.target.value }); setProductFormError(''); }}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                minLength={5}
                required
              />

              <div className="space-y-2">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'صورة المنتج (اختياري)' : 'Product Image'}</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 text-center space-y-1.5 cursor-pointer transition-all hover:border-red-500 ${subBg}`}>
                  <Upload className="w-6 h-6 text-red-500" />
                  <span className="text-xs font-bold">
                    {newProduct.image_url ? (isAr ? '✓ تم تجهيز صورة المنتج' : '✓ Image ready') : (isAr ? 'اضغط لرفع صورة المنتج' : 'Upload Product Image')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingProductImg(true);
                      try {
                        const fileName = `prod_img_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                        const { error } = await supabase.storage.from('certificates').upload(fileName, file);
                        if (error) throw error;
                        const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
                        setNewProduct({ ...newProduct, image_url: urlData.publicUrl });
                        showToast(isAr ? 'تم رفع صورة المنتج!' : 'Image uploaded!');
                      } catch (err) {
                        showToast(err.message, 'error');
                      } finally {
                        setUploadingProductImg(false);
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                {uploadingProductImg && <p className="text-xs text-amber-500 font-bold">{isAr ? 'جاري رفع الصورة...' : 'Uploading image...'}</p>}
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'ملف الداتا شيت PDF للمنتج (اختياري)' : 'Product Datasheet PDF'}</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 text-center space-y-1.5 cursor-pointer transition-all hover:border-red-500 ${subBg}`}>
                  <BookOpen className="w-6 h-6 text-amber-500" />
                  <span className="text-xs font-bold">
                    {newProduct.file_url ? (isAr ? '✓ تم رفع ملف الداتا شيت PDF' : '✓ Datasheet PDF ready') : (isAr ? 'اضغط لرفع ملف الداتا شيت (PDF)' : 'Upload Datasheet PDF')}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingProductPdf(true);
                      try {
                        const fileName = `${file.name.replace(/\s+/g, '_')}`;
                        const { error } = await supabase.storage.from('certificates').upload(fileName, file, { upsert: true });
                        if (error) throw error;
                        const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
                        setNewProduct({ ...newProduct, file_url: urlData.publicUrl });
                        showToast(isAr ? 'تم رفع ملف الداتا شيت بنجاح!' : 'Datasheet uploaded!');
                      } catch (err) {
                        showToast(err.message, 'error');
                      } finally {
                        setUploadingProductPdf(false);
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                {uploadingProductPdf && <p className="text-xs text-amber-500 font-bold">{isAr ? 'جاري رفع الملف...' : 'Uploading...'}</p>}
              </div>

              <button type="submit" className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer shadow-lg active:scale-95">
                {isAr ? 'إضافة ونشر المنتج في صفحة المنتجات' : 'Publish Product to Products Page'}
              </button>
            </form>
          </div>

          <div className={`rounded-2xl border overflow-hidden p-6 ${cardBg}`}>
            <h2 className={`text-lg font-bold mb-4 ${textMain}`}>
              {isAr ? `جميع المنتجات المعروضة في الموقع (${filteredProducts.length} منتج)` : `Current Displayed Products (${filteredProducts.length})`}
            </h2>

            {filteredProducts.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>{isAr ? 'لا توجد منتجات مطابقة للبحث حالياً.' : 'No products found.'}</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod, idx) => {
                  const localizedProd = resolveProductText(prod, isAr);
                  const prodImg = prod.image_url || prod.image || '';
                  const prodPdf = prod.file_url || prod.pdf_url || '';

                  return (
                    <div key={`${prod._source}_${prod.id || idx}`} className={`flex justify-between items-start p-4 border rounded-xl gap-3 ${subBg}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        {prodImg && (
                          <img
                            src={prodImg}
                            alt={localizedProd.name}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-900"
                          />
                        )}
                        <div className="space-y-1.5 text-start min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">
                              {localizedProd.category}
                            </span>
                            {localizedProd.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                                {localizedProd.badge}
                              </span>
                            )}
                            {prod.code && (
                              <span className="font-mono text-[10px] text-blue-400 font-bold">{prod.code}</span>
                            )}
                          </div>
                          <h4 className={`font-bold text-sm ${textMain}`}>{localizedProd.name}</h4>
                          {localizedProd.description && <p className={`text-xs ${textMuted}`}>{localizedProd.description}</p>}
                          {prodPdf && (
                            <a href={prodPdf} target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline inline-block mt-1 font-bold">
                              {isAr ? '📄 تحميل الداتا شيت' : '📄 View Datasheet'}
                            </a>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow shrink-0"
                      >
                        <Trash2 className="w-4 h-4" /> {isAr ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: System Status & Real Visitor Stats ==================== */}
      {activeTab === 'system' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'حالة نظام موقع كيانكو وإحصائيات الزوار الفعلية (Live)' : 'KIANKO System Status & Real Visitors'}</h2>
              <p className={`text-xs mt-1 ${textMuted}`}>
                {isAr ? 'أرقام حقيقية ومباشرة مربوطة بـ Supabase Realtime وقاعدة البيانات بدون أي أرقام ثابتة' : '100% Real-time stats via Supabase Presence & Database'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetRealVisits}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              {isAr ? 'تصفير عداد الزيارات وبدء العد من (1)' : 'Reset Visits Counter to 1'}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'إجمالي زيارات وتفاعل الموقع' : 'Total Real Website Activity'}</span>
              <p className="text-2xl font-black text-purple-400">{realVisitsCount}</p>
            </div>
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'الزوار المتواجدون الآن (مباشر)' : 'Live Active Visitors Now'}</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <p className="text-2xl font-black text-emerald-400">{liveOnlineUsers}</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'حالة قاعدة البيانات (Supabase)' : 'Database Status'}</span>
              <p className="text-emerald-500 font-bold">{isAr ? 'متصلة وتعمل بكفاءة عالية (Active)' : 'Connected & Active'}</p>
            </div>
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'الجلسة الحالية للأدمن' : 'Admin Session'}</span>
              <p className={`font-bold ${textMain}`}>{isAr ? 'آمنة ومؤمنة عبر Supabase' : 'Secured via Supabase'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}