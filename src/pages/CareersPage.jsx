import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload, CheckCircle2, AlertCircle, Loader2, X,
  MapPin, Briefcase, ShieldCheck, FileText
} from 'lucide-react';
import { useJobs } from '../hooks/useContent';
import SpotlightCard from '../components/ui/SpotlightCard';
import { submitJobApplication, CV_MAX_BYTES, CV_TYPES } from '../lib/api';
import { supabase } from '../lib/supabase';

// ثوابت الحماية وتحجيم المرسل (Rate Limiting)
const COOLDOWN_MS = 15 * 60 * 1000; // 15 دقيقة بين كل طلب توظيف وآخر
const MAX_DAILY_APPLICATIONS = 3; // أقصى عدد طلبات توظيف في اليوم الواحد
const MIN_FILL_TIME_MS = 3000; // 3 ثوانٍ كحد أدنى لمنع الإرسال الآلي (Bots)
const MIN_CV_BYTES = 2048; // 2 كيلوبايت كحد أدنى لمنع الملفات الفارغة الوهمية

const BLOCKED_WORDS = [
  'test', 'testing', 'tester', 'asdf', 'qwerty', 'admin', 'root', 'null', 'undefined',
  'script', 'alert', 'onload', 'onerror', 'svg', 'iframe', 'javascript', 'eval',
  'تجربه', 'تجربة', 'تيست', 'تست', 'وهمي', 'فحص', 'هاك', 'هكر'
];

// 1. دالة تطهير فورية تمنع ثغرات XSS أثناء الكتابة وقبل الإرسال
function sanitizePlainText(input = '', maxLen = 150) {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>?/gm, '') // إزالة أي وسوم HTML نهائياً
    .replace(/[<>{}[\]\\^`~;$]/g, '') // منع الرموز البرمجية الخطرة
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, maxLen);
}

// 2. دالة تطهير اسم ملف السيرة الذاتية من أي أكواد XSS أو امتدادات مزدوجة خبيثة
function sanitizeFileName(fileName = '') {
  const clean = sanitizePlainText(fileName, 100).replace(/[^a-zA-Z0-9\u0621-\u064A._-]/g, '_');
  return clean || 'resume.pdf';
}

// 3. دالة ذكية لكشف الكلمات العشوائية مثل "Moggjff" أو الحروف المكررة مثل "aaaa"
function isGibberishOrFakeText(text = '') {
  const clean = text.trim().toLowerCase();
  if (!clean) return true;

  // منع تكرار نفس الحرف 3 مرات متتالية أو أكثر
  if (/(.)\1{2,}/i.test(clean)) return true;

  const words = clean.split(/\s+/);
  for (const w of words) {
    if (BLOCKED_WORDS.includes(w)) return true;
    const isLatin = /^[a-z]+$/i.test(w);
    if (isLatin && w.length >= 4) {
      if (!/[aeiouy]/i.test(w)) return true; // كلمة بدون أي حرف متحرك
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) return true; // 5 حروف ساكنة متتالية
    }
  }

  return false;
}

// 4. دالة التحقق الصارمة من بيانات المتقدم للوظيفة
function validateCareerForm({ name, email, phone }, file, isAr = true) {
  const errors = [];

  const cleanName = sanitizePlainText(name, 60).trim().replace(/\s+/g, ' ');
  const cleanEmail = sanitizePlainText(email, 100).trim().toLowerCase();
  const cleanPhone = sanitizePlainText(phone, 20).trim().replace(/[\s()-]/g, '');

  // أ) التحقق من الاسم الثنائي أو الثلاثي الحقيقي
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

  // ب) التحقق الصارم من البريد الإلكتروني
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  const [localPart = '', domainPart = ''] = cleanEmail.split('@');
  const domainName = domainPart.split('.')[0] || '';
  const isFakeEmail =
    localPart.length < 3 ||
    /^(.)\1+$/i.test(localPart) ||
    /^(test|testing|admin|user|abc|abcd|123|1234|qwe|asdf|none|null|fake)$/i.test(localPart) ||
    /^(test|example|invalid|localhost|temp|tempmail|mailinator)$/i.test(domainName);

  if (!cleanEmail || !emailRegex.test(cleanEmail) || isFakeEmail) {
    errors.push(
      isAr
        ? 'يرجى إدخال بريد إلكتروني رسمي أو شخصي صحيح (لا تُقبل الإيميلات التجريبية أو الوهمية).'
        : 'Please enter a valid, real email address (test or fake emails are not accepted).'
    );
  }

  // ج) التحقق الصارم من رقم الجوال
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

  // د) التحقق الأمني من ملف السيرة الذاتية (CV)
  if (!file) {
    errors.push(
      isAr
        ? 'يرجى إرفاق ملف السيرة الذاتية (بصيغة PDF أو Word) قبل الإرسال.'
        : 'Please attach your CV (PDF or Word document) before submitting.'
    );
  } else {
    const allowedExtRegex = /\.(pdf|doc|docx)$/i;
    const dangerousDoubleExt = /\.(exe|js|html|htm|svg|php|sh|bat|cmd)\./i;
    if (
      !CV_TYPES.includes(file.type) ||
      !allowedExtRegex.test(file.name) ||
      dangerousDoubleExt.test(file.name)
    ) {
      errors.push(
        isAr
          ? 'صيغة الملف غير مدعومة أو غير آمنة. يرجى رفع ملف PDF أو Word فقط.'
          : 'Unsupported or unsafe file format. Please upload a PDF or Word file only.'
      );
    } else if (file.size < MIN_CV_BYTES) {
      errors.push(
        isAr
          ? 'الملف المرفق صغير جداً أو فارغ. يرجى رفع سيرة ذاتية صالحة.'
          : 'The attached file is empty or too small. Please upload a valid CV.'
      );
    } else if (file.size > CV_MAX_BYTES) {
      errors.push(
        isAr
          ? 'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).'
          : 'File size exceeds the maximum allowed limit (5 MB).'
      );
    }
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

// 5. فحص وتسجيل تحجيم المرسل (Rate Limit) لمنع إغراق طلبات التوظيف
function checkCareerRateLimit(isAr) {
  try {
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10);
    const rawLog = JSON.parse(localStorage.getItem('kianko_career_rate_limit') || '{}');

    if (rawLog.lastSentAt && now - rawLog.lastSentAt < COOLDOWN_MS) {
      const remainingMins = Math.ceil((COOLDOWN_MS - (now - rawLog.lastSentAt)) / 60000);
      return {
        allowed: false,
        reason: isAr
          ? `لقد قمت بإرسال طلب توظيف مؤخراً. يرجى الانتظار ${remainingMins} دقيقة قبل إرسال طلب آخر.`
          : `You recently submitted an application. Please wait ${remainingMins} minute(s) before applying again.`,
      };
    }

    const countToday = rawLog.date === todayStr ? (rawLog.count || 0) : 0;
    if (countToday >= MAX_DAILY_APPLICATIONS) {
      return {
        allowed: false,
        reason: isAr
          ? 'لقد وصلت للحد الأقصى المسموح به من طلبات التوظيف اليومية. سيقوم فريق الموارد البشرية بمراجعة طلبك.'
          : 'You have reached the maximum daily limit of job applications. Our HR team will review your submission.',
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordCareerSubmission() {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const rawLog = JSON.parse(localStorage.getItem('kianko_career_rate_limit') || '{}');
    const prevCount = rawLog.date === todayStr ? (rawLog.count || 0) : 0;
    localStorage.setItem(
      'kianko_career_rate_limit',
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

export default function CareersPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const staticJobs = useJobs();
  const formRef = useRef(null);
  const mountTimeRef = useRef(Date.now());

  const [dbJobs, setDbJobs] = useState([]);
  const [deletedJobIds, setDeletedJobIds] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', website: '' });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('idle');

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

  // جلب الوظائف المضافة من لوحة التحكم (Supabase) مع تطهير النصوص واستبعاد المحذوفات
  useEffect(() => {
    const fetchCareersFromDB = async () => {
      let hidden = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('kianko_deleted_items') || '{}');
        hidden = (parsed.jobs || []).map(String);
      } catch {
        hidden = [];
      }
      setDeletedJobIds(hidden);

      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const validDbJobs = data
            .filter((j) => j.title && sanitizePlainText(j.title, 100).trim().length >= 3)
            .map((j) => ({
              id: `db_${j.id}`,
              rawId: String(j.id),
              titleEn: sanitizePlainText(j.title_en || j.title, 100),
              titleAr: sanitizePlainText(j.title, 100),
              dept: sanitizePlainText(j.department, 80) || pick('Engineering & Operations', 'الهندسة والتشغيل'),
              location: sanitizePlainText(j.location, 80) || pick('Riyadh / Jeddah, KSA', 'الرياض / جدة - السعودية'),
              description: sanitizePlainText(j.description, 300) || '',
            }));
          setDbJobs(validDbJobs);
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
      }
    };

    fetchCareersFromDB();
  }, [isAr]);

  const jobs = useMemo(() => {
    const formattedStatic = (staticJobs || [])
      .filter((j) => !deletedJobIds.includes(String(j.id)))
      .map((j) => ({
        ...j,
        titleEn: sanitizePlainText(j.titleEn || j.title || 'Engineer', 100),
        titleAr: sanitizePlainText(j.titleAr || j.title || 'مهندس', 100),
        dept: sanitizePlainText(j.dept || j.department || '', 80),
        location: sanitizePlainText(j.location || pick('Riyadh / Jeddah', 'الرياض / جدة'), 80),
        description: sanitizePlainText(j.description || '', 300),
      }));

    const activeDbJobs = dbJobs.filter(
      (j) => !deletedJobIds.includes(String(j.id)) && !deletedJobIds.includes(String(j.rawId))
    );

    return [...activeDbJobs, ...formattedStatic];
  }, [dbJobs, staticJobs, deletedJobIds, isAr]);

  const selectedJob = jobs.find((j) => j.id === jobId);

  // تطهير المدخلات لحظياً أثناء الكتابة لمنع إدخال أي كود XSS
  const set = (k, maxLen = 100) => (e) => {
    let val = sanitizePlainText(e.target.value, maxLen);
    if (k === 'phone') {
      val = val.replace(/[^0-9+\s-]/g, '');
    }
    setForm({ ...form, [k]: val });
    if (fileError) setFileError('');
    if (status === 'error') setStatus('idle');
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFileError('');
    if (!f) return setFile(null);

    const allowedExtRegex = /\.(pdf|doc|docx)$/i;
    const dangerousDoubleExt = /\.(exe|js|html|htm|svg|php|sh|bat|cmd)\./i;

    if (!CV_TYPES.includes(f.type) || !allowedExtRegex.test(f.name) || dangerousDoubleExt.test(f.name)) {
      setFile(null);
      return setFileError(
        pick(
          'Unsupported or unsafe file format. Please upload a PDF or Word file only.',
          'صيغة الملف غير مدعومة أو غير آمنة. يرجى رفع ملف PDF أو Word فقط.'
        )
      );
    }
    if (f.size < MIN_CV_BYTES) {
      setFile(null);
      return setFileError(
        pick(
          'The attached file is empty or too small. Please upload a valid CV.',
          'الملف المرفق صغير جداً أو فارغ. يرجى رفع سيرة ذاتية صالحة.'
        )
      );
    }
    if (f.size > CV_MAX_BYTES) {
      setFile(null);
      return setFileError(
        pick(
          'File is larger than 5 MB.',
          'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).'
        )
      );
    }
    setFile(f);
  };

  const apply = (id) => {
    setJobId(id);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFileError('');

    // 1. فحص مصيدة البوتات (Honeypot + سرعة الملء)
    if (form.website || Date.now() - mountTimeRef.current < MIN_FILL_TIME_MS) {
      return setStatus('sent');
    }

    // 2. فحص تحجيم المرسل (Rate Limit)
    const rateCheck = checkCareerRateLimit(isAr);
    if (!rateCheck.allowed) {
      return setFileError(rateCheck.reason);
    }

    // 3. التحقق الصارم من الاسم الثنائي والإيميل والجوال وملف السيرة الذاتية
    const validation = validateCareerForm(form, file, isAr);
    if (!validation.isValid) {
      return setFileError(validation.errors[0]);
    }

    const { name: cleanName, email: cleanEmail, phone: cleanPhone } = validation.cleanData;
    const safeCvFileName = sanitizeFileName(file.name);

    setStatus('sending');

    try {
      const jobTitleText = selectedJob
        ? sanitizePlainText(pick(selectedJob.titleEn, selectedJob.titleAr), 100)
        : pick('General Engineering Application', 'تقديم عام للوظائف الهندسية');

      // رفع السيرة الذاتية باسم مطهر تماماً إلى Supabase Storage
      let cvPublicUrl = '';
      try {
        const storagePath = `cv_${Date.now()}_${safeCvFileName}`;
        const { error: uploadErr } = await supabase.storage.from('certificates').upload(storagePath, file);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(storagePath);
          cvPublicUrl = urlData?.publicUrl || '';
        }
      } catch {
        // المتابعة بأمان حتى لو كان التخزين مقفلاً
      }

      const applicationSummary = isAr
        ? `[طلب توظيف: ${jobTitleText}]${cvPublicUrl ? ` | رابط السيرة الذاتية: ${cvPublicUrl}` : ` | المرفق: ${safeCvFileName}`}`
        : `[Job Application: ${jobTitleText}]${cvPublicUrl ? ` | CV Link: ${cvPublicUrl}` : ` | Attached: ${safeCvFileName}`}`;

      await supabase.from('contact_messages').insert([
        {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: sanitizePlainText(applicationSummary, 380),
        },
      ]);

      try {
        await submitJobApplication({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          website: form.website,
          jobId: selectedJob ? jobTitleText : jobId,
          file,
          lang,
        });
      } catch {
        // تم الحفظ بنجاح في قاعدة البيانات
      }

      recordCareerSubmission();
      setForm({ name: '', email: '', phone: '', website: '' });
      setFile(null);
      setJobId('');
      setStatus('sent');
    } catch (err) {
      console.error('[careers]', err);
      setStatus('error');
    }
  };

  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textDesc = darkMode ? 'text-slate-400' : 'text-slate-600';
  const cardBg = darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md';
  const jobTitleColor = darkMode ? 'text-white' : 'text-slate-900';
  const jobDeptColor = darkMode ? 'text-slate-400' : 'text-slate-500';
  
  const formBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xl';
  const inputBg = darkMode 
    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-red-500' 
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500';
  const uploadBox = darkMode 
    ? 'border-slate-700 bg-slate-900/50 hover:border-red-500/60 text-slate-300' 
    : 'border-slate-300 bg-slate-50 hover:border-red-500/60 text-slate-700';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 text-start overflow-x-hidden"
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center space-y-3"
      >
        <h1 className={`text-3xl sm:text-5xl font-black ${textTitle}`}>
          {pick('Careers at', 'انضم لفرق')}{' '}
          <span style={{ color: themeColor }}>{pick('KIANKO STEEL', 'كيانكو الهندسية')}</span>
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto ${textDesc}`}>
          {pick(
            'Shape the future of heavy industrial engineering with our team in Saudi Arabia.',
            'نبحث دائماً عن الكفاءات الهندسية والفنية المتميزة للانضمام إلى فريق عمل شركة كيانكو للصناعات الحديدية في المملكة العربية السعودية.'
          )}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        {/* قائمة الوظائف المتاحة */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-4"
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${textTitle}`}>
            {pick(`Open Positions (${jobs.length})`, `الوظائف المتاحة حالياً (${jobs.length})`)}
          </h2>

          {jobs.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center ${cardBg}`}>
              <p className={`text-sm leading-relaxed ${textDesc}`}>
                {pick(
                  'No open positions at the moment. You can still send your resume for future opportunities.',
                  'لا توجد وظائف شاغرة معلنة حالياً، يمكنك إرسال سيرتك الذاتية عبر النموذج للتواصل معك عند توفر شواغر تناسب تخصصك.'
                )}
              </p>
            </div>
          ) : (
            jobs.map((job) => {
              const on = job.id === jobId;
              return (
                <SpotlightCard
                  key={job.id}
                  darkMode={darkMode}
                  className={`${cardBg} p-5 sm:p-6 rounded-2xl border flex justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
                    on 
                      ? (darkMode ? 'border-red-500/70 ring-1 ring-red-500/30' : 'border-red-500 shadow-lg') 
                      : (darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="space-y-2 min-w-0">
                    <h3 className={`font-bold text-base sm:text-lg ${jobTitleColor}`}>
                      {pick(job.titleEn, job.titleAr)}
                    </h3>
                    <div className={`flex flex-wrap items-center gap-3 text-xs ${jobDeptColor}`}>
                      {job.dept && (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{job.dept}</span>
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{job.location}</span>
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className={`text-xs leading-relaxed pt-1 ${textDesc}`}>
                        {job.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => apply(job.id)}
                    aria-label={pick(`Apply for ${job.titleEn}`, `التقديم لوظيفة ${job.titleAr}`)}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white shadow-md shrink-0 hover:opacity-90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {on ? pick('Selected ✓', 'تم الاختيار ✓') : pick('Apply Now', 'تقديم الآن')}
                  </button>
                </SpotlightCard>
              );
            })
          )}
        </motion.div>

        {/* نموذج إرسال السيرة الذاتية المؤمّن */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 scroll-mt-28 ${formBg}`}
        >
          <h2 className={`text-xl font-bold ${textTitle}`}>
            {pick('Send Your Resume (CV)', 'إرسال السيرة الذاتية مباشرة')}
          </h2>

          {status === 'sent' ? (
            <div role="status" className="space-y-4 text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <p className={`text-sm font-bold leading-relaxed ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {pick(
                  'Your application has been received successfully. Our HR team at KIANKO will contact you soon.',
                  'تم استلام طلب التوظيف وسيرتك الذاتية بنجاح. سيتواصل معك فريق الموارد البشرية بشركة كيانكو قريباً.'
                )}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                aria-label={pick('Submit another application', 'إرسال طلب توظيف آخر')}
                className={`text-sm font-bold underline min-h-[44px] px-4 underline-offset-4 hover:opacity-80 cursor-pointer ${textTitle}`}
              >
                {pick('Submit another application', 'إرسال طلب توظيف آخر')}
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              {/* حقل مصيدة البوتات المخفي */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website', 50)} />
                </label>
              </div>

              {selectedJob && (
                <p className={`flex items-center justify-between gap-3 text-xs border rounded-xl px-4 py-2.5 ${darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
                  <span>
                    {pick('Applying for:', 'التقديم على وظيفة:')}{' '}
                    <strong className={textTitle}>{pick(selectedJob.titleEn, selectedJob.titleAr)}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setJobId('')}
                    aria-label={pick('Clear selection', 'إلغاء الاختيار')}
                    className="hover:opacity-75 min-h-[32px] px-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </p>
              )}

              <div className="space-y-1.5">
                <label htmlFor="cv-name" className="text-xs font-bold block opacity-90">
                  {pick('Full Name (First & Last Name) *', 'الاسم الثنائي أو الثلاثي بالكامل *')}
                </label>
                <input
                  id="cv-name"
                  type="text"
                  placeholder={pick('e.g. Ahmed Al-Salem', 'مثال: أحمد محمد السالم')}
                  autoComplete="name"
                  required
                  minLength={5}
                  maxLength={60}
                  value={form.name}
                  onChange={set('name', 60)}
                  className={`w-full px-4 py-3 min-h-[48px] rounded-xl border text-base sm:text-sm focus:outline-none transition-colors ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cv-email" className="text-xs font-bold block opacity-90">
                  {pick('Active Email Address *', 'البريد الإلكتروني الرسمي / الفعّال *')}
                </label>
                <input
                  id="cv-email"
                  type="email"
                  placeholder="name@domain.com"
                  autoComplete="email"
                  dir="ltr"
                  required
                  maxLength={100}
                  value={form.email}
                  onChange={set('email', 100)}
                  className={`w-full px-4 py-3 min-h-[48px] rounded-xl border text-base sm:text-sm focus:outline-none transition-colors ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cv-phone" className="text-xs font-bold block opacity-90">
                  {pick('Mobile Number *', 'رقم الجوال الفعلي *')}
                </label>
                <input
                  id="cv-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="05XXXXXXXX / +9665XXXXXXXX"
                  autoComplete="tel"
                  dir="ltr"
                  required
                  minLength={10}
                  maxLength={16}
                  value={form.phone}
                  onChange={set('phone', 16)}
                  className={`w-full px-4 py-3 min-h-[48px] rounded-xl border text-base sm:text-sm focus:outline-none transition-colors ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold block opacity-90">
                  {pick('Attach Resume / CV (PDF or Word) *', 'إرفاق السيرة الذاتية (PDF أو Word) *')}
                </label>
                <label className={`block border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors ${uploadBox}`}>
                  {file ? (
                    <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  )}
                  <span className="block text-xs font-bold break-all">
                    {file
                      ? `✓ ${sanitizeFileName(file.name)}`
                      : pick(
                          'Click to upload your CV (PDF or DOCX, max 5 MB)',
                          'اضغط لرفع السيرة الذاتية (PDF أو Word، بحد أقصى 5 ميجابايت)'
                        )}
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={onFile} />
                </label>
              </div>

              {fileError && (
                <p role="alert" className="flex items-start gap-2 text-xs text-red-300 bg-red-950/50 border border-red-800 rounded-xl p-3 font-semibold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{fileError}</span>
                </p>
              )}

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{pick('We could not submit your application. Please try again.', 'تعذر إرسال طلبك حالياً، يرجى المحاولة مرة أخرى.')}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                aria-label={status === 'sending' ? pick('Submitting…', 'جاري الإرسال…') : pick('Submit Application', 'إرسال طلب التوظيف')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait min-h-[48px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: themeColor }}
              >
                {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{status === 'sending' ? pick('Submitting…', 'جاري الإرسال…') : pick('Submit Official Application', 'إرسال طلب التوظيف الآن')}</span>
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1"> </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}