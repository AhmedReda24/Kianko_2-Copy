import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, Download, RefreshCw, FileText, CheckCircle2, 
  Lock, LogOut, KeyRound, Mail, MessageSquare, FileDown, 
  Briefcase, Award, Plus, Trash2, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';

export default function AdminDashboard({ themeColor = '#C9252C', lang = 'ar' }) {
  const isAr = lang === 'ar';
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth_kianko') === 'true';
  });
  const [activeTab, setActiveTab] = useState('analytics'); 
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Data States
  const [analytics, setAnalytics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [systemStats, setSystemStats] = useState({ visits: 1420, activeSessions: 3 });
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', description: '' });
  
  // New Certification Form State + Upload State
  const [newCert, setNewCert] = useState({ title: '', issuer: '', year: '', file_url: '' });
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    document.title = isAr ? 'كيانكو | لوحة التحكم الآمنة' : 'KIANKO | Secure Admin Portal';
  }, [isAr]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: analyticsData } = await supabase
        .from('product_analytics')
        .select('*')
        .order('downloads_count', { ascending: false });
      setAnalytics(analyticsData || []);

      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      const { data: jobsData } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });
      setJobs(jobsData || []);

      const { data: certsData } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false });
      setCertifications(certsData || []);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError(false);

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('password_value');

      if (error || !data || data.length === 0) {
        throw new Error('Could not fetch password');
      }

      const dbPassword = data[0].password_value;

      if (passwordInput === dbPassword) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth_kianko', 'true');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setAuthError(true);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_kianko');
    setPasswordInput('');
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title) return;
    await supabase.from('careers').insert([newJob]);
    setNewJob({ title: '', department: '', location: '', description: '' });
    fetchData();
  };

  const handleDeleteJob = async (id) => {
    await supabase.from('careers').delete().eq('id', id);
    fetchData();
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.title) return;
    await supabase.from('certifications').insert([newCert]);
    setNewCert({ title: '', issuer: '', year: '', file_url: '' });
    fetchData();
  };

  const handleDeleteCert = async (id) => {
    await supabase.from('certifications').delete().eq('id', id);
    fetchData();
  };

  // دالة لتنظيف النصوص من أي أكواد خبيثة أو تنبيهات (XSS Sanitizer)
  const sanitizeText = (text) => {
    if (!text) return '—';
    return String(text)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .replace(/<[^>]*>?/gm, ''); // إزالة أي وسوم HTML لتأمين الطباعة تماماً
  };

  // دالة طباعة وتصدير التقارير الآمنة 100%
  const exportReport = (format) => {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US');

    if (format === 'word') {
      let content = `${isAr ? 'تقرير رسائل كيانكو' : 'KIANKO Messages Report'} - ${dateStr}\n\n`;
      messages.forEach((m, i) => {
        content += `${i + 1}. ${isAr ? 'الاسم' : 'Name'}: ${sanitizeText(m.name)} | ${isAr ? 'البريد' : 'Email'}: ${sanitizeText(m.email)} | ${isAr ? 'الهاتف' : 'Phone'}: ${sanitizeText(m.phone)} | ${isAr ? 'الرسالة' : 'Message'}: ${sanitizeText(m.message)}\n\n`;
      });
      const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kianko_Messages_${dateStr}.doc`;
      a.click();
    } else if (format === 'excel') {
      let csv = isAr ? '\uFEFFالاسم,البريد الإلكتروني,الهاتف,الرسالة,التاريخ\n' : '\uFEFFName,Email,Phone,Message,Date\n';
      messages.forEach(m => {
        csv += `"${sanitizeText(m.name)}","${sanitizeText(m.email)}","${sanitizeText(m.phone)}","${sanitizeText(m.message).replace(/"/g, '""')}","${new Date(m.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kianko_Messages_${dateStr}.csv`;
      a.click();
    } else {
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.top = '-9999px';
      printFrame.style.left = '-9999px';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow ? printFrame.contentWindow.document : printFrame.contentDocument;
      if (!frameDoc) return;

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
        <head>
          <meta charset="UTF-8">
          <title>${isAr ? 'تقرير رسائل التواصل - كيانكو' : 'Contact Messages Report - KIANKO'}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; color: #1e293b; padding: 20px; direction: ${isAr ? 'rtl' : 'ltr'}; text-align: ${isAr ? 'right' : 'left'}; }
            .report-header { text-align: center; border-bottom: 3px solid ${themeColor}; padding-bottom: 15px; margin-bottom: 25px; }
            .logo-text { font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px; }
            .logo-text span { color: ${themeColor}; }
            .report-subtitle { font-size: 14px; font-weight: bold; color: #475569; margin-top: 5px; }
            .meta-box { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; background: #f8fafc; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #0f172a; color: #ffffff; padding: 12px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${isAr ? 'right' : 'left'}; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #334155; text-align: ${isAr ? 'right' : 'left'}; vertical-align: top; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="logo-text">KIANKO <span>COMPANY</span></div>
            <div class="report-subtitle">${isAr ? 'تقرير رسائل نموذج اتصل بنا (Client Messages Report)' : 'Contact Us Form Messages Report'}</div>
          </div>

          <div class="meta-box">
            <div><b>${isAr ? 'تاريخ التقرير' : 'Report Date'}:</b> ${dateStr}</div>
            <div><b>${isAr ? 'إجمالي الرسائل' : 'Total Messages'}:</b> ${messages.length}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${isAr ? 'الاسم' : 'Name'}</th>
                <th>${isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th>${isAr ? 'الهاتف' : 'Phone'}</th>
                <th>${isAr ? 'الرسالة' : 'Message'}</th>
                <th>${isAr ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody>
              ${messages.map(m => `
                <tr>
                  <td><b>${sanitizeText(m.name)}</b></td>
                  <td>${sanitizeText(m.email)}</td>
                  <td>${sanitizeText(m.phone)}</td>
                  <td>${sanitizeText(m.message)}</td>
                  <td>${new Date(m.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            ${isAr ? 'تم إنشاء هذا التقرير آلياً بواسطة لوحة تحكم شركة كيانكو المركزية' : 'Generated automatically by KIANKO Central Admin Dashboard'} © ${new Date().getFullYear()}
          </div>
        </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 500);
    }
  };

  const totalDownloads = analytics.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center px-4`} dir={isAr ? 'rtl' : 'ltr'}>
        <form onSubmit={handleLogin} className={`w-full max-w-md bg-[#0A1832] p-8 rounded-2xl border border-blue-900/60 shadow-2xl space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-blue-950 text-red-500 border border-blue-900">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">{isAr ? 'بوابة الإدارة الآمنة' : 'Secure Admin Portal'}</h2>
            <p className="text-slate-400 text-xs">{isAr ? 'أدخل كلمة المرور المشفرة للوصول إلى لوحة التحكم' : 'Enter secure password to access dashboard'}</p>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold text-slate-300 block`}>{isAr ? 'كلمة مرور الأدمن' : 'Admin Password'}</label>
            <div className="relative">
              <KeyRound className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={isAr ? 'أدخل كلمة المرور السرية...' : 'Enter secret password...'}
                className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} py-3 bg-[#061022] border border-blue-900/60 rounded-xl text-white text-sm focus:outline-none focus:border-red-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && <p className="text-xs text-red-400 font-bold">{isAr ? 'كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.' : 'Incorrect password, please try again.'}</p>}
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            {loginLoading ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'دخول اللوحة الآمنة' : 'Access Secure Portal')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <BarChart3 style={{ color: themeColor }} className="w-8 h-8" />
            {isAr ? 'لوحة تحكم كيانكو المركزية' : 'KIANKO Central Dashboard'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{isAr ? 'إدارة التحليلات، الوظائف، الاعتمادات، ورسائل العملاء' : 'Manage analytics, careers, certifications, and client messages'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-950/80 hover:bg-blue-900 text-white text-sm font-semibold rounded-xl border border-blue-800/50 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {isAr ? 'تحديث البيانات' : 'Refresh Data'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-sm font-semibold rounded-xl border border-red-800/50 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {isAr ? 'خروج آمن' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-blue-900/60 gap-4 overflow-x-auto">
        {[
          { id: 'analytics', label: isAr ? `تحليلات الكتالوج (${totalDownloads})` : `Catalog Analytics (${totalDownloads})`, icon: BarChart3 },
          { id: 'messages', label: isAr ? `رسائل التواصل (${messages.length})` : `Contact Messages (${messages.length})`, icon: Mail },
          { id: 'jobs', label: isAr ? `إدارة الوظائف (${jobs.length})` : `Manage Careers (${jobs.length})`, icon: Briefcase },
          { id: 'certifications', label: isAr ? `الاعتمادات (${certifications.length})` : `Certifications (${certifications.length})`, icon: Award },
          { id: 'system', label: isAr ? 'حالة ونظام الموقع' : 'System Status', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي التحميلات' : 'Total Downloads'}</span>
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalDownloads}</div>
          <p className="text-xs text-slate-400">{isAr ? 'تنزيل ملفات الداتا شيت' : 'Datasheet downloads'}</p>
        </div>

        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">{isAr ? 'الرسائل الواردة' : 'Incoming Messages'}</span>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{messages.length}</div>
          <p className="text-xs text-slate-400">{isAr ? 'رسائل نموذج اتصل بنا' : 'Contact form submissions'}</p>
        </div>

        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">{isAr ? 'الوظائف النشطة' : 'Active Jobs'}</span>
            <Briefcase className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{jobs.length}</div>
          <p className="text-xs text-slate-400">{isAr ? 'فرص عمل متاحة للتقديم' : 'Available career openings'}</p>
        </div>

        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">{isAr ? 'زيارات النظام' : 'System Visits'}</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{systemStats.visits}</div>
          <p className="text-xs text-slate-400">{isAr ? 'إجمالي مشاهدات الصفحة' : 'Total page views'}</p>
        </div>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-blue-900/60">
            <h2 className="text-lg font-bold text-white">{isAr ? 'تفاصيل التحميلات حسب المنتج' : 'Downloads Breakdown by Product'}</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-400">{isAr ? 'جاري تحميل البيانات...' : 'Loading data...'}</div>
          ) : analytics.length === 0 ? (
            <div className="p-12 text-center text-slate-400">{isAr ? 'لا توجد تحليلات مسجلة حتى الآن.' : 'No analytics recorded yet.'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} text-slate-300`}>
                <thead className="bg-[#061022] text-xs font-bold uppercase text-slate-400 border-b border-blue-900/60">
                  <tr>
                    <th className="px-6 py-4">{isAr ? 'معرّف المنتج (ID)' : 'Product ID'}</th>
                    <th className="px-6 py-4 text-center">{isAr ? 'عدد التحميلات' : 'Downloads Count'}</th>
                    <th className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'آخر تحميل' : 'Last Download'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/40">
                  {analytics.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-950/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{item.product_id}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Download className="w-3.5 h-3.5" />
                          {item.downloads_count}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} text-xs text-slate-400`}>
                        {new Date(item.updated_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Messages */}
      {activeTab === 'messages' && (
        <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-blue-900/60 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-bold text-white">{isAr ? 'رسائل التواصل الواردة' : 'Incoming Contact Messages'}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => exportReport('pdf')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <FileDown className="w-4 h-4" /> {isAr ? 'طباعة / PDF' : 'Print / PDF'}
              </button>
              <button
                onClick={() => exportReport('word')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <FileText className="w-4 h-4" /> {isAr ? 'تصدير Word' : 'Export Word'}
              </button>
              <button
                onClick={() => exportReport('excel')}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> {isAr ? 'تصدير Excel' : 'Export Excel'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">{isAr ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-slate-400">{isAr ? 'لا توجد رسائل تواصل مسجلة حتى الآن.' : 'No contact messages recorded yet.'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} text-slate-300`}>
                <thead className="bg-[#061022] text-xs font-bold uppercase text-slate-400 border-b border-blue-900/60">
                  <tr>
                    <th className="px-6 py-4">{isAr ? 'الاسم' : 'Name'}</th>
                    <th className="px-6 py-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="px-6 py-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                    <th className="px-6 py-4">{isAr ? 'الرسالة' : 'Message'}</th>
                    <th className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/40">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-blue-950/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{sanitizeText(msg.name)}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{sanitizeText(msg.email)}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{sanitizeText(msg.phone)}</td>
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{sanitizeText(msg.message)}</td>
                      <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} text-xs text-slate-400 whitespace-nowrap`}>
                        {new Date(msg.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Jobs Management */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-500" /> {isAr ? 'إضافة وظيفة جديدة للموقع' : 'Add New Career Opening'}
            </h2>
            <form onSubmit={handleAddJob} className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isAr ? 'المسمى الوظيفي (مثال: مهندس مبيعات)' : 'Job Title (e.g. Sales Engineer)'}
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'القسم (مثال: المبيعات والهندسة)' : 'Department (e.g. Sales & Engineering)'}
                value={newJob.department}
                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'المكان (مثال: الإسماعيلية / القاهرة)' : 'Location (e.g. Ismailia / Cairo)'}
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'وصف مختصر للوظيفة' : 'Short Job Description'}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
              />
              <button
                type="submit"
                className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer"
              >
                {isAr ? 'نشر الوظيفة فوراً' : 'Publish Job Instantly'}
              </button>
            </form>
          </div>

          <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden p-6">
            <h2 className="text-lg font-bold text-white mb-4">{isAr ? 'الوظائف الحالية المعروضة' : 'Current Active Jobs'}</h2>
            {jobs.length === 0 ? (
              <p className="text-slate-400 text-sm">{isAr ? 'لا توجد وظائف مضافة حالياً.' : 'No careers added currently.'}</p>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-4 bg-[#061022] border border-blue-900/50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-white text-sm">{job.title}</h4>
                      <p className="text-xs text-slate-400">{job.department} | {job.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 bg-red-950/60 text-red-400 hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> {isAr ? 'إضافة اعتماد أو شهادة جديدة (رفع مباشر)' : 'Add New Certification (Direct Upload)'}
            </h2>
            <form onSubmit={handleAddCert} className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isAr ? 'عنوان الاعتماد (مثال: شهادة الأيزو ISO 9001)' : 'Title (e.g. ISO 9001 Certification)'}
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'الجهة المانحة (مثال: SGS / TUV)' : 'Issuer (e.g. SGS / TUV)'}
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'سنة الإصدار (مثال: 2026)' : 'Year (e.g. 2026)'}
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                className={`px-4 py-3 bg-[#061022] border border-blue-900 rounded-xl text-white text-sm ${isAr ? 'text-right' : 'text-left'}`}
              />
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isAr ? 'ملف الشهادة أو الاعتماد (PDF)' : 'Certification File (PDF)'}</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    setUploadingFile(true);
                    try {
                      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                      
                      const { error } = await supabase.storage
                        .from('certificates')
                        .upload(fileName, file);

                      if (error) throw error;

                      const { data: urlData } = supabase.storage
                        .from('certificates')
                        .getPublicUrl(fileName);

                      setNewCert({ ...newCert, file_url: urlData.publicUrl });
                      alert(isAr ? 'تم رفع الملف بنجاح!' : 'File uploaded successfully!');
                    } catch (err) {
                      console.error('Error uploading file:', err);
                      alert(isAr ? 'حدث خطأ أثناء رفع الملف.' : 'Error uploading file.');
                    } finally {
                      setUploadingFile(false);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#061022] border border-blue-900 rounded-xl text-white text-xs file:ml-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                />
                {uploadingFile && <p className="text-xs text-amber-400 mt-1">{isAr ? 'جاري رفع الملف إلى السرفر...' : 'Uploading file to server...'}</p>}
                {newCert.file_url && <p className="text-xs text-emerald-400 mt-1">✓ {isAr ? 'تم تجهيز الملف وحفظ رابطه بنجاح' : 'File uploaded and URL saved successfully'}</p>}
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all cursor-pointer"
              >
                {isAr ? 'حفظ ونشر الاعتماد' : 'Save & Publish Certification'}
              </button>
            </form>
          </div>

          <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden p-6">
            <h2 className="text-lg font-bold text-white mb-4">{isAr ? 'الاعتمادات الحالية' : 'Current Certifications'}</h2>
            {certifications.length === 0 ? (
              <p className="text-slate-400 text-sm">{isAr ? 'لا توجد اعتمادات مضافة حالياً.' : 'No certifications added currently.'}</p>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-center p-4 bg-[#061022] border border-blue-900/50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.issuer} - {cert.year}</p>
                      {cert.file_url && (
                        <a href={cert.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline mt-1 block">
                          {isAr ? 'عرض الملف المرفق' : 'View Attached File'}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-2 bg-red-950/60 text-red-400 hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: System Status */}
      {activeTab === 'system' && (
        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">{isAr ? 'حالة نظام موقع كيانكو' : 'KIANKO System Status'}</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#061022] rounded-xl border border-blue-900/40 space-y-1">
              <span className="text-slate-400 text-xs">{isAr ? 'حالة قاعدة البيانات (Supabase)' : 'Database Status (Supabase)'}</span>
              <p className="text-emerald-400 font-bold">{isAr ? 'متصلة وتعمل بكفاءة عالية (Active)' : 'Connected & Active'}</p>
            </div>
            <div className="p-4 bg-[#061022] rounded-xl border border-blue-900/40 space-y-1">
              <span className="text-slate-400 text-xs">{isAr ? 'الجلسة الحالية للأدمن' : 'Current Admin Session'}</span>
              <p className="text-white font-bold">{isAr ? 'آمنة ومؤمنة بـ LocalStorage' : 'Secure via LocalStorage'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}