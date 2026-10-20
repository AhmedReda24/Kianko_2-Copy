export const ROUTES = {
    home: '/',
    story: '/our-story',
    overview: '/overview',
    values: '/values',
    quality: '/governance-quality',
    iso: '/iso-certifications',
    careers: '/careers',
    projects: '/projects',
    products: '/products',
    contact: '/contact',
    locations: '/locations',
    admin: '/kianko-secure-portal-9921',
};

export const PAGE_TITLES = {
    home: ['KIANKO | Steel Fabrication & Cable Management', 'كيانكو | تصنيع الحديد وأنظمة الكابلات'],
    story: ['Our Story | KIANKO', 'قصتنا | كيانكو'],
    overview: ['Overview | KIANKO', 'نظرة عامة | كيانكو'],
    values: ['Our Values | KIANKO', 'قيمنا | كيانكو'],
    quality: ['Governance & Quality | KIANKO', 'الحوكمة والجودة | كيانكو'],
    iso: ['ISO Certifications | KIANKO', 'شهادات الأيزو | كيانكو'],
    careers: ['Careers | KIANKO', 'الوظائف | كيانكو'],
    projects: ['Regional Projects | KIANKO', 'المشاريع الإقليمية | كيانكو'],
    products: ['Products | KIANKO', 'المنتجات | كيانكو'],
    contact: ['Contact Us | KIANKO', 'تواصل معنا | كيانكو'],
    locations: ['Our Locations | KIANKO', 'فروعنا ومكاتبنا | كيانكو'],
    admin: ['Admin Dashboard | KIANKO', 'لوحة التحكم | كيانكو'],
    notFound: ['Page not found | KIANKO', 'الصفحة غير موجودة | كيانكو'],
};

export function pageKeyFromPath(pathname) {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const hit = Object.entries(ROUTES).find(([, path]) => path === clean);
    return hit ? hit[0] : null;
}