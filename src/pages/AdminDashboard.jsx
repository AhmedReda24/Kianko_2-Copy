import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Download, RefreshCw, FileText, CheckCircle2, Lock, LogOut, KeyRound, Mail, MessageSquare, FileDown } from 'lucide-react';

const ADMIN_PASSWORD = 'kiankoadmin'; // 👈 كلمة المرور للوحة التحكم

export default function AdminDashboard({ themeColor = '#C9252C' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth_kianko') === 'true';
  });
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'messages'
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Data States
  const [analytics, setAnalytics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'KIANKO | Admin Dashboard';
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. جلب تحليلات المنتجات
      const { data: analyticsData } = await supabase
        .from('product_analytics')
        .select('*')
        .order('downloads_count', { ascending: false });
      setAnalytics(analyticsData || []);

      // 2. جلب رسائل اتصل بنا
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth_kianko', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_kianko');
    setPasswordInput('');
  };

  // دالة تصدير رسائل التواصل إلى ملف PDF أنيق ومظبوط بالعربي
  const exportMessagesToPDF = () => {
    if (messages.length === 0) return;

    const printWindow = window.open('', 'تقرير_رسائل_كيانكو', 'width=900,height=700');
    const dateStr = new Date().toLocaleDateString('ar-EG');

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير رسائل التواصل - شركة كيانكو</title>
        <style>
          @page {
            size: A4;
            margin: 10mm 15mm 15mm 15mm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 0;
            margin: 0;
            color: #1e293b;
            background-color: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid ${themeColor};
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .brand {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
          }
          .brand span {
            color: ${themeColor};
          }
          .subtitle {
            font-size: 13px;
            color: #64748b;
          }
          .meta {
            text-align: left;
            font-size: 12px;
            color: #475569;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #0f172a;
            color: #fff;
            text-align: right;
            padding: 12px 10px;
            font-size: 12px;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
            word-wrap: break-word;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">KIANKO <span>COMPANY</span></div>
            <div class="subtitle">تقرير رسائل نموذج اتصل بنا (Contact Us)</div>
          </div>
          <div class="meta">
            <div>تاريخ التقرير: ${dateStr}</div>
            <div>إجمالي الرسائل: ${messages.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 15%;">الاسم</th>
              <th style="width: 20%;">البريد الإلكتروني</th>
              <th style="width: 15%;">رقم الهاتف</th>
              <th style="width: 35%;">الرسالة</th>
              <th style="width: 15%;">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            ${messages.map(msg => `
              <tr>
                <td><strong>${msg.name || '—'}</strong></td>
                <td>${msg.email || '—'}</td>
                <td>${msg.phone || '—'}</td>
                <td>${msg.message || '—'}</td>
                <td>${new Date(msg.created_at).toLocaleString('ar-EG')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          تم إنشاء هذا التقرير تلقائياً بواسطة لوحة تحكم كيانكو © ${new Date().getFullYear()}
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const totalDownloads = analytics.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0A1832] p-8 rounded-2xl border border-blue-900/60 shadow-2xl space-y-6 text-start">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-blue-950 text-red-500 border border-blue-900">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">تسجيل دخول الإدارة</h2>
            <p className="text-slate-400 text-xs">أدخل كلمة المرور للوصول لوحة تحكم كيانكو</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
            <div className="relative">
              <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full ps-10 pe-4 py-3 bg-[#061022] border border-blue-900/60 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            {authError && <p className="text-xs text-red-400 font-bold">كلمة المرور غير صحيحة، حاول مجدداً.</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg cursor-pointer hover:opacity-90 active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            دخول اللوحة
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <BarChart3 style={{ color: themeColor }} className="w-8 h-8" />
            لوحة تحكم كيانكو الشاملة
          </h1>
          <p className="text-slate-400 text-sm mt-1">متابعة التحليلات والرسائل الواردة من الموقع</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-950/80 hover:bg-blue-900 text-white text-sm font-semibold rounded-xl border border-blue-800/50 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-sm font-semibold rounded-xl border border-red-800/50 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-blue-900/60 gap-4">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-red-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          تحليلات الكتالوج ({totalDownloads})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'messages'
              ? 'border-red-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          رسائل التواصل ({messages.length})
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">إجمالي التحميلات</span>
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalDownloads}</div>
          <p className="text-xs text-slate-400">مرات تنزيل ملفات الداتا شيت</p>
        </div>

        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">الرسائل الواردة</span>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{messages.length}</div>
          <p className="text-xs text-slate-400">رسالة تواصل من نموذج Contact Us</p>
        </div>

        <div className="bg-[#0A1832] p-6 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase">حالة الاتصال</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">Supabase Active</div>
          <p className="text-xs text-slate-400">قواعد البيانات متصلة بنجاح</p>
        </div>
      </div>

      {/* TAB 1: Product Analytics Table */}
      {activeTab === 'analytics' && (
        <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-blue-900/60">
            <h2 className="text-lg font-bold text-white">تفاصيل التحميلات حسب المنتج</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">جاري تحميل البيانات...</div>
          ) : analytics.length === 0 ? (
            <div className="p-12 text-center text-slate-400">لا توجد تحليلات مسجلة حتى الآن.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start text-slate-300">
                <thead className="bg-[#061022] text-xs font-bold uppercase text-slate-400 border-b border-blue-900/60">
                  <tr>
                    <th className="px-6 py-4">معرّف المنتج (ID)</th>
                    <th className="px-6 py-4 text-center">عدد التحميلات</th>
                    <th className="px-6 py-4 text-end">آخر تحميل</th>
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
                      <td className="px-6 py-4 text-end text-xs text-slate-400">
                        {new Date(item.updated_at).toLocaleString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Contact Us Messages Table with PDF Export */}
      {activeTab === 'messages' && (
        <div className="bg-[#0A1832] rounded-2xl border border-blue-900/60 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-blue-900/60 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-bold text-white">رسائل التواصل الواردة</h2>
            <button
              onClick={exportMessagesToPDF}
              disabled={messages.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              تصدير تقرير PDF
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">جاري تحميل الرسائل...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-slate-400">لا توجد رسائل تواصل مسجلة حتى الآن.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start text-slate-300">
                <thead className="bg-[#061022] text-xs font-bold uppercase text-slate-400 border-b border-blue-900/60">
                  <tr>
                    <th className="px-6 py-4">الاسم</th>
                    <th className="px-6 py-4">البريد الإلكتروني</th>
                    <th className="px-6 py-4">الهاتف</th>
                    <th className="px-6 py-4">الرسالة</th>
                    <th className="px-6 py-4 text-end">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/40">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-blue-950/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{msg.name || '—'}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{msg.email || '—'}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{msg.phone || '—'}</td>
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{msg.message || '—'}</td>
                      <td className="px-6 py-4 text-end text-xs text-slate-400 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}