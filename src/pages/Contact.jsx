import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight,
  AlertCircle, Loader2, MessageSquare, ShieldCheck
} from 'lucide-react';
import { useLocations } from '../hooks/useContent';
import { ROUTES } from '../routes';
import { supabase } from '../lib/supabase';

// ثوابت تحجيم المرسل (Rate Limiting)
const COOLDOWN_MS = 15 * 60 * 1000; // 15 دقيقة بين كل رسالة وأخرى
const MAX_DAILY_MESSAGES = 3; // أقصى عدد رسائل في اليوم الواحد لنفس الجهاز
const MIN_FILL_TIME_MS = 3000; // 3 ثوانٍ كحد أدنى لملء النموذج لمنع البوتات

// القائمة السوداء للكلمات التجريبية والوهمية
const BLOCKED_WORDS = [
  'test', 'testing', 'tester', 'asdf', 'qwerty', 'admin', 'root', 'null', 'undefined',
  'script', 'alert', 'onload', 'onerror', 'svg', 'iframe', 'javascript', 'eval',
  'تجربه', 'تجربة', 'تيست', 'تست', 'وهمي', 'فحص', 'هاك', 'هكر'
];

// 1. دالة تطهير فورية تمنع ثغرات XSS أثناء الكتابة وقبل الإرسال
export function sanitizePlainText(input = '', maxLen = 200) {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>?/gm, '') // إزالة أي وسوم HTML نهائياً
    .replace(/[<>{}[\]\\^`~;$]/g, '') // منع الرموز البرمجية الخطرة
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\u0000-\u001F\u007F]/g, '') // إزالة محارف التحكم الخفية
    .slice(0, maxLen);
}

// 2. دالة ذكية لكشف الكلمات العشوائية مثل "Moggjff" أو تكرار الحروف مثل "aaaa"
function isGibberishOrFakeText(text = '') {
  const clean = text.trim().toLowerCase();
  if (!clean) return true;

  // منع تكرار نفس الحرف 3 مرات متتالية أو أكثر (مثل aaa أو هههه)
  if (/(.)\1{2,}/i.test(clean)) return true;

  // فحص الكلمات الإنجليزية: أي كلمة إنجليزية طولها 4 حروف فأكثر يجب أن تحتوي على حرف متحرك واحد على الأقل، ولا تحتوي على 5 حروف ساكنة متتالية (يكشف Moggjff وأمثالها)
  const words = clean.split(/\s+/);
  for (const w of words) {
    if (BLOCKED_WORDS.includes(w)) return true;
    const isLatin = /^[a-z]+$/i.test(w);
    if (isLatin && w.length >= 4) {
      if (!/[aeiouy]/i.test(w)) return true; // لا يوجد أي حرف متحرك
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) return true; // 5 حروف ساكنة متتالية
    }
  }

  return false;
}

// 3. دالة التحقق الصارمة من جميع حقول التواصل
function validateForm({ name, email, phone, message }, isAr = true) {
  const errors = [];

  const cleanName = sanitizePlainText(name, 60).trim().replace(/\s+/g, ' ');
  const cleanEmail = sanitizePlainText(email, 100).trim().toLowerCase();
  const cleanPhone = sanitizePlainText(phone, 20).trim().replace(/[\s()-]/g, '');
  const cleanMessage = sanitizePlainText(message, 400).trim();

  // أ) التحقق من الاسم الكامل (يجب أن يكون اسمين على الأقل بينهما مسافة، حروف عربية أو إنجليزية فقط)
  const nameWords = cleanName.split(' ').filter((w) => w.length >= 2);
  const nameRegex = /^[\u0621-\u064Aa-zA-Z\s]{5,60}$/;
  if (
    !cleanName ||
    nameWords.length < 2 ||
    !nameRegex.test(cleanName) ||
    isGibberishOrFakeText(cleanName)
  ) {
    errors.push(
      isAr
        ? 'يرجى كتابة الاسم الثنائي أو الثلاثي الحقيقي بالكامل (لا يُقبل اسم مفرد أو حروف عشوائية مثل test).'
        : 'Please enter your real full name (first and last name, at least two words without random characters).'
    );
  }

  // ب) التحقق الصارم من البريد الإلكتروني (منع aaa@gmail.com والإيميلات الوهمية)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  const [localPart = '', domainPart = ''] = cleanEmail.split('@');
  const domainName = domainPart.split('.')[0] || '';
  const isFakeEmail =
    localPart.length < 3 ||
    /^(.)\1+$/i.test(localPart) || // مثل aaa@ أو 111@
    /^(test|testing|admin|user|abc|abcd|123|1234|qwe|asdf|none|null|fake)$/i.test(localPart) ||
    /^(test|example|invalid|localhost|temp|tempmail|mailinator)$/i.test(domainName);

  if (!cleanEmail || !emailRegex.test(cleanEmail) || isFakeEmail) {
    errors.push(
      isAr
        ? 'يرجى إدخال بريد إلكتروني رسمي أو شخصي صحيح (لا تُقبل الإيميلات التجريبية أو الوهمية).'
        : 'Please enter a valid, real email address (test or fake emails are not accepted).'
    );
  }

  // ج) التحقق الصارم من رقم الجوال (منع +960000000 و 04689878 والأرقام المكررة)
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  const isSaudiMobile = /^(05\d{8}|9665\d{8})$/.test(digitsOnly);
  const isEgyptMobile = /^(01[0125]\d{8}|201[0125]\d{8})$/.test(digitsOnly);
  const isGccOrIntlMobile = /^[1-9]\d{9,13}$/.test(digitsOnly);
  const hasRepeatedDigits = /(\d)\1{4,}/.test(digitsOnly) || /012345|123456|654321/.test(digitsOnly);

  if (
    !cleanPhone ||
    hasRepeatedDigits ||
    !(isSaudiMobile || isEgyptMobile || isGccOrIntlMobile)
  ) {
    errors.push(
      isAr
        ? 'يرجى إدخال رقم جوال صحيح وفعّال (مثال للسعودية: 05XXXXXXXX أو +9665XXXXXXXX).'
        : 'Please enter a valid mobile number (e.g. Saudi mobile: 05XXXXXXXX or +9665XXXXXXXX).'
    );
  }

  // د) التحقق من تفاصيل الرسالة (إجباري من 10 إلى 400 حرف بدون أكواد أو كلام عشوائي)
  if (!cleanMessage || cleanMessage.length < 10) {
    errors.push(
      isAr
        ? 'يرجى كتابة تفاصيل استفسارك أو المنتجات المطلوبة بوضوح (10 أحرف على الأقل).'
        : 'Please write your inquiry details clearly (at least 10 characters).'
    );
  } else if (isGibberishOrFakeText(cleanMessage)) {
    errors.push(
      isAr
        ? 'يرجى كتابة رسالة حقيقية وواضحة بدون رموز أو حروف مكررة عشوائية.'
        : 'Please write a clear, valid inquiry without random repeated characters.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    },
  };
}

// 4. فحص تحجيم المرسل (Rate Limit) لمنع إغراق الموقع بالرسائل
function checkSenderRateLimit(isAr) {
  try {
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10);
    const rawLog = JSON.parse(localStorage.getItem('kianko_contact_rate_limit') || '{}');

    // فحص وقت آخر رسالة (15 دقيقة انتظار)
    if (rawLog.lastSentAt && now - rawLog.lastSentAt < COOLDOWN_MS) {
      const remainingMins = Math.ceil((COOLDOWN_MS - (now - rawLog.lastSentAt)) / 60000);
      return {
        allowed: false,
        reason: isAr
          ? `لقد قمت بإرسال طلب مؤخراً. يرجى الانتظار ${remainingMins} دقيقة قبل إرسال طلب جديد.`
          : `You recently submitted a request. Please wait ${remainingMins} minute(s) before sending another.`,
      };
    }

    // فحص الحد الأقصى اليومي (3 رسائل كحد أقصى في اليوم)
    const countToday = rawLog.date === todayStr ? (rawLog.count || 0) : 0;
    if (countToday >= MAX_DAILY_MESSAGES) {
      return {
        allowed: false,
        reason: isAr
          ? 'لقد وصلت للحد الأقصى المسموح به من الرسائل اليومية. سيتواصل معك فريقنا قريباً.'
          : 'You have reached the maximum daily limit of requests. Our team will contact you soon.',
      };
    }

    return { allowed: true, countToday, todayStr };
  } catch {
    return { allowed: true, countToday: 0, todayStr: '' };
  }
}

function recordSenderSubmission() {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const rawLog = JSON.parse(localStorage.getItem('kianko_contact_rate_limit') || '{}');
    const prevCount = rawLog.date === todayStr ? (rawLog.count || 0) : 0;
    localStorage.setItem(
      'kianko_contact_rate_limit',
      JSON.stringify({
        date: todayStr,
        count: prevCount + 1,
        lastSentAt: Date.now(),
      })
    );
  } catch {
    // ignore storage errors
  }
}

export async function submitContactMessage({ name, email, phone, message, locationId, branchLabel, lang }) {
  const safeName = sanitizePlainText(name, 60);
  const safeEmail = sanitizePlainText(email, 100);
  const safePhone = sanitizePlainText(phone, 20);
  const safeBranch = sanitizePlainText(branchLabel || (lang === 'ar' ? 'المقر الرئيسي - جدة / الرياض' : 'Head Office - Jeddah / Riyadh'), 80);
  const safeMsgBody = sanitizePlainText(message, 400);

  const formattedMessage = `[${safeBranch}] ${safeMsgBody}`;

  const dbPayload = {
    name: safeName,
    email: safeEmail,
    phone: safePhone,
    location_id: locationId === 'any' ? safeBranch : locationId,
    message: formattedMessage,
    lang,
    status: 'new',
  };

  let { data, error } = await supabase.from('contact_messages').insert([dbPayload]);

  if (error) {
    const fallbackRes = await supabase.from('contact_messages').insert([
      {
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        message: formattedMessage,
      },
    ]);
    if (fallbackRes.error) throw new Error(fallbackRes.error.message);
    data = fallbackRes.data;
  }

  // إرسال البيانات مطهرة بالكامل إلى Make.com مع ملء حقول الفرع والرسالة لضمان عدم ظهورها فارغة في الإيميل
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: safeName,
          email: safeEmail,
          phone: safePhone,
          lang,
          location_id: safeBranch,
          branch: safeBranch,
          preferred_branch: safeBranch,
          message: safeMsgBody,
          details: safeMsgBody,
          status: 'new',
        }),
      });
    } catch (err) {
      console.error('Failed to notify Make.com:', err);
    }
  }

  return data;
}

const empty = { name: '', email: '', phone: '', branch: 'any', message: '', website: '' };
const telHref = (v = '') => `tel:${v.replace(/\s/g, '')}`;

export default function Contact({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const locations = useLocations();
  const mountTimeRef = useRef(Date.now());

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(empty);

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

  const emails = [...new Set(locations.map((l) => l.email).filter(Boolean))];

  // تطهير المدخلات لحظياً أثناء الكتابة لمنع إدخال أي كود XSS
  const set = (key, maxLen = 100) => (e) => {
    let val = sanitizePlainText(e.target.value, maxLen);
    if (key === 'phone') {
      val = val.replace(/[^0-9+\s-]/g, '');
    }
    setFormData({ ...formData, [key]: val });
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. فحص مصيدة البوتات (Honeypot + سرعة الإرسال)
    if (formData.website || Date.now() - mountTimeRef.current < MIN_FILL_TIME_MS) {
      setStatus('sent');
      return;
    }

    // 2. فحص تحجيم المرسل (Rate Limit)
    const rateCheck = checkSenderRateLimit(isAr);
    if (!rateCheck.allowed) {
      setStatus('error');
      setErrorMessage(rateCheck.reason);
      return;
    }

    // 3. التحقق الصارم من صحة وحقيقة البيانات ومنع XSS
    const validation = validateForm(formData, isAr);
    if (!validation.isValid) {
      setStatus('error');
      setErrorMessage(validation.errors[0]);
      return;
    }

    const selectedLocationObj = locations.find((l) => String(l.id) === String(formData.branch));
    const branchLabel = selectedLocationObj
      ? pick(selectedLocationObj.name, selectedLocationObj.nameAr)
      : pick('Head Office (Jeddah / Riyadh)', 'المكتب الرئيسي (جدة / الرياض)');

    setStatus('sending');
    try {
      await submitContactMessage({
        ...validation.cleanData,
        locationId: formData.branch,
        branchLabel,
        lang,
      });
      recordSenderSubmission();
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

  const cardBg = darkMode ? 'bg-[#0A1832] text-white border-blue-900/40 shadow-xl' : 'bg-white text-slate-800 border-slate-200 shadow-xl';
  const formCardBg = darkMode ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-xl text-slate-800';
  const inputBg = darkMode ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-red-500';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-300' : 'text-slate-700';
  const labelColor = darkMode ? 'text-xs font-bold text-slate-200' : 'text-xs font-bold text-slate-800';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12 text-start overflow-x-hidden"
      style={{
        '--accent': themeColor,
        fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center space-y-3"
      >
        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black ${textTitle}`}>
          {pick('Get in Touch with', 'تواصل مع')}{' '}
          <span style={{ color: themeColor }}>{pick('KIANKO', 'كيانكو')}</span>
        </h1>
        <p className={`max-w-xl mx-auto font-medium text-sm sm:text-base ${textDesc}`}>
          {pick(
            'Our engineering and sales team in Saudi Arabia will contact you directly via phone or email.',
            'أدخل بياناتك وسيقوم فريق المبيعات والدعم الفني بشركة كيانكو بالتواصل معك عبر الهاتف أو البريد الإلكتروني.'
          )}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 border ${cardBg}`}
        >
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
                  <p className={`leading-relaxed ${textDesc}`}>{pick(l.address, l.addressAr)}</p>
                  {l.phone && (
                    <a
                      href={telHref(l.phone)}
                      dir="ltr"
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
                  <h3 className={`font-bold py-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {pick('Email Address', 'البريد الإلكتروني')}
                  </h3>
                  <a
                    href={`mailto:${em}`}
                    dir="ltr"
                    className={`inline-block py-1 px-1 mt-1 hover:opacity-80 break-all min-h-[44px] ${textDesc}`}
                  >
                    {em}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className={`border-t pt-6 ${darkMode ? 'border-blue-900' : 'border-slate-200'}`}>
            <Link
              to={ROUTES.locations}
              className={`inline-flex items-center justify-center gap-2 text-sm font-bold hover:underline min-h-[44px] px-2 ${textTitle}`}
            >
              <span>{pick('All locations & maps', 'كل الفروع والخرائط')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          className={`lg:col-span-2 p-5 sm:p-8 rounded-3xl border shadow-2xl ${formCardBg}`}
        >
          {status === 'sent' ? (
            <div role="status" className={`p-6 sm:p-8 text-center space-y-4 rounded-2xl border ${darkMode ? 'bg-green-950/40 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto" />
              <h2 className={`text-xl sm:text-2xl font-bold ${textTitle}`}>
                {pick('Request Received Successfully!', 'تم استلام طلبك بنجاح!')}
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                {pick(
                  'Thank you for contacting KIANKO Steel Industries. Our team will contact you shortly.',
                  'شكراً لتواصلك مع شركة كيانكو للصناعات الحديدية. سيتواصل معك فريقنا المختص في أقرب وقت ممكن.'
                )}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className={`text-sm font-bold underline underline-offset-4 hover:opacity-85 min-h-[44px] px-4 cursor-pointer ${textTitle}`}
              >
                {pick('Submit another request', 'إرسال طلب تواصل جديد')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              {/* حقل مصيدة البوتات المخفي */}
              <div className="hidden" aria-hidden="true">
                <input type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={set('website', 50)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-name" className={labelColor}>
                    {pick('Full Name (First & Last Name) *', 'الاسم الثنائي أو الثلاثي بالكامل *')}
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    minLength={5}
                    maxLength={60}
                    autoComplete="name"
                    value={formData.name}
                    onChange={set('name', 60)}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none min-h-[48px] transition-colors ${inputBg}`}
                    placeholder={pick('e.g. Ahmed Al-Salem', 'مثال: أحمد محمد السالم')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-phone" className={labelColor}>
                    {pick('Mobile Number *', 'رقم الجوال الفعلي *')}
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    minLength={10}
                    maxLength={16}
                    autoComplete="tel"
                    dir="ltr"
                    placeholder="05XXXXXXXX / +9665XXXXXXXX"
                    value={formData.phone}
                    onChange={set('phone', 16)}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none min-h-[48px] transition-colors ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="c-email" className={labelColor}>
                    {pick('Official / Active Email Address *', 'البريد الإلكتروني الرسمي / الفعّال *')}
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    maxLength={100}
                    autoComplete="email"
                    dir="ltr"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={set('email', 100)}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none min-h-[48px] transition-colors ${inputBg}`}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="c-branch" className={labelColor}>
                    {pick('Preferred Branch *', 'الفرع المفضل للتواصل *')}
                  </label>
                  <select
                    id="c-branch"
                    value={formData.branch}
                    onChange={set('branch', 40)}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none min-h-[48px] cursor-pointer transition-colors ${inputBg}`}
                  >
                    <option value="any">{pick('Head Office (Jeddah / Riyadh)', 'المكتب الرئيسي (جدة / الرياض)')}</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {pick(l.name, l.nameAr)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="c-message" className={`flex items-center gap-1.5 ${labelColor}`}>
                    <MessageSquare className="w-3.5 h-3.5" style={{ color: themeColor }} />
                    <span>{pick('Inquiry or Project Details *', 'تفاصيل الاستفسار أو المنتجات المطلوبة *')}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.message.length}/400
                  </span>
                </div>
                <textarea
                  id="c-message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={400}
                  value={formData.message}
                  onChange={set('message', 400)}
                  placeholder={pick(
                    'Please describe the required steel systems, cable trays, or project quantities (10 to 400 characters)…',
                    'يرجى كتابة تفاصيل المنتجات المطلوبة أو اسم المشروع بوضوح (من 10 إلى 400 حرف)…'
                  )}
                  className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none transition-colors resize-none ${inputBg}`}
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-xs sm:text-sm text-red-300 bg-red-950/50 border border-red-800 rounded-xl p-3.5 font-semibold leading-relaxed">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full min-h-[52px] flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: themeColor }}
              >
                {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
                <span>
                  {status === 'sending' ? pick('Sending…', 'جاري الإرسال…') : pick('Send Official Inquiry', 'إرسال الطلب الآن')}
                </span>
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}