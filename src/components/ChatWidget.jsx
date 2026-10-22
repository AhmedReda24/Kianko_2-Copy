import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';

// 1. دالة تطهير صارمة لمنع أي أكواد XSS أو وسوم HTML داخل المحادثة
function sanitizeChatInput(input = '', maxLen = 300) {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>{}[\]\\^`~;$]/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, maxLen);
}

// 2. أزرار الاستفسار السريع لتسهيل الاستخدام على الهاتف وسطح المكتب
const QUICK_QUESTIONS = {
  ar: [
    'ما هي منتجات شركة كيانكو؟',
    'ما هي شهادات الأيزو والاعتمادات لديكم؟',
    'عناوين الفروع وأرقام التواصل',
    'كيف أطلب عرض سعر أو كتالوج؟',
  ],
  en: [
    'What products does KIANKO manufacture?',
    'What ISO certificates & approvals do you have?',
    'Branch locations & contact numbers',
    'How to request a quote or datasheet?',
  ],
};

// 3. محرك المعرفة الموثق لشركة كيانكو للصناعات الحديدية (يمنع التخريف ويرد بدقة 100%)
function getKiankoVerifiedResponse(rawQuery = '', defaultIsAr = true) {
  const q = rawQuery.trim().toLowerCase();
  const hasArabicChars = /[\u0600-\u06FF]/.test(q);
  const replyInAr = hasArabicChars || (defaultIsAr && !/[a-z]{3,}/i.test(q));

  // أ) التحقق من الكلمات الخارجة تماماً عن نطاق الشركة (رياضة، طبخ، سياسة، برمجة عامة، طقس، إلخ)
  const outOfScopeKeywords = [
    'طبخ', 'وصفة', 'اكلة', 'مباراة', 'كرة قدم', 'ريال مدريد', 'برشلونة', 'اهلي', 'زمالك',
    'سياسة', 'انتخابات', 'طقس', 'درجة الحرارة', 'فيلم', 'مسلسل', 'اغنية', 'نكتة', 'شعر',
    'طبيب', 'دواء', 'علاج', 'مرض', 'برمجة', 'بايثون', 'جافاسكريبت', 'كود برمجي', 'عملات رقمية', 'بيتكوين',
    'recipe', 'cooking', 'football', 'soccer', 'weather', 'movie', 'song', 'joke', 'poem',
    'medicine', 'doctor', 'python', 'javascript', 'bitcoin', 'crypto', 'politics'
  ];

  if (outOfScopeKeywords.some((kw) => q.includes(kw))) {
    return {
      isHandled: true,
      isOutOfScope: true,
      reply: replyInAr
        ? 'عذراً، لم يتم تزويدي بهذه المعلومات لأنها خارج نطاق تخصص ومجال شركة كيانكو للصناعات الحديدية.\n\nيسعدني دائماً إجابتك عن:\n• خطوط إنتاجنا الـ 13 (حوامل وسلالم الكابلات والمقاطع المعدنية).\n• شهادات الأيزو واعتمادات المشاريع الكبرى.\n• عناوين وأرقام فروعنا في جدة والرياض وطلبات التسعير.'
        : 'Apologies, I have not been provided with this information as it falls outside the scope and industry of KIANKO Steel Industries.\n\nI would be happy to assist you with:\n• Our 13 steel product lines (cable trays, ladders, trunking & profiles).\n• ISO certifications & major project approvals.\n• Jeddah & Riyadh branch contacts and quotation requests.',
    };
  }

  // ب) الترحيب والسلام
  if (/^(سلام|السلام عليكم|مرحبا|مرحب|اهلا|أهلا|هلا|صباح|مساء|ازيك|كيف حالك|حي الله|hi|hello|hey|good morning|good evening|greetings)$/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'أهلاً ومرحباً بك في شركة كيانكو للصناعات الحديدية (KIANKO)! 🏭\nكيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن منتجاتنا الـ 13، الكتالوجات الفنية، اعتماداتنا في المشاريع الكبرى، أو أرقام وعناوين فروعنا في جدة والرياض.'
        : 'Welcome to KIANKO Steel Industries! 🏭\nHow can I assist you today? You can ask me about our 13 steel product lines, technical datasheets, ISO & project approvals, or our branches in Jeddah and Riyadh.',
    };
  }

  // ج) السؤال عن هوية الشركة (من أنتم / عن كيانكو)
  if (/(من انتم|مين انتم|عن الشركة|عن كيانكو|شركة كيان|كيانكو|نبذة|تخصصكم|مجالكم|who are you|about kianko|what does kianko do|company profile)/i.test(q) && !/(منتج|فرع|سعر|شهاد|اعتماد)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'شركة كيانكو للصناعات الحديدية (KIANKO Steel Industries) هي شركة صناعية رائدة في المملكة العربية السعودية (جدة والرياض)، متخصصة في تصنيع وتوريد:\n1. أنظمة إدارة الكابلات (حوامل الكابلات المثقبة والشبكية، سلالم الكابلات الثقيلة، وأنظمـة الترنكنج).\n2. أنظمة القطاعات والتدعيم (C-Channels و Strut Channels ومشابك الكمرات).\n3. مقاطع المباني وهياكل الجبس بورد وملحقات وزوايا المحارة والبلوك.\nجميع منتجاتنا مصنعة وفق أعلى المعايير العالمية (ISO & ASTM).'
        : 'KIANKO Steel Industries is a leading industrial manufacturer in Saudi Arabia (Jeddah & Riyadh), specializing in:\n1. Cable Management Systems (Perforated Trays, Wire Mesh Basket Trays, Heavy-Duty Cable Ladders, and Cable Trunking).\n2. Structural Support Systems (C-Channels, Strut Channels, Brackets & Beam Clamps).\n3. Building Profiles, Drywall Framing, and Plastering & Blockwork Accessories.\nAll engineered in compliance with ISO and ASTM standards.',
    };
  }

  // د) السؤال عن المنتجات والكتالوجات (13 منتجاً)
  if (/(منتج|منتجات|كتالوج|داتا شيت|حوامل|كابلات|سلم|سلالم|ترنكنج|قطاعات|جبس|محارة|لياسة|زوايا|شبك|مشابك|خطوط انتاج|تصنعون|تبيعون|product|catalog|datasheet|tray|ladder|trunking|channel|plaster|drywall|bracket|clamp|mesh)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'تضم محفظة شركة كيانكو للصناعات الحديدية (13 خط إنتاج رئيسي) مقسمة إلى قطاعين:\n\nأولاً: أنظمة إدارة الكابلات والتدعيم:\n• حوامل الكابلات الشبكية (Basket Cable Trays)\n• سلم الكابلات الثقيل (Heavy Duty Cable Ladders)\n• حوامل الكابلات المثقبة (Perforated Cable Trays)\n• أنظمة ترنكنج الكابلات المغلقة (Cable Trunking)\n• أنظمة القطاعات والتدعيم (Channels & Supports)\n• قطاعات سي شانل المعدنية (C-Channels)\n• حوامل كابلات شبكية بسلك معدني\n\nثانياً: مقاطع المباني والمحارة:\n• ملحقات المحارة والبلوك (Plastering Accessories)\n• زوايا ومقاطع المحارة (Corner Beads)\n• أنظمة هياكل الجبس بورد (Drywall Framing)\n• كتائب وحوامل الإدارة (Management Brackets)\n• مشابك الكمرات الثقيلة واليايات (Beam Clamps)\n• زوايا فولاذية وشبك ممدد (Expanded Metal Mesh)\n\n📄 يمكنك تحميل الـ Datasheet لأي منتج مباشرة من صفحة "المنتجات" بالموقع.'
        : 'KIANKO Steel Industries manufactures 13 specialized steel product lines across two main sectors:\n\n1. Cable Management & Support Systems:\n• Basket Type & Wire Mesh Cable Trays\n• Heavy-Duty Cable Ladders\n• Perforated Cable Trays\n• Cable Trunking Systems\n• Strut Channels & C-Channels\n\n2. Building & Plastering Profiles:\n• Plastering & Blockwork Accessories\n• Corner Beads & Profiles\n• Drywall Framing Systems\n• Management Brackets & Heavy-Duty Beam Clamps\n• Steel Angle Beads & Expanded Metal Mesh\n\n📄 You can download the official PDF Datasheet for any item directly from our "Products" page.',
    };
  }

  // هـ) السؤال عن شهادات الأيزو والاعتمادات والمشاريع
  if (/(شهادة|شهادات|ايزو|أيزو|اعتماد|اعتمادات|جودة|ارامكو|أرامكو|نيوم|المربع|مسار|سفن|حديقة الملك سلمان|مشاريع|سابقة اعمال|iso|certificat|approval|accredited|aramco|neom|murabba|quality|project)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'تتمتع شركة كيانكو للصناعات الحديدية بأقوى سجل شهادات واعتمادات رسمية في المملكة:\n\n🏅 شهادات الأيزو العالمية:\n• ISO 9001:2015 (نظام إدارة الجودة العالمي)\n• ISO 14001:2015 (نظام الإدارة البيئية)\n• ISO 45001:2018 (إدارة السلامة والصحة المهنية)\n\n🏗️ أبرز اعتمادات المشاريع والجهات الكبرى:\n• اعتماد أرامكو السعودية (Saudi Aramco)\n• مشروع مدينة نيوم (NEOM)\n• مشروع المربع الجديد بالرياض (New Murabba)\n• مشروع حديقة الملك سلمان (King Salman Park)\n• مشروع وجهة مسار مكة (Masar Makkah)\n• مشاريع شركة سفن الترفيهية (SEVEN)\n• المشروع الوطني للمياه وإشراف هيل إنترناشونال.\n\nيمكنك معاينة وتحميل صور الشهادات والاعتمادات من قسم "الشركة والجودة" بالموقع.'
        : 'KIANKO Steel Industries holds top-tier international certifications and major project approvals:\n\n🏅 ISO Certifications:\n• ISO 9001:2015 (Quality Management System)\n• ISO 14001:2015 (Environmental Management)\n• ISO 45001:2018 (Occupational Health & Safety)\n\n🏗️ Major Project Approvals:\n• Saudi Aramco Vendor & Material Approval\n• NEOM Mega Project\n• New Murabba & King Salman Park (Riyadh)\n• Masar Makkah & SEVEN Entertainment Projects\n• National Water Project & Hill International.\n\nYou can preview and download all certificates under the "Company & Quality" menu.',
    };
  }

  // و) السؤال عن الفروع، العناوين، أرقام الهواتف، أو مواعيد العمل
  if (/(فرع|فروع|عنوان|عناوين|موقع|مواقع|مكان|تليفون|هاتف|جوال|رقم|ارقام|تواصل|ايميل|بريد|واتساب|جدة|الرياض|مواعيد|ساعات العمل|branch|location|address|phone|contact|email|whatsapp|jeddah|riyadh|office|hours)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'فروع ومكاتب شركة كيانكو للصناعات الحديدية في المملكة العربية السعودية:\n\n📍 المكتب الرئيسي وفرع جدة:\n• العنوان: 8484 القنديل، حي العزيزية، جدة 23334، المملكة العربية السعودية.\n• الهاتف / واتساب: +966 54 363 7676\n\n📍 فرع الرياض:\n• العنوان: شارع أبي الفضل الدارمي (8533–8643)، حي الفيصلية، الرياض 12881، المملكة العربية السعودية.\n• الهاتف / واتساب: +966 50 557 0663\n\n🕒 مواعيد العمل الرسمية: الأحد إلى الخميس (8:00 صباحاً – 5:00 مساءً).'
        : 'KIANKO Steel Industries Branches in Saudi Arabia:\n\n📍 Head Office & Jeddah Branch:\n• Address: 8484 Al Qandil, Al Aziziyah Dist., Jeddah 23334, Saudi Arabia.\n• Phone / WhatsApp: +966 54 363 7676\n\n📍 Riyadh Branch:\n• Address: Abi Al-Fadl Al-Darimi St., Al Faisaliyah Dist., Riyadh 12881, Saudi Arabia.\n• Phone / WhatsApp: +966 50 557 0663\n\n🕒 Working Hours: Sunday – Thursday (8:00 AM – 5:00 PM).',
    };
  }

  // ز) السؤال عن الأسعار، عروض الأسعار، التوريد، أو الطلبات
  if (/(سعر|اسعار|أسعار|تسعير|عرض سعر|تكلفة|كم سعر|شراء|طلبية|توريد|مقايسة|كميات|boq|price|pricing|quote|quotation|cost|order|buy|supply)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'تعتمد أسعار التوريد على المواصفات الفنية المطلوبة (سمك الصاج، نوع الجلفنة، والأبعاد) وجدول الكميات (BOQ) الخاص بمشروعك.\n\nللحصول على عرض سعر رسمي سريع:\n1. توجه إلى صفحة "تواصل معنا" وأرسل تفاصيل طلبك والفرع المفضل (الرياض أو جدة).\n2. أو تواصل مباشرة مع إدارة المبيعات عبر الهاتف/واتساب:\n• جدة: +966 54 363 7676\n• الرياض: +966 50 557 0663'
        : 'Pricing depends on technical specifications (steel thickness, galvanization type, dimensions) and your project BOQ quantities.\n\nTo receive an official quotation promptly:\n1. Visit our "Contact Us" page and submit your inquiry.\n2. Or contact our Sales Engineering team directly via Phone/WhatsApp:\n• Jeddah: +966 54 363 7676\n• Riyadh: +966 50 557 0663',
    };
  }

  // ح) السؤال عن الوظائف والتوظيف
  if (/(وظيفة|وظائف|توظيف|شغل|عمل|سيرة ذاتية|تقديم|مهندس|فني|career|job|vacancy|hiring|cv|resume|apply)/i.test(q)) {
    return {
      isHandled: true,
      reply: replyInAr
        ? 'نرحب دائماً بالكفاءات الهندسية والفنية للانضمام لفريق كيانكو!\nيمكنك استعراض الوظائف المتاحة حالياً ورفع سيرتك الذاتية (CV بصيغة PDF أو Word) مباشرة عبر صفحة "الوظائف" في قائمة "الشركة والجودة".'
        : 'We are always looking for talented engineers and technicians to join KIANKO!\nYou can view open positions and upload your CV (PDF or Word) directly on our "Careers" page under the "Company & Quality" menu.',
    };
  }

  // ط) التحقق مما إذا كان السؤال مرتبطاً بالمجال الهندسي/المعدني لإرساله إلى Make.com مع سياق صارم، أو رفضه فوراً إن كان خارج النطاق
  const domainRelatedWords = [
    'كيان', 'حديد', 'صلب', 'معدن', 'مجلفن', 'جلفنة', 'ستانلس', 'مصنع', 'تثبيت', 'سقف', 'حائط', 'كابل', 'كهرباء', 'مشروع', 'استشاري', 'مقاول', 'مواصفات', 'سماكة', 'مللي',
    'kian', 'steel', 'metal', 'galvanized', 'hot dip', 'factory', 'cable', 'support', 'consultant', 'contractor', 'spec', 'thickness', 'astm', 'bs'
  ];

  const isDomainRelated = domainRelatedWords.some((w) => q.includes(w));

  if (!isDomainRelated) {
    return {
      isHandled: true,
      isOutOfScope: true,
      reply: replyInAr
        ? 'عذراً، لم يتم تزويدي بهذه المعلومات لأنها خارج نطاق تخصص ومجال شركة كيانكو للصناعات الحديدية.\n\nأنا مخصص فقط للإجابة عن استفساراتكم حول منتجات كيانكو (حوامل وسلالم الكابلات والمقاطع المعدنية)، شهادات الجودة والاعتمادات، الفروع، وطلبات التسعير.'
        : 'Apologies, I have not been provided with this information as it is outside the scope of KIANKO Steel Industries.\n\nI am dedicated exclusively to answering questions about KIANKO products, technical catalogs, ISO & project approvals, branch locations, and quotations.',
    };
  }

  return { isHandled: false, replyInAr };
}

export default function ChatWidget({ lang, themeColor = '#C9252C', darkMode = true }) {
  // التعرف التلقائي على اللغة الحالية للموقع حتى لو لم يتم تمرير lang كـ prop
  const [detectedAr, setDetectedAr] = useState(() => {
    if (lang) return lang === 'ar';
    if (typeof document !== 'undefined') {
      return document.documentElement.dir === 'rtl' || document.body.style.fontFamily.includes('IBM');
    }
    return true;
  });

  useEffect(() => {
    if (lang) {
      setDetectedAr(lang === 'ar');
      return;
    }
    const observer = new MutationObserver(() => {
      const isRtl = document.documentElement.dir === 'rtl' || document.body.style.fontFamily.includes('IBM');
      setDetectedAr(isRtl);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang', 'class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'dir'] });
    return () => observer.disconnect();
  }, [lang]);

  const isAr = lang ? lang === 'ar' : detectedAr;
  const pick = (en, ar) => (isAr ? ar : en);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const lastSentTimeRef = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ضبط رسالة الترحيب الافتراضية باسم "شركة كيانكو للصناعات الحديدية" باللغتين
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            sender: 'bot',
            text: isAr
              ? 'أهلاً بك في شركة كيانكو للصناعات الحديدية (KIANKO)! 🏭\nكيف يمكنني مساعدتك اليوم بخصوص منتجاتنا، الكتالوجات، الاعتمادات، أو الفروع؟'
              : 'Welcome to KIANKO Steel Industries! 🏭\nHow can I assist you today regarding our steel products, datasheets, approvals, or branches?',
          },
        ];
      }
      return prev;
    });
  }, [isAr]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 80);
    }
  }, [messages, loading, isOpen]);

  const formatBotText = (text) => {
    if (typeof text !== 'string') return '';
    return sanitizeChatInput(
      text
        .replace(/["{}]/g, '')
        .replace(/reply:/gi, '')
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .trim(),
      1200
    );
  };

  const handleSendText = async (rawTextToSend) => {
    const cleanUserText = sanitizeChatInput(rawTextToSend, 300).trim();
    if (!cleanUserText || loading) return;

    // تحجيم الإرسال السريع المتتالي (Rate Limit 1.5 ثانية بين كل رسالة)
    const now = Date.now();
    if (now - lastSentTimeRef.current < 1500) return;
    lastSentTimeRef.current = now;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: cleanUserText }]);
    setLoading(true);

    // 1. فحص السؤال أولاً عبر محرك كيانكو الموثق لضمان دقة 100% وعدم التخريف والعمل الفوري على الموبايل
    const localCheck = getKiankoVerifiedResponse(cleanUserText, isAr);
    if (localCheck.isHandled) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: localCheck.reply }]);
        setLoading(false);
      }, 350);
      return;
    }

    // 2. إذا كان السؤال هندسياً تفصيلياً داخل نطاق كيانكو، نتصل بـ Make.com مع إرسال قواعد صارمة تمنع التخريف، مع مهلة أمان للموبايل
    const webhookUrl = import.meta.env.VITE_MAKE_CHAT_WEBHOOK_URL;
    if (!webhookUrl) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: pick(
              'For detailed custom engineering specs, please contact our technical team in Jeddah (+966 54 363 7676) or Riyadh (+966 50 557 0663).',
              'للاستفسارات الهندسية التفصيلية الخاصة، يسعدنا تواصلك المباشر مع فريقنا الفني في جدة (+966 54 363 7676) أو الرياض (+966 50 557 0663).'
            ),
          },
        ]);
        setLoading(false);
      }, 350);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const strictSystemInstruction =
        'أنت المساعد الرسمي لشركة كيانكو للصناعات الحديدية (KIANKO Steel Industries) في السعودية (جدة والرياض). أجب فقط عن منتجات كيانكو (حوامل الكابلات، سلالم الكابلات، الترنكنج، قطاعات السي شانل، الجبس بورد، وزوايا وشبك المحارة). إذا كان السؤال خارج هذا النطاق قل فقط: لم يتم تزويدي بهذه المعلومات لأنها خارج مجال شركة كيانكو.';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: `${strictSystemInstruction}\n\nسؤال العميل: ${cleanUserText}`,
          user_question: cleanUserText,
          lang: isAr ? 'ar' : 'en',
        }),
      });

      clearTimeout(timeoutId);
      const rawText = await response.text();
      let botReply = rawText;

      try {
        const parsed = JSON.parse(rawText);
        botReply = parsed.result || parsed.reply || parsed.text || parsed.message || rawText;
      } catch {
        botReply = rawText;
      }

      botReply = formatBotText(botReply);

      // إذا رد الـ Webhook بـ Accepted أو رد فارغ، نقدم إجابة كيانكو الهندسية المعتمدة
      if (!botReply || botReply.toLowerCase() === 'accepted' || botReply.length < 4) {
        botReply = pick(
          'KIANKO manufactures all steel systems according to ASTM & ISO 9001 standards. For custom technical submittals, please contact our engineers at +966 54 363 7676 (Jeddah) or +966 50 557 0663 (Riyadh).',
          'تصنّع شركة كيانكو كافة الأنظمة المعدنية وحوامل الكابلات وفق المواصفات القياسية (ASTM & ISO 9001). للحصول على الاعتماد الفني أو المقاسات الخاصة بمشروعك، تواصل مع فريقنا الهندسي في جدة (+966 54 363 7676) أو الرياض (+966 50 557 0663).'
        );
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch {
      clearTimeout(timeoutId);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: pick(
            'KIANKO Steel Industries provides 13 certified product lines (Cable Trays, Ladders, Trunking & Building Profiles). Contact us directly at +966 54 363 7676 (Jeddah) or +966 50 557 0663 (Riyadh).',
            'تقدم شركة كيانكو 13 خط إنتاج معتمد (حوامل وسلالم الكابلات والمقاطع المعدنية). للتواصل المباشر مع الإدارة الهندسية: جدة (+966 54 363 7676) | الرياض (+966 50 557 0663).'
          ),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendText(input);
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: isAr
          ? 'أهلاً بك في شركة كيانكو للصناعات الحديدية (KIANKO)! 🏭\nكيف يمكنني مساعدتك اليوم بخصوص منتجاتنا، الكتالوجات، الاعتمادات، أو الفروع؟'
          : 'Welcome to KIANKO Steel Industries! 🏭\nHow can I assist you today regarding our steel products, datasheets, approvals, or branches?',
      },
    ]);
  };

  const quickList = isAr ? QUICK_QUESTIONS.ar : QUICK_QUESTIONS.en;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: isAr ? "'IBM Plex Sans Arabic', sans-serif" : undefined }}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40"
    >
      {/* زر الفتح العائم في الزاوية السفلية بعيداً عن أزرار الفوتر */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{ borderColor: themeColor }}
          className="relative bg-gradient-to-tr from-[#061024] via-[#0A1832] to-red-950 text-white w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 group cursor-pointer"
          aria-label={pick('Open KIANKO Assistant', 'فتح مساعد شركة كيانكو الذكي')}
        >
          <span
            className="absolute -inset-1 rounded-full opacity-25 group-hover:opacity-55 blur-xs transition duration-300"
            style={{ backgroundColor: themeColor }}
          />
          <Bot className="relative w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#061024] rounded-full animate-ping" />
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#061024] rounded-full" />
        </button>
      )}

      {/* نافذة المحادثة المتجاوبة مع الموبايل والتابلت واللابتوب */}
      {isOpen && (
        <div
          className={`fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[370px] h-[72dvh] max-h-[520px] min-h-[340px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col border overflow-hidden transition-all z-50 ${
            darkMode
              ? 'bg-[#0A1832] border-blue-900/80 text-white'
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          {/* الهيدر العلوي للمساعد */}
          <div
            className="bg-gradient-to-r from-[#061024] via-[#0A1832] to-slate-900 text-white px-3.5 py-3 flex justify-between items-center shadow-md border-b-2 shrink-0"
            style={{ borderBottomColor: themeColor }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow shrink-0"
                style={{ backgroundColor: themeColor }}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-start">
                <h3 className="font-extrabold text-xs sm:text-sm tracking-wide truncate flex items-center gap-1.5">
                  <span>{pick('KIANKO Smart Assistant', 'مساعد كيانكو الذكي')}</span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                </h3>
                <p className="text-[10px] text-slate-300 truncate">
                  {pick('Official Product & Technical Guide', 'الدليل الرسمي للمنتجات والاعتمادات')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                title={pick('Reset Conversation', 'بدء محادثة جديدة')}
                className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={pick('Close Chat', 'إغلاق نافذة المحادثة')}
                className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-red-600/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* منطقة الرسائل وأزرار الاستفسار السريع */}
          <div
            className={`flex-1 p-3 overflow-y-auto space-y-3 text-xs sm:text-sm leading-relaxed ${
              darkMode ? 'bg-[#061022]' : 'bg-slate-50'
            }`}
          >
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    style={{ backgroundColor: isUser ? themeColor : undefined }}
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl whitespace-pre-line font-medium leading-relaxed shadow-sm text-start ${
                      isUser
                        ? 'text-white rounded-ee-none'
                        : darkMode
                        ? 'bg-[#0A1832] text-slate-100 border border-blue-900/60 rounded-es-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-es-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* أزرار الاستفسار السريع باللمس (تعمل فوراً على الموبايل واللابتوب) */}
            {!loading && (
              <div className="pt-1 space-y-1.5">
                <p className={`text-[10px] font-bold flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{pick('Quick Inquiries:', 'استفسارات سريعة باللمس:')}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickList.map((qText) => (
                    <button
                      key={qText}
                      type="button"
                      onClick={() => handleSendText(qText)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 text-start ${
                        darkMode
                          ? 'bg-[#0A1832] border-blue-800/70 text-slate-200 hover:border-red-500 hover:text-white'
                          : 'bg-white border-slate-300 text-slate-800 hover:border-red-500 shadow-2xs'
                      }`}
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-end">
                <div
                  className={`px-3.5 py-2.5 rounded-2xl border shadow-sm flex items-center gap-1.5 text-xs ${
                    darkMode
                      ? 'bg-[#0A1832] text-slate-300 border-blue-900/60'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ms-1 font-bold">
                    {pick('Preparing verified answer…', 'جاري تحضير الرد الموثق…')}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* شريط كتابة وإرسال الرسالة (مجهز خصيصاً للمس الهواتف الذكية) */}
          <form
            onSubmit={handleFormSubmit}
            className={`p-2.5 border-t flex gap-2 items-center shrink-0 ${
              darkMode ? 'bg-[#0A1832] border-blue-900/60' : 'bg-white border-slate-200'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={300}
              aria-label={pick('Type your question here', 'اكتب استفسارك هنا')}
              onChange={(e) => setInput(sanitizeChatInput(e.target.value, 300))}
              placeholder={pick('Ask about KIANKO products or branches…', 'اسأل عن منتجات كيانكو، الاعتمادات، الفروع…')}
              className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border focus:outline-none focus:border-red-500 min-h-[42px] transition-colors ${
                darkMode
                  ? 'bg-[#061022] border-blue-900/60 text-white placeholder-slate-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              onMouseDown={(e) => e.preventDefault()}
              aria-label={pick('Send Message', 'إرسال الرسالة')}
              style={{ backgroundColor: loading || !input.trim() ? undefined : themeColor }}
              className="disabled:bg-slate-600 disabled:opacity-50 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] shrink-0 active:scale-95"
            >
              <span>{pick('Send', 'إرسال')}</span>
              <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </button>
          </form>

          {/* شريط الحماية السفلي */}
          <div
            className={`px-3 py-1 text-[10px] flex items-center justify-center gap-1 border-t shrink-0 ${
              darkMode
                ? 'bg-[#061022] border-blue-950 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              {pick(
                'KIANKO Official AI — Verified Industrial Data',
                'مساعد كيانكو الرسمي — بيانات صناعية موثقة'
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}