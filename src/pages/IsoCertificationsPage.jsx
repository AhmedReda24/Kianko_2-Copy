import { useState, useMemo } from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle2, ZoomIn, X, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../routes';

export default function IsoCertificationsPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);

  // حالة الصورة المكبرة عند الضغط على شهادة لها صورة حقيقية (Modal)
  const [selectedCert, setSelectedCert] = useState(null);

  // مصفوفة الـ 10 اعتمادات بمسارات الصور المحدثة بدون مسافات لضمان السيرفرات
  const accreditations = useMemo(() => [
    {
      id: 'iso-9001',
      code: 'ISO 9001:2015',
      titleEn: 'Quality Management System',
      titleAr: 'نظام إدارة الجودة العالمي',
      descEn: 'Certifies world-class quality management in rolling, punching, and steel fabrication.',
      descAr: 'اعتماد رسمي لنظام إدارة الجودة وضمان سلامة كافة عمليات التصنيع والتدلفين.',
      img: '/Image/ISO-9001-2015.jpg', // تم تعديل الاسم بدون مسافات
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    },
    {
      id: 'iso-14001',
      code: 'ISO 14001:2015',
      titleEn: 'Environmental Management System',
      titleAr: 'نظام الإدارة البيئية',
      descEn: 'Verifies eco-friendly industrial operations, acid recycling, and zero-waste galvanization.',
      descAr: 'اعتماد الممارسات البيئية الآمنة وإعادة تدوير أحماض الجلفنة وتقليل الانبعاثات.',
      img: '/Image/ISO-14001-2015.jpg', // تم تعديل الاسم بدون مسافات
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    },
    {
      id: 'iso-45001',
      code: 'ISO 45001:2018',
      titleEn: 'Occupational Health & Safety',
      titleAr: 'إدارة السلامة والصحة المهنية',
      descEn: 'Ensures strict workforce protection, safety protocols, and zero-harm operational standards.',
      descAr: 'اعتماد تطبيق أعلى معايير الحماية والتأمين للكوادر الفنية والعمال داخل المصانع.',
      img: '/Image/ISO-45001-2018.jpg', // تم تعديل الاسم بدون مسافات
      badgeEn: 'Verified Image',
      badgeAr: 'شهادة موثقة',
      hasImage: true,
    },
    {
      id: 'astm-a123',
      code: 'ASTM A123 / A123M',
      titleEn: 'Zinc Coating Standard Spec',
      titleAr: 'المواصفة القياسية للجلفنة على الساخن',
      descEn: 'Standard specification for zinc (hot-dip galvanized) coatings on iron and steel products.',
      descAr: 'المواصفة الأمريكية المعتمدة لسمك وجودة طلاء الزنك للحديد والقطاعات الفولاذية.',
      badgeEn: 'Standard Spec',
      badgeAr: 'مواصفة عالمية',
      hasImage: false,
    },
    {
      id: 'nema-ve1',
      code: 'NEMA VE 1 / CSA C22.2',
      titleEn: 'Metal Cable Tray Systems Spec',
      titleAr: 'معيار نيمـا لأنظمة حوامل الكابلات',
      descEn: 'Performance, manufacturing, and testing standards for metallic cable tray installations.',
      descAr: 'المعيار القياسي الدولي لتصنيع واختبار قدرة تحميل حوامل وسلالم الكابلات المعدنية.',
      badgeEn: 'NEMA Compliant',
      badgeAr: 'مطابق لـ NEMA',
      hasImage: false,
    },
    {
      id: 'iec-61537',
      code: 'IEC 61537 Standard',
      titleEn: 'Cable Management Systems Code',
      titleAr: 'كود الكهروميكانيك للسلالم والحوامل',
      descEn: 'International electrotechnical standard for cable tray and cable ladder systems.',
      descAr: 'الكود الدولي الفني المعتمد للتمديدات الكهروميكانيكية في المنشآت الصناعية.',
      badgeEn: 'International Code',
      badgeAr: 'كود دولي',
      hasImage: false,
    },
    {
      id: 'din-en-10346',
      code: 'DIN EN 10346',
      titleEn: 'Continuously Hot-Dip Coated Steel',
      titleAr: 'مواصفة الصُلب المجلفن المستمر',
      descEn: 'European standard for continuously hot-dip coated steel flat products for cold forming.',
      descAr: 'المعيار الأوروبي لتوريد وفحص ألواح ولفائف الصلب المجلفن المخصص للتدلفين.',
      badgeEn: 'Euro Standard',
      badgeAr: 'معيار أوروبي',
      hasImage: false,
    },
    {
      id: 'bs-en-61537',
      code: 'BS EN 61537',
      titleEn: 'British Standard Cable Management',
      titleAr: 'المواصفة البريطانية لحوامل الكابلات',
      descEn: 'British standard specifying requirements and tests for cable tray systems.',
      descAr: 'المواصفة البريطانية الخاصة باختبارات الأحمال ومقاومة التآكل لأنظمة الكابلات.',
      badgeEn: 'BS Certified',
      badgeAr: 'مطابق للمواصفة البريطانية',
      hasImage: false,
    },
    {
      id: 'osha-1910',
      code: 'OSHA 1910 Standard',
      titleEn: 'General Industry Safety Compliance',
      titleAr: 'معايير أوشـا للسلامة الصناعية',
      descEn: 'Occupational safety guidelines protecting facility workforce and industrial plant operations.',
      descAr: 'التزام كامل بقواعد إدارة السلامة والصحة المهنية الأمريكية داخل المصنع.',
      badgeEn: 'Safety Spec',
      badgeAr: 'معيار السلامة',
      hasImage: false,
    },
    {
      id: 'sgs-inspection',
      code: 'Third-Party Batch Testing',
      titleEn: 'Mill Test & Batch Inspection',
      titleAr: 'شهادات الفحص واختبار الدفعات',
      descEn: 'In-house physical tensile, yield, and coating thickness verification with third-party readiness.',
      descAr: 'شهادات فحص فيزياء الصلب وسمك الطلاء لكل دفعة توريد مجهزة للاعتماد الاستشاري.',
      badgeEn: 'Lab Verified',
      badgeAr: 'مفحوص معملياً',
      hasImage: false,
    },
  ], []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-start">
      
      {/* 1. Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0A1832] border border-blue-900/80 shadow-md">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{pick('GLOBAL ACCREDITATIONS & CERTIFICATES', 'الاعتمادات والجودة المعتمدة')}</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          {pick(`${accreditations.length} Accredited International Certifications`, `${accreditations.length} شهادات جودة واعترافات دولية`)}
        </h1>
        <p className="text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
          {pick(
            'Kianko Steel adheres to global quality, environmental safety, and galvanizing compliance frameworks.',
            'تلتزم كيانكو بأعلى معايير التصنيع والجودة والجلفنة للحلول الهيكلية وحوامل الكابلات.'
          )}
        </p>
      </div>

      {/* 2. Full Accreditations Grid (عرض الـ 10 كروت) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {accreditations.map((cert) => (
          <div
            key={cert.id}
            className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="space-y-4">
              {/* إذا كان الكارت يحتوي على صورة شهادة حقيقية */}
              {cert.hasImage ? (
                <div 
                  className="relative rounded-2xl overflow-hidden bg-white p-2 border border-slate-700 shadow-inner group/img cursor-pointer h-64 flex items-center justify-center"
                  onClick={() => setSelectedCert(cert)}
                >
                  <img
                    src={cert.img}
                    alt={cert.code}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs rounded-2xl">
                    <ZoomIn className="w-5 h-5" />
                    <span>{pick('Click to Enlarge', 'انقر للتكبير')}</span>
                  </div>
                </div>
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-blue-900/80 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-7 h-7" style={{ color: themeColor }} />
                </div>
              )}

              {/* تفاصيل الاعتماد */}
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white inline-block" style={{ backgroundColor: themeColor }}>
                  {cert.code}
                </span>
                <h3 className="text-xl font-bold text-white">{pick(cert.titleEn, cert.titleAr)}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{pick(cert.descEn, cert.descAr)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <FileCheck className="w-4 h-4" />
                <span>{pick(cert.badgeEn, cert.badgeAr)}</span>
              </span>
              {cert.hasImage && (
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="text-white hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{pick('View Cert', 'معاينة الشهادة')}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. In-House Quality Control Pillars */}
      <div className="bg-[#0A1832] border border-blue-900/60 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-800 border border-blue-900/80">
              {pick('STRICT COMPLIANCE', 'الالتزام بالمواصفات')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {pick('Beyond ISO Certification Standards', 'ما بعد معايير شهادات الآيزو')}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {pick(
                'Every steel profile and cable tray system undergoes physical tensile testing and coating thickness checks in our accredited testing lab before leaving the plant.',
                'تخضع جميع قطاعات الصلب وأنظمة حوامل الكابلات لاختبارات إجهاد الشد والسمك في معمل الفحص المعتمد لدينا قبل الخروج للمواقع.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { titleEn: 'ASTM A123 Galvanization Standard', titleAr: 'مطابقة مواصفات الجلفنة ASTM A123' },
              { titleEn: 'NEMA VE-1 Cable Tray Specs', titleAr: 'معايير NEMA VE-1 لحوامل الكابلات' },
              { titleEn: 'Tensile Strength Physical Testing', titleAr: 'اختبارات إجهاد الشد والتحمل الفولاذي' },
              { titleEn: 'Digital Zinc Coating Thickness Test', titleAr: 'قياس سمك الزنك الرقمي بالميكرون' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-blue-900/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">{pick(item.titleEn, item.titleAr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CTA Section */}
      <div className="bg-gradient-to-r from-[#0A1832] via-[#0E2347] to-[#0A1832] border border-blue-900/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          {pick('Need Quality Certificates for Consultant Approval?', 'تحتاج صور الشهادات المعتمدة للتقديم للاستشاري؟')}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
          {pick(
            'Request verified copies of our ISO certificates and mill test reports directly for your project submittals.',
            'اطلب نسخاً معتمدة وموثوقة من شهادات ISO وتقارير فحص المصنع لتقديمها مباشرة ضمن أوراق اعتماد المشروع.'
          )}
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to={ROUTES.contact}
            className="inline-flex items-center gap-3 py-3.5 px-8 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <span>{pick('Request Certified Submittal Dossier', 'اطلب ملف الاعتمادات المعتمد')}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* 5. Lightbox Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1832] border border-blue-900/80 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <h3 className="text-lg font-bold text-white">{selectedCert.code} - {pick(selectedCert.titleEn, selectedCert.titleAr)}</h3>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-2 rounded-2xl max-h-[70vh] overflow-y-auto flex items-center justify-center">
              <img src={selectedCert.img} alt={selectedCert.code} className="max-h-[65vh] object-contain rounded-xl" />
            </div>

            <div className="flex justify-end pt-2">
              <a
                href={selectedCert.img}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-all border border-blue-900/80"
              >
                <Download className="w-4 h-4" />
                <span>{pick('Download Certificate Image', 'تحميل صورة الشهادة')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}