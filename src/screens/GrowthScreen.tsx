import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Trash2, Edit2, Sparkle, Clock, Code2, FolderGit2, Target, CheckCircle2, Download } from 'lucide-react';
import { ConsistencyStats, DailyReview, WorkSession } from '../types';
import { api } from '../services/api';
import { DEFAULT_WORK_SESSIONS } from '../data/defaultData';
import { ConsistencyChart } from '../components/ConsistencyChart';
import { CumulativeGrowthChart } from '../components/CumulativeGrowthChart';
import { DailyReviewModal } from '../components/DailyReviewModal';

interface GrowthScreenProps {
  consistency?: ConsistencyStats;
  onRefresh: () => void;
  onEditSession?: (session: WorkSession) => void;
  onOpenLogger?: () => void;
  refreshTrigger?: number;
}

export const GrowthScreen: React.FC<GrowthScreenProps> = ({
  consistency,
  onRefresh,
  onEditSession,
  onOpenLogger,
  refreshTrigger = 0,
}) => {
  const [reviewsHistory, setReviewsHistory] = useState<DailyReview[]>([]);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>(() => DEFAULT_WORK_SESSIONS);
  const [sessionCategoryFilter, setSessionCategoryFilter] = useState<'ALL' | 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER'>('ALL');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dedupStatus, setDedupStatus] = useState<string | null>(null);
  const [isDeduplicating, setIsDeduplicating] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [refreshTrigger]);

  const loadAllData = async () => {
    try {
      const [histRes, sessions] = await Promise.allSettled([
        fetch('/api/growth/history').then((r) => r.ok ? r.json() : []),
        api.getWorkSessions(),
      ]);
      if (histRes.status === 'fulfilled' && Array.isArray(histRes.value)) {
        setReviewsHistory(histRes.value);
      }
      if (sessions.status === 'fulfilled' && Array.isArray(sessions.value) && sessions.value.length > 0) {
        setWorkSessions(sessions.value);
      }
    } catch (err) {
      console.warn('Error loading growth screen data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeduplicate = async () => {
    try {
      setIsDeduplicating(true);
      setDedupStatus(null);
      const res = await api.deduplicateWorkSessions();
      setDedupStatus(res.message);
      await loadAllData();
      onRefresh();
      setTimeout(() => setDedupStatus(null), 4000);
    } catch (err: any) {
      console.error('Error deduplicating:', err);
      setDedupStatus('Failed to deduplicate sessions');
    } finally {
      setIsDeduplicating(false);
    }
  };

  const handleDeleteSession = async (session: WorkSession) => {
    if (!window.confirm(`Delete log: "${session.taskTitle}" (${session.durationMinutes}m)?`)) return;

    try {
      await api.deleteWorkSession(session.id);
      await loadAllData();
      onRefresh();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const filteredSessions = workSessions.filter((s) => {
    if (sessionCategoryFilter === 'ALL') return true;
    return s.category === sessionCategoryFilter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'DSA':
        return <span className="badge badge-indigo flex items-center gap-1"><Code2 className="w-3 h-3" /> DSA</span>;
      case 'PROJECT':
        return <span className="badge badge-emerald flex items-center gap-1"><FolderGit2 className="w-3 h-3" /> Project</span>;
      case 'INTERVIEW':
        return <span className="badge badge-amber flex items-center gap-1"><Target className="w-3 h-3" /> Interview</span>;
      default:
        return <span className="badge badge-slate flex items-center gap-1"><Sparkles className="w-3 h-3" /> Other</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Header Overview Bar */}
      <div className="panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-emerald">DAILY DISCIPLINE & GROWTH</span>
              <span className="text-xs font-mono text-slate-400">Reflect, Refine & Sustain</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Daily Growth & Reflection Center</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenLogger && (
              <button
                onClick={onOpenLogger}
                className="btn-secondary text-xs py-2 px-3"
              >
                <span>+ Log Work</span>
              </button>
            )}
            <button
              onClick={() => setIsReviewOpen(true)}
              className="btn-primary text-xs py-2 px-4 shadow-md shadow-brand-600/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2-Min Daily Check-in</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-dark-800">
          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 font-mono">
            <span className="text-[11px] text-slate-400 block">Current Streak</span>
            <span className="text-lg font-bold text-amber-400">
              🔥 {consistency?.currentStreak ?? 0} Days
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 font-mono">
            <span className="text-[11px] text-slate-400 block">Longest Streak</span>
            <span className="text-lg font-bold text-white">
              🏆 {consistency?.longestStreak ?? 0} Days
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 font-mono">
            <span className="text-[11px] text-slate-400 block">Days Completed (Month)</span>
            <span className="text-lg font-bold text-emerald-400">
              {consistency?.daysCompletedThisMonth ?? 0} Days
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 font-mono">
            <span className="text-[11px] text-slate-400 block">Total Work Logged</span>
            <span className="text-lg font-bold text-brand-400">
              {consistency?.totalHoursLoggedAllTime ?? 0}h
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cumulative Growth Trajectory Line Chart (DSA 80 Target, Project 100% Target, Missed Day Penalties) */}
      <CumulativeGrowthChart onRefreshParent={onRefresh} refreshTrigger={refreshTrigger} />

      {/* 3. Consistency Chart & Heatmap */}
      <ConsistencyChart consistency={consistency} />

      {/* 3. Logged Work Sessions & Audit History (Edit / Delete / Deduplicate) */}
      <div className="panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dark-800">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Logged Work Sessions ({workSessions.length})</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Edit wrong durations, fix categories, or clean up accidental duplicate clicks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export CSV Button */}
            <a
              href="/api/export/sessions"
              download
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:text-emerald-300 hover:border-emerald-500/40"
              title="Download all logged work sessions as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Sessions CSV</span>
            </a>

            {/* Deduplicate Button */}
            <button
              onClick={handleDeduplicate}
              disabled={isDeduplicating}
              title="Detect and remove identical session logs on the same day"
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-brand-500"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{isDeduplicating ? 'Scanning...' : 'Clean Duplicate Logs'}</span>
            </button>
          </div>
        </div>

        {dedupStatus && (
          <div className="p-3 rounded-lg bg-brand-600/10 border border-brand-500/30 text-xs font-mono text-brand-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{dedupStatus}</span>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {(['ALL', 'DSA', 'PROJECT', 'INTERVIEW', 'OTHER'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSessionCategoryFilter(cat)}
              className={`py-1 px-2.5 rounded-lg border text-[11px] transition-colors ${sessionCategoryFilter === cat
                  ? 'bg-dark-800 text-white border-dark-700 font-bold'
                  : 'text-slate-400 border-transparent hover:bg-dark-850 hover:text-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            No work sessions found in this category. Click "+ Log Work" to log your first session!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 sm:p-3.5 rounded-xl bg-dark-850 border border-dark-800 hover:border-dark-700/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryBadge(session.category)}
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {session.date}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white bg-dark-950 px-2 py-0.5 rounded border border-dark-800">
                      {session.durationMinutes} min ({parseFloat((session.durationMinutes / 60).toFixed(1))}h)
                    </span>
                  </div>

                  <h3 className="text-white font-semibold tracking-tight text-xs truncate">
                    {session.taskTitle}
                  </h3>

                  {session.notes && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-1">
                      "{session.notes}"
                    </p>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center font-mono">
                  {onEditSession && (
                    <button
                      onClick={() => onEditSession(session)}
                      title="Edit / Change this log"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 border border-dark-800 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-400" />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSession(session)}
                    title="Delete this log"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-dark-800 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Reflection History Log */}
      <div className="panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Recent Daily Check-in Reflections
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Last 30 days history</span>
        </div>

        {reviewsHistory.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            No daily reflections logged yet. Complete today's 2-minute check-in above!
          </div>
        ) : (
          <div className="space-y-3">
            {reviewsHistory.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-dark-850 border border-dark-800/80 space-y-2 font-mono text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-white font-bold">{rev.date}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">
                      Logged: <strong className="text-emerald-400">{rev.actualHours}h</strong> / {rev.targetHours}h
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-amber-400">Energy: {rev.energy}/5</span>
                    <span className="text-brand-400">Focus: {rev.focus}/5</span>
                    {rev.spentTooMuchTimeDeciding && (
                      <span className="text-rose-400">⚠️ Deciding Loop</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                  {rev.oneThingLearned && (
                    <div>
                      <span className="text-emerald-400 font-bold block">💡 Learned / Invariant:</span>
                      <p className="text-slate-300 mt-0.5">{rev.oneThingLearned}</p>
                    </div>
                  )}

                  {rev.oneMistake && (
                    <div>
                      <span className="text-rose-400 font-bold block">🚨 Mistake / Trap:</span>
                      <p className="text-slate-300 mt-0.5">{rev.oneMistake}</p>
                    </div>
                  )}
                </div>

                {rev.tomorrowPriority && (
                  <div className="p-2 rounded bg-dark-950 border border-dark-800 text-[11px]">
                    <span className="text-brand-400 font-bold">Tomorrow Priority: </span>
                    <span className="text-white">{rev.tomorrowPriority}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Review Modal */}
      <DailyReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={() => {
          loadAllData();
          onRefresh();
        }}
      />
    </div>
  );
};
