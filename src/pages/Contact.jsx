import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useLocations } from '../hooks/useContent';
import { ROUTES } from '../routes';
import { supabase } from '../lib/supabase';

// دالة الـ CRUD وإرسال البيانات لـ Make.com
export async function submitContactMessage({ name, email, phone, locationId, message, lang }) {
  const messageData = {
    name,
    email,
    phone,
    location_id: locationId === 'any' ? null : locationId,
    message,
    lang,
    status: 'new',
  };

  // 1. الحفظ في Supabase
  const { data, error } = await supabase.from('contact_messages').insert([messageData]);

  if (error) {
    throw new Error(error.message);
  }

  // 2. إرسال البيانات إلى Webhook الخاص بـ Make.com (لو الرابط متحدد في الـ env)
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
    } catch (err) {
      console.error('Failed to notify Make.com:', err);
    }
  }

  return data;
}

const empty = { name: '', email: '', phone: '', branch: 'any', message: '', website: '' };

const telHref = (v = '') => `tel:${v.replace(/\s/g, '')}`;

export default function Contact({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const locations = useLocations();

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [formData, setFormData] = useState(empty);

  // الإيميلات الموجودة فعلًا فقط (لو مفيش إيميل بيتخفي الصف)
  const emails = [...new Set(locations.map((l) => l.email).filter(Boolean))];

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.website) {
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        locationId: formData.branch,
        message: formData.message,
        lang,
      });
      setFormData(empty);
      setStatus('sent');
    } catch (err) {
      console.error('[contact]', err);
      setStatus('error');
    }
  };

  const input =
    'w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-base sm:text-sm focus:border-(--accent) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
  const label = 'text-xs font-bold text-slate-300';

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12 text-start"
      style={{ '--accent': themeColor }}
    >
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black">
          {pick('Get in Touch with', 'تواصل مع')} <span style={{ color: themeColor }}>KIANKO</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto font-medium text-sm sm:text-base">
          {pick(
            'Our sales and engineering support teams are ready to assist with your project quotes.',
            'يسعد فريقنا الهندسي والتجاري بالرد على استفساراتكم وتقديم عروض الأسعار.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* الشريط الجانبي */}
        <aside className="bg-[#0A1832] text-white rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-2xl border border-blue-900/40">
          <h2 className="text-xl sm:text-2xl font-bold border-b border-blue-900 pb-4">
            {pick('Contact Information', 'معلومات التواصل')}
          </h2>

          <div className="space-y-6 text-sm">
            {locations.map((l) => (
              <div key={l.id} className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl text-white shrink-0"
                  style={{ backgroundColor: `${themeColor}40` }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-bold text-white">{pick(l.name, l.nameAr)}</h3>
                  <p className="text-slate-400">{pick(l.address, l.addressAr)}</p>
                  {l.phone && (
                    <a
                      href={telHref(l.phone)}
                      dir="ltr"
                      className="inline-flex items-center gap-2 font-semibold text-slate-200 hover:text-white"
                    >
                      <Phone className="w-4 h-4 shrink-0" style={{ color: themeColor }} />
                      <span>{l.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}

            {emails.map((em) => (
              <div key={em} className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl text-white shrink-0"
                  style={{ backgroundColor: `${themeColor}40` }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-300">{pick('Email Address', 'البريد الإلكتروني')}</h3>
                  <a href={`mailto:${em}`} className="block text-slate-400 mt-1 hover:text-white break-all">
                    {em}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-900 pt-6">
            <Link
              to={ROUTES.locations}
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
            >
              {pick('All locations & maps', 'كل الفروع والخرائط')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </aside>

        {/* نموذج التواصل */}
        <div className="lg:col-span-2 bg-slate-900/50 p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {status === 'sent' ? (
            <div role="status" className="p-6 sm:p-8 text-center space-y-4 bg-green-950/40 rounded-2xl border border-green-800">
              <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">{pick('Message sent!', 'تم إرسال رسالتك!')}</h2>
              <p className="text-slate-300 text-sm sm:text-base">
                {pick(
                  'Thank you for reaching out to Kianko. Our team will get back to you soon.',
                  'شكراً لتواصلك مع كيانكو. هيرد عليك فريقنا في أقرب وقت.'
                )}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="text-sm font-bold text-white underline underline-offset-4 hover:opacity-80"
              >
                {pick('Send another message', 'إرسال رسالة تانية')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={set('website')} />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-name" className={label}>{pick('Full Name', 'الاسم بالكامل')}</label>
                  <input id="c-name" type="text" required minLength={2} maxLength={120} autoComplete="name" value={formData.name} onChange={set('name')} className={input} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-phone" className={label}>{pick('Phone Number', 'رقم الهاتف')}</label>
                  <input id="c-phone" type="tel" inputMode="tel" required minLength={5} maxLength={40} autoComplete="tel" dir="ltr" placeholder="+966 5x xxx xxxx" value={formData.phone} onChange={set('phone')} className={input} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-email" className={label}>{pick('Email Address', 'البريد الإلكتروني')}</label>
                  <input id="c-email" type="email" required maxLength={200} autoComplete="email" dir="ltr" value={formData.email} onChange={set('email')} className={input} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-branch" className={label}>{pick('Preferred location', 'الفرع المفضل للتواصل')}</label>
                  <select id="c-branch" value={formData.branch} onChange={set('branch')} className={input}>
                    <option value="any">{pick('Any Location', 'أي فرع')}</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{pick(l.name, l.nameAr)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="c-msg" className={label}>{pick('Inquiry Message', 'تفاصيل الطلب أو الرسالة')}</label>
                <textarea
                  id="c-msg"
                  rows={4}
                  required
                  minLength={5}
                  maxLength={4000}
                  placeholder={pick('Specify your structural steel specifications...', 'اكتب تفاصيل الكميات المطلوبة أو المواصفات...')}
                  value={formData.message}
                  onChange={set('message')}
                  className={input}
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>
                    {pick(
                      'We could not send your message. Please try again, or call us on the number shown.',
                      'مقدرناش نبعت رسالتك. جرّب تاني، أو كلمنا على الرقم الموضح.'
                    )}
                  </span>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full min-h-[52px] flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl shadow-xl transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: themeColor }}
              >
                {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
                <span>
                  {status === 'sending' ? pick('Sending…', 'جاري الإرسال…') : pick('Send Message', 'إرسال الرسالة الآن')}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}