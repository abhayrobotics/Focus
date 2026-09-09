import React from 'react';
import {
  LayoutDashboard,
  Code2,
  FolderGit2,
  Target,
  Sparkles,
  Map,
  Flame,
  X,
} from 'lucide-react';
import { NavTab, ConsistencyStats } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  consistency?: ConsistencyStats;
  parkedCount?: number;
  onOpenParkingLot: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  consistency,
  parkedCount = 0,
  onOpenParkingLot,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'DSA', label: 'DSA Tracker', icon: <Code2 className="w-4 h-4" />, badge: '80 Q' },
    { id: 'PROJECTS', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'INTERVIEW', label: 'Interview Prep', icon: <Target className="w-4 h-4" /> },
    { id: 'GROWTH', label: 'Daily Growth', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ROADMAP', label: 'Roadmap', icon: <Map className="w-4 h-4" />, badge: 'Phase 1' },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 flex flex-col justify-between shrink-0 h-screen transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        {/* Brand & Logo Header */}
        <div>
          <div className="p-5 border-b border-dark-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-sm text-surface shadow-sm shadow-brand-500/20">
                ⚡
              </div>
              <div>
                <span className="font-bold tracking-tight text-sm text-white block">Focus</span>
                <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">Execution & Velocity</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {consistency && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold"
                  title="Current Consistency Streak"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{consistency.currentStreak}d</span>
                </div>
              )}

              {/* Close Mobile Button */}
              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-dark-800"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                      ? 'bg-brand-600 text-surface font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/70'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-dark-950 text-white font-bold' : 'bg-dark-800 text-slate-400 border border-dark-700'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info & Parking Lot Shortcut */}
        <div className="p-4 border-t border-dark-800 space-y-3 bg-dark-950/40">
          <button
            onClick={() => {
              onOpenParkingLot();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-800 text-slate-300 hover:text-white transition-all text-xs group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🅿️</span>
              <span className="font-semibold">Parking Lot</span>
            </div>
            <span className="badge badge-indigo text-[10px]">
              {parkedCount} parked
            </span>
          </button>

          {consistency && (
            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 text-[11px] font-mono space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Today Logged:</span>
                <span className="font-bold text-white">
                  {consistency.todayActualHours}h / {consistency.todayTargetHours}h
                </span>
              </div>
              <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${consistency.todayStatus === 'TARGET_MET'
                      ? 'bg-emerald-500'
                      : consistency.todayStatus === 'STUDIED_PACE'
                        ? 'bg-brand-500'
                        : 'bg-slate-600'
                    }`}
                  style={{ width: `${consistency.todayProgressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
