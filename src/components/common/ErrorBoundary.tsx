import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected telemetry error occurred.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CITYOS UI Error caught by boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-[#DC2626] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#1E293B]">
            Telemetry Subsystem Unavailable
          </h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            The active interface encountered a temporary synchronization fault with the campus IoT gateway. No physical systems are affected.
          </p>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] font-mono text-[11px] text-[#DC2626] border border-[#E2E8F0]">
            {this.state.errorMessage}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Component</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] text-xs font-medium transition-colors"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
