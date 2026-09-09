import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { ConsistencyStats, DailyReview } from '../types';
import { api } from '../services/api';
import { ConsistencyChart } from '../components/ConsistencyChart';
import { DailyReviewModal } from '../components/DailyReviewModal';

interface GrowthScreenProps {
  consistency?: ConsistencyStats;
  onRefresh: () => void;
}

export const GrowthScreen: React.FC<GrowthScreenProps> = ({ consistency, onRefresh }) => {
  const [reviewsHistory, setReviewsHistory] = useState<DailyReview[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getHeatmapData(); // triggers update
      const hist = await fetch('/api/growth/history').then((r) => r.json());
      setReviewsHistory(hist);
    } catch (err) {
      console.error('Error loading growth history:', err);
    } finally {
      setLoading(false);
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

          <button
            onClick={() => setIsReviewOpen(true)}
            className="btn-primary text-xs py-2 px-4 shadow-md shadow-brand-600/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Complete 2-Min Daily Check-in</span>
          </button>
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

      {/* 2. Consistency Chart & Heatmap */}
      <ConsistencyChart consistency={consistency} />

      {/* 3. Reflection History Log */}
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
          loadHistory();
          onRefresh();
        }}
      />
    </div>
  );
};
