import React, { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global resilience handler to prevent opaque "Script error." in sandboxed iframes
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Log diagnostics cleanly
    if (event.message === 'Script error.' || !event.message) {
      console.warn('[Soverify Shield] Caught external cross-origin or sandboxed frame script error:', event);
    } else {
      console.error('[Soverify Shield] Uncaught runtime script error:', event.message, event.filename, event.lineno);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Soverify Shield] Unhandled promise rejection intercepted:', event.reason);
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unknown runtime error' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Soverify UI ErrorBoundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/40 bg-slate-900/95 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-white">تنبيه استعادة الجلسة (Session Recovery)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              حدث استثناء أثناء عرض أحد العناصر. تم عزل الخطأ لمنع توقف المنصة.
            </p>
            <div className="p-3 bg-black/50 rounded-xl text-[11px] font-mono text-rose-300 text-right overflow-x-auto">
              {this.state.errorMessage}
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition duration-200 shadow-lg shadow-emerald-600/30"
            >
              إعادة تحميل المنصة (Reload Application)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
