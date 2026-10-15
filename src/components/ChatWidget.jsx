import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك في شركة كيان النموذجية للمنتجات الحديدية! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const formatBotText = (text) => {
    if (typeof text !== 'string') return text;
    return text
      .replace(/["{}]/g, '')
      .replace(/reply:/gi, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .trim();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_MAKE_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const rawText = await response.text();
      let botReply = rawText;

      try {
        const parsed = JSON.parse(rawText);
        botReply = parsed.result || parsed.reply || parsed.text || parsed.message || rawText;
      } catch {
        botReply = rawText;
      }

      botReply = formatBotText(botReply);

      if (!botReply || botReply.toLowerCase() === 'accepted') {
        botReply = rawText && rawText.toLowerCase() !== 'accepted' ? rawText : 'أهلاً بك! جاري تحضير الرد من النظام...';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'عذراً، حدث خطأ في الاتصال.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // تم ضبط الارتفاع على bottom-24 ليكون الزر مرفوعاً بمسافة آمنة وفصل تام عن زر السهم الموجود في bottom-6
    <div className="fixed bottom-24 right-6 z-50 font-sans" dir="rtl">
      {/* زر فتح الشات بوت بحجم دائرى صغير وأنيق */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-tr from-black via-zinc-900 to-red-950 text-white p-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-red-600/50 group cursor-pointer"
          aria-label="فتح مساعد شركة كيان"
        >
          <span className="absolute -inset-1 rounded-full bg-red-600 opacity-20 group-hover:opacity-60 blur transition duration-300 animate-pulse"></span>
          <svg className="relative w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2zm4 6h2v2H9v-2zm6 0h2v2h-2v-2z" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full animate-ping"></span>
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full"></span>
        </button>
      )}

      {/* نافذة الشات بوت المنبثقة بشكل مضغوط ومناسب تماماً */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 top-16 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[340px] sm:h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-fadeIn">
          {/* الهيدر */}
          <div className="bg-gradient-to-r from-black via-zinc-900 to-slate-900 text-white px-3 py-2.5 flex justify-between items-center shadow-md border-b-2 border-red-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-xs sm:text-sm tracking-wide">مساعد شركة كيان 🤖</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white font-bold text-base w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* محتوى الرسائل */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 text-xs sm:text-sm leading-relaxed">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl whitespace-pre-line font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-red-700 text-white rounded-br-none shadow-red-900/10'
                      : 'bg-white text-gray-900 border border-gray-200/80 rounded-bl-none text-right'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-white text-gray-600 px-3 py-2 rounded-2xl border border-gray-200 shadow-sm animate-pulse flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="mr-1 font-medium">جاري تحضير الرد...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* حقل الإدخال */}
          <form onSubmit={sendMessage} className="p-2 bg-white border-t border-gray-200 flex gap-2 items-center">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs resize-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center cursor-pointer h-[34px]"
            >
              إرسال
            </button>
          </form>
        </div>
      )}
    </div>
  );
}