import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useLocations } from '../hooks/useContent';
import { ROUTES } from '../routes';
import { supabase } from '../lib/supabase';

function isGibberish(text) {
  if (/(.)\1{3,}/i.test(text)) return true;
  return false;
}

function validateForm({ name, email, phone }) {
  const errors = [];

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim().replace(/\s+/g, '');

  const nameRegex = /^[\u0621-\u064Aa-zA-Z\s]{3,50}$/;
  if (!cleanName || !nameRegex.test(cleanName) || isGibberish(cleanName)) {
    errors.push('يرجى إدخال اسم ثلاثي أو ثنائي صحيح بدون حروف عشوائية.');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    errors.push('يرجى إدخال بريد إلكتروني صحيح ومفعل.');
  }

  const phoneRegex = /^(\+?[0-9]{8,15})$/;
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    errors.push('يرجى إدخال رقم هاتف صحيح (مثال: +966500000000 أو 0500000000).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    },
  };
}

export async function submitContactMessage({ name, email, phone, locationId, lang }) {
  const messageData = {
    name,
    email,
    phone,
    location_id: locationId === 'any' ? null : locationId,
    message: 'طلب تواصل سريع',
    lang,
    status: 'new',
  };

  const { data, error } = await supabase.from('contact_messages').insert([messageData]);
  if (error) throw new Error(error.message);

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

const empty = { name: '', email: '', phone: '', branch: 'any', website: '' };
const telHref = (v = '') => `tel:${v.replace(/\s/g, '')}`;

export default function Contact({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const locations = useLocations();

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(empty);

  const emails = [...new Set(locations.map((l) => l.email).filter(Boolean))];
  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.website) {
      setStatus('sent');
      return;
    }

    const validation = validateForm(formData);
    if (!validation.isValid) {
      setStatus('error');
      setErrorMessage(validation.errors[0]);
      return;
    }

    setStatus('sending');
    try {
      await submitContactMessage({
        ...validation.cleanData,
        locationId: formData.branch,
        lang,
      });
      setFormData(empty);
      setStatus('sent');
    } catch (err) {
      console.error('[contact]', err);
      setStatus('error');
      setErrorMessage(
        pick('Failed to send request. Please try again.', 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.')
      );
    }
  };

  // ✅ تم تحسين التباين ليطابق متطلبات Lighthouse 100%
  const cardBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/40' : 'bg-white text-slate-800 border-slate-200 shadow-xl';
  const formCardBg = darkMode ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-xl text-slate-800';
  const inputBg = darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-700'; // ✅ زيادة سطوع النص الرمادي الداكن
  const labelColor = darkMode ? 'text-xs font-bold text-slate-200' : 'text-xs font-bold text-slate-800'; // ✅ زيادة سطوع الـ Labels

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12 text-start"
      style={{ '--accent': themeColor }}
    >
      <div className="text-center space-y-3">
        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black ${textTitle}`}>
          {pick('Get in Touch with', 'تواصل مع')} <span style={{ color: themeColor }}>KIANKO</span>
        </h1>
        <p className={`max-w-xl mx-auto font-medium text-sm sm:text-base ${textDesc}`}>
          {pick(
            'Our team will contact you directly via phone or email.',
            'أدخل بياناتك وسيقوم فريقنا بالتواصل معك عبر الهاتف أو البريد الإلكتروني.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <aside className={`rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 border ${cardBg}`}>
          <h2 className={`text-xl sm:text-2xl font-bold border-b pb-4 ${darkMode ? 'border-blue-900 text-white' : 'border-slate-200 text-slate-900'}`}>
            {pick('Contact Information', 'معلومات التواصل')}
          </h2>

          <div className="space-y-6 text-sm">
            {locations.map((l) => (
              <div key={l.id} className="flex items-start gap-4">
                <div
                  className="p-3 rounded-2xl shrink-0 shadow-md border border-white/10"
                  style={{ backgroundColor: themeColor }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className={`font-bold ${textTitle}`}>{pick(l.name, l.nameAr)}</h3>
                  <p className={textDesc}>{pick(l.address, l.addressAr)}</p>
                  {l.phone && (
                    <a
                      href={telHref(l.phone)}
                      dir="ltr"
                      // ✅ تم تكبير مساحة النقر للرقم
                      className={`inline-flex items-center gap-2 font-semibold py-1 px-1 hover:opacity-80 min-h-[44px] ${textTitle}`}
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
                  className="p-3 rounded-2xl shrink-0 shadow-md border border-white/10"
                  style={{ backgroundColor: themeColor }}
                >
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold py-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{pick('Email Address', 'البريد الإلكتروني')}</h3>
                  {/* ✅ تم تكبير مساحة النقر للإيميل */}
                  <a href={`mailto:${em}`} className={`inline-block py-1 px-1 mt-1 hover:opacity-80 break-all min-h-[44px] ${textDesc}`}>
                    {em}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className={`border-t pt-6 ${darkMode ? 'border-blue-900' : 'border-slate-200'}`}>
            <Link
              to={ROUTES.locations}
              // ✅ تم تكبير مساحة النقر للرابط السفلي
              className={`inline-flex items-center justify-center gap-2 text-sm font-bold hover:underline min-h-[44px] px-2 ${textTitle}`}
            >
              {pick('All locations & maps', 'كل الفروع والخرائط')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </aside>

        <div className={`lg:col-span-2 p-5 sm:p-8 rounded-3xl border shadow-2xl ${formCardBg}`}>
          {status === 'sent' ? (
            <div role="status" className={`p-6 sm:p-8 text-center space-y-4 rounded-2xl border ${darkMode ? 'bg-green-950/40 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto" />
              <h2 className={`text-xl sm:text-2xl font-bold ${textTitle}`}>{pick('Request Received!', 'تم استلام طلبك بنجاح!')}</h2>
              <p className={`text-sm sm:text-base ${textDesc}`}>
                {pick(
                  'Thank you. Our team will contact you shortly.',
                  'شكراً لتواصلك مع كيانكو. هيرد عليك فريقنا في أقرب وقت.'
                )}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className={`text-sm font-bold underline underline-offset-4 hover:opacity-85 min-h-[44px] px-4 ${textTitle}`}
              >
                {pick('Submit another request', 'إرسال طلب جديد')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              <div className="hidden" aria-hidden="true">
                <input type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={set('website')} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-name" className={labelColor}>{pick('Full Name', 'الاسم بالكامل')}</label>
                  <input id="c-name" type="text" required autoComplete="name" value={formData.name} onChange={set('name')} className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] ${inputBg}`} placeholder={pick('e.g. Ahmed Ali', 'مثال: أحمد علي')} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-phone" className={labelColor}>{pick('Phone Number', 'رقم الهاتف')}</label>
                  <input id="c-phone" type="tel" inputMode="tel" required autoComplete="tel" dir="ltr" placeholder="+966 5x xxx xxxx" value={formData.phone} onChange={set('phone')} className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] ${inputBg}`} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-email" className={labelColor}>{pick('Email Address', 'البريد الإلكتروني')}</label>
                  <input id="c-email" type="email" required autoComplete="email" dir="ltr" placeholder="name@domain.com" value={formData.email} onChange={set('email')} className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] ${inputBg}`} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-branch" className={labelColor}>{pick('Preferred location', 'الفرع المفضل للتواصل')}</label>
                  <select id="c-branch" value={formData.branch} onChange={set('branch')} className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] ${inputBg}`}>
                    <option value="any">{pick('Any Location', 'أي فرع')}</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{pick(l.name, l.nameAr)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
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
                  {status === 'sending' ? pick('Sending…', 'جاري الإرسال…') : pick('Request Contact', 'طلب تواصل الآن')}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}