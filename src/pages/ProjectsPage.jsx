import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2, MapPin, Calendar, CheckCircle2, ArrowRight,
  Search, X, ShieldCheck, Layers, Factory, Zap, Award,
  ChevronLeft, ChevronRight, FileCheck, Package
} from 'lucide-react';
import { useProjects } from '../hooks/useContent';
import { ROUTES } from '../routes';
import SpotlightCard from '../components/ui/SpotlightCard';

const PROJECTS_PER_PAGE = 6;

// قائمة المشاريع الإقليمية الكبرى المعتمدة لشركة كيانكو (باللغتين العربية والإنجليزية)
const KIANKO_REGIONAL_PROJECTS = [
  {
    id: 'proj-neom',
    code: 'NEOM-2026',
    sector: 'giga',
    sectorAr: 'مشاريع رؤية 2030 الكبرى',
    sectorEn: 'Vision 2030 Giga Projects',
    nameAr: 'مشروع مدينة نيوم — البنية التحتية والمرافق',
    name: 'NEOM Mega City — Infrastructure & Utilities',
    clientAr: 'شركة نيوم (NEOM)',
    clientEn: 'NEOM Company',
    locationAr: 'نيوم، تبوك — المملكة العربية السعودية',
    location: 'NEOM, Tabuk — Saudi Arabia',
    year: '2025 - 2026',
    statusAr: 'معتمد وجاري التوريد',
    statusEn: 'Approved & Active Supply',
    img: '/Image/ladder.webp',
    descAr: 'توريد واعتماد أنظمة سلالم الكابلات للخدمة الشاقة وحوامل الكابلات المثقبة المقاومة للظروف البيئية القاسية لشبكات الطاقة والاتصالات.',
    descEn: 'Supply and approval of heavy-duty cable ladders and corrosion-resistant perforated cable trays for power and telecom networks.',
    scopeAr: ['سلالم الكابلات الثقيلة (Heavy Duty Ladders)', 'حوامل الكابلات المثقبة المجلفنة', 'أنظمة التدعيم والـ C-Channel'],
    scopeEn: ['Heavy-Duty Cable Ladders', 'Galvanized Perforated Trays', 'Strut Channels & Supports'],
  },
  {
    id: 'proj-aramco',
    code: 'ARAMCO-PQL',
    sector: 'energy',
    sectorAr: 'الطاقة والصناعة والمياه',
    sectorEn: 'Energy, Industrial & Water',
    nameAr: 'مشاريع منشآت أرامكو السعودية — المنطقة الشرقية',
    name: 'Saudi Aramco Industrial Facilities — Eastern Province',
    clientAr: 'أرامكو السعودية (Saudi Aramco)',
    clientEn: 'Saudi Aramco',
    locationAr: 'الظهران / الجبيل — المملكة العربية السعودية',
    location: 'Dhahran / Jubail — Saudi Arabia',
    year: '2025 - 2026',
    statusAr: 'مورد معتمد وموثق',
    statusEn: 'Approved Vendor Supply',
    img: '/Image/basket.webp',
    descAr: 'توريد أنظمة إدارة الكابلات الصناعية وحوامل الكابلات الشبكية والدعامات الفولاذية المطابقة لأعلى المواصفات القياسية في قطاع النفط والغاز.',
    descEn: 'Supplying industrial cable management systems, wire mesh trays, and structural supports compliant with oil & gas standards.',
    scopeAr: ['حوامل الكابلات الشبكية (Basket Trays)', 'سلالم الكابلات المقاومة للتآكل', 'مشابك الكمرات الثقيلة (Beam Clamps)'],
    scopeEn: ['Wire Mesh Basket Trays', 'Corrosion-Resistant Cable Ladders', 'Heavy-Duty Beam Clamps'],
  },
  {
    id: 'proj-new-murabba',
    code: 'MURABBA-RYD',
    sector: 'giga',
    sectorAr: 'مشاريع رؤية 2030 الكبرى',
    sectorEn: 'Vision 2030 Giga Projects',
    nameAr: 'مشروع المربع الجديد — الوجهة الحضرية بالرياض',
    name: 'New Murabba Development — Riyadh Downtown',
    clientAr: 'شركة تطوير المربع الجديد',
    clientEn: 'New Murabba Development Co.',
    locationAr: 'الرياض — المملكة العربية السعودية',
    location: 'Riyadh — Saudi Arabia',
    year: '2026',
    statusAr: 'اعتماد رسمي وتوريد',
    statusEn: 'Official Approval & Supply',
    img: '/Image/tray.webp',
    descAr: 'اعتماد وتوريد خطوط متكاملة من مجاري الكابلات المغلقة (Trunking) وحوامل الكابلات ومقاطع تدعيم المباني والمنشآت الحديثة.',
    descEn: 'Approved supply of integrated cable trunking systems, cable trays, and structural building profiles.',
    scopeAr: ['أنظمة ترنكنج الكابلات (Cable Trunking)', 'حوامل الكابلات المثقبة', 'مقاطع وهياكل القواطع المعدنية'],
    scopeEn: ['Cable Trunking Systems', 'Perforated Cable Trays', 'Drywall & Partition Framing'],
  },
  {
    id: 'proj-king-salman-park',
    code: 'KSP-RYD',
    sector: 'giga',
    sectorAr: 'مشاريع رؤية 2030 الكبرى',
    sectorEn: 'Vision 2030 Giga Projects',
    nameAr: 'مشروع حديقة الملك سلمان — المرافق والمباني الثقافية',
    name: 'King Salman Park — Cultural & Utility Complexes',
    clientAr: 'مؤسسة حديقة الملك سلمان',
    clientEn: 'King Salman Park Foundation',
    locationAr: 'الرياض — المملكة العربية السعودية',
    location: 'Riyadh — Saudi Arabia',
    year: '2025 - 2026',
    statusAr: 'معتمد ومكتمل التوريد',
    statusEn: 'Approved & Supplied',
    img: '/Image/channels.webp',
    descAr: 'توريد أنظمة القطاعات المعدنية والدعامات الهندسية وإكسسوارات اللياسة والمباني للمنشآت الخدمية والأنفاق والمجمعات الثقافية.',
    descEn: 'Supplying structural support channels, mounting brackets, and plastering accessories for utility tunnels and complexes.',
    scopeAr: ['أنظمة القطاعات والتدعيم (Strut Channels)', 'كتائب وحوامل الإدارة', 'زوايا وشبك اللياسة الممدد'],
    scopeEn: ['Strut Channels & Supports', 'Management Brackets', 'Expanded Metal Mesh & Beads'],
  },
  {
    id: 'proj-masar-makkah',
    code: 'MASAR-MKH',
    sector: 'urban',
    sectorAr: 'التطوير العمراني والبنية التحتية',
    sectorEn: 'Urban & Infrastructure',
    nameAr: 'مشروع وجهة مسار مكة — الأبراج والفنادق المركزية',
    name: 'Masar Makkah Destination — Towers & Hospitality',
    clientAr: 'شركة أم القرى للتنمية والإعمار',
    clientEn: 'Umm Al-Qura for Development',
    locationAr: 'مكة المكرمة — المملكة العربية السعودية',
    location: 'Makkah — Saudi Arabia',
    year: '2025 - 2026',
    statusAr: 'معتمد وجاري التوريد',
    statusEn: 'Approved & Active Supply',
    img: '/Image/plastering.webp',
    descAr: 'توريد واسع النطاق لملحقات البلوك والمحارة، الزوايا الفولاذية المجلفنة، وحوامل الكابلات الكهربائية للأبراج الفندقية ومحطات المسار.',
    descEn: 'Large-scale supply of blockwork & plastering accessories, galvanized angle beads, and electrical cable trays.',
    scopeAr: ['ملحقات المحارة والبلوك', 'زوايا فولاذية وشبك ممدد', 'حوامل الكابلات المثقبة والشبكية'],
    scopeEn: ['Plastering & Blockwork Accessories', 'Steel Angle Beads & Mesh', 'Perforated & Mesh Cable Trays'],
  },
  {
    id: 'proj-seven',
    code: 'SEVEN-KSA',
    sector: 'giga',
    sectorAr: 'مشاريع رؤية 2030 الكبرى',
    sectorEn: 'Vision 2030 Giga Projects',
    nameAr: 'مشاريع الوجهات الترفيهية — شركة سفن (SEVEN)',
    name: 'SEVEN Entertainment Destinations — Multi-City',
    clientAr: 'شركة مشاريع الترفيه السعودية (سفن)',
    clientEn: 'Saudi Entertainment Ventures (SEVEN)',
    locationAr: 'الرياض / جدة / الدمام — السعودية',
    location: 'Riyadh / Jeddah / Dammam — KSA',
    year: '2025 - 2026',
    statusAr: 'اعتماد رسمي وتوريد',
    statusEn: 'Official Approval & Supply',
    img: '/Image/trunking.webp',
    descAr: 'توريد أنظمة مجاري الكابلات المغلقة والشبكية وهياكل الجبس بورد والقواطع المعدنية لتجهيز المجمعات الترفيهية الكبرى.',
    descEn: 'Supplying enclosed cable trunking, wire mesh trays, and drywall framing systems for entertainment complexes.',
    scopeAr: ['أنظمة ترنكنج الكابلات', 'أنظمة هياكل الجبس بورد', 'حوامل كابلات شبكية بسلك معدني'],
    scopeEn: ['Cable Trunking Systems', 'Drywall Framing Systems', 'Wire Mesh Basket Trays'],
  },
  {
    id: 'proj-water',
    code: 'NWC-WATER',
    sector: 'energy',
    sectorAr: 'الطاقة والصناعة والمياه',
    sectorEn: 'Energy, Industrial & Water',
    nameAr: 'المشروع الوطني للمياه ومحطات التحلية والضخ',
    name: 'National Water Project & Desalination Plants',
    clientAr: 'قطاع المياه والمشاريع الاستراتيجية',
    clientEn: 'National Water & Utility Sector',
    locationAr: 'جدة / الرياض / ينبع — السعودية',
    location: 'Jeddah / Riyadh / Yanbu — KSA',
    year: '2025 - 2026',
    statusAr: 'معتمد ومكتمل التوريد',
    statusEn: 'Approved & Completed',
    img: '/Image/C-Channels.webp',
    descAr: 'توريد قطاعات وحوامل كابلات مجلفنة بالغمس الساخن لمقاومة الرطوبة والأملاح العالية في محطات معالجة وضخ المياه.',
    descEn: 'Supplying hot-dip galvanized cable trays and C-channels engineered for high-humidity water treatment plants.',
    scopeAr: ['قطاعات سي شانل المعدنية', 'سلالم الكابلات الثقيلة المجلفنة', 'إكسسوارات التثبيت المقاومة للصدأ'],
    scopeEn: ['Galvanized C-Channels', 'Heavy-Duty Cable Ladders', 'Anti-Corrosion Mounting Hardware'],
  },
  {
    id: 'proj-hill-prime',
    code: 'HILL-PRIME',
    sector: 'urban',
    sectorAr: 'التطوير العمراني والبنية التحتية',
    sectorEn: 'Urban & Infrastructure',
    nameAr: 'مجمعات وأبراج برايم وإشراف هيل إنترناشونال',
    name: 'Prime Commercial Towers & Hill International Projects',
    clientAr: 'هيل إنترناشونال / مشاريع برايم',
    clientEn: 'Hill International / Prime Projects',
    locationAr: 'جدة / الرياض — المملكة العربية السعودية',
    location: 'Jeddah / Riyadh — Saudi Arabia',
    year: '2025 - 2026',
    statusAr: 'اعتماد كود B وتوريد',
    statusEn: 'Approved Code B & Supplied',
    img: '/Image/Corner.webp',
    descAr: 'توريد زوايا ومقاطع المحارة القياسية وملحقات تثبيت البلوك وأنظمة حوامل الكابلات للمباني الإدارية والأبراج السكنية.',
    descEn: 'Supplying precision corner beads, blockwork accessories, and cable management trays for high-rise towers.',
    scopeAr: ['زوايا ومقاطع المحارة', 'ملحقات المحارة والبلوك', 'حوامل الكابلات المثقبة'],
    scopeEn: ['Corner Beads & Profiles', 'Blockwork Accessories', 'Perforated Cable Trays'],
  },
  {
    id: 'proj-modern-metal',
    code: 'MMI-PQL',
    sector: 'energy',
    sectorAr: 'الطاقة والصناعة والمياه',
    sectorEn: 'Energy, Industrial & Water',
    nameAr: 'المجمعات الصناعية ومصانع المعادن الحديثة',
    name: 'Modern Metal Industrial Complexes & Warehouses',
    clientAr: 'شركة صناعات المعادن الحديثة',
    clientEn: 'Modern Metal Industries Co.',
    locationAr: 'المدن الصناعية (الرياض / الدمام / جدة)',
    location: 'Industrial Cities (Riyadh / Dammam / Jeddah)',
    year: '2025 - 2026',
    statusAr: 'مورد مؤهل ومعتمد (PQL)',
    statusEn: 'PQL Qualified & Supplied',
    img: '/Image/Management Brackets.webp',
    descAr: 'توريد أنظمة تعليق الأحمال الثقيلة وكتائب الإدارة وسلالم الكابلات للمصانع وخطوط الإنتاج والمدن اللوجستية.',
    descEn: 'Supplying heavy-duty suspension brackets, cable ladders, and industrial framing for factories and logistics hubs.',
    scopeAr: ['كتائب وحوامل الإدارة', 'مشابك الكمرات الثقيلة واليايات', 'سلالم الكابلات الصناعية'],
    scopeEn: ['Management Brackets', 'Heavy-Duty Beam Clamps', 'Industrial Cable Ladders'],
  },
];

export default function ProjectsPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const rawHookProjects = useProjects();

  const [activeSector, setActiveSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const gridTopRef = useRef(null);

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

  // إغلاق نافذة تفاصيل المشروع بزر Escape
  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  // إعادة الصفحة إلى 1 عند تغيير الفلتر أو البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSector, searchQuery]);

  // دمج المشاريع الإقليمية المعتمدة مع أي مشاريع إضافية في useProjects
  const allProjects = useMemo(() => {
    const formattedHook = (rawHookProjects || []).map((p, i) => ({
      id: p.id || `hook_proj_${i}`,
      code: p.code || `PRJ-${i + 1}`,
      sector: p.sector || 'urban',
      sectorAr: p.sectorAr || 'التطوير العمراني والبنية التحتية',
      sectorEn: p.sectorEn || 'Urban & Infrastructure',
      nameAr: p.nameAr || p.name,
      name: p.name || p.nameAr,
      clientAr: p.clientAr || 'مشروع إقليمي معتمد',
      clientEn: p.clientEn || 'Regional Project',
      locationAr: p.locationAr || p.location || 'المملكة العربية السعودية',
      location: p.location || p.locationAr || 'Saudi Arabia',
      year: p.year || '2026',
      statusAr: 'تم التوريد والاعتماد',
      statusEn: 'Approved & Supplied',
      img: p.img || '/Image/basket.webp',
      descAr: p.descAr || 'توريد أنظمة حوامل الكابلات والمقاطع المعدنية وفق أعلى معايير الجودة.',
      descEn: p.descEn || 'Supplying cable management systems and steel profiles to international standards.',
      scopeAr: p.scopeAr || ['حوامل الكابلات', 'المقاطع المعدنية'],
      scopeEn: p.scopeEn || ['Cable Trays', 'Steel Profiles'],
    }));

    const existingIds = new Set(KIANKO_REGIONAL_PROJECTS.map((item) => item.id));
    const uniqueExtra = formattedHook.filter((item) => !existingIds.has(item.id));

    return [...KIANKO_REGIONAL_PROJECTS, ...uniqueExtra];
  }, [rawHookProjects]);

  // الفلاتر حسب القطاع
  const sectorTabs = [
    { id: 'all', label: pick(`All Projects (${allProjects.length})`, `كل المشاريع (${allProjects.length})`) },
    { id: 'giga', label: pick('Vision 2030 Giga Projects', 'مشاريع رؤية 2030 الكبرى') },
    { id: 'energy', label: pick('Energy, Industrial & Water', 'الطاقة والصناعة والمياه') },
    { id: 'urban', label: pick('Urban & Infrastructure', 'التطوير العمراني والبنية التحتية') },
  ];

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allProjects.filter((p) => {
      if (activeSector !== 'all' && p.sector !== activeSector) return false;
      if (!q) return true;
      const combined = [
        p.name, p.nameAr, p.location, p.locationAr,
        p.clientEn, p.clientAr, p.descEn, p.descAr,
        p.code, ...(p.scopeAr || []), ...(p.scopeEn || [])
      ].join(' ').toLowerCase();
      return combined.includes(q);
    });
  }, [allProjects, activeSector, searchQuery]);

  // حسابات تقسيم الصفحات (6 مشاريع لكل صفحة)
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // إحصائيات الأثر الإقليمي
  const impactStats = [
    {
      value: '+120',
      labelAr: 'مشروعاً استراتيجياً وإقليمياً',
      labelEn: 'Strategic Regional Projects',
      subAr: 'في المملكة العربية السعودية والشرق الأوسط',
      subEn: 'Across Saudi Arabia & MENA Region',
    },
    {
      value: '+45,000',
      labelAr: 'طن من الأنظمة المعدنية الموردة',
      labelEn: 'Tons of Steel Systems Supplied',
      subAr: 'حوامل وسلالم كابلات ومقاطع إنشائية',
      subEn: 'Cable trays, ladders & building profiles',
    },
    {
      value: '100%',
      labelAr: 'نسبة قبول الاعتمادات الفنية',
      labelEn: 'Consultant Submittal Approval',
      subAr: 'مطابقة لمعايير أرامكو وSASO وASTM',
      subEn: 'Compliant with Aramco, SASO & ASTM',
    },
    {
      value: '+15',
      labelAr: 'مدينة ومركزاً صناعياً رئيسياً',
      labelEn: 'Major Cities & Industrial Hubs',
      subAr: 'الرياض، جدة، الدمام، نيوم، مكة، ينبع',
      subEn: 'Riyadh, Jeddah, Dammam, NEOM, Makkah',
    },
  ];

  // القطاعات الهندسية المخدومة
  const engineeringSectors = [
    {
      icon: Factory,
      titleAr: 'النفط والغاز والبتروكيماويات',
      titleEn: 'Oil, Gas & Petrochemicals',
      descAr: 'أنظمة سلالم وحوامل كابلات للخدمة الشاقة مجلفنة بالغمس الساخن لمقاومة التآكل الكيميائي والبيئات البحرية.',
      descEn: 'Hot-dip galvanized heavy-duty cable ladders and trays built for harsh chemical and offshore environments.',
    },
    {
      icon: Building2,
      titleAr: 'مدن المستقبل ومشاريع رؤية 2030',
      titleEn: 'Giga Cities & Vision 2030 Projects',
      descAr: 'حلول متكاملة لشبكات البنية التحتية والأنفاق الخدمية والمباني الذكية في نيوم والمربع الجديد وحديقة الملك سلمان.',
      descEn: 'Integrated solutions for smart infrastructure, utility tunnels, and iconic developments across KSA.',
    },
    {
      icon: Zap,
      titleAr: 'محطات الطاقة والمياه ومراكز البيانات',
      titleEn: 'Power, Water & Data Centers',
      descAr: 'حوامل كابلات شبكية (Basket Trays) لتهوية كابلات الألياف الضوئية والداتا سنتر، وقطاعات مقاومة للرطوبة لمحطات التحلية.',
      descEn: 'Wire mesh basket trays for optimal data center airflow and moisture-resistant profiles for desalination plants.',
    },
    {
      icon: Layers,
      titleAr: 'الأبراج التجارية والتطوير العمراني',
      titleEn: 'High-Rise Towers & Urban Developments',
      descAr: 'مقاطع وهياكل الجبس بورد، زوايا اللياسة وشبك التمدد المعدني، وإكسسوارات تقوية المباني والفنادق الكبرى.',
      descEn: 'Precision drywall framing, corner beads, expanded metal mesh, and blockwork reinforcement accessories.',
    },
  ];

  // Styling Variables
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-600';
  const subText = darkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg = darkMode ? 'border-blue-900/60 bg-[#0A1832] text-white shadow-xl' : 'border-slate-200 bg-white text-slate-900 shadow-xl';
  const subBoxBg = darkMode ? 'bg-[#061022] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';
  const inputBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white placeholder:text-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 text-start"
    >
      {/* ==================== 1. Hero Section & Impact Statistics ==================== */}
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${darkMode ? 'bg-[#0A1832] text-emerald-400 border-blue-900/80' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{pick('REGIONAL PORTFOLIO & TRACK RECORD', 'سجل المشاريع والتوريدات الإقليمية')}</span>
          </span>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${textTitle}`}>
            {pick('Regional Projects of', 'المشاريع الإقليمية لشركة')}{' '}
            <span style={{ color: themeColor }}>{pick('KIANKO', 'كيانكو')}</span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed font-medium ${textDesc}`}>
            {pick(
              'A proven track record of supplying certified cable management systems and structural steel profiles to flagship giga-projects, industrial hubs, and infrastructure across Saudi Arabia and the MENA region.',
              'سجل حافل في توريد واعتماد أنظمة حوامل الكابلات والقطاعات المعدنية ومستلزمات المباني لكبرى المشاريع الاستراتيجية والمدن الصناعية في المملكة العربية السعودية والشرق الأوسط.'
            )}
          </p>
        </motion.div>

        {/* شريط الإحصائيات الإقليمية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {impactStats.map((stat, idx) => (
            <motion.div
              key={stat.labelEn}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`p-6 rounded-2xl border text-center space-y-1.5 transition-transform duration-300 hover:-translate-y-1 ${cardBg}`}
            >
              <div className="text-3xl sm:text-4xl font-black" style={{ color: themeColor }} dir="ltr">
                {stat.value}
              </div>
              <div className={`text-sm font-bold ${textTitle}`}>
                {pick(stat.labelEn, stat.labelAr)}
              </div>
              <div className={`text-xs ${subText}`}>
                {pick(stat.subEn, stat.subAr)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ==================== 2. Search & Sector Filters ==================== */}
      <motion.div
        ref={gridTopRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 scroll-mt-24"
      >
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={pick('Search projects by name, city, or product…', 'ابحث باسم المشروع، المدينة (الرياض، نيوم، جدة)، أو المنتج…')}
            className={`w-full ps-11 pe-10 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-all ${inputBg}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 p-1 text-slate-400 hover:text-red-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-2.5 sm:gap-3 flex-wrap" role="tablist">
          {sectorTabs.map((tab) => {
            const isSelected = activeSector === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveSector(tab.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 border cursor-pointer ${
                  isSelected ? 'text-white border-transparent' : `${cardBg}${textDesc} hover:opacity-90`
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="project-sector-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl shadow-lg"
                    style={{ backgroundColor: themeColor }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <p className={`text-xs ${subText}`}>
          {pick(
            `Showing ${paginatedProjects.length} of ${filteredProjects.length} project(s) — Page ${safePage} of ${totalPages}`,
            `عرض ${paginatedProjects.length} من أصل ${filteredProjects.length} مشروع — صفحة ${safePage} من ${totalPages}`
          )}
        </p>
      </motion.div>

      {/* ==================== 3. Projects Grid (with Scroll Reveal & Pagination) ==================== */}
      {filteredProjects.length === 0 ? (
        <div className={`rounded-2xl border border-dashed p-12 text-center space-y-4 ${cardBg}`}>
          <p className={textDesc}>
            {pick('No projects match your current search.', 'لا توجد مشاريع مطابقة لكلمة البحث الحالية.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveSector('all');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            {pick('Reset Filters', 'إعادة ضبط الفلاتر وعرض الكل')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedProjects.map((proj, index) => {
                const colDelay = (index % 3) * 0.1;
                const projTitle = pick(proj.name, proj.nameAr);
                const projLoc = pick(proj.location, proj.locationAr);
                const projDesc = pick(proj.descEn, proj.descAr);
                const projSector = pick(proj.sectorEn, proj.sectorAr);
                const projStatus = pick(proj.statusEn, proj.statusAr);
                const projScope = isAr ? proj.scopeAr : proj.scopeEn;

                return (
                  <motion.div
                    key={`${proj.id}_${safePage}`}
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: colDelay, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    <SpotlightCard
                      as="article"
                      className={`group h-full rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${cardBg}`}
                    >
                      <div>
                        {/* صورة المشروع والبادجات العلوية */}
                        <div
                          onClick={() => setSelectedProject(proj)}
                          className="relative h-52 sm:h-56 overflow-hidden bg-[#061022] cursor-pointer"
                        >
                          {proj.img && (
                            <motion.img
                              initial={{ scale: 1.06, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: false, amount: 0.2 }}
                              transition={{ duration: 0.55, delay: colDelay + 0.05 }}
                              src={proj.img}
                              alt={projTitle}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#061022] via-[#061022]/30 to-transparent opacity-85" />

                          {/* كود المشروع والقطاع */}
                          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
                            <span
                              className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md"
                              style={{ backgroundColor: themeColor }}
                            >
                              {projSector}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-white border border-white/15 backdrop-blur-xs">
                              {proj.code}
                            </span>
                          </div>

                          {/* الموقع والسنة أسفل الصورة */}
                          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-slate-200 font-semibold">
                            <span className="inline-flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{projLoc}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] bg-white/10 px-2 py-0.5 rounded">
                              <Calendar className="w-3 h-3 text-emerald-400" />
                              <span>{proj.year}</span>
                            </span>
                          </div>
                        </div>

                        {/* تفاصيل المشروع ونطاق التوريد */}
                        <div className="p-5 sm:p-6 space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                              <FileCheck className="w-3.5 h-3.5 shrink-0" />
                              <span>{projStatus}</span>
                            </div>
                            <h2 className={`text-lg font-extrabold leading-snug ${textTitle}`}>
                              {projTitle}
                            </h2>
                            <p className={`text-xs leading-relaxed line-clamp-2 ${textDesc}`}>
                              {projDesc}
                            </p>
                          </div>

                          {/* المنتجات الموردة للمشروع */}
                          <div className="space-y-2 pt-2 border-t border-blue-900/30">
                            <span className={`text-[11px] font-bold block ${subText}`}>
                              {pick('Supplied KIANKO Systems:', 'الأنظمة الموردة للمشروع:')}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(projScope || []).map((item) => (
                                <span
                                  key={item}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${subBoxBg}`}
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{item}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* زر عرض تفاصيل التوريد */}
                      <div className="p-5 sm:p-6 pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(proj)}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                          style={{ backgroundColor: themeColor }}
                        >
                          <span>{pick('View Supply & Approval Details', 'عرض تفاصيل التوريد والاعتماد')}</span>
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* شريط التنقل بين الصفحات (Pagination) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${cardBg} hover:border-red-500`}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{pick('Previous', 'السابق')}</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = safePage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    style={{ backgroundColor: isActive ? themeColor : undefined }}
                    className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      isActive ? 'text-white shadow-lg scale-105' : `border ${cardBg} hover:border-red-500`
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
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${cardBg} hover:border-red-500`}
              >
                <span>{pick('Next', 'التالي')}</span>
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </>
      )}

      {/* ==================== 4. Sectors Served Section ==================== */}
      <div className="space-y-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <h2 className={`text-2xl sm:text-3xl font-black ${textTitle}`}>
            {pick('Key Industrial & Engineering Sectors', 'القطاعات الهندسية والصناعية التي نخدمها')}
          </h2>
          <p className={`text-xs sm:text-sm ${textDesc}`}>
            {pick(
              'Engineered steel solutions tailored to the technical requirements of mega infrastructure across the Kingdom.',
              'حلول صناعية ومعدنية مصممة خصيصاً لتلبية المتطلبات الفنية الصارمة للمشاريع العملاقة في المملكة.'
            )}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {engineeringSectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.titleEn}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={`p-6 rounded-2xl border space-y-3 transition-all hover:-translate-y-1 ${cardBg}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-base font-bold ${textTitle}`}>
                  {pick(sec.titleEn, sec.titleAr)}
                </h3>
                <p className={`text-xs leading-relaxed ${textDesc}`}>
                  {pick(sec.descEn, sec.descAr)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==================== 5. CTA Section (Submit Project Inquiry) ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className={`rounded-3xl p-8 sm:p-12 text-center space-y-6 border shadow-2xl ${
          darkMode
            ? 'bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border-blue-900/60'
            : 'bg-slate-100 border-slate-300'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className={`text-2xl sm:text-4xl font-black ${textTitle}`}>
            {pick('Have a Project Requiring Approved Steel Systems?', 'هل لديك مشروع يتطلب توريد واعتماد أنظمة كيانكو؟')}
          </h2>
          <p className={`text-xs sm:text-base leading-relaxed ${textDesc}`}>
            {pick(
              'Our engineering team in Saudi Arabia is ready to provide full technical submittals, PQL files, compliance certificates, and competitive BOQ quotations.',
              'فريقنا الهندسي في المملكة العربية السعودية جاهز لتزويدكم بملفات الاعتماد الفني الكاملة (Submittals & PQL)، شهادات المطابقة، وعروض الأسعار التنافسية لجداول الكميات.'
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to={ROUTES.contact}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-transform hover:scale-105 text-xs sm:text-sm"
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Request Project Quotation & Submittal', 'اطلب تسعير مشروعك وملف الاعتماد')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <Link
            to={ROUTES.products}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl border transition-all text-xs sm:text-sm ${subBoxBg} hover:border-red-500`}
          >
            <Package className="w-4 h-4 text-red-500" />
            <span>{pick('Browse Product Catalog', 'تصفح كتالوج المنتجات (13 خط إنتاج)')}</span>
          </Link>
        </div>
      </motion.div>

      {/* ==================== 6. Project Details Modal ==================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl ${cardBg}`}
            >
              <div className="relative h-56 sm:h-64 bg-[#061022]">
                <img
                  src={selectedProject.img}
                  alt={pick(selectedProject.name, selectedProject.nameAr)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1832] via-[#0A1832]/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 end-4 p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 inset-x-6 space-y-1">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-bold text-white inline-block"
                    style={{ backgroundColor: themeColor }}
                  >
                    {pick(selectedProject.sectorEn, selectedProject.sectorAr)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {pick(selectedProject.name, selectedProject.nameAr)}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${subBoxBg}`}>
                    <span className={`block text-[10px] ${subText}`}>{pick('Client / Authority', 'الجهة المالكة / المشروع')}</span>
                    <strong className="font-bold">{pick(selectedProject.clientEn, selectedProject.clientAr)}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${subBoxBg}`}>
                    <span className={`block text-[10px] ${subText}`}>{pick('Location', 'الموقع')}</span>
                    <strong className="font-bold">{pick(selectedProject.location, selectedProject.locationAr)}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${subBoxBg}`}>
                    <span className={`block text-[10px] ${subText}`}>{pick('Approval Status', 'حالة الاعتماد والتوريد')}</span>
                    <strong className="font-bold text-emerald-400">{pick(selectedProject.statusEn, selectedProject.statusAr)}</strong>
                  </div>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc}`}>
                  {pick(selectedProject.descEn, selectedProject.descAr)}
                </p>

                <div className="space-y-2">
                  <h4 className={`text-xs font-bold ${textTitle}`}>
                    {pick('Scope of KIANKO Supply:', 'نطاق التوريد المعتمد من كيانكو:')}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {(isAr ? selectedProject.scopeAr : selectedProject.scopeEn).map((item) => (
                      <div key={item} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold ${subBoxBg}`}>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-blue-900/40">
                  <Link
                    to={ROUTES.contact}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:opacity-90 flex items-center gap-2"
                    style={{ backgroundColor: themeColor }}
                  >
                    <span>{pick('Inquire About Similar Supply', 'اطلب توريد مماثل لمشروعك')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}