import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Upload,
  Play,
} from 'lucide-react';
import { Project, ProjectFeature } from '../types';
import { api } from '../services/api';
import { FeatureDetailModal } from '../components/FeatureDetailModal';
import { ImportModal } from '../components/ImportModal';

interface ProjectsScreenProps {
  onOpenLogger: (category?: 'PROJECT', taskTitle?: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onOpenLogger }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<ProjectFeature | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'DEVELOPMENT':
        return 'bg-brand-500/10 text-brand-400 border border-brand-500/30';
      case 'TESTING':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
      case 'PLANNED':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-dark-800 text-slate-400 border border-dark-700';
    }
  };

  if (loading || !flagship) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading project feature trees...
      </div>
    );
  }

  const allMvpFeatures = flagship.mvpFeatures || [];
  const filteredMvp = selectedCategory === 'ALL'
    ? allMvpFeatures
    : allMvpFeatures.filter((f) => f.category === selectedCategory);

  const futureFeatures = flagship.futureFeatures || [];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Project Hero Overview */}
      <div className="panel p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-indigo">FLAGSHIP SYSTEM</span>
              <span className="text-xs font-mono text-slate-400">Enterprise Lifecycle Architecture</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{flagship.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {flagship.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {flagship.githubUrl && (
              <a
                href={flagship.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}
            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Features</span>
            </button>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="space-y-2 pt-2 border-t border-dark-800">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">
              MVP Feature Completion ({flagship.completedCount} / {flagship.totalMvpCount} Completed)
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {flagship.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-dark-950 rounded-full h-2.5 p-0.5 border border-dark-800 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${flagship.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Prominent "Next Action" Banner */}
        <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" /> WHAT TO WORK ON NEXT IN CODE:
            </span>
            <h3 className="text-sm font-bold text-white">
              {flagship.currentNextAction}
            </h3>
            <span className="text-xs text-slate-400 font-mono block">
              Target Module: {flagship.currentNextFeatureName}
            </span>
          </div>

          <button
            onClick={() => onOpenLogger('PROJECT', `Project: ${flagship.currentNextAction}`)}
            className="btn-primary py-2 px-4 text-xs font-bold shrink-0 shadow-md shadow-brand-600/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start & Log Feature Sprint</span>
          </button>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-dark-900 border border-dark-800">
        {[
          { id: 'ALL', label: 'All MVP Modules' },
          { id: 'CORE', label: 'Core Workflow' },
          { id: 'GIS', label: 'GIS Survey & Map' },
          { id: 'REPORTS', label: 'Audio & Translation Reports' },
          { id: 'METER', label: 'Meter & Replacement' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. MVP Feature Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          Active MVP Features ({filteredMvp.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMvp.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFeature(f);
                setIsDetailOpen(true);
              }}
              className="panel-card cursor-pointer space-y-3 group hover:border-brand-500/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge badge-slate text-[10px]">{f.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`badge ${f.priority === 'HIGH' ? 'badge-rose' : 'badge-amber'} text-[10px]`}>
                      {f.priority}
                    </span>
                    <span className={`badge ${getStatusBadge(f.status)} text-[10px]`}>
                      {f.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                    {f.name}
                  </h3>
                  {f.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {f.description}
                    </p>
                  )}
                </div>

                {f.nextAction && (
                  <div className="p-2.5 rounded-lg bg-dark-950 border border-dark-800/80 text-xs font-mono text-slate-300">
                    <span className="text-brand-400 font-bold block text-[10px] uppercase">Next Step:</span>
                    <span className="text-white">{f.nextAction}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar & Actions */}
              <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between gap-3">
                <div className="flex-1 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Progress:</span>
                    <span className="text-white font-bold">{f.progress}%</span>
                  </div>
                  <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-500 h-full" style={{ width: `${f.progress}%` }} />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogger('PROJECT', `Project: ${f.name} - ${f.nextAction || 'Development'}`);
                  }}
                  className="btn-secondary py-1 px-2.5 text-[11px] shrink-0"
                >
                  Log Time
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Future Ideas Isolation Section (Protected from Scope Creep) */}
      <div className="panel p-5 space-y-3 bg-dark-950/60 border border-dark-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Future Phase Ideas (Post-MVP) — {futureFeatures.length} Ideas
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Isolated to prevent scope creep during active sprint
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {futureFeatures.map((ff) => (
            <div key={ff.id} className="p-3 rounded-lg bg-dark-900 border border-dark-800/80 text-xs space-y-1">
              <span className="font-semibold text-slate-300 block">{ff.name}</span>
              <p className="text-[11px] text-slate-500">{ff.description}</p>
            </div>
          ))}
        </div>
      </div>

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
