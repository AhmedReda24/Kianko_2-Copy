# تجهيز المشروع (Tailwind v4 + React 19 + Vite + Supabase)

## 1) المكتبات الجديدة
```bash
npm i react-router motion embla-carousel-react embla-carousel-autoplay
```
(`@supabase/supabase-js` و`lucide-react` موجودين عندك بالفعل.)

## 2) ربط Supabase
1. أنشئ مشروع على supabase.com.
2. SQL Editor → الصق محتوى `supabase/schema.sql` → Run.
3. SQL Editor → الصق محتوى `supabase/seed.sql` → Run (بيحط البيانات الحالية للموقع).
4. انسخ `.env.example` باسم `.env.local` واملا القيمتين من Project Settings → API.
5. أعد تشغيل `npm run dev`.

بعد كده:
- رسايل "تواصل معنا" بتتحفظ في جدول `contact_messages`، وطلبات التوظيف في `job_applications` (والسيرة الذاتية في bucket اسمه `cvs` الخاص).
- المنتجات والفروع والوظائف والشهادات والمشاريع بتتعدل من Table Editor، والموقع بيقراها (الصف بيظهر لما `is_published = true`).
- صور الشهادات وملفات الداتا شيت: ارفعها في bucket `site-files` (عام) وحط اللينك في الجدول (`image_url` / `file_url` / `datasheet_url`).
- لو Supabase مش متظبط أو الجدول فاضي: الموقع يشتغل بالبيانات المحلية في `src/data/*`، بس الفورمات هتظهر رسالة خطأ.

### إيميل تنبيه للشركة (اختياري)
فيه Edge Function جاهزة في `supabase/functions/notify-contact` (خطواتها في أول الملف) بتبعت إيميل للشركة مع كل رسالة جديدة.

### الأمان
- مفتاح الـ publishable/anon ظاهر في المتصفح وده طبيعي؛ الحماية من سياسات RLS في `schema.sql`:
  الزوار يقدروا يقروا المحتوى المنشور ويبعتوا فورمات بس، ومايقدروش يقروا الرسايل أو السير الذاتية.
- فيه حقل مخفي (honeypot) ضد البوتات. لو جالك سبام كتير ضيف Cloudflare Turnstile.

## 3) الخطوط — الكلاس font-display
في index.html داخل <head>:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
```
في src/index.css (Tailwind v4 — الإعدادات في CSS):
```css
@import "tailwindcss";

@theme {
  --font-sans: "Cairo", system-ui, sans-serif;
  --font-display: "Barlow Condensed", "Cairo", sans-serif;
}
```
لو عندك @theme بالفعل (مثلاً فيه --color-kiankoRed) ضيف السطرين جواه.

## 4) الاستضافة (SPA fallback)
- Netlify: ملف public/_redirects  →  /*  /index.html  200
- Vercel: vercel.json → { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }

## 5) حاجات وهمية لازم تتبدل
- src/config/social.js (لينكات السوشيال)
- بيانات الفروع والإيميلات والتليفونات (في Supabase جدول locations، أو src/data/locations.js كاحتياطي)
- صور قسم "المرافق الإنتاجية" في src/components/home/FacilitiesSection.jsx

## 6) لمسات اختيارية في src/index.css
```css
html { scroll-behavior: smooth; }
::selection { background: #C9252C; color: #fff; }
```

## 7) التفاعلات (للمرجع)
- `src/components/ui/`: SpotlightCard (إضاءة تتبع الماوس) · TiltCard (ميل ثلاثي الأبعاد) · CtaLink (زر بلمعة وسهم متحرك)
  · SectionHeading (شريط يترسم) · ScrollProgress · BackToTop
- `MotionConfig reducedMotion="user"` في App.jsx: لو الزائر مفعّل "تقليل الحركة" في جهازه، الحركات بتتقلل تلقائياً.
- الشرارات في الهيرو: `components/home/Sparks.jsx` (احذف `<Sparks />` من HeroSection لو مش عايزها).
