import React from 'react';
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react';

interface RedAlertBannerProps {
  message?: string | null;
  onStartMicroSession: () => void;
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  message,
  onStartMicroSession,
}) => {
  if (!message) return null;

  return (
    <div className="bg-rose-950/80 border-2 border-rose-500/80 rounded-xl p-4 sm:p-5 shadow-lg shadow-rose-950/50 animate-pulse-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-200 tracking-tight flex items-center gap-2">
            <span>MOMENTUM WARNING: 2 CONSECUTIVE BLANK DAYS</span>
            <span className="badge badge-rose">UNACCEPTABLE</span>
          </h3>
          <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <button
        onClick={onStartMicroSession}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all shrink-0 active:scale-95"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>Start 15m Micro-Session</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
