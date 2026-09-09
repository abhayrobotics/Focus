import React from 'react';
import { Plus, Sparkles, Calendar, Menu, Sun, Moon, Download } from 'lucide-react';
import { ConsistencyStats } from '../types';
import { format } from 'date-fns';

interface HeaderProps {
  consistency?: ConsistencyStats;
  parkedCount?: number;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenLogger: (initialCategory?: 'DSA' | 'PROJECT' | 'INTERVIEW') => void;
  onOpenParkingLot: () => void;
  onOpenDailyReview: () => void;
  onOpenExport?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  consistency,
  parkedCount = 0,
  isDarkMode = false,
  onToggleTheme,
  onOpenLogger,
  onOpenParkingLot,
  onOpenDailyReview,
  onOpenExport,
  onToggleMobileMenu,
}) => {
  const todayFormatted = format(new Date(), 'EEEE, d MMMM yyyy');
  const shortDate = format(new Date(), 'dd MMM');

  return (
    <header className="h-16 border-b border-slate-200 dark:border-dark-800 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Hamburger + Date / Status */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-850 md:hidden border border-slate-200 dark:border-dark-800"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="hidden sm:inline">{todayFormatted}</span>
          <span className="sm:hidden text-slate-900 dark:text-white font-bold">{shortDate}</span>
        </div>

        {consistency && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-slate-300 dark:text-dark-700 font-bold">|</span>
            {consistency.todayStatus === 'TARGET_MET' ? (
              <span className="badge badge-emerald">
                🏆 Target Met ({consistency.todayActualHours}h)
              </span>
            ) : consistency.todayStatus === 'STUDIED_PACE' ? (
              <span className="badge badge-indigo">
                🟢 Studied ({consistency.todayActualHours}h / {consistency.todayTargetHours}h)
              </span>
            ) : (
              <span className="badge badge-slate">
                ⚪ Target: {consistency.todayTargetHours}h
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Download CSV / Export Data Button */}
        {onOpenExport && (
          <button
            onClick={onOpenExport}
            title="Download CSV / Database Backup"
            className="btn-secondary py-1.5 px-2.5 sm:px-3 text-xs flex items-center gap-1.5 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-300"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
        )}

        {/* Theme Toggle (Light / Dark Mode) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Clean Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg border border-slate-200 dark:border-dark-800 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors flex items-center gap-1.5"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-[11px] font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="hidden xl:inline text-[11px] font-mono">Dark</span>
              </>
            )}
          </button>
        )}

        {/* Park Distraction Button */}
        <button
          onClick={onOpenParkingLot}
          title="Park a distraction (Ctrl+P)"
          className="btn-secondary py-1.5 px-2.5 sm:px-3.5 text-xs"
        >
          <span>🅿️</span>
          <span className="hidden sm:inline">Parking Lot</span>
          {parkedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold font-mono">
              {parkedCount}
            </span>
          )}
        </button>

        {/* 2-Min Daily Check-in */}
        <button
          onClick={onOpenDailyReview}
          className="btn-secondary hidden sm:inline-flex py-1.5 px-3 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">2-Min Reflection</span>
        </button>

        {/* Fast Log Session Button */}
        <button
          onClick={() => onOpenLogger()}
          title="Fast work session log (Ctrl+L)"
          className="btn-primary py-1.5 px-3 sm:px-4 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Log Work</span>
        </button>
      </div>
    </header>
  );
};
