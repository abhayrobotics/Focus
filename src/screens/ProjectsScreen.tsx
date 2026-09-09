import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Upload,
  Play,
  Sparkles,
  RotateCcw,
  Download,
  CheckCircle2,
  Circle,
  Layers,
  Database,
  Lock,
  Workflow,
  BarChart3,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Project, ProjectFeature } from '../types';
import { api } from '../services/api';
import { FeatureDetailModal } from '../components/FeatureDetailModal';
import { ImportModal } from '../components/ImportModal';

interface ProjectsScreenProps {
  onOpenLogger: (category?: 'PROJECT', taskTitle?: string) => void;
}

interface PhaseConfig {
  id: string;
  phaseNumber: number;
  title: string;
  stepRange: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  milestoneNote: string;
}

const PHASES: PhaseConfig[] = [
  {
    id: 'PHASE_1',
    phaseNumber: 1,
    title: 'Phase 1 — Product & UI Foundation',
    stepRange: 'Steps 1 – 5',
    icon: Layers,
    accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    milestoneNote: 'The grievance data model and simple status workflow come directly from your original concept.',
  },
  {
    id: 'PHASE_2',
    phaseNumber: 2,
    title: 'Phase 2 — Backend & Database',
    stepRange: 'Steps 6 – 10',
    icon: Database,
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    milestoneNote: 'Your proposed architecture specifically recommends a modular monolith using React/TypeScript → Express → Prisma → PostgreSQL, rather than microservices.',
  },
  {
    id: 'PHASE_3',
    phaseNumber: 3,
    title: 'Phase 3 — Authentication',
    stepRange: 'Steps 11 – 14',
    icon: Lock,
    accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    milestoneNote: 'Milestone: You can log in → reach dashboard → refresh page → remain authenticated.',
  },
  {
    id: 'PHASE_4',
    phaseNumber: 4,
    title: 'Phase 4 — Grievance Core',
    stepRange: 'Steps 15 – 20',
    icon: Workflow,
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    milestoneNote: 'This is the heart of the product: create, view, assign, forward and update grievances.',
  },
  {
    id: 'PHASE_5',
    phaseNumber: 5,
    title: 'Phase 5 — Accountability & Dashboard',
    stepRange: 'Steps 21 – 25',
    icon: BarChart3,
    accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    milestoneNote: 'Accountability & Dashboard: Final production deployment of the complete 25-step UtilityOps MVP.',
  },
];

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onOpenLogger }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<ProjectFeature | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
      setProjects(res);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const flagship = projects.find((p) => p.isFlagship) || projects[0];

  const handleToggleFeature = async (feature: ProjectFeature, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleted = feature.status === 'COMPLETE';
    const newStatus = isCompleted ? 'PLANNED' : 'COMPLETE';
    const newProgress = isCompleted ? 0 : 100;

    // Optimistic UI Update
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== feature.projectId) return proj;
        const updatedMvp = proj.mvpFeatures.map((f) =>
          f.id === feature.id ? { ...f, status: newStatus as any, progress: newProgress } : f
        );
        const completedCount = updatedMvp.filter((f) => f.status === 'COMPLETE').length;
        const totalCount = updatedMvp.length;
        const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        return {
          ...proj,
          mvpFeatures: updatedMvp,
          completedCount,
          progressPercent,
        };
      })
    );

    try {
      await api.updateProjectFeature(feature.id, {
        status: newStatus as any,
        progress: newProgress,
      });
    } catch (err) {
      console.error('Error toggling step status:', err);
      loadProjects();
    }
  };

  const handleSyncGridOpsTracker = async () => {
    try {
      setIsSyncing(true);
      await api.seedGridOpsMvp();
      await loadProjects();
    } catch (err) {
      console.error('Error syncing UtilityOps 25-step tracker:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading || !flagship) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading UtilityOps 25-Step MVP Completion Tracker...
      </div>
    );
  }

  const allMvpFeatures = flagship.mvpFeatures || [];
  const futureFeatures = flagship.futureFeatures || [];

  const filteredMvp = selectedCategory === 'ALL'
    ? allMvpFeatures
    : allMvpFeatures.filter((f) => f.category === selectedCategory);

  const nextIncompleteStep = allMvpFeatures.find((f) => f.status !== 'COMPLETE');
  const currentNextAction = nextIncompleteStep?.nextAction || flagship.currentNextAction || 'All 25 MVP steps completed!';
  const currentNextFeatureName = nextIncompleteStep?.name || flagship.currentNextFeatureName || 'UtilityOps MVP 100% Deployed';

  const completedStepsCount = allMvpFeatures.filter((f) => f.status === 'COMPLETE').length;
  const totalMvpStepsCount = allMvpFeatures.length || 25;
  const completionPercentage = totalMvpStepsCount > 0
    ? Math.round((completedStepsCount / totalMvpStepsCount) * 100)
    : 0;

  return (
    <div className="p-3 sm:p-5 md:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6 w-full">
      {/* 1. Project Hero Overview */}
      <div className="panel p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-indigo text-[10px] font-bold">UtilityOps FLAGSHIP MVP</span>
              <span className="badge badge-emerald text-[10px] font-mono font-bold">+4% GROWTH PER STEP</span>
              <span className="text-[11px] font-mono text-slate-400">25-Step Architecture Engine</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight break-words">
              UtilityOps — 25-Step MVP Completion Tracker
            </h1>

            {/* Fully responsive project description & architecture flow */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl space-y-2 break-words">
              <p className="break-words">
                {flagship.description ||
                  'Modular Monolith architecture for real-time grievance tracking, supervisor escalations, and automated SLA accountability.'}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono pt-0.5">
                <span className="text-slate-400 font-semibold shrink-0">Stack:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
                  React + TypeScript
                </span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                  Node.js Express
                </span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                  Prisma ORM
                </span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30">
                  SQLite / PostgreSQL
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons toolbar (responsive wrapping) */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full lg:w-auto">
            {flagship.githubUrl && (
              <a
                href={flagship.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            <button
              onClick={async () => {
                if (window.confirm('Reset all 25 MVP steps to 0% progress (PLANNED)?')) {
                  await api.resetProjectProgress();
                  loadProjects();
                }
              }}
              title="Reset all project features to 0% progress"
              className="btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset (0%)</span>
            </button>
            <button
              onClick={handleSyncGridOpsTracker}
              disabled={isSyncing}
              title="Sync / Seed 25 UtilityOps Steps"
              className="btn-secondary text-xs hover:text-brand-300 hover:border-brand-500/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync 25 Steps'}</span>
            </button>
            <a
              href="/api/export/projects"
              download
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-emerald-300 hover:border-emerald-500/40"
              title="Download all project features as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Master Progress Metric Bar */}
        <div className="space-y-2 pt-2 border-t border-dark-800">
          <div className="flex justify-between items-center text-xs font-mono flex-wrap gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-200 font-bold uppercase">
                MVP Step Completion: {completedStepsCount} / {totalMvpStepsCount} Steps Done
              </span>
              <span className="text-slate-400 font-medium">
                ({completedStepsCount * 4}% Total Project Growth)
              </span>
            </div>
            <span className="text-emerald-400 font-bold text-sm sm:text-base">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-dark-950 rounded-full h-3 p-0.5 border border-dark-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 overflow-x-auto gap-2">
            <span>Phase 1 (UI)</span>
            <span>Phase 2 (Backend)</span>
            <span>Phase 3 (Auth)</span>
            <span>Phase 4 (Grievance)</span>
            <span>Phase 5 (Deploy 100%)</span>
          </div>
        </div>

        {/* 2. Prominent "Next Immediate Step" Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-brand-950/40 border border-brand-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 shrink-0" /> WHAT TO BUILD NEXT IN CODE:
            </span>
            <h3 className="text-sm font-bold text-white break-words">
              {currentNextFeatureName}
            </h3>
            <span className="text-xs text-slate-300 font-mono block break-words">
              🎯 Next Action: {currentNextAction}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {nextIncompleteStep && (
              <button
                onClick={(e) => handleToggleFeature(nextIncompleteStep, e)}
                className="btn-secondary py-2 px-3 text-xs font-semibold text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Step Done (+4%)</span>
              </button>
            )}
            <button
              onClick={() => onOpenLogger('PROJECT', `Project: ${currentNextFeatureName}`)}
              className="btn-primary py-2 px-4 text-xs font-bold shadow-md shadow-brand-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Log Sprint Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-dark-900 border border-dark-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
          }`}
        >
          All 25 Steps ({allMvpFeatures.length})
        </button>
        {PHASES.map((p) => {
          const phaseFeatures = allMvpFeatures.filter((f) => f.category === p.id);
          const phaseDone = phaseFeatures.filter((f) => f.status === 'COMPLETE').length;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedCategory(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                selectedCategory === p.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
              }`}
            >
              <span>{p.title.split('—')[0].trim()}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-dark-950/60 font-mono text-slate-300">
                {phaseDone}/{phaseFeatures.length || 0}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setSelectedCategory('FUTURE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap ${
            selectedCategory === 'FUTURE'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
          }`}
        >
          Post-MVP ({futureFeatures.length})
        </button>
      </div>

      {/* 4. Phase-Grouped 25-Step MVP Checklist */}
      {selectedCategory !== 'FUTURE' && (
        <div className="space-y-6">
          {PHASES.map((phase) => {
            if (selectedCategory !== 'ALL' && selectedCategory !== phase.id) {
              return null;
            }

            const phaseFeatures = allMvpFeatures.filter((f) => f.category === phase.id);
            if (phaseFeatures.length === 0 && selectedCategory !== 'ALL') {
              return null;
            }

            const phaseDoneCount = phaseFeatures.filter((f) => f.status === 'COMPLETE').length;
            const isPhaseComplete = phaseFeatures.length > 0 && phaseDoneCount === phaseFeatures.length;
            const Icon = phase.icon;

            return (
              <div key={phase.id} className="panel p-4 sm:p-5 space-y-4 border border-dark-800/90">
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-dark-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg ${phase.accentColor} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-white tracking-tight break-words">
                        {phase.title}
                      </h2>
                      <span className="text-xs text-slate-400 font-mono block">
                        {phase.stepRange} • {phaseDoneCount} / {phaseFeatures.length} Steps Completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span
                      className={`badge text-xs font-mono font-bold ${
                        isPhaseComplete
                          ? 'badge-emerald'
                          : phaseDoneCount > 0
                          ? 'badge-amber'
                          : 'badge-slate'
                      }`}
                    >
                      {isPhaseComplete
                        ? 'PHASE COMPLETE'
                        : `${Math.round((phaseDoneCount / (phaseFeatures.length || 1)) * 100)}% DONE`}
                    </span>
                  </div>
                </div>

                {/* Milestone Context Note (Fully responsive & wrapping) */}
                <div className="p-3 sm:p-3.5 rounded-lg bg-dark-950/70 border border-dark-800/60 text-xs font-mono text-slate-300 leading-relaxed break-words">
                  <span className="text-brand-400 font-bold mr-1.5 inline-block">
                    📌 Architectural Milestone:
                  </span>
                  <span className="text-slate-300 break-words">{phase.milestoneNote}</span>
                </div>

                {/* Step Items List */}
                <div className="space-y-2.5">
                  {phaseFeatures.map((step) => {
                    const isDone = step.status === 'COMPLETE';
                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          setSelectedFeature(step);
                          setIsDetailOpen(true);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                          isDone
                            ? 'bg-dark-900/40 border-dark-800/60 hover:border-emerald-500/40'
                            : 'bg-dark-900/90 border-dark-750 hover:border-brand-500/60 hover:bg-dark-850'
                        }`}
                      >
                        {/* Checkbox & Task Details */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={(e) => handleToggleFeature(step, e)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition-colors p-0.5 rounded focus:outline-none"
                            title={isDone ? 'Mark as Planned' : 'Mark as Complete (+4% growth)'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 hover:text-brand-400" />
                            )}
                          </button>

                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`text-xs sm:text-sm font-bold leading-snug transition-colors break-words ${
                                  isDone
                                    ? 'text-slate-400 line-through'
                                    : 'text-white group-hover:text-brand-400'
                                }`}
                              >
                                {step.name}
                              </h3>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-dark-950 text-emerald-400 font-semibold border border-emerald-500/20 shrink-0">
                                +4% Growth
                              </span>
                            </div>

                            {/* Responsive step description (no harsh line-clamp truncation) */}
                            {step.description && (
                              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed break-words">
                                {step.description}
                              </p>
                            )}

                            {step.nextAction && !isDone && (
                              <div className="text-[11px] font-mono text-brand-300 flex flex-wrap items-baseline gap-1 mt-1 break-words">
                                <span className="font-bold text-slate-400 shrink-0">Action:</span>
                                <span className="break-words">{step.nextAction}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions & Status Pill */}
                        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-800/60">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLogger('PROJECT', `Project: ${step.name}`);
                            }}
                            className="btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1"
                            title="Log work session on this step"
                          >
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Log Time</span>
                          </button>

                          <span
                            className={`badge text-[10px] font-mono ${
                              isDone
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isDone ? 'DONE' : 'PLANNED'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Future Ideas Isolation Section (Protected from Scope Creep) */}
      {(selectedCategory === 'ALL' || selectedCategory === 'FUTURE') && (
        <div className="panel p-4 sm:p-5 space-y-3 bg-dark-950/60 border border-dark-800/80">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Future Phase Ideas (Post-MVP) — {futureFeatures.length} Ideas
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Protected from scope creep during active MVP sprint
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {futureFeatures.map((ff) => (
              <div key={ff.id} className="p-3 rounded-lg bg-dark-900 border border-dark-800/80 text-xs space-y-1">
                <span className="font-semibold text-slate-300 block break-words">{ff.name}</span>
                <p className="text-[11px] text-slate-400 break-words leading-relaxed">{ff.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdated={loadProjects}
        onLogSession={(task) => onOpenLogger('PROJECT', task)}
      />

      {/* Import Modal */}
      <ImportModal
        type="PROJECT"
        projectId={flagship.id}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={loadProjects}
      />
    </div>
  );
};
