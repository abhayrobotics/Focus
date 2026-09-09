import React, { useState, useEffect } from 'react';
import {
  Star,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Server,
  Terminal,
  Cpu,
} from 'lucide-react';
import { InterviewTopic } from '../types';
import { api } from '../services/api';
import { TopicDetailModal } from '../components/TopicDetailModal';
import { ImportModal } from '../components/ImportModal';

interface InterviewScreenProps {
  onOpenLogger: (category?: 'INTERVIEW', taskTitle?: string) => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ onOpenLogger }) => {
  const [data, setData] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // New Topic Form State
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<'FRONTEND' | 'BACKEND' | 'CODING' | 'CS_FUNDAMENTALS'>('FRONTEND');
  const [newTopicPriority, setNewTopicPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newTopicConfidence, setNewTopicConfidence] = useState<number>(3);
  const [newTopicPhase, setNewTopicPhase] = useState<'PHASE_1' | 'PHASE_2'>('PHASE_1');
  const [newTopicTips, setNewTopicTips] = useState('');
  const [newTopicQuestions, setNewTopicQuestions] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    try {
      setIsCreating(true);
      await api.addInterviewTopic({
        name: newTopicName.trim(),
        category: newTopicCategory,
        priority: newTopicPriority,
        confidence: newTopicConfidence,
        phase: newTopicPhase,
        practicalTips: newTopicTips.trim(),
        keyQuestions: newTopicQuestions.trim(),
        notes: newTopicNotes.trim(),
        status: 'LEARNING',
      });

      // Reset form
      setNewTopicName('');
      setNewTopicTips('');
      setNewTopicQuestions('');
      setNewTopicNotes('');
      setIsAddOpen(false);

      await loadInterviewTopics();
    } catch (err) {
      console.error('Error creating topic:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTopic = async (topic: InterviewTopic, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete practice topic "${topic.name}"?`)) {
      try {
        await api.deleteInterviewTopic(topic.id);
        await loadInterviewTopics();
      } catch (err) {
        console.error('Error deleting topic:', err);
      }
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FRONTEND':
        return Code2;
      case 'BACKEND':
        return Server;
      case 'CODING':
        return Terminal;
      case 'CS_FUNDAMENTALS':
        return Cpu;
      default:
        return Layers;
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading interview readiness tracker...
      </div>
    );
  }

  const { overview, categoryBreakdown, weakTopics, phase2Topics, allTopics = [] } = data;

  const filteredCategories = selectedCategoryTab === 'ALL'
    ? categoryBreakdown
    : categoryBreakdown.filter((c: any) => c.category === selectedCategoryTab);

  return (

    <div className="p-3 sm:p-5 md:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6 w-full">
      {/* 1. Header Overview Bar */}
      <div className="panel p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge badge-indigo text-[10px] font-bold">PRODUCT COMPANY TARGET (ZOHO / SDE-1)</span>
              <span className="badge badge-emerald text-[10px] font-mono font-bold">
                {overview.totalPhase1} Core Topics
              </span>
              <span className="text-[11px] font-mono text-slate-400">Phase 1: Full Stack Core</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2 flex-wrap break-words">
              <span>Interview Preparation Hub</span>
              <span className="text-amber-400 text-base sm:text-lg md:text-xl font-mono">
                ({overview.avgConfidence} / 5.0 Avg Score)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed break-words">
              Active recall revision on core system design, framework internals, async runtimes, and algorithmic invariants.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setIsAddOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-white"
              title="Add a new interview practice topic"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>Add Topic</span>
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-brand-300 hover:border-brand-500/40"
              title="Import practice topics from Excel / CSV file"
            >
              <Upload className="w-3.5 h-3.5 text-brand-400" />
              <span>Import Excel / CSV</span>
            </button>
            <a
              href="/api/export/interview"
              download
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-emerald-300 hover:border-emerald-500/40"
              title="Download all interview practice topics as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={() => onOpenLogger('INTERVIEW', 'Interview active recall revision')}
              className="btn-primary text-xs py-2 px-3 shadow-md shadow-brand-600/20"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>

        {/* Priority Weakness Alert Banner */}
        {weakTopics.length > 0 && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Weak Topics ({weakTopics.length} Topics with Score ≤ 3/5)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">High yield for technical rounds</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {weakTopics.map((wt: InterviewTopic) => (
                <button
                  key={wt.id}
                  onClick={() => {
                    setSelectedTopic(wt);
                    setIsDetailOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-dark-850 border border-amber-500/30 text-xs text-slate-200 flex items-center gap-1.5 transition-all font-mono hover:scale-102 max-w-full break-words text-left"
                >
                  <span className="break-words">{wt.name.split('(')[0].trim()}</span>
                  <span className="text-amber-400 font-bold shrink-0">({wt.confidence}/5)</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-dark-900 border border-dark-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: `All Categories (${overview.totalPhase1})` },
          { id: 'FRONTEND', label: 'Frontend & React' },
          { id: 'BACKEND', label: 'Backend & Node/DB' },
          { id: 'CODING', label: 'Algorithms & Patterns' },
          { id: 'CS_FUNDAMENTALS', label: `Phase 2: CS Core (${overview.totalPhase2})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategoryTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap ${selectedCategoryTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Category Topic Grids (Frontend, Backend, Coding) */}
      {selectedCategoryTab !== 'CS_FUNDAMENTALS' && (
        <div className="space-y-5 sm:space-y-6">
          {filteredCategories.map((catGroup: any) => {
            const Icon = getCategoryIcon(catGroup.category);
            return (
              <div key={catGroup.category} className="panel p-4 sm:p-5 space-y-4 border border-dark-800">
                <div className="flex items-center justify-between pb-2 border-b border-dark-800 flex-wrap gap-2">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>
                      {catGroup.category} TOPICS ({catGroup.ready}/{catGroup.total} Ready — {catGroup.percent}%)
                    </span>
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    {catGroup.topics.length} active topics
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {catGroup.topics.map((t: InterviewTopic) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTopic(t);
                        setIsDetailOpen(true);
                      }}
                      className="panel-card cursor-pointer space-y-3 group hover:border-brand-500/60 transition-all flex flex-col justify-between p-3.5 sm:p-4 min-w-0"
                    >
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`badge ${t.priority === 'CRITICAL' ? 'badge-rose' : 'badge-slate'
                                } text-[10px]`}
                            >
                              {t.priority}
                            </span>
                            <span className={`badge ${getStatusBadge(t.status)} text-[10px]`}>
                              {t.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          {/* 1-5 Star Indicator */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${t.confidence >= s ? 'text-amber-400 fill-current' : 'text-dark-700'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="min-w-0 space-y-1">
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-400 transition-colors break-words">
                            {t.name}
                          </h3>
                          {t.notes && (
                            <p className="text-xs text-slate-400 leading-relaxed break-words">
                              {t.notes}
                            </p>
                          )}
                        </div>

                        {t.practicalTips && (
                          <div className="p-2 sm:p-2.5 rounded-lg bg-dark-950 border border-dark-800/80 text-[11px] font-mono text-emerald-400 break-words leading-relaxed">
                            <span className="text-slate-500 font-bold mr-1">Tip:</span>
                            {t.practicalTips}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-mono text-slate-400">
                          Confidence: <strong className="text-white">{t.confidence}/5</strong>
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => handleDeleteTopic(t, e)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Phase 2 Topics (CS Fundamentals - Next Month) */}
      {(selectedCategoryTab === 'ALL' || selectedCategoryTab === 'CS_FUNDAMENTALS') && (
        <div className="panel p-4 sm:p-5 space-y-4 bg-dark-950/60 border border-dark-800/80">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-dark-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                        Phase 2: Computer Science Fundamentals (Next Month) — {phase2Topics.length} Topics
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Preserved for Phase 2 sprint (OS, DBMS, Networks)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {phase2Topics.map((pt: InterviewTopic) => (
                      <div
                        key={pt.id}
                        onClick={() => {
                          setSelectedTopic(pt);
                          setIsDetailOpen(true);
                        }}
                        className="p-3.5 rounded-xl bg-dark-900 border border-dark-800 hover:border-brand-500/50 cursor-pointer text-xs space-y-2 transition-all min-w-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-200 block break-words">{pt.name}</span>
                          <span className="badge badge-slate text-[10px] shrink-0">{pt.priority}</span>
                        </div>
                        {pt.notes && <p className="text-[11px] text-slate-400 leading-relaxed break-words">{pt.notes}</p>}
                        <div className="flex justify-between items-center pt-1 border-t border-dark-800/60 text-[11px] font-mono text-slate-500">
                          <span>Score: {pt.confidence}/5</span>
                          <button
                            onClick={(e) => handleDeleteTopic(pt, e)}
                            className="text-slate-500 hover:text-rose-400 p-0.5"
                            title="Delete topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Manual Add Topic Modal */ }
            {
              isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
                  <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                    <div className="p-4 sm:p-5 border-b border-dark-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Plus className="w-4 h-4 text-brand-400 shrink-0" />
                        <h2 className="text-sm font-bold text-white tracking-tight break-words">Add New Interview Practice Topic</h2>
                      </div>
                      <button
                        onClick={() => setIsAddOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCreateTopic} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400 font-bold uppercase">Topic Title *</label>
                        <input
                          type="text"
                          required
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          placeholder="e.g. React (Hooks, Fiber Reconciliation, State Colocation)"
                          className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400 font-bold uppercase">Category</label>
                          <select
                            value={newTopicCategory}
                            onChange={(e) => setNewTopicCategory(e.target.value as any)}
                            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                          >
                            <option value="FRONTEND">Frontend</option>
                            <option value="BACKEND">Backend</option>
                            <option value="CODING">Algorithms & Coding</option>
                            <option value="CS_FUNDAMENTALS">CS Fundamentals</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400 font-bold uppercase">Priority</label>
                          <select
                            value={newTopicPriority}
                            onChange={(e) => setNewTopicPriority(e.target.value as any)}
                            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                          >
                            <option value="CRITICAL">Critical</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400 font-bold uppercase">Sprint Phase</label>
                          <select
                            value={newTopicPhase}
                            onChange={(e) => setNewTopicPhase(e.target.value as any)}
                            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                          >
                            <option value="PHASE_1">Phase 1 (Current Month)</option>
                            <option value="PHASE_2">Phase 2 (Next Month)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400 font-bold uppercase">
                            Initial Score ({newTopicConfidence}/5)
                          </label>
                          <select
                            value={newTopicConfidence}
                            onChange={(e) => setNewTopicConfidence(parseInt(e.target.value, 10))}
                            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
                          >
                            <option value={1}>1 - Weak (Need study)</option>
                            <option value={2}>2 - Basic understanding</option>
                            <option value={3}>3 - Moderate (Practiced)</option>
                            <option value={4}>4 - Strong</option>
                            <option value={5}>5 - Interview Ready</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400 font-bold uppercase">Practical Tips & Invariants</label>
                        <input
                          type="text"
                          value={newTopicTips}
                          onChange={(e) => setNewTopicTips(e.target.value)}
                          placeholder="e.g. Always state colocation to eliminate 90% of re-renders"
                          className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400 font-bold uppercase">Key Interview Questions</label>
                        <textarea
                          rows={3}
                          value={newTopicQuestions}
                          onChange={(e) => setNewTopicQuestions(e.target.value)}
                          placeholder="1. Question 1...\n2. Question 2..."
                          className="w-full min-h-[80px] bg-dark-950 border border-dark-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 font-mono resize-y leading-relaxed"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-dark-800">
                        <button
                          type="button"
                          onClick={() => setIsAddOpen(false)}
                          className="btn-secondary text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreating}
                          className="btn-primary text-xs py-2 px-4"
                        >
                          {isCreating ? 'Creating...' : 'Create Topic'}
                        </button>
                      </div>
                    </form>
              </div>
            </div>
          )}

          {/* Topic Detail Modal */}
          <TopicDetailModal
            topic={selectedTopic}
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            onUpdated={loadInterviewTopics}
            onLogSession={(task) => onOpenLogger('INTERVIEW', task)}
          />

          {/* Excel / CSV Import Modal */}
          <ImportModal
            type="INTERVIEW"
            isOpen={isImportOpen}
            onClose={() => setIsImportOpen(false)}
            onImportSuccess={loadInterviewTopics}
          />
        </div>
      );
    };
