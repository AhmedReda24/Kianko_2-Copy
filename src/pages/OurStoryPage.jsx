import { Play } from 'lucide-react';

export default function OurStoryPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-start">
      {/* Banner Section */}
      <div className="relative rounded-3xl overflow-hidden h-96 border border-blue-900/50 shadow-2xl">
        <img
          src="https://images.pexels.com/photos/224924/pexels-photo-224924.jpeg?auto=compress&cs=tinysrgb&fit=crop&fm=webp&q=75&w=1200"
          alt="Kianko Steel History"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-[#07132B]/40 to-transparent" />
        <div className="absolute bottom-10 start-10 end-10 space-y-3">
          <span className="px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase" style={{ backgroundColor: themeColor }}>
            {isAr ? 'قصتنا وتأسيسنا' : 'OUR HERITAGE'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            {isAr ? 'عقود من التميز والصناعة الثقيلة' : 'Decades of Industrial Steel Leadership'}
          </h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 leading-relaxed text-base">
          {/* Title - Pure White */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {isAr ? 'تاريخ ممتد في تشكيل المعادن وتلبية المشاريع القومية' : 'Building Strong Foundations Across the Region'}
          </h2>

          {/* Paragraphs - Light Slate for High Contrast */}
          <p className="text-slate-300 font-medium">
            {isAr
              ? 'تأسست كيانكو للصناعات الحديدية كأحد الصروح الصناعية الرائدة المتخصصة في إنتاج وتشكيل قطاعات الصُلب، وحوامل الكابلات الهندسية، والسلالم المعدنية الفولاذية بمختلف المواصفات.'
              : 'Kianko For Steel Industries was established to pioneer precision steel fabrication, cable management systems, and heavy structural profiles engineered to world-class standards.'}
          </p>

          <p className="text-slate-300 font-medium">
            {isAr
              ? 'نمضي بخطى ثابتة نحو تطوير خطوط الإنتاج والاعتماد على أحدث ماكينات التدلفين الدقيق والجلفنة على الساخن لتقديم حلول متكاملة تُنفذ في كبرى المشاريع بالشرق الأوسط.'
              : 'Our commitment to engineering accuracy and continuous technological investment has secured Kianko as a cornerstone partner for major national infrastructure developments.'}
          </p>
        </div>

        {/* Video Preview Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/60 bg-slate-900 group h-80 flex items-center justify-center">
          <img
            src="https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&fit=crop&fm=webp&q=75&w=800"
            alt="Factory Video Thumbnail"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              type="button"
              aria-label={isAr ? 'تشغيل فيديو قصة كيانكو' : 'Play Kianko story video'}
              className="p-5 rounded-full bg-white/90 text-slate-900 shadow-2xl hover:scale-110 transition-transform cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Play className="w-8 h-8 fill-current" style={{ color: themeColor }} />
            </button>
          </div>
          <span className="absolute bottom-4 start-4 bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold">
            {isAr ? 'فيديو قصة كيانكو' : 'Watch Story Video'}
          </span>
        </div>
      </div>
    </div>
  );
}