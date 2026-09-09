import React, { useState, useEffect } from 'react';
import { Lock, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface RoadmapScreenProps {
  onOpenParkingLot: () => void;
  onOpenLogger?: () => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  onOpenParkingLot,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.getRoadmap();
      setData(res);
    } catch (err) {
      console.error('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading roadmap guardrails...
      </div>
    );
  }

  const { phase1, phase2 } = data;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Header & Roadmap Lock Status */}
      <div className="panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-emerald flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>ROADMAP LOCKED</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Anti-Planning Guardrails Active</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              2026 Career Transition Roadmap
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Execution &gt; Planning. Roadmaps are strictly locked during the active sprint. Use the <strong className="text-white">Parking Lot</strong> to capture new ideas or distractions without derailing Phase 1.
            </p>
          </div>

          <button
            onClick={onOpenParkingLot}
            className="btn-secondary text-xs"
          >
            <span>🅿️ Open Parking Lot</span>
          </button>
        </div>

        {/* Phase 1 Live Completion Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-dark-800 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800 space-y-1.5">
            <span className="text-slate-400 block font-bold">1. DSA 80 Questions</span>
            <div className="flex items-baseline justify-between">
              <span className="text-white font-bold text-sm">
                {phase1.metrics.dsa.solved} / {phase1.metrics.dsa.total}
              </span>
              <span className="text-cyan-400 font-bold">{phase1.metrics.dsa.percent}%</span>
            </div>
            <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-500 h-full" style={{ width: `${phase1.metrics.dsa.percent}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800 space-y-1.5">
            <span className="text-slate-400 block font-bold">2. Grievance System MVP</span>
            <div className="flex items-baseline justify-between">
              <span className="text-white font-bold text-sm">
                {phase1.metrics.project.complete} / {phase1.metrics.project.total}
              </span>
              <span className="text-purple-400 font-bold">{phase1.metrics.project.percent}%</span>
            </div>
            <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${phase1.metrics.project.percent}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800 space-y-1.5">
            <span className="text-slate-400 block font-bold">3. Full Stack Readiness</span>
            <div className="flex items-baseline justify-between">
              <span className="text-white font-bold text-sm">
                {phase1.metrics.interview.ready} / {phase1.metrics.interview.total}
              </span>
              <span className="text-emerald-400 font-bold">{phase1.metrics.interview.percent}%</span>
            </div>
            <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${phase1.metrics.interview.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Phase 1 (Active Month) Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PHASE 1: CURRENT MONTH (ACTIVE SPRINT FOCUS)</span>
          </h2>
          <span className="badge badge-emerald text-[10px]">IN PROGRESS</span>
        </div>

        <div className="space-y-3">
          {phase1.items.map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-indigo text-[10px]">{item.category}</span>
                  <span className="badge badge-slate text-[10px]">{item.priority}</span>
                  <h3 className="font-bold text-white text-xs font-sans">{item.name}</h3>
                </div>
                {item.notes && (
                  <p className="text-[11px] text-slate-400 font-sans">{item.notes}</p>
                )}
              </div>

              <span className="badge badge-emerald shrink-0 text-[10px]">
                Active Focus
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Phase 2 (Next Month) Items */}
      <div className="panel p-5 space-y-4 bg-dark-950/60 border border-dark-800/80">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>PHASE 2: NEXT MONTH (UPCOMING MILESTONES)</span>
          </h2>
          <span className="badge badge-slate text-[10px]">QUEUED</span>
        </div>

        <div className="space-y-2.5">
          {phase2.items.map((item: any) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg bg-dark-900 border border-dark-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">{item.name}</span>
                <span className="badge badge-slate text-[10px]">{item.category}</span>
              </div>
              {item.notes && <p className="text-[11px] text-slate-500 font-sans">{item.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
