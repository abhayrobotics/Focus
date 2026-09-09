import React, { useState, useEffect } from 'react';
import { Star, AlertCircle, Clock, BookOpen, Layers } from 'lucide-react';
import { InterviewTopic } from '../types';
import { api } from '../services/api';
import { TopicDetailModal } from '../components/TopicDetailModal';

interface InterviewScreenProps {
  onOpenLogger: (category?: 'INTERVIEW', taskTitle?: string) => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ onOpenLogger }) => {
  const [data, setData] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviewTopics();
  }, []);

  const loadInterviewTopics = async () => {
    try {
      setLoading(true);
      const res = await api.getInterviewTopics();
      setData(res);
    } catch (err) {
      console.error('Error loading interview topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INTERVIEW_READY':
        return 'badge-emerald';
      case 'PRACTICED':
        return 'badge-indigo';
      case 'LEARNING':
        return 'badge-amber';
      default:
        return 'badge-slate';
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading interview readiness tracker...
      </div>
    );
  }

  const { overview, categoryBreakdown, weakTopics, phase2Topics } = data;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Header Overview Bar */}
      <div className="panel p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-indigo">PRODUCT COMPANY TARGET (ZOHO / SDE-1)</span>
              <span className="text-xs font-mono text-slate-400">Phase 1: Full Stack Core</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Interview Preparation Hub</span>
              <span className="text-amber-400 text-lg font-mono">
                (Avg Score: {overview.avgConfidence} / 5.0)
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenLogger('INTERVIEW', 'Interview active recall revision')}
              className="btn-primary text-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Interview Prep</span>
            </button>
          </div>
        </div>

        {/* Weakness Alert Bar */}
        {weakTopics.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Priority Weak Topics ({weakTopics.length} Topics with Score ≤ 3/5)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">High yield for product company screens</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {weakTopics.map((wt: InterviewTopic) => (
                <button
                  key={wt.id}
                  onClick={() => {
                    setSelectedTopic(wt);
                    setIsDetailOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-dark-850 border border-amber-500/30 text-xs text-slate-200 flex items-center gap-2 transition-all font-mono"
                >
                  <span>{wt.name.split('(')[0]}</span>
                  <span className="text-amber-400 font-bold">({wt.confidence}/5)</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Category Topic Grid (Frontend, Backend, Coding) */}
      <div className="space-y-6">
        {categoryBreakdown.map((catGroup: any) => (
          <div key={catGroup.category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>{catGroup.category} TOPICS ({catGroup.ready}/{catGroup.total} Ready — {catGroup.percent}%)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catGroup.topics.map((t: InterviewTopic) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTopic(t);
                    setIsDetailOpen(true);
                  }}
                  className="panel-card cursor-pointer space-y-3 group hover:border-brand-500/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`badge ${t.priority === 'CRITICAL' ? 'badge-rose' : 'badge-slate'} text-[10px]`}>
                          {t.priority}
                        </span>
                        <span className={`badge ${getStatusBadge(t.status)} text-[10px]`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* 1-5 Star Indicator */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              t.confidence >= s ? 'text-amber-400 fill-current' : 'text-dark-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">
                        {t.name}
                      </h3>
                      {t.notes && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {t.notes}
                        </p>
                      )}
                    </div>

                    {t.practicalTips && (
                      <div className="p-2 rounded-lg bg-dark-950 border border-dark-800/80 text-[11px] font-mono text-emerald-400 truncate">
                        Tip: {t.practicalTips}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      Score: <strong className="text-white">{t.confidence}/5</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLogger('INTERVIEW', `Interview Prep: ${t.name}`);
                      }}
                      className="btn-secondary py-1 px-2.5 text-[11px]"
                    >
                      Log Time
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Phase 2 Topics (CS Fundamentals - Next Month) */}
      <div className="panel p-5 space-y-3 bg-dark-950/60 border border-dark-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Phase 2: Computer Science Fundamentals (Next Month)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Do not let this distract from Phase 1 Full Stack focus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {phase2Topics.map((pt: InterviewTopic) => (
            <div key={pt.id} className="p-3 rounded-lg bg-dark-900 border border-dark-800/80 text-xs space-y-1">
              <span className="font-semibold text-slate-300 block">{pt.name}</span>
              <p className="text-[11px] text-slate-500">{pt.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Detail Modal */}
      <TopicDetailModal
        topic={selectedTopic}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdated={loadInterviewTopics}
        onLogSession={(task) => onOpenLogger('INTERVIEW', task)}
      />
    </div>
  );
};
