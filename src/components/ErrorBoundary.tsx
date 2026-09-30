import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-neutral-900 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-5 shadow-lg">
              <BookOpen className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold font-serif-magic text-amber-300 mb-2">
              Grimoire Memerlukan Pemulihan
            </h2>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Terjadi sedikit gangguan magis pada aplikasi. Semua data jurnal rahasiamu tetap aman dienkripsi.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Muat Ulang Grimoire
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
