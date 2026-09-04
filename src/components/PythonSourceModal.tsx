import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Download, Terminal, Code2, Play } from 'lucide-react';

interface PythonSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const PythonSourceModal: React.FC<PythonSourceModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      const res = await fetch('/app.py');
      let text = '';
      if (res.ok) {
        text = await res.text();
      } else {
        text = `# Please find app.py in your project root folder.`;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/app.py');
    element.setAttribute('download', 'app.py');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl border border-emerald-500/40 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">app.py</h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                  Single-File Flask Backend
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'ملف بايثون مستقل وشامل يحتوي على الخادم وقواعد الفحص والواجهة المدمجة'
                  : 'Self-contained single Python file containing complete Flask backend & embedded UI'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition font-mono"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (isAr ? 'تم النسخ بنجاح!' : 'Copied!') : (isAr ? 'نسخ كود app.py' : 'Copy Code')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:text-white transition font-mono"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? 'تحميل الملف' : 'Download app.py'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Local Run Instructions */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
            <Terminal className="h-4 w-4" />
            <span>{isAr ? 'تعليمات التشغيل المحلي (Zero Configuration):' : 'Local Execution Instructions:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500 block mb-1">1. تثبيت المتطلبات:</span>
              <code className="text-emerald-300">pip install flask</code>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500 block mb-1">2. تشغيل التطبيق:</span>
              <code className="text-emerald-300">python app.py</code>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-slate-500 block mb-1">3. فتح المتصفح:</span>
              <code className="text-emerald-300">http://127.0.0.1:5000</code>
            </div>
          </div>
        </div>

        {/* Code Content preview */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 bg-slate-950/90 no-scrollbar select-all">
          <pre className="text-emerald-300/90">
{`# Soverify - Moroccan Law 08/09 Compliance & Privacy Audit Platform
# Dahir n° 1-09-15 & Commission Nationale CNDP Regulations
# Single-File Flask Application with Embedded Dark Cybersecurity UI

import os, time, random, re
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)
app.secret_key = "soverify-moroccan-law-0809-cyber-token-2026"

# Routes included in app.py:
# /                -> Serves embedded dark HTML/Tailwind compliance portal
# /audit           -> POST: executes Moroccan Law 08/09 audit on target domain
# /compare         -> POST: compares two websites head-to-head
# /breach-template -> POST: generates formal 72h CNDP notification letter
# /history         -> GET:  returns past audit reports and evolution log

# To run:
# pip install flask
# python app.py
# Open: http://127.0.0.1:5000`}
          </pre>
          <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            {isAr
              ? 'تم حفظ ملف app.py بالكامل في المجلد الجذري للمشروع (/app.py) وهو جاهز للتنفيذ الفوري.'
              : 'The complete app.py file is saved in the workspace root (/app.py) and ready to run.'}
          </div>
        </div>
      </div>
    </div>
  );
};
