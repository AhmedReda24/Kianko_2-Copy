// ⚠️ اتأكد إن كل شهادة هنا شهادة فعلية عند الشركة.
// file: مسار ملف الشهادة الحقيقي (PDF أو صورة) من src/assets/certificates/
//   مثال:  import iso9001 from '../assets/certificates/iso-9001.pdf'  ثم  file: iso9001
// لو file = null زر التحميل مابيظهرش.
export const accreditations = [
  { id: 1, name: 'ISO 9001:2015', titleAr: 'نظام إدارة الجودة العالمية', titleEn: 'Quality Management System', descAr: 'الاعتماد الدولي لإدارة ضبط واستدامة الجودة لمراحل التصنيع.', descEn: 'International quality control standard for steel manufacturing.', file: null },
  { id: 2, name: 'ISO 14001:2015', titleAr: 'نظام الإدارة البيئية', titleEn: 'Environmental Management', descAr: 'الالتزام التام بالتصنيع المستدام والحد من الانبعاثات الكربونية.', descEn: 'Environmental safety compliance and sustainable steel mill protocols.', file: null },
  { id: 3, name: 'ISO 45001:2018', titleAr: 'السلامة والصحة المهنية', titleEn: 'Occupational Health & Safety', descAr: 'توفير أقصى درجات حماية العمالة وبيئة العمل الصناعية.', descEn: 'World-class workplace safety and structural hazard control.', file: null },
  { id: 4, name: 'ASTM A123 / A123M', titleAr: 'اعتماد جلفنة الصلب على الساخن', titleEn: 'Hot-Dip Galvanizing Standard', descAr: 'مطابقة سمك طبقة الخارصين ومقاومة التآكل والصدأ.', descEn: 'Zinc coating thickness and anti-corrosion specification.', file: null },
  { id: 5, name: 'IEC 61537 Standard', titleAr: 'شهادة حوامل وسلالم الكابلات', titleEn: 'Cable Tray Systems Compliance', descAr: 'مطابقة أنظمة مسارات الكابلات الكهربائية للأحمال والمواصفات الأوروبية.', descEn: 'International standard for electrical cable tray and ladder systems.', file: null },
  { id: 6, name: 'BS EN 10346', titleAr: 'اعتماد الصفائح الفولاذية المغلفنة', titleEn: 'Continuously Hot-Dip Coated Steel', descAr: 'اعتماد معايير الجودة للشرائح الفولاذية المستخدمة في التدلفين.', descEn: 'Continuously hot-dip coated steel flat products certification.', file: null },
  { id: 7, name: 'ISO 50001:2018', titleAr: 'نظام إدارة الطاقة الصناعية', titleEn: 'Energy Management System', descAr: 'ترشيد كفاءة استهلاك الطاقة في أفرام الجلفنة وخطوط الإنتاج.', descEn: 'Industrial energy efficiency and optimized furnace management.', file: null },
  { id: 8, name: 'CE Marking Certificate', titleAr: 'شهادة التوافق الأوروبي CE', titleEn: 'European Conformity Certification', descAr: 'اعتماد التصدير لأسواق الاتحاد الأوروبي والشرق الأوسط.', descEn: 'European market conformity for structural steel products.', file: null },
  { id: 9, name: 'RoHS Compliance', titleAr: 'شهادة خلو المنتجات من المواد الخطرة', titleEn: 'Restriction of Hazardous Substances', descAr: 'مطابقة منتجات حوامل الكابلات للمعايير البيئية النظيفة.', descEn: 'Environmentally clean and non-hazardous metal finishing.', file: null },
  { id: 10, name: 'ISO/IEC 17025', titleAr: 'اعتماد مختبرات الفحص والقياس', titleEn: 'Testing Laboratory Accreditation', descAr: 'اعتماد دقة اختبارات شد الصلب واختبارات الجودة الداخلية.', descEn: 'Accreditation of in-house tensile and thickness testing labs.', file: null },
];
