// ⚠️ بيانات مؤقتة — بدّل كل عنصر بشهادة حقيقية:
//   1) حط صورة الشهادة في src/assets/certificates/
//   2) استوردها فوق:  import iso from '../assets/certificates/iso.jpg'
//   3) حطها في حقل img بدل null
// type: 'accreditation' (اعتماد) أو 'experience' (شهادة خبرة)
export const certificates = [
  { id: 'c1', type: 'accreditation', title: 'Quality Management Accreditation', titleAr: 'اعتماد نظام إدارة الجودة', img: null },
  { id: 'c2', type: 'accreditation', title: 'ISO Certification', titleAr: 'شهادة الأيزو', img: null },
  { id: 'c3', type: 'experience', title: 'Experience Certificate', titleAr: 'شهادة خبرة', img: null },
  { id: 'c4', type: 'accreditation', title: 'Approved Supplier Certificate', titleAr: 'شهادة مورّد معتمد', img: null },
  { id: 'c5', type: 'experience', title: 'Project Completion Certificate', titleAr: 'شهادة إتمام مشروع', img: null },
  { id: 'c6', type: 'accreditation', title: 'Product Testing Report', titleAr: 'تقرير اختبار المنتج', img: null },
];
