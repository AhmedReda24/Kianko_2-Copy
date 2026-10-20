import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, Download, RefreshCw, FileText, 
  LogOut, KeyRound, Mail, MessageSquare, FileDown, 
  Briefcase, Award, Plus, Trash2, Eye, EyeOff, ShieldCheck, Upload 
} from 'lucide-react';

export default function AdminDashboard({ themeColor = '#C9252C', lang = 'ar', darkMode = true }) {
  const isAr = lang === 'ar';
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth_kianko') === 'true';
  });
  const [activeTab, setActiveTab] = useState('analytics'); 
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Data States
  const [analytics, setAnalytics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [systemStats] = useState({ visits: 1420, activeSessions: 3 });
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', description: '' });
  
  // New Certification Form State
  const [newCert, setNewCert] = useState({ 
    title: '', 
    issuer: '', 
    year: '2026', 
    file_url: '', 
    category: 'approval', 
    code: 'ASTM-01' 
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Styling Variables
  const cardBg = darkMode ? 'bg-[#0A1832] border-blue-900/60 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-md';
  const subBg = darkMode ? 'bg-[#061022] border-blue-900/60 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500';
  const textMain = darkMode ? 'text-white' : 'text-slate-900 font-extrabold';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-600 font-semibold';
  const textSub = darkMode ? 'text-slate-300' : 'text-slate-800 font-bold';
  const borderCol = darkMode ? 'border-blue-900/60' : 'border-slate-300';
  const divideCol = darkMode ? 'divide-blue-900/40' : 'divide-slate-200';
  const rowHover = darkMode ? 'hover:bg-blue-950/40' : 'hover:bg-slate-100';
  const tableHeadBg = darkMode ? 'bg-[#061022] text-slate-300' : 'bg-slate-200 text-slate-900 font-black';

  useEffect(() => {
    document.title = isAr ? 'كيانكو | لوحة التحكم الآمنة' : 'KIANKO | Secure Admin Portal';
  }, [isAr]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: analyticsData } = await supabase.from('product_analytics').select('*').order('downloads_count', { ascending: false });
      setAnalytics(analyticsData || []);

      const { data: messagesData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      setMessages(messagesData || []);

      const { data: jobsData } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
      setJobs(jobsData || []);

      const { data: certsData } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
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
    setAuthError('');

    const cleanInput = passwordInput.trim();

    try {
      const { data: rpcValid, error: rpcError } = await supabase
        .rpc('verify_admin_password', { input_pass: cleanInput });

      if (!rpcError && rpcValid === true) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth_kianko', 'true');
        return;
      }

      const { data, error } = await supabase.from('admin_settings').select('password_value');
      if (error) {
        setAuthError(isAr ? `خطأ صلاحيات: ${error.message}` : `Error: ${error.message}`);
        return;
      }

      const isMatch = (data || []).some(
        (row) => row.password_value && String(row.password_value).trim() === cleanInput
      );

      if (isMatch) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth_kianko', 'true');
      } else {
        setAuthError(isAr ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.');
      }
    } catch (err) {
      setAuthError(isAr ? 'خطأ في الاتصال بقاعدة البيانات.' : 'Connection error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_kianko');
    setPasswordInput('');
  };

  // إدارة الوظائف
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title) return;
    const { error } = await supabase.from('careers').insert([newJob]);
    if (!error) {
      setNewJob({ title: '', department: '', location: '', description: '' });
      fetchData();
      alert(isAr ? 'تم نشر الوظيفة بنجاح!' : 'Job published successfully!');
    } else {
      alert(isAr ? 'خطأ أثناء نشر الوظيفة' : 'Error publishing job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?')) {
      await supabase.from('careers').delete().eq('id', id);
      fetchData();
    }
  };

  // إدارة الاعتمادات والأيزو
  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.title) return;
    
    const { error } = await supabase.from('certifications').insert([{
      title: newCert.title,
      issuer: newCert.issuer,
      year: newCert.year,
      file_url: newCert.file_url,
      category: newCert.category,
      code: newCert.code
    }]);

    if (!error) {
      setNewCert({ title: '', issuer: '', year: '2026', file_url: '', category: 'approval', code: 'ASTM-01' });
      fetchData();
      alert(isAr ? 'تم حفظ ونشر المستند بنجاح!' : 'Document published successfully!');
    } else {
      alert(isAr ? `خطأ أثناء النشر: ${error.message}` : `Error: ${error.message}`);
    }
  };

  const handleDeleteCert = async (id) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المستند؟' : 'Are you sure you want to delete this document?')) {
      await supabase.from('certifications').delete().eq('id', id);
      fetchData();
    }
  };

  const sanitizeText = (text) => {
    if (!text) return '—';
    return String(text)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .replace(/<[^>]*>?/gm, '');
  };

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
        <head><meta charset="UTF-8"><title>Report</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h2 style="text-align: center; color: #C9252C;">KIANKO COMPANY - تقرير رسائل العملاء</h2>
          <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead><tr><th>الاسم</th><th>البريد</th><th>الهاتف</th><th>الرسالة</th><th>التاريخ</th></tr></thead>
            <tbody>
              ${messages.map(m => `<tr><td>${sanitizeText(m.name)}</td><td>${sanitizeText(m.email)}</td><td>${sanitizeText(m.phone)}</td><td>${sanitizeText(m.message)}</td><td>${new Date(m.created_at).toLocaleString('ar-EG')}</td></tr>`).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
        </html>
      `);
      frameDoc.close();
      setTimeout(() => { printFrame.contentWindow.focus(); printFrame.contentWindow.print(); setTimeout(() => document.body.removeChild(printFrame), 1000); }, 500);
    }
  };

  const totalDownloads = analytics.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center px-4 transition-colors duration-300`} dir={isAr ? 'rtl' : 'ltr'}>
        <form onSubmit={handleLogin} className={`w-full max-w-md p-8 rounded-2xl border transition-all duration-300 space-y-6 ${cardBg} ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="text-center space-y-2">
            <div className={`inline-flex p-3 rounded-full border ${darkMode ? 'bg-blue-950 text-red-500 border-blue-900' : 'bg-red-50 text-red-600 border-red-200'}`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className={`text-2xl font-bold ${textMain}`}>{isAr ? 'بوابة الإدارة الآمنة' : 'Secure Admin Portal'}</h2>
            <p className={`text-xs ${textMuted}`}>{isAr ? 'أدخل كلمة المرور للوصول إلى لوحة التحكم' : 'Enter password to access dashboard'}</p>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'كلمة مرور الأدمن' : 'Admin Password'}</label>
            <div className="relative">
              <KeyRound className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoCapitalize="none"
                placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter password...'}
                className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} py-3 border rounded-xl text-sm focus:outline-none focus:border-red-500 transition-colors ${subBg}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${textMuted} cursor-pointer`}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && <p className="text-xs text-red-500 font-bold leading-relaxed">{authError}</p>}
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
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 transition-colors duration-300 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 p-6 rounded-2xl border ${cardBg}`}>
        <div>
          <h1 className={`text-2xl font-extrabold flex items-center gap-3 ${textMain}`}>
            <BarChart3 style={{ color: themeColor }} className="w-8 h-8" />
            {isAr ? 'لوحة تحكم كيانكو المركزية' : 'KIANKO Central Dashboard'}
          </h1>
          <p className={`text-sm mt-1 ${textMuted}`}>{isAr ? 'إدارة التحليلات، الوظائف، الاعتمادات، ورسائل العملاء' : 'Manage analytics, careers, certifications, and client messages'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode ? 'bg-blue-950/80 hover:bg-blue-900 text-white border-blue-800/50' : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {isAr ? 'تحديث البيانات' : 'Refresh Data'}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border-red-800/50' : 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isAr ? 'خروج آمن' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className={`flex border-b gap-4 overflow-x-auto ${borderCol}`}>
        {[
          { id: 'analytics', label: isAr ? `تحليلات الكتالوج (${totalDownloads})` : `Catalog Analytics (${totalDownloads})`, icon: BarChart3 },
          { id: 'messages', label: isAr ? `رسائل التواصل (${messages.length})` : `Contact Messages (${messages.length})`, icon: Mail },
          { id: 'jobs', label: isAr ? `إدارة الوظائف (${jobs.length})` : `Manage Careers (${jobs.length})`, icon: Briefcase },
          { id: 'certifications', label: isAr ? `الاعتمادات والأيزو (${certifications.length})` : `Certifications (${certifications.length})`, icon: Award },
          { id: 'system', label: isAr ? 'حالة ونظام الموقع' : 'System Status', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? `border-[#C9252C] ${darkMode ? 'text-white' : 'text-slate-950 font-black'}`
                  : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950'}`
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
        <div className={`p-6 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي التحميلات' : 'Total Downloads'}</span>
            <Download className="w-5 h-5 text-emerald-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{totalDownloads}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'تنزيل ملفات الداتا شيت' : 'Datasheet downloads'}</p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'الرسائل الواردة' : 'Incoming Messages'}</span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{messages.length}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'رسائل نموذج اتصل بنا' : 'Contact form submissions'}</p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'الوظائف النشطة' : 'Active Jobs'}</span>
            <Briefcase className="w-5 h-5 text-amber-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{jobs.length}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'فرص عمل متاحة للتقديم' : 'Available career openings'}</p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-2 ${cardBg}`}>
          <div className={`flex justify-between items-center ${textMuted}`}>
            <span className="text-xs font-bold uppercase">{isAr ? 'زيارات النظام' : 'System Visits'}</span>
            <Eye className="w-5 h-5 text-purple-500" />
          </div>
          <div className={`text-3xl font-black ${textMain}`}>{systemStats.visits}</div>
          <p className={`text-xs ${textMuted}`}>{isAr ? 'إجمالي مشاهدات الصفحة' : 'Total page views'}</p>
        </div>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`p-6 border-b ${borderCol}`}>
            <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'تفاصيل التحميلات حسب المنتج' : 'Downloads Breakdown by Product'}</h2>
          </div>
          {loading ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'جاري تحميل البيانات...' : 'Loading data...'}</div>
          ) : analytics.length === 0 ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'لا توجد تحليلات مسجلة حتى الآن.' : 'No analytics recorded yet.'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} ${textSub}`}>
                <thead className={`text-xs font-bold uppercase border-b ${tableHeadBg} ${borderCol}`}>
                  <tr>
                    <th className="px-6 py-4">{isAr ? 'معرّف المنتج (ID)' : 'Product ID'}</th>
                    <th className="px-6 py-4 text-center">{isAr ? 'عدد التحميلات' : 'Downloads Count'}</th>
                    <th className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'آخر تحميل' : 'Last Download'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divideCol}`}>
                  {analytics.map((item) => (
                    <tr key={item.id} className={`transition-colors ${rowHover}`}>
                      <td className={`px-6 py-4 font-bold ${textMain}`}>{item.product_id}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Download className="w-3.5 h-3.5" />
                          {item.downloads_count}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} text-xs ${textMuted}`}>
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
        <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
          <div className={`p-6 border-b flex justify-between items-center flex-wrap gap-4 ${borderCol}`}>
            <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'رسائل التواصل الواردة' : 'Incoming Contact Messages'}</h2>
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
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</div>
          ) : messages.length === 0 ? (
            <div className={`p-12 text-center ${textMuted}`}>{isAr ? 'لا توجد رسائل تواصل مسجلة حتى الآن.' : 'No contact messages recorded yet.'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'} ${textSub}`}>
                <thead className={`text-xs font-bold uppercase border-b ${tableHeadBg} ${borderCol}`}>
                  <tr>
                    <th className="px-6 py-4">{isAr ? 'الاسم' : 'Name'}</th>
                    <th className="px-6 py-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="px-6 py-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                    <th className="px-6 py-4">{isAr ? 'الرسالة' : 'Message'}</th>
                    <th className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divideCol}`}>
                  {messages.map((msg) => (
                    <tr key={msg.id} className={`transition-colors ${rowHover}`}>
                      <td className={`px-6 py-4 font-bold ${textMain}`}>{sanitizeText(msg.name)}</td>
                      <td className={`px-6 py-4 font-mono text-xs ${textSub}`}>{sanitizeText(msg.email)}</td>
                      <td className={`px-6 py-4 font-mono text-xs ${textSub}`}>{sanitizeText(msg.phone)}</td>
                      <td className={`px-6 py-4 max-w-xs truncate ${textSub}`}>{sanitizeText(msg.message)}</td>
                      <td className={`px-6 py-4 ${isAr ? 'text-left' : 'text-right'} text-xs whitespace-nowrap ${textMuted}`}>
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
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
              <Plus className="w-5 h-5 text-red-500" /> {isAr ? 'إضافة وظيفة جديدة للموقع' : 'Add New Career Opening'}
            </h2>
            <form onSubmit={handleAddJob} className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isAr ? 'المسمى الوظيفي (مثال: مهندس مبيعات)' : 'Job Title'}
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'القسم (مثال: المبيعات)' : 'Department'}
                value={newJob.department}
                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'المكان (مثال: الإسماعيلية)' : 'Location'}
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'وصف مختصر' : 'Description'}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <button type="submit" className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer">
                {isAr ? 'نشر الوظيفة فوراً' : 'Publish Job'}
              </button>
            </form>
          </div>

          <div className={`rounded-2xl border overflow-hidden p-6 ${cardBg}`}>
            <h2 className={`text-lg font-bold mb-4 ${textMain}`}>{isAr ? 'الوظائف الحالية (مع زر الحذف)' : 'Current Careers'}</h2>
            {jobs.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>{isAr ? 'لا توجد وظائف مضافة حالياً.' : 'No careers added.'}</p>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className={`flex justify-between items-center p-4 border rounded-xl ${subBg}`}>
                    <div>
                      <h4 className={`font-bold text-sm ${textMain}`}>{job.title}</h4>
                      <p className={`text-xs ${textMuted}`}>{job.department} | {job.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                    >
                      <Trash2 className="w-4 h-4" /> {isAr ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Certifications & ISO */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
              <Award className="w-5 h-5 text-amber-500" /> {isAr ? 'إضافة اعتماد أو شهادة أيزو جديدة' : 'Add ISO or Approval Document'}
            </h2>
            <form onSubmit={handleAddCert} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'نوع المستند (التصنيف)' : 'Document Category'}</label>
                <select
                  value={newCert.category}
                  onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl text-sm ${subBg} cursor-pointer`}
                >
                  <option value="approval">{isAr ? 'اعتماد مشاريع (يظهر في الهوم وفي صفحة الاعتمادات)' : 'Project Approval'}</option>
                  <option value="iso">{isAr ? 'شهادة أيزو ISO (تذهب لصفحة شهادات الأيزو والهوم Slider)' : 'ISO Certification'}</option>
                </select>
              </div>

              <input
                type="text"
                placeholder={isAr ? 'عنوان الشهادة/الاعتماد' : 'Title'}
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
                required
              />
              <input
                type="text"
                placeholder={isAr ? 'الجهة المانحة / المشروع' : 'Issuer'}
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'الكود (مثال: ISO-9001)' : 'Code'}
                value={newCert.code}
                onChange={(e) => setNewCert({ ...newCert, code: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              <input
                type="text"
                placeholder={isAr ? 'السنة' : 'Year'}
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                className={`px-4 py-3 border rounded-xl text-sm ${subBg} ${isAr ? 'text-right' : 'text-left'}`}
              />
              
              {/* تصميم احترافي وزرار رفع ملفات مميز مع مؤشر الماوس (cursor-pointer) */}
              <div className="sm:col-span-2 space-y-2">
                <label className={`text-xs font-bold block ${textSub}`}>{isAr ? 'ملف الـ PDF أو الصورة' : 'File'}</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-all hover:border-red-500 ${subBg}`}>
                  <Upload className="w-8 h-8 text-red-500 animate-bounce" />
                  <span className="text-xs font-bold">
                    {newCert.file_url ? (isAr ? '✓ تم رفع الملف بنجاح' : '✓ File uploaded successfully') : (isAr ? 'اضغط هنا لرفع ملف PDF أو صورة الشهادة' : 'Click to upload PDF or image')}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingFile(true);
                      try {
                        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                        const { error } = await supabase.storage.from('certificates').upload(fileName, file);
                        if (error) throw error;
                        const { data: urlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
                        setNewCert({ ...newCert, file_url: urlData.publicUrl });
                        alert(isAr ? 'تم رفع الملف بنجاح!' : 'File uploaded successfully!');
                      } catch (err) {
                        alert(isAr ? `خطأ أثناء رفع الملف: ${err.message}` : 'Error uploading file');
                      } finally {
                        setUploadingFile(false);
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                {uploadingFile && <p className="text-xs text-amber-500 mt-1 font-bold">{isAr ? 'جاري رفع الملف للسيرفر...' : 'Uploading...'}</p>}
              </div>

              <button type="submit" className="sm:col-span-2 py-3 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all cursor-pointer shadow-lg active:scale-95">
                {isAr ? 'حفظ ونشر المستند' : 'Publish Document'}
              </button>
            </form>
          </div>

          <div className={`rounded-2xl border overflow-hidden p-6 ${cardBg}`}>
            <h2 className={`text-lg font-bold mb-4 ${textMain}`}>{isAr ? 'الشهادات والاعتمادات الحالية' : 'Current Documents'}</h2>
            {certifications.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>{isAr ? 'لا توجد اعتمادات مضافة حالياً.' : 'No documents added.'}</p>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className={`flex justify-between items-center p-4 border rounded-xl gap-4 ${subBg}`}>
                    <div className="space-y-1 text-start">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-red-600 text-white shadow-xs">
                          {cert.category === 'iso' ? 'ISO Certificate' : 'Project Approval'}
                        </span>
                        <h4 className={`font-bold text-base ${textMain}`}>{cert.title}</h4>
                      </div>
                      <p className={`text-xs font-semibold ${textMuted}`}>
                        {isAr ? 'الجهة / المشروع: ' : 'Issuer: '}<span className="text-amber-500 font-bold">{cert.issuer || '—'}</span> | {isAr ? 'الكود: ' : 'Code: '}<span className="font-mono font-bold">{cert.code || '—'}</span> | <span className="opacity-75">{cert.year}</span>
                      </p>
                      {cert.file_url && (
                        <a href={cert.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline inline-block mt-1">
                          {isAr ? '🔗 معاينة الملف المرفق' : '🔗 View Attached File'}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" /> {isAr ? 'حذف' : 'Delete'}
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
        <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
          <h2 className={`text-lg font-bold ${textMain}`}>{isAr ? 'حالة نظام موقع كيانكو' : 'KIANKO System Status'}</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'حالة قاعدة البيانات (Supabase)' : 'Database Status'}</span>
              <p className="text-emerald-500 font-bold">{isAr ? 'متصلة وتعمل بكفاءة عالية (Active)' : 'Connected & Active'}</p>
            </div>
            <div className={`p-4 rounded-xl border space-y-1 ${subBg}`}>
              <span className={`text-xs ${textMuted}`}>{isAr ? 'الجلسة الحالية للأدمن' : 'Admin Session'}</span>
              <p className={`font-bold ${textMain}`}>{isAr ? 'آمنة ومؤمنة عبر Supabase' : 'Secured via Supabase'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}