import { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { useJobs } from '../hooks/useContent';
import SpotlightCard from '../components/ui/SpotlightCard';
import { submitJobApplication, CV_MAX_BYTES, CV_TYPES } from '../lib/api';

const field =
  'w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function CareersPage({ lang = 'en', themeColor = '#C9252C' }) {
  const isAr = lang === 'ar';
  const pick = (en, ar) => (isAr ? ar : en);
  const jobs = useJobs();
  const formRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', website: '' });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const selectedJob = jobs.find((j) => j.id === jobId);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFileError('');
    if (!f) return setFile(null);
    if (!CV_TYPES.includes(f.type)) {
      setFile(null);
      return setFileError(pick('Please upload a PDF or Word file.', 'ارفع ملف PDF أو Word من فضلك.'));
    }
    if (f.size > CV_MAX_BYTES) {
      setFile(null);
      return setFileError(pick('File is larger than 5 MB.', 'حجم الملف أكبر من 5 ميجا.'));
    }
    setFile(f);
  };

  const apply = (id) => {
    setJobId(id);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return setStatus('sent'); // honeypot
    if (!file) return setFileError(pick('Please attach your CV.', 'من فضلك أرفق السيرة الذاتية.'));
    setStatus('sending');
    try {
      await submitJobApplication({ ...form, jobId, file, lang });
      setForm({ name: '', email: '', phone: '', website: '' });
      setFile(null);
      setJobId('');
      setStatus('sent');
    } catch (err) {
      console.error('[careers]', err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-start">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black">{pick('Careers at KIANKO STEEL', 'انضم لفرق كيانكو الهندسية')}</h1>
        <p className="text-slate-400 text-base">
          {pick('Shape the future of heavy industrial engineering with our team.', 'نبحث دائماً عن المهندسين والفنيين الشغوفين بالصناعة')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">{pick('Open Positions', 'الوظائف المتاحة حالياً')}</h2>
          {jobs.map((job) => {
            const on = job.id === jobId;
            return (
              <SpotlightCard
                key={job.id}
                className={`bg-slate-900/80 p-6 rounded-2xl border flex justify-between items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  on ? 'border-white/40' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <h3 className="font-bold text-white text-base">{pick(job.titleEn, job.titleAr)}</h3>
                  <p className="text-xs text-slate-400 mt-1">{job.dept}</p>
                </div>
                <button
                  type="button"
                  onClick={() => apply(job.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shrink-0 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {on ? pick('Selected', 'تم الاختيار') : pick('Apply Now', 'تقديم')}
                </button>
              </SpotlightCard>
            );
          })}
        </div>

        <div ref={formRef} className="bg-[#0A1832] p-8 rounded-3xl border border-blue-900/60 shadow-2xl space-y-6 scroll-mt-28">
          <h2 className="text-xl font-bold text-white">{pick('Send Your Resume', 'إرسال السيرة الذاتية مباشرة')}</h2>

          {status === 'sent' ? (
            <div role="status" className="space-y-3 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
              <p className="text-emerald-300 text-sm font-semibold">
                {pick('Application received. We will contact you if there is a suitable role.', 'تم استلام طلبك، هنتواصل معاك لو فيه وظيفة مناسبة.')}
              </p>
              <button type="button" onClick={() => setStatus('idle')} className="text-sm font-bold text-white underline underline-offset-4 hover:opacity-80">
                {pick('Submit another application', 'تقديم طلب تاني')}
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
                <p className="flex items-center justify-between gap-3 text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-slate-200">
                  <span>{pick('Applying for:', 'التقديم على:')} <strong className="text-white">{pick(selectedJob.titleEn, selectedJob.titleAr)}</strong></span>
                  <button type="button" onClick={() => setJobId('')} aria-label={pick('Clear selection', 'إلغاء الاختيار')} className="hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </p>
              )}

              <input type="text" aria-label={pick('Full Name', 'الاسم بالكامل')} placeholder={pick('Full Name', 'الاسم بالكامل')} autoComplete="name" required minLength={2} maxLength={120} value={form.name} onChange={set('name')} className={field} />
              <input type="email" aria-label={pick('Email Address', 'البريد الإلكتروني')} placeholder={pick('Email Address', 'البريد الإلكتروني')} autoComplete="email" dir="ltr" required maxLength={200} value={form.email} onChange={set('email')} className={field} />
              <input type="tel" aria-label={pick('Phone Number', 'رقم الهاتف')} placeholder={pick('Phone Number', 'رقم الهاتف')} autoComplete="tel" dir="ltr" required minLength={5} maxLength={40} value={form.phone} onChange={set('phone')} className={field} />

              <label className="block border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-slate-500 cursor-pointer focus-within:border-white">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="block text-xs text-slate-300 font-medium">
                  {file ? file.name : pick('Click to upload your CV (PDF or DOCX, max 5 MB)', 'اضغط لرفع السيرة الذاتية (PDF أو DOCX، حد أقصى 5 ميجا)')}
                </span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={onFile} />
              </label>
              {fileError && <p role="alert" className="text-xs text-red-300">{fileError}</p>}

              {status === 'error' && (
                <p role="alert" className="flex items-start gap-2 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{pick('We could not submit your application. Please try again.', 'مقدرناش نستلم طلبك. جرّب تاني.')}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: themeColor }}
              >
                {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{status === 'sending' ? pick('Submitting…', 'جاري الإرسال…') : pick('Submit Application', 'إرسال الطلب')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
