import { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, X, MapPin, Briefcase } from 'lucide-react';
import { useJobs } from '../hooks/useContent';
import SpotlightCard from '../components/ui/SpotlightCard';
import { submitJobApplication, CV_MAX_BYTES, CV_TYPES } from '../lib/api';
import { supabase } from '../lib/supabase';

export default function CareersPage({ lang = 'en', themeColor = '#C9252C', darkMode = true }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const staticJobs = useJobs();
  const formRef = useRef(null);

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

  // جلب الوظائف المضافة من لوحة التحكم (Supabase) واستبعاد الوظائف الفارغة أو المحذوفة
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
            .filter((j) => j.title && String(j.title).trim().length >= 2)
            .map((j) => ({
              id: `db_${j.id}`,
              rawId: String(j.id),
              titleEn: j.title_en || j.title,
              titleAr: j.title,
              dept: j.department || pick('Engineering & Operations', 'الهندسة والتشغيل'),
              location: j.location || pick('Riyadh / Jeddah, KSA', 'الرياض / جدة - السعودية'),
              description: j.description || '',
            }));
          setDbJobs(validDbJobs);
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
      }
    };

    fetchCareersFromDB();
  }, [isAr]);

  // دمج وظائف الداتا بيز مع الوظائف الأساسية مع فلترة أي وظيفة محذوفة
  const jobs = useMemo(() => {
    const formattedStatic = (staticJobs || [])
      .filter((j) => !deletedJobIds.includes(String(j.id)))
      .map((j) => ({
        ...j,
        titleEn: j.titleEn || j.title || 'Engineer',
        titleAr: j.titleAr || j.title || 'مهندس',
        dept: j.dept || j.department || '',
        location: j.location || pick('Riyadh / Jeddah', 'الرياض / جدة'),
        description: j.description || '',
      }));

    const activeDbJobs = dbJobs.filter(
      (j) => !deletedJobIds.includes(String(j.id)) && !deletedJobIds.includes(String(j.rawId))
    );

    return [...activeDbJobs, ...formattedStatic];
  }, [dbJobs, staticJobs, deletedJobIds, isAr]);

  const selectedJob = jobs.find((j) => j.id === jobId);
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (fileError) setFileError('');
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFileError('');
    if (!f) return setFile(null);
    if (!CV_TYPES.includes(f.type)) {
      setFile(null);
      return setFileError(pick('Please upload a PDF or Word file.', 'يرجى رفع ملف بصيغة PDF أو Word فقط.'));
    }
    if (f.size > CV_MAX_BYTES) {
      setFile(null);
      return setFileError(pick('File is larger than 5 MB.', 'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).'));
    }
    setFile(f);
  };

  const apply = (id) => {
    setJobId(id);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return setStatus('sent');

    // Validation صارم لمنع المسافات الفارغة
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();

    if (cleanName.length < 3) {
      return setFileError(pick('Please enter your full name (at least 3 characters).', 'يرجى إدخال الاسم بالكامل بشكل صحيح (3 أحرف على الأقل).'));
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return setFileError(pick('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.'));
    }
    if (cleanPhone.replace(/[^0-9]/g, '').length < 8) {
      return setFileError(pick('Please enter a valid phone number.', 'يرجى إدخال رقم جوال صحيح.'));
    }
    if (!file) {
      return setFileError(pick('Please attach your CV.', 'يرجى إرفاق ملف السيرة الذاتية (CV) قبل الإرسال.'));
    }

    setStatus('sending');
    setFileError('');

    try {
      const jobTitleText = selectedJob
        ? pick(selectedJob.titleEn, selectedJob.titleAr)
        : pick('General Application', 'تقديم عام');

      // 1. رفع ملف السيرة الذاتية إلى Supabase Storage وتسجيل الطلب في رسائل الداش بورد ليظهر للأدمن فوراً
      let cvPublicUrl = '';
      try {
        const safeFileName = `cv_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: uploadErr } = await supabase.storage.from('certificates').upload(safeFileName, file);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(safeFileName);
          cvPublicUrl = urlData?.publicUrl || '';
        }
      } catch {
        // المتابعة حتى لو كان الـ bucket مقفلاً
      }

      const applicationSummary = isAr
        ? `[طلب توظيف: ${jobTitleText}]${cvPublicUrl ? ` | رابط السيرة الذاتية: ${cvPublicUrl}` : ` | المرفق: ${file.name}`}`
        : `[Job Application: ${jobTitleText}]${cvPublicUrl ? ` | CV Link: ${cvPublicUrl}` : ` | Attached: ${file.name}`}`;

      await supabase.from('contact_messages').insert([
        {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: applicationSummary,
        },
      ]);

      // 2. استدعاء دالة الـ API الأساسية أيضاً
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
        // تم حفظ الطلب بالفعل في قاعدة البيانات
      }

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
    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-slate-500' 
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-400';
  const uploadBox = darkMode 
    ? 'border-slate-700 bg-slate-900/50 hover:border-slate-500 text-slate-300' 
    : 'border-slate-300 bg-slate-50 hover:border-slate-400 text-slate-700';

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start"
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
    >
      <div className="text-center space-y-3">
        <h1 className={`text-4xl sm:text-5xl font-black ${textTitle}`}>
          {pick('Careers at KIANKO STEEL', 'انضم لفرق كيانكو الهندسية')}
        </h1>
        <p className={`text-base ${textDesc}`}>
          {pick(
            'Shape the future of heavy industrial engineering with our team in Saudi Arabia.',
            'نبحث دائماً عن الكفاءات الهندسية والفنية المتميزة للانضمام إلى فريق عملنا في المملكة العربية السعودية.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold mb-6 ${textTitle}`}>
            {pick(`Open Positions (${jobs.length})`, `الوظائف المتاحة حالياً (${jobs.length})`)}
          </h2>

          {jobs.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center ${cardBg}`}>
              <p className={`text-sm ${textDesc}`}>
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
                  className={`${cardBg} p-6 rounded-2xl border flex justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
                    on 
                      ? (darkMode ? 'border-red-500/70 ring-1 ring-red-500/30' : 'border-red-500 shadow-lg') 
                      : (darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="space-y-2">
                    <h3 className={`font-bold text-base sm:text-lg ${jobTitleColor}`}>
                      {pick(job.titleEn, job.titleAr)}
                    </h3>
                    <div className={`flex flex-wrap items-center gap-3 text-xs ${jobDeptColor}`}>
                      {job.dept && (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-red-500" />
                          {job.dept}
                        </span>
                      )}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {job.location}
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
        </div>

        <div ref={formRef} className={`p-8 rounded-3xl border shadow-2xl space-y-6 scroll-mt-28 ${formBg}`}>
          <h2 className={`text-xl font-bold ${textTitle}`}>
            {pick('Send Your Resume', 'إرسال السيرة الذاتية مباشرة')}
          </h2>

          {status === 'sent' ? (
            <div role="status" className="space-y-4 text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <p className={`text-sm font-bold leading-relaxed ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {pick(
                  'Your application has been received successfully. Our HR team will contact you soon.',
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
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="hidden" aria-hidden="true">
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
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

              <input
                type="text"
                aria-label={pick('Full Name', 'الاسم بالكامل')}
                placeholder={pick('Full Name', 'الاسم بالكامل')}
                autoComplete="name"
                required
                minLength={3}
                maxLength={120}
                value={form.name}
                onChange={set('name')}
                className={`w-full px-4 py-3 min-h-[44px] rounded-xl border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${inputBg}`}
              />
              <input
                type="email"
                aria-label={pick('Email Address', 'البريد الإلكتروني')}
                placeholder={pick('Email Address', 'البريد الإلكتروني')}
                autoComplete="email"
                dir="ltr"
                required
                maxLength={200}
                value={form.email}
                onChange={set('email')}
                className={`w-full px-4 py-3 min-h-[44px] rounded-xl border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${inputBg}`}
              />
              <input
                type="tel"
                aria-label={pick('Phone Number', 'رقم الجوال (مثال: 05XXXXXXXX)')}
                placeholder={pick('Phone Number (e.g. +966 5X XXX XXXX)', 'رقم الجوال (مثال: 05XXXXXXXX)')}
                autoComplete="tel"
                dir="ltr"
                required
                minLength={8}
                maxLength={40}
                value={form.phone}
                onChange={set('phone')}
                className={`w-full px-4 py-3 min-h-[44px] rounded-xl border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${inputBg}`}
              />

              <label className={`block border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors focus-within:border-white ${uploadBox}`}>
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="block text-xs font-medium">
                  {file ? `✓ ${file.name}` : pick('Click to upload your CV (PDF or DOCX, max 5 MB)', 'اضغط لرفع السيرة الذاتية (PDF أو Word، بحد أقصى 5 ميجابايت)')}
                </span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={onFile} />
              </label>
              {fileError && <p role="alert" className="text-xs text-red-500 font-semibold">{fileError}</p>}

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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait min-h-[44px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: themeColor }}
              >
                {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{status === 'sending' ? pick('Submitting…', 'جاري الإرسال…') : pick('Submit Application', 'إرسال طلب التوظيف')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}