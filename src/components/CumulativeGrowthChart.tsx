import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';
import { CumulativeGrowthData, CumulativeGrowthDay } from '../types';
import { api } from '../services/api';

interface CumulativeGrowthChartProps {
  onRefreshParent?: () => void;
  refreshTrigger?: number;
}

export const CumulativeGrowthChart: React.FC<CumulativeGrowthChartProps> = ({
  onRefreshParent,
  refreshTrigger = 0,
}) => {
  const [data, setData] = useState<CumulativeGrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<CumulativeGrowthDay | null>(null);
  const [selectedDay, setSelectedDay] = useState<CumulativeGrowthDay | null>(null);

  // Simulation Mode State
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedDays, setSimulatedDays] = useState<CumulativeGrowthDay[]>([]);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCumulativeGrowth();
      setData(res);
      const todayItem =
        res.days.find((d) => d.isToday) ||
        res.days.find((d) => d.isPastOrToday) ||
        res.days[0];
      setSelectedDay(todayItem || null);

      initializeSimulationDays(res);
    } catch (err) {
      console.error('Error loading cumulative growth data:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeSimulationDays = (baseData: CumulativeGrowthData) => {
    let runningDsa = 0;
    let runningProj = 0;

    const sim = baseData.days.map((d, index) => {
      const dayNum = index + 1;
      let dsaSolved = 0;
      let isMissed = false;
      let dsaPenalty = 0;
      let dsaDelta = 0;
      let featuresDeployed = 0;
      let projectDelta = 0;

      if (dayNum === 1) {
        dsaSolved = 2;
        dsaDelta = 2;
        runningDsa += 2;
      } else if (dayNum === 2) {
        isMissed = true;
        dsaPenalty = -2;
        dsaDelta = -2;
        runningDsa = Math.max(0, runningDsa - 2);
      } else if (dayNum === 3) {
        dsaSolved = 3;
        dsaDelta = 3;
        runningDsa += 3;
      } else if (dayNum === 4) {
        dsaSolved = 2;
        dsaDelta = 2;
        runningDsa += 2;
        featuresDeployed = 1;
        projectDelta = 4;
        runningProj += 4;
      } else if (dayNum <= 9) {
        dsaSolved = 3;
        dsaDelta = 3;
        runningDsa += 3;
      }

      return {
        ...d,
        isPastOrToday: dayNum <= 9,
        isToday: dayNum === 9,
        dsaSolved,
        isMissed,
        dsaPenalty,
        dsaDelta,
        dsaCumulative: dayNum <= 9 ? runningDsa : null,
        featuresDeployed,
        projectDelta,
        projectCumulative: dayNum <= 9 ? runningProj : null,
      };
    });

    setSimulatedDays(sim);
  };

  const activeDays = isSimulationMode ? simulatedDays : data?.days || [];

  const totalDays = data?.totalDays || 30;
  const currentDsa =
    activeDays.filter((d) => d.dsaCumulative !== null).slice(-1)[0]?.dsaCumulative ?? 0;
  const currentProject =
    activeDays.filter((d) => d.projectCumulative !== null).slice(-1)[0]?.projectCumulative ?? 0;
  const totalMissedCount = activeDays.filter((d) => d.isMissed).length;

  const handleModifySimDay = (
    dayNum: number,
    action: 'ADD_DSA' | 'TOGGLE_MISSED' | 'ADD_PROJECT' | 'RESET'
  ) => {
    let runningDsa = 0;
    let runningProj = 0;

    const updated = simulatedDays.map((d) => {
      let dsaSolved = d.dsaSolved;
      let isMissed = d.isMissed;
      let featuresDeployed = d.featuresDeployed;
      let isPastOrToday = d.isPastOrToday;

      if (d.day === dayNum) {
        isPastOrToday = true;
        if (action === 'ADD_DSA') {
          isMissed = false;
          dsaSolved = (dsaSolved + 1) % 6;
        } else if (action === 'TOGGLE_MISSED') {
          isMissed = !isMissed;
          if (isMissed) dsaSolved = 0;
        } else if (action === 'ADD_PROJECT') {
          featuresDeployed = (featuresDeployed + 1) % 4;
        } else if (action === 'RESET') {
          dsaSolved = 0;
          isMissed = false;
          featuresDeployed = 0;
        }
      }

      let dsaPenalty = 0;
      let dsaDelta = 0;
      let projectDelta = 0;

      if (isPastOrToday) {
        if (dsaSolved > 0) {
          dsaDelta = dsaSolved;
          isMissed = false;
        } else if (isMissed) {
          dsaPenalty = -2;
          dsaDelta = -2;
        }

        runningDsa = Math.max(0, runningDsa + dsaDelta);
        projectDelta = featuresDeployed * 4;
        runningProj = Math.min(100, runningProj + projectDelta);
      }

      return {
        ...d,
        isPastOrToday,
        dsaSolved,
        isMissed,
        dsaPenalty,
        dsaDelta,
        dsaCumulative: isPastOrToday ? runningDsa : null,
        featuresDeployed,
        projectDelta,
        projectCumulative: isPastOrToday ? runningProj : null,
      };
    });

    setSimulatedDays(updated);
    const updatedSelected = updated.find((d) => d.day === (selectedDay?.day || dayNum));
    if (updatedSelected) setSelectedDay(updatedSelected);
  };

  const handleApplyPreset = (preset: 'USER_PROMPT' | 'AGGRESSIVE' | 'CLEAN_SLATE') => {
    if (!data) return;

    if (preset === 'CLEAN_SLATE') {
      const clean = data.days.map((d) => ({
        ...d,
        isPastOrToday: d.day === 1,
        dsaSolved: 0,
        isMissed: false,
        dsaPenalty: 0,
        dsaDelta: 0,
        dsaCumulative: d.day === 1 ? 0 : null,
        featuresDeployed: 0,
        projectDelta: 0,
        projectCumulative: d.day === 1 ? 0 : null,
      }));
      setSimulatedDays(clean);
      setSelectedDay(clean[0]);
    } else if (preset === 'USER_PROMPT') {
      initializeSimulationDays(data);
    } else if (preset === 'AGGRESSIVE') {
      let rDsa = 0;
      let rProj = 0;
      const agg = data.days.map((d, i) => {
        const dayNum = i + 1;
        const dsaSolved = 4;
        const featuresDeployed = dayNum % 3 === 0 ? 1 : 0;
        rDsa += dsaSolved;
        rProj = Math.min(100, rProj + featuresDeployed * 4);
        return {
          ...d,
          isPastOrToday: dayNum <= 15,
          dsaSolved,
          isMissed: false,
          dsaPenalty: 0,
          dsaDelta: dsaSolved,
          dsaCumulative: dayNum <= 15 ? rDsa : null,
          featuresDeployed,
          projectDelta: featuresDeployed * 4,
          projectCumulative: dayNum <= 15 ? rProj : null,
        };
      });
      setSimulatedDays(agg);
      setSelectedDay(agg[8]);
    }
  };

  // SVG Chart Geometry Constants
  const svgWidth = 860;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 24;
  const paddingBottom = 32;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxDsa = 80;
  const maxProject = 100;

  const getX = (dayIndex: number) => {
    return paddingLeft + ((dayIndex - 1) / (totalDays - 1)) * chartWidth;
  };

  const getY_DSA = (value: number) => {
    const clamped = Math.max(0, Math.min(maxDsa, value));
    return paddingTop + chartHeight - (clamped / maxDsa) * chartHeight;
  };

  const getY_Project = (value: number) => {
    const clamped = Math.max(0, Math.min(maxProject, value));
    return paddingTop + chartHeight - (clamped / maxProject) * chartHeight;
  };

  const dsaPoints = activeDays
    .filter((d) => d.dsaCumulative !== null)
    .map((d) => ({ x: getX(d.day), y: getY_DSA(d.dsaCumulative!), day: d }));

  const projectPoints = activeDays
    .filter((d) => d.projectCumulative !== null)
    .map((d) => ({ x: getX(d.day), y: getY_Project(d.projectCumulative!), day: d }));

  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const dsaPathStr = buildSmoothPath(dsaPoints);
  const projectPathStr = buildSmoothPath(projectPoints);

  const dsaAreaStr =
    dsaPoints.length > 0
      ? `${dsaPathStr} L ${dsaPoints[dsaPoints.length - 1].x} ${paddingTop + chartHeight} L ${dsaPoints[0].x} ${
          paddingTop + chartHeight
        } Z`
      : '';

  const projectAreaStr =
    projectPoints.length > 0
      ? `${projectPathStr} L ${projectPoints[projectPoints.length - 1].x} ${paddingTop + chartHeight} L ${
          projectPoints[0].x
        } ${paddingTop + chartHeight} Z`
      : '';

  if (loading && !data) {
    return (
      <div className="panel p-6 text-center text-xs font-mono text-slate-500">
        Loading cumulative velocity charts...
      </div>
    );
  }

  const activeFocusDay = hoveredDay || selectedDay || activeDays[0];

  return (
    <div className="panel p-5 sm:p-6 space-y-5 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-950 border border-dark-800">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-dark-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo flex items-center gap-1 text-[10px]">
              <TrendingUp className="w-3 h-3 text-brand-400" />
              MONTHLY VELOCITY ENGINE
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              {data?.monthName || 'September 2026'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Cumulative Growth Trajectory
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Targeting <strong className="text-indigo-400">80 DSA Problems</strong> & <strong className="text-emerald-400">100% Project Completion</strong>. Missed days record a <strong className="text-rose-400">-2 penalty (🔴)</strong> with next-day recovery.
          </p>
        </div>

        {/* Live vs Sandbox Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-center font-mono text-xs p-1 rounded-xl bg-dark-950 border border-dark-800">
          <button
            onClick={() => setIsSimulationMode(false)}
            className={`px-3 py-1 rounded-lg transition-all ${
              !isSimulationMode
                ? 'btn-primary font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Tracker
          </button>
          <button
            onClick={() => setIsSimulationMode(true)}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              isSimulationMode
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Sandbox</span>
          </button>
        </div>
      </div>

      {/* Simulator Quick Presets Toolbar */}
      {isSimulationMode && (
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-1.5 text-purple-300 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>
              <strong>Sandbox Mode:</strong> Click any day node on the chart or preset to preview growth scenarios.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleApplyPreset('USER_PROMPT')}
              className="py-1 px-2.5 rounded-lg bg-dark-900 border border-purple-500/40 text-purple-200 hover:bg-purple-900/40 transition-colors text-[11px]"
            >
              ★ Scenario Demo (+2, 🔴 -2, +3, +4%)
            </button>
            <button
              onClick={() => handleApplyPreset('AGGRESSIVE')}
              className="py-1 px-2.5 rounded-lg bg-dark-900 border border-dark-700 text-slate-300 hover:bg-dark-800 transition-colors text-[11px]"
            >
              ⚡ Fast Track (4/day)
            </button>
            <button
              onClick={() => handleApplyPreset('CLEAN_SLATE')}
              className="py-1 px-2 rounded-lg bg-dark-900 border border-dark-700 text-slate-400 hover:text-white transition-colors text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* DSA Cumulative */}
        <div className="p-3.5 rounded-xl bg-dark-950/80 border border-indigo-500/25 font-mono relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">DSA Cumulative</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-indigo-400">{currentDsa}</span>
            <span className="text-[11px] text-slate-500 font-semibold">/ 80 Goal</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1 mt-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((currentDsa / 80) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-indigo-300/80 mt-1 block">
            {Math.round((currentDsa / 80) * 100)}% of target
          </span>
        </div>

        {/* Project Deployed */}
        <div className="p-3.5 rounded-xl bg-dark-950/80 border border-emerald-500/25 font-mono relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Project Deployed</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-emerald-400">{currentProject}%</span>
            <span className="text-[11px] text-slate-500 font-semibold">/ 100% Target</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, currentProject)}%` }}
            />
          </div>
          <span className="text-[10px] text-emerald-300/80 mt-1 block">
            {Math.round(currentProject / 4)} / 25 steps complete
          </span>
        </div>

        {/* Missed Days Penalties */}
        <div className="p-3.5 rounded-xl bg-dark-950/80 border border-rose-500/25 font-mono relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Missed Penalties (🔴)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-rose-400">{totalMissedCount}</span>
            <span className="text-[11px] text-slate-500 font-semibold">Days Lost</span>
          </div>
          <span className="text-[10px] text-rose-300/90 font-semibold block mt-2">
            -{totalMissedCount * 2} points total penalty
          </span>
        </div>

        {/* Required Velocity Pace */}
        <div className="p-3.5 rounded-xl bg-dark-950/80 border border-dark-800 font-mono relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Required Pace</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-white">
              {Math.max(
                0,
                parseFloat(
                  ((80 - currentDsa) / Math.max(1, 30 - (activeFocusDay?.day || 9))).toFixed(1)
                )
              )}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">Qs / day</span>
          </div>
          <span className="text-[10px] text-brand-400 font-semibold block mt-2">
            {currentDsa >= ((activeFocusDay?.day || 9) * 80) / 30 ? '🚀 Ahead of Target' : '⚡ Catch-up pace'}
          </span>
        </div>
      </div>

      {/* 3. Professional Line Chart Visualization */}
      <div className="space-y-2.5">
        {/* Compact Chart Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono px-1">
          <div className="flex flex-wrap items-center gap-3.5">
            {/* DSA Curve */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded bg-indigo-500 inline-block" />
              <span className="text-indigo-300 font-semibold">DSA Cumulative (0 → 80)</span>
            </div>

            {/* Project Curve */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded bg-emerald-500 inline-block" />
              <span className="text-emerald-300 font-semibold">Project Deployed (0 → 100%)</span>
            </div>

            {/* Missed Day Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              <span className="text-rose-400">Missed Day (-2 🔴)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 border-t border-dashed border-indigo-400/50 inline-block" />
              <span>DSA Target Pace</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 border-t border-dashed border-emerald-400/50 inline-block" />
              <span>Project Target Pace</span>
            </span>
          </div>
        </div>

        {/* SVG Canvas with Floating Crosshair Tooltip */}
        <div className="relative rounded-2xl bg-white dark:bg-dark-950/95 border border-slate-200 dark:border-dark-800/90 p-2 sm:p-3 overflow-hidden shadow-inner chart-canvas-box">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* DSA Area Gradient */}
              <linearGradient id="dsaGradientRefined" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>

              {/* Project Area Gradient */}
              <linearGradient id="projGradientRefined" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Grid Lines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + chartHeight * (1 - ratio);
              const dsaVal = Math.round(ratio * maxDsa);
              const projVal = Math.round(ratio * maxProject);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={paddingLeft + chartWidth}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-dark-800"
                    strokeDasharray="2 3"
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />
                  {/* Left Y-Axis: DSA */}
                  <text
                    x={paddingLeft - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-indigo-600 dark:fill-indigo-400/70 font-semibold"
                  >
                    {dsaVal}
                  </text>
                  {/* Right Y-Axis: Project */}
                  <text
                    x={paddingLeft + chartWidth + 6}
                    y={y + 3.5}
                    textAnchor="start"
                    className="text-[9px] font-mono fill-emerald-600 dark:fill-emerald-400/70 font-semibold"
                  >
                    {projVal}%
                  </text>
                </g>
              );
            })}

            {/* Linear Reference Vector: DSA 80 Pace */}
            <line
              x1={getX(1)}
              y1={getY_DSA((80 / totalDays) * 1)}
              x2={getX(totalDays)}
              y2={getY_DSA(80)}
              stroke="currentColor"
              className="text-indigo-400/70 dark:text-indigo-400/40"
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {/* Linear Reference Vector: Project 100% Pace */}
            <line
              x1={getX(1)}
              y1={getY_Project((100 / totalDays) * 1)}
              x2={getX(totalDays)}
              y2={getY_Project(100)}
              stroke="currentColor"
              className="text-emerald-500/70 dark:text-emerald-400/35"
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {/* Shaded Area Fills */}
            {projectAreaStr && <path d={projectAreaStr} fill="url(#projGradientRefined)" />}
            {dsaAreaStr && <path d={dsaAreaStr} fill="url(#dsaGradientRefined)" />}

            {/* Line 1: Project Cumulative (Emerald) */}
            {projectPathStr && (
              <path
                d={projectPathStr}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Line 2: DSA Cumulative (Indigo) */}
            {dsaPathStr && (
              <path
                d={dsaPathStr}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Refined Project Data Points (Smaller Pointers) */}
            {projectPoints.map(({ x, y, day }) => {
              const isSelected = activeFocusDay?.day === day.day;
              const hasDeployed = day.featuresDeployed > 0;

              return (
                <g key={`proj-${day.day}`}>
                  {hasDeployed ? (
                    // Small Discrete Deployed Milestone Diamond
                    <g
                      transform={`translate(${x}, ${y}) rotate(45)`}
                      className="cursor-pointer"
                      onClick={() => setSelectedDay(day)}
                    >
                      <rect
                        x="-3"
                        y="-3"
                        width="6"
                        height="6"
                        fill="#10b981"
                        stroke="#064e3b"
                        strokeWidth="1"
                      />
                    </g>
                  ) : (
                    // Small clean node (r=1.75)
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 3.5 : 1.75}
                      fill="#10b981"
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedDay(day)}
                    />
                  )}
                </g>
              );
            })}

            {/* Refined DSA Data Points & Red Dots (Smaller Pointers) */}
            {dsaPoints.map(({ x, y, day }) => {
              const isSelected = activeFocusDay?.day === day.day;
              const isMissed = day.isMissed;

              return (
                <g key={`dsa-${day.day}`}>
                  {isMissed ? (
                    // Refined discrete Red Dot for Missed Day (r=2.5)
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 4 : 2.5}
                      fill="#ef4444"
                      stroke="#450a0a"
                      strokeWidth="1"
                      className="cursor-pointer"
                      onClick={() => setSelectedDay(day)}
                    />
                  ) : (
                    // Clean small regular point (r=1.75)
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 3.5 : 1.75}
                      fill="#6366f1"
                      stroke="#1e1b4b"
                      strokeWidth="1"
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedDay(day)}
                    />
                  )}
                </g>
              );
            })}

            {/* X-Axis Day Labels (Sep 1, 5, 10, 15, 20, 25, 30) & Invisible Hover Strips */}
            {activeDays.map((d) => {
              const showLabel = d.day === 1 || d.day % 5 === 0 || d.day === totalDays;
              const x = getX(d.day);
              const isSelected = activeFocusDay?.day === d.day;
              return (
                <g key={`x-tick-${d.day}`}>
                  {showLabel && (
                    <text
                      x={x}
                      y={paddingTop + chartHeight + 16}
                      textAnchor="middle"
                      className={`text-[9px] font-mono ${
                        isSelected
                          ? 'fill-slate-900 dark:fill-white font-bold'
                          : 'fill-slate-500'
                      }`}
                    >
                      Sep {d.day}
                    </text>
                  )}

                  {/* Vertical Hover Tracking Slice */}
                  <rect
                    x={x - chartWidth / (totalDays * 2)}
                    y={paddingTop}
                    width={chartWidth / totalDays}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer hover:fill-slate-400/15 dark:hover:fill-slate-700/10"
                    onMouseEnter={() => setHoveredDay(d)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setSelectedDay(d)}
                  />
                </g>
              );
            })}

            {/* Active Vertical Crosshair Hairline */}
            {activeFocusDay && (
              <line
                x1={getX(activeFocusDay.day)}
                y1={paddingTop}
                x2={getX(activeFocusDay.day)}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeDasharray="2 2"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            )}
          </svg>
        </div>
      </div>

      {/* 4. Refined Floating Day Inspector Card */}
      {activeFocusDay && (
        <div className="p-3.5 rounded-xl bg-dark-950/90 border border-dark-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-dark-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-white font-bold">
                Day {activeFocusDay.day}: {activeFocusDay.date} ({activeFocusDay.dayName})
              </span>
              {activeFocusDay.isToday && (
                <span className="badge badge-brand text-[9px] font-bold">TODAY</span>
              )}
              {activeFocusDay.isMissed && (
                <span className="badge badge-rose text-[9px] font-bold">🔴 MISSED DAY (-2)</span>
              )}
            </div>

            {/* Metric snapshot for this day */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-indigo-400">
                DSA: <strong>{activeFocusDay.dsaCumulative ?? '—'}</strong> / 80
                {activeFocusDay.dsaSolved > 0 && ` (+${activeFocusDay.dsaSolved})`}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">
                Project: <strong>{activeFocusDay.projectCumulative ?? '—'}%</strong>
                {activeFocusDay.featuresDeployed > 0 && ` (+${activeFocusDay.projectDelta}%)`}
              </span>
            </div>
          </div>

          {/* Sandbox Controls for this day (if in sandbox mode) */}
          {isSimulationMode && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <span className="text-slate-400">Edit Day {activeFocusDay.day} parameters:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleModifySimDay(activeFocusDay.day, 'ADD_DSA')}
                  className="py-1 px-2 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60"
                >
                  + DSA ({activeFocusDay.dsaSolved})
                </button>
                <button
                  onClick={() => handleModifySimDay(activeFocusDay.day, 'TOGGLE_MISSED')}
                  className={`py-1 px-2 rounded border ${
                    activeFocusDay.isMissed
                      ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold'
                      : 'bg-dark-900 border-dark-750 text-slate-400 hover:text-rose-300'
                  }`}
                >
                  {activeFocusDay.isMissed ? '🔴 Missed (-2)' : 'Toggle Missed'}
                </button>
                <button
                  onClick={() => handleModifySimDay(activeFocusDay.day, 'ADD_PROJECT')}
                  className="py-1 px-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60"
                >
                  + Project Step ({activeFocusDay.featuresDeployed})
                </button>
                <button
                  onClick={() => handleModifySimDay(activeFocusDay.day, 'RESET')}
                  className="py-1 px-2 rounded bg-dark-900 border border-dark-800 text-slate-500 hover:text-white"
                >
                  Reset Day
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
