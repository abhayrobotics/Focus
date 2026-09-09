import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Clock,
  Code2,
  FolderGit2,
  Zap,
} from 'lucide-react';
import { DashboardData } from '../types';
import { api } from '../services/api';
import { ConsistencyChart } from '../components/ConsistencyChart';
import { RedAlertBanner } from '../components/RedAlertBanner';

interface DashboardScreenProps {
  onOpenLogger: (category?: 'DSA' | 'PROJECT' | 'INTERVIEW', taskTitle?: string) => void;
  onNavigate: (tab: any) => void;
  onOpenDailyReview: () => void;
  refreshTrigger: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenLogger,
  onNavigate,
  onOpenDailyReview,
  refreshTrigger,
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardSummary();
      setData(res);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading personal command center...
      </div>
    );
  }

  const { consistency, recommendations, projectSnapshot, dsaSnapshot } = data;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Red Alert Banner (Triggered if 2 consecutive days have 0 minutes logged) */}
      {consistency.hasRedAlert && (
        <RedAlertBanner
          message={consistency.redAlertMessage}
          onStartMicroSession={() => onOpenLogger('DSA', '15m Micro-Start: Sliding Window Invariant Drill')}
        />
      )}

      {/* 2. Today's Master Progress Hero Bar */}
      <div className="panel p-6 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-dark-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold block">
              TODAY'S EXECUTION TARGET
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {consistency.todayActualHours}h
                <span className="text-slate-400 text-lg sm:text-xl font-normal"> / {consistency.todayTargetHours}h</span>
              </h1>
              <span className={`text-xs font-mono font-bold ${
                consistency.todayProgressPercent >= 100 ? 'text-emerald-400' : 'text-brand-400'
              }`}>
                ({consistency.todayProgressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-mono text-xs">
              <span className="text-slate-400 block">Remaining:</span>
              <span className="font-bold text-slate-200">
                {consistency.todayRemainingMinutes > 0
                  ? `${Math.floor(consistency.todayRemainingMinutes / 60)}h ${consistency.todayRemainingMinutes % 60}m`
                  : '0m (Target Complete!)'}
              </span>
            </div>

            <button
              onClick={() => onOpenLogger()}
              className="btn-primary py-2.5 px-4 text-xs font-bold shadow-md shadow-brand-600/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Log Work Session</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-dark-950 rounded-full h-3 p-0.5 border border-dark-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                consistency.todayStatus === 'TARGET_MET'
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  : consistency.todayStatus === 'STUDIED_PACE'
                  ? 'bg-brand-500 shadow-sm shadow-brand-500/50'
                  : 'bg-slate-700'
              }`}
              style={{ width: `${consistency.todayProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>0h (Start)</span>
            <span className="text-blue-400">30m (Streak Win Target)</span>
            <span className="text-white font-bold">{consistency.todayTargetHours}h (Full Target)</span>
          </div>
        </div>
      </div>

      {/* 3. Smart "What Should I Do Now?" Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              What Should I Study Now? (Next Best Actions)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Automated highest-leverage priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((action, idx) => (
            <div
              key={action.id}
              className="panel-card flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-brand-500/60"
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  Top Priority
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      action.category === 'DSA'
                        ? 'badge-indigo'
                        : action.category === 'PROJECT'
                        ? 'badge-emerald'
                        : 'badge-amber'
                    } text-[10px]`}
                  >
                    {action.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{action.durationMinutes} min</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                    {action.subtitle}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  {action.reason}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenLogger(action.category, action.subtitle)}
                  className="btn-primary w-full text-xs py-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start & Log ({action.durationMinutes}m)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Consistency Analytics & Execution vs Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consistency Chart & Heatmap (2 Columns) */}
        <div className="lg:col-span-2">
          <ConsistencyChart
            consistency={consistency}
            onSelectDay={(date) => {}}
          />
        </div>

        {/* Execution vs Planning & Snapshots (1 Column) */}
        <div className="space-y-4">
          {/* Execution vs Planning Card */}
          <div className="panel p-5 space-y-3 bg-dark-900 border border-dark-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Execution vs. Planning
              </span>
              <span className="badge badge-indigo text-[10px] font-mono font-bold">
                {consistency.executionVsPlanning.executionRatio}% Execution
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded-lg bg-dark-850 border border-dark-800">
                <span className="text-slate-400">⚡ Actual Work Sessions:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {consistency.executionVsPlanning.workSessionsCount}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-dark-850 border border-dark-800">
                <span className="text-slate-400">📝 Roadmap/Planning Changes:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {consistency.executionVsPlanning.planningChangesCount}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              {consistency.executionVsPlanning.executionRatio >= 75
                ? '🟢 Strong execution bias. You are coding more than tweaking roadmaps.'
                : '🟡 High planning ratio detected. Stop reorganizing; write code!'}
            </p>
          </div>

          {/* DSA & Flagship Project Quick Status */}
          <div className="panel p-5 space-y-4 bg-dark-900 border border-dark-800">
            {/* DSA Pill */}
            <div
              onClick={() => onNavigate('DSA')}
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> DSA PROGRESS (80 Q)
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  {dsaSnapshot.solved} / {dsaSnapshot.total} ({dsaSnapshot.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${dsaSnapshot.progressPercent}%` }} />
              </div>
            </div>

            {/* Project Pill */}
            <div
              onClick={() => onNavigate('PROJECTS')}
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5" /> {projectSnapshot.name}
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  {projectSnapshot.completedFeatures}/{projectSnapshot.totalFeatures} ({projectSnapshot.progress}%)
                </span>
              </div>
              <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${projectSnapshot.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
