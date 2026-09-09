import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, TrendingUp, Calendar, Info, Clock } from 'lucide-react';
import { HeatmapDay, ConsistencyStats } from '../types';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';

interface ConsistencyChartProps {
  consistency?: ConsistencyStats;
  onSelectDay?: (date: string) => void;
}

export const ConsistencyChart: React.FC<ConsistencyChartProps> = ({
  consistency,
  onSelectDay,
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatmap();
  }, []);

  const loadHeatmap = async () => {
    try {
      setLoading(true);
      const data = await api.getHeatmapData();
      setHeatmapData(data);
      // default select today
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todayItem = data.find((d) => d.date === todayStr) || data[data.length - 1];
      setSelectedDay(todayItem || null);
    } catch (err) {
      console.error('Error loading heatmap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-emerald-500 hover:bg-emerald-400'; // Target Met (4h+)
      case 2:
        return 'bg-brand-500 hover:bg-brand-400'; // 2h - 3h59m
      case 1:
        return 'bg-blue-500/80 hover:bg-blue-400'; // 30m - 1h59m (Consistent Win!)
      default:
        return 'bg-dark-800 hover:bg-dark-700'; // 0 min
    }
  };

  const weeklyDays = consistency?.weeklySummary.days || [];

  return (
    <div className="panel p-5 space-y-6">
      {/* Header & Metric Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-dark-800">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <span>Consistency & Execution Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Target: 4h weekdays / 6h weekends. <span className="text-emerald-400 font-semibold font-mono">≥ 30 min</span> counts as an active streak-preserving win.
          </p>
        </div>

        {/* Consistency Pill Counters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-850 border border-dark-800">
            <Flame className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-slate-300">Streak:</span>
            <span className="font-bold text-amber-400">{consistency?.currentStreak ?? 0} Days</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-850 border border-dark-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">This Month:</span>
            <span className="font-bold text-white">{consistency?.daysCompletedThisMonth ?? 0} Days</span>
          </div>
        </div>
      </div>

      {/* 1. 7-Day Visual Execution Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider font-mono text-[11px]">This Week's Daily Hours</span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-0.5 bg-slate-500 inline-block border-t border-dashed border-slate-300"></span> 30m Min Pace Line
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-0.5 bg-brand-400 inline-block"></span> 4.0h Full Target
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 pb-2 bg-dark-950/40 p-4 rounded-xl border border-dark-800/60">
          {weeklyDays.map((day) => {
            const heightPercent = Math.min(100, Math.round((day.actualHours / 6.0) * 100));
            const isToday = day.date === format(new Date(), 'yyyy-MM-dd');
            return (
              <div key={day.date} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => onSelectDay && onSelectDay(day.date)}>
                {/* Bar area */}
                <div className="w-full max-w-[40px] h-32 bg-dark-850 rounded-lg p-1 flex flex-col justify-end relative border border-dark-800 group-hover:border-dark-700 transition-colors">
                  {/* 30m guideline (0.5h / 6h = ~8%) */}
                  <div className="absolute bottom-[8%] left-0 right-0 border-b border-dashed border-slate-600/80 pointer-events-none z-10" title="30m Min Consistency Line" />
                  {/* 4h guideline (4h / 6h = ~66%) */}
                  <div className="absolute bottom-[66%] left-0 right-0 border-b border-brand-500/30 pointer-events-none z-10" title="4h Full Target Line" />

                  {/* Filled bar */}
                  <div
                    className={`w-full rounded-md transition-all duration-300 ${
                      day.status === 'TARGET_MET'
                        ? 'bg-emerald-500'
                        : day.status === 'STUDIED_PACE'
                        ? 'bg-brand-500'
                        : 'bg-slate-700/40'
                    }`}
                    style={{ height: `${Math.max(day.actualHours > 0 ? 8 : 0, heightPercent)}%` }}
                  />
                </div>

                {/* Day label and hours */}
                <div className="text-center font-mono">
                  <span className={`text-[11px] block font-semibold ${isToday ? 'text-brand-400 font-bold' : 'text-slate-400'}`}>
                    {day.dayName}
                  </span>
                  <span className={`text-[10px] block font-bold mt-0.5 ${day.actualHours >= 4 ? 'text-emerald-400' : day.actualHours >= 0.5 ? 'text-slate-200' : 'text-slate-500'}`}>
                    {day.actualHours}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. GitHub-Style 365-Day Consistency Heatmap */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
              Yearly Consistency Heatmap (365 Days)
            </span>
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-dark-800" title="0 min" />
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80" title="30m - 1h59m" />
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" title="2h - 3h59m" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" title="4h+ Goal Met" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1 p-2 bg-dark-950/60 rounded-xl border border-dark-800/80 min-w-[720px]">
            {heatmapData.map((d) => {
              const isSelected = selectedDay?.date === d.date;
              return (
                <button
                  key={d.date}
                  onClick={() => {
                    setSelectedDay(d);
                    if (onSelectDay) onSelectDay(d.date);
                  }}
                  title={`${d.date}: ${d.hours}h logged (Target: ${d.targetHours}h)`}
                  className={`w-3 h-3 rounded-[2px] transition-all ${getCellColor(d.level)} ${
                    isSelected ? 'ring-2 ring-white scale-125 z-10' : ''
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Selected Day Quick Inspector */}
        {selectedDay && (
          <div className="p-3 rounded-lg bg-dark-850 border border-dark-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-white font-bold">{selectedDay.date}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">
                Logged: <strong className="text-white">{selectedDay.hours}h</strong> / {selectedDay.targetHours}h ({selectedDay.percentage}%)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-cyan-400">DSA: {selectedDay.dsaMinutes}m</span>
              <span className="text-purple-400">Project: {selectedDay.projectMinutes}m</span>
              <span className="text-emerald-400">Interview: {selectedDay.interviewMinutes}m</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
