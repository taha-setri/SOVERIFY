import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Paperclip, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Scale, 
  ShieldCheck, 
  AlertCircle,
  X,
  FileText,
  ChevronDown,
  RefreshCw,
  Cpu,
  Zap
} from 'lucide-react';
import Markdown from 'react-markdown';
import { AuditReport, ChatMessage, GeminiModelChoice } from '../types';
import { generateSovereignDpoLegalAdvice } from '../services/sovereignDpoEngine';

interface GeminiDpoChatbotProps {
  lang: 'ar' | 'en';
  currentReport: AuditReport | null;
  currentUser?: { name: string; email: string; uid?: string } | null;
  initialPrompt?: string;
}

export const GeminiDpoChatbot: React.FC<GeminiDpoChatbotProps> = ({
  lang,
  currentReport,
  currentUser,
  initialPrompt
}) => {
  const isAr = lang === 'ar';

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome-1',
    role: 'model',
    content: isAr
      ? `مرحباً بك! أنا **المستشار القانوني السيادي للامتثال (Soverify DPO)**، أعمل **مجاناً 100% وبشكل مستقل** دون الحاجة لنماذج ذكاء اصطناعي مدفوعة أو استهلاك أي رصيد، ومجهز بالكامل بقواعد **القانون المغربي رقم 08.09** ومداولات وقرارات **CNDP**.

يمكنني مساعدتك فوراً وبالمجان في:
- ⚖️ **تفسير بنود ومواد القانون 08.09** والعقوبات والغرامات الجنائية المرتبطة بكل مخالفة.
- 🍪 **صياغة لافتة الكوكيز المتوافقة** مع مداولة CNDP رقم 08-2020 وتوفير زر «رفض الكل».
- 📋 **صياغة بنود سياسة الخصوصية** الملتزمة بالمادة 12 من القانون 08.09.
- 🌍 **شروط نقل المعطيات السحابية خارج المغرب** (المادتان 43 و44 وتراخيص CNDP).
- 🚨 **بروتوكول التعامل مع تسريب واختراق المعطيات** والإشعار الرسمي لـ CNDP خلال 48 ساعة.
${currentReport ? `\n> 🔍 **بيانات الفحص النشط**: تم تحميل بيانات موقع **${currentReport.domain}** بنسبة امتثال (**${currentReport.score}%**). يمكنك سؤالي مباشرة عن معالجة الثغرات المرصودة!` : ''}

كيف يمكنني مساعدتك في ملف امتثالك اليوم؟`
      : `Welcome! I am your **Autonomous Sovereign DPO Legal Advisor**, operating **100% Free** without requiring paid AI models or API quotas, fully specialized in **Moroccan Law No. 09-08** and **CNDP** deliberations.

I can assist you instantly and completely free of charge with:
- ⚖️ **Statutory interpretation of Law 08/09** and criminal sanctions.
- 🍪 **Drafting compliant Cookie Banners** per CNDP Deliberation 08-2020 with equal refusal buttons.
- 📋 **Mandatory Privacy Policy Clauses** (Article 12 requirements).
- 🌍 **Cross-Border Cloud Data Transfers** (Articles 43 & 44 authorizations).
- 🚨 **Data Breach Emergency Protocol** and formal CNDP notification within 48 hours.
${currentReport ? `\n> 🔍 **Active Audit Context**: Loaded data for **${currentReport.domain}** (${currentReport.score}% compliance). You can ask me directly for remedies for your detected gaps!` : ''}

How can I assist your compliance journey today?`,
    timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    modelUsed: isAr ? 'المحرك القانوني السيادي (مجاني 100%)' : 'Sovereign Engine (100% Free)'
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('soverify_dpo_chat');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.warn('[Soverify Chat] Could not restore chat history from localStorage:', e);
    }
    return [defaultWelcomeMessage];
  });

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('sovereign-free');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Attachment state for multimodal analysis
  const [attachment, setAttachment] = useState<{
    name: string;
    mimeType: string;
    data: string; // base64
    preview: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('soverify_dpo_chat', JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('[Soverify Chat] Could not persist chat history to localStorage:', e);
    }
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const quickPrompts = isAr ? [
    {
      label: '🍪 صياغة إشعار كوكيز متوافق (مداولة 08-2020)',
      prompt: 'قم بصياغة نص متكامل للافتة إشعار ملفات تعريف الارتباط (Cookie Consent Banner) لموقع تجارة إلكترونية بالمغرب يلتزم كلياً بمداولة CNDP رقم 08-2020، مع خيارات القبول والرفض وإدارة التفضيلات.'
    },
    {
      label: '🌍 شروط نقل البيانات لخارج المغرب (المادة 43)',
      prompt: 'موقعي يستعمل خوادم سحابية في فرنسا (AWS/GCP). ما هي الشروط والإجراءات القانونية الصارمة لنقل المعطيات خارج المغرب وفق المادتين 43 و44 من القانون 08.09؟ وما العقوبات المترتبة في حال عدم الحصول على إذن CNDP؟'
    },
    {
      label: '📋 صياغة بند سياسة الخصوصية طبقاً للمادة 12',
      prompt: 'صغ لي بند إخبار المستخدمين في سياسة الخصوصية يغطي جميع متطلبات المادة 12 من القانون 08.09 (هوية المسؤول، أهداف المعالجة، المستلمون، وحق الولوج والتصحيح).'
    },
    {
      label: '🔍 تحليل الثغرات للموقع المفحوص واقتراح أولويات',
      prompt: currentReport
        ? `بناءً على فحص موقع ${currentReport.domain} ونسبة امتشاله (${currentReport.score}%)، ما هي الثغرات الأكثر إلحاحاً قانونياً، وما هي خطة العمل الفورية لتجنب غرامات CNDP؟`
        : 'ما هي أكثر الأخطاء الشائعة التي ترصدها CNDP في المواقع الإلكترونية المغربية وتتسبب في إشعار بالمخالفة؟'
    },
    {
      label: '🚨 إشعار CNDP بواقعة تسريب معطيات',
      prompt: 'حدث اشتباه في تسريب أمني لقاعدة بيانات العملاء. ما هو النموذج والإجراءات المطلوبة لإشعار CNDP خلال الأجل القانوني (48 ساعة) وحماية الشركة من المتابعة الجنائية؟'
    }
  ] : [
    {
      label: '🍪 Compliant Cookie Notice (Delib 08-2020)',
      prompt: 'Draft a compliant Cookie Consent banner copy for an e-commerce website operating in Morocco, strictly meeting CNDP Deliberation 08-2020 rules for prior consent and equal Reject options.'
    },
    {
      label: '🌍 Cross-border Data Transfers (Art. 43)',
      prompt: 'Our web app uses cloud hosting in Europe (AWS/GCP). What are the mandatory legal prerequisites under Articles 43 and 44 of Law 08/09 to transfer personal data abroad, and how do we file with CNDP?'
    },
    {
      label: '📋 Article 12 Privacy Policy Clause',
      prompt: 'Draft an information clause for our Privacy Policy complying with all requirements of Article 12 of Law 08/09 (controller identity, purpose, recipients, access/rectification rights).'
    },
    {
      label: '🔍 Audit Findings Remediation Plan',
      prompt: currentReport
        ? `Based on the active audit of ${currentReport.domain} (${currentReport.score}%), analyze the critical gaps and suggest an immediate step-by-step remediation plan to prevent CNDP penalties.`
        : 'What are the top 3 compliance violations sanctioned by CNDP under Moroccan Law 08/09?'
    },
    {
      label: '🚨 CNDP Data Breach Notification Template',
      prompt: 'Provide a formal notification draft and step-by-step protocol for reporting a personal data breach to CNDP within 48 hours.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to 4MB
    if (file.size > 4 * 1024 * 1024) {
      const errAlert: ChatMessage = {
        id: `file-err-${Date.now()}`,
        role: 'model',
        content: isAr
          ? '⚠️ تنبيه: حجم الملف المرفق يتجاوز الحد الأقصى المسموح به (4 ميغابايت). يرجى إرفاق صورة أو مستند بحجم أصغر.'
          : '⚠️ Warning: Attached file exceeds the 4MB limit. Please upload a smaller screenshot or document.',
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages((prev) => [...prev, errAlert]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachment({
        name: file.name,
        mimeType: file.type || 'image/png',
        data: base64Data,
        preview: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !attachment) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      attachmentName: attachment?.name,
      attachmentPreview: attachment?.preview
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    const currentAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);

    try {
      const auditContext = currentReport ? {
        domain: currentReport.domain,
        businessName: currentReport.businessName,
        score: currentReport.score,
        status: currentReport.status,
        sovereigntyStatus: currentReport.sovereigntyStatus,
        gaps: currentReport.gaps,
        warnings: currentReport.warnings,
        cookies: currentReport.cookies
      } : null;

      // 1. If Sovereign Free mode is selected, generate instantly and 100% free right in the browser!
      // This guarantees zero external network dependency, zero AI quotas, and instant execution on Vercel.
      if (selectedModel === 'sovereign-free' || !selectedModel) {
        const advice = generateSovereignDpoLegalAdvice(
          textToSend,
          updatedMessages.map(m => ({ role: m.role, content: m.content })),
          auditContext
        );

        const botReply: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: advice,
          timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: isAr ? 'المحرك القانوني السيادي المغربي (مجاني 100% ومستقل)' : 'Sovereign Moroccan Legal Engine (100% Free)'
        };

        setMessages([...updatedMessages, botReply]);
        return;
      }

      // 2. If an optional AI model is selected, attempt the backend proxy
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          auditContext,
          attachment: currentAttachment ? {
            mimeType: currentAttachment.mimeType,
            data: currentAttachment.data
          } : undefined
        })
      });

      let replyContent = '';
      let usedModelName: string = selectedModel;

      if (response.ok) {
        const data = await response.json();
        replyContent = data.reply || (isAr ? 'تم استلام الاستشارة بنجاح.' : 'Response received.');
        usedModelName = data.modelUsed || selectedModel;
      } else {
        // Fallback to client sovereign engine if server responds with error or 404 on Vercel
        replyContent = generateSovereignDpoLegalAdvice(textToSend, apiMessages, auditContext);
        usedModelName = isAr ? 'المحرك القانوني السيادي (احتياطي تلقائي مجاني)' : 'Sovereign Engine (Autonomous Fallback)';
      }

      const botReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: usedModelName
      };

      setMessages([...updatedMessages, botReply]);
    } catch (err: any) {
      console.warn('[Gemini DPO Chat] Network/API notification, executing sovereign engine locally:', err?.message || err);
      const auditContext = currentReport ? {
        domain: currentReport.domain,
        businessName: currentReport.businessName,
        score: currentReport.score,
        status: currentReport.status,
        sovereigntyStatus: currentReport.sovereigntyStatus,
        gaps: currentReport.gaps,
        warnings: currentReport.warnings,
        cookies: currentReport.cookies
      } : null;

      const safeLocalAdvice = generateSovereignDpoLegalAdvice(
        textToSend,
        updatedMessages.map(m => ({ role: m.role, content: m.content })),
        auditContext
      );

      const safeFallbackReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: safeLocalAdvice,
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: isAr ? 'المحرك القانوني السيادي المغربي (مجاني 100% ومستقل)' : 'Soverify Sovereign DPO (100% Free & Autonomous)'
      };
      setMessages([...updatedMessages, safeFallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          // fallback ignore
        });
      }
    } catch {
      // ignore
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([defaultWelcomeMessage]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('soverify_dpo_chat');
      }
    } catch (e) {
      console.warn('[Soverify Chat] Could not clear localStorage chat key:', e);
    }
    setShowClearConfirm(false);
  };

  const handleExportChat = () => {
    const transcript = messages.map(m => `### [${m.timestamp}] ${m.role === 'user' ? (currentUser?.name || 'User / DPO') : 'Gemini DPO Advisor'}\n\n${m.content}\n\n---\n`).join('\n');
    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Soverify-DPO-Legal-Consultation-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                {isAr ? 'المستشار القانوني السيادي DPO (مجاني 100%)' : 'Sovereign DPO Legal Advisor (100% Free)'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {isAr ? 'مجاني بدون رصيد' : '100% Free'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? 'استشارات قانونية وصياغة بنود الخصوصية ومطابقة CNDP والقانون 08.09 دون الحاجة لنماذج ذكاء اصطناعي' : 'Autonomous Moroccan privacy compliance & statutory drafting (No API quota needed)'}
            </p>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Model Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as GeminiModelChoice)}
              className="bg-transparent text-xs font-mono text-emerald-300 outline-none cursor-pointer pr-1"
            >
              <option value="sovereign-free" className="bg-slate-900 text-emerald-400 font-bold">
                ⚡ {isAr ? 'المحرك السيادي (مجاني 100% ومستقل)' : 'Sovereign Engine (100% Free)'}
              </option>
              <option value="gemini-3.8-flash" className="bg-slate-900 text-slate-300">
                🤖 gemini-3.8-flash (اختياري / AI)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-300">
                🤖 gemini-3.1-flash-lite (اختياري / AI)
              </option>
              <option value="gemini-2.5-flash" className="bg-slate-900 text-slate-300">
                🤖 gemini-2.5-flash (اختياري / AI)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-slate-300">
                🤖 gemini-3.1-pro (اختياري / AI)
              </option>
            </select>
          </div>

          {/* Export Transcript */}
          <button
            onClick={handleExportChat}
            title={isAr ? 'تصدير تفريغ الاستشارة (Markdown)' : 'Export Consultation Transcript'}
            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Clear Chat with in-UI Confirmation */}
          {showClearConfirm ? (
            <div className="flex items-center gap-1 bg-slate-950 border border-rose-500/50 rounded-lg p-1">
              <span className="text-[10px] text-rose-300 px-1">{isAr ? 'تأكيد؟' : 'Clear?'}</span>
              <button
                onClick={handleClearChat}
                className="px-1.5 py-0.5 text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold rounded"
              >
                {isAr ? 'نعم' : 'Yes'}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                {isAr ? 'إلغاء' : 'No'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              title={isAr ? 'مسح المحادثة' : 'Clear Chat'}
              className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Audit Context Banner (if available) */}
      {currentReport && (
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-emerald-950/20 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              {isAr ? 'سياق التدقيق النشط:' : 'Active Audit Context:'}{' '}
              <strong className="font-mono text-white">{currentReport.domain}</strong>{' '}
              ({currentReport.score}% {isAr ? 'امتثال' : 'compliance'})
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {currentReport.gaps.length} {isAr ? 'ثغرات حرجة' : 'critical gaps'}
          </span>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? (isAr ? 'flex-row' : 'flex-row-reverse') : (isAr ? 'flex-row-reverse' : 'flex-row')}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                  isUser
                    ? 'border-emerald-500/30 bg-emerald-950/60 text-emerald-300'
                    : 'border-slate-700 bg-slate-800 text-teal-400'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-50'
                    : msg.isError
                    ? 'bg-rose-950/30 border border-rose-500/40 text-rose-200'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] text-slate-400 font-mono">
                  <span>
                    {isUser ? (currentUser?.name || (isAr ? 'المستخدم / DPO' : 'User / DPO')) : (isAr ? 'مستشار Soverify السيادي' : 'Soverify Sovereign DPO')}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.modelUsed && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-sans">
                        <Zap className="h-2.5 w-2.5 text-emerald-400" />
                        {msg.modelUsed}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-white"
                      title={isAr ? 'نسخ النص' : 'Copy'}
                    >
                      {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Attachment preview if user uploaded one */}
                {msg.attachmentPreview && (
                  <div className="mb-2.5 rounded-lg overflow-hidden border border-slate-700 max-w-xs">
                    <img 
                      src={msg.attachmentPreview} 
                      alt="Attachment" 
                      className="max-h-48 object-cover w-full"
                    />
                    <div className="p-1.5 bg-slate-900 text-[11px] font-mono text-slate-300 truncate">
                      📎 {msg.attachmentName}
                    </div>
                  </div>
                )}

                {/* Markdown content */}
                <div className="markdown-body prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className={`flex gap-3 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-teal-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400 flex items-center gap-3">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              <span>
                {isAr ? 'يقوم المستشار القانوني بتحليل نصوص القانون وصياغة الاستشارة...' : 'Gemini DPO is reviewing Law 08/09 provisions & formulating advice...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 p-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-mono text-slate-500 shrink-0 px-1">
            {isAr ? 'نماذج جاهزة:' : 'Templates:'}
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-slate-800 transition disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attachment Preview Box (if selected) */}
      {attachment && (
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-mono text-emerald-400">📎 {attachment.name}</span>
            <span className="text-slate-500 text-[11px]">({attachment.mimeType})</span>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="text-slate-400 hover:text-rose-400 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-slate-800 bg-slate-950 p-3 sm:p-4 flex items-center gap-2"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,application/pdf"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title={isAr ? 'إرفاق لقطة شاشة أو وثيقة (كوكيز، سياسة خصوصية)' : 'Attach screenshot or doc (cookie banner, policy)'}
          className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isAr
              ? 'اكتب سؤالك القانوني أو اطلب صياغة بنود خصوصية وفق القانون 08.09...'
              : 'Ask a legal question or request Privacy Policy clauses under Law 08/09...'
          }
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-sans"
        />

        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !attachment)}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
