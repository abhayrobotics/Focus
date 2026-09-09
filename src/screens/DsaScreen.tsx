import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Upload,
  Play,
} from 'lucide-react';
import { DSAQuestion, DSAOverview, DSATopicStat } from '../types';
import { api } from '../services/api';
import { QuestionDetailModal } from '../components/QuestionDetailModal';
import { ImportModal } from '../components/ImportModal';

interface DsaScreenProps {
  onOpenLogger: (category?: 'DSA', taskTitle?: string) => void;
}

export const DsaScreen: React.FC<DsaScreenProps> = ({ onOpenLogger }) => {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [overview, setOverview] = useState<DSAOverview | null>(null);
  const [topicStats, setTopicStats] = useState<DSATopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [revisionOnly, setRevisionOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    loadDsaQuestions();
  }, [selectedTopic, selectedDifficulty, selectedStatus, revisionOnly, searchQuery]);

  const loadDsaQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.getDsaQuestions({
        topic: selectedTopic !== 'ALL' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'ALL' ? selectedDifficulty : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        needsRevision: revisionOnly ? true : undefined,
        search: searchQuery.trim() || undefined,
      });
      setQuestions(res.questions);
      setOverview(res.overview);
      setTopicStats(res.topicStats);
    } catch (err) {
      console.error('Error loading DSA questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const openQuestionModal = (q: DSAQuestion) => {
    setSelectedQuestion(q);
    setIsDetailOpen(true);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'badge-emerald';
      case 'Medium':
        return 'badge-amber';
      case 'Hard':
        return 'badge-rose';
      default:
        return 'badge-slate';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SOLVED':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'NEEDS_REVISION':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-dark-800 text-slate-400 border border-dark-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* 1. Header Overview Bar */}
      <div className="panel p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-indigo">CURATED CURRICULUM</span>
              <span className="text-xs font-mono text-slate-400">Locked 9-Topic Sequence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>DSA Tracker</span>
              <span className="text-brand-400 text-lg font-mono">
                ({overview?.solved || 0} / {overview?.total || 80} Solved — {overview?.completionPercent || 0}%)
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Excel / CSV</span>
            </button>
            {overview?.nextRecommended && (
              <button
                onClick={() => openQuestionModal(overview.nextRecommended!)}
                className="btn-primary text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Solve Next Recommended</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400">Total Solved</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {overview?.solved || 0} / {overview?.total || 80}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400">Solved Myself</span>
            <div className="text-lg font-bold font-mono text-white">
              {overview?.solvedMyselfCount || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400">Needed Help</span>
            <div className="text-lg font-bold font-mono text-amber-400">
              {overview?.neededHelpCount || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 space-y-0.5">
            <span className="text-[11px] font-mono text-slate-400">Needs Revision</span>
            <div className="text-lg font-bold font-mono text-rose-400">
              {overview?.needsRevisionCount || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-850 border border-dark-800 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-mono text-slate-400">Current Topic</span>
            <div className="text-xs font-bold text-brand-400 truncate">
              {overview?.currentTopic || 'Array'}
            </div>
          </div>
        </div>

        {/* 9-Topic Sequence Pills */}
        <div className="space-y-1.5 pt-2 border-t border-dark-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Sequence Roadmap:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {topicStats.map((ts, idx) => (
              <button
                key={ts.topic}
                onClick={() => setSelectedTopic(selectedTopic === ts.topic ? 'ALL' : ts.topic)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  selectedTopic === ts.topic
                    ? 'bg-brand-600 text-white border-brand-500 font-bold shadow-sm'
                    : 'bg-dark-850 text-slate-300 border-dark-800 hover:border-dark-700'
                }`}
              >
                <span>{idx + 1}. {ts.topic}</span>
                <span className="ml-1.5 text-[10px] text-slate-400">
                  ({ts.solved}/{ts.total})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-dark-900 border border-dark-800">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem title, topic, or mistakes..."
            className="w-full bg-dark-950 border border-dark-800 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-dark-950 border border-dark-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-950 border border-dark-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLVED">Solved</option>
            <option value="NEEDS_REVISION">Needs Revision</option>
          </select>

          <button
            onClick={() => setRevisionOnly(!revisionOnly)}
            className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
              revisionOnly
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold'
                : 'bg-dark-950 text-slate-400 border-dark-800 hover:text-slate-200'
            }`}
          >
            🔄 Revision Only
          </button>
        </div>
      </div>

      {/* 3. Question Table */}
      <div className="panel overflow-hidden border border-dark-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 border-b border-dark-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-3 text-center">Difficulty</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Solve Type</th>
                <th className="py-3 px-3 text-center">Complexity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    Loading questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    No questions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => openQuestionModal(q)}
                    className="table-row-hover cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                      {q.number}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span className="badge badge-slate text-[10px]">{q.topic}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                          {q.title}
                        </span>
                        {q.needsRevision && (
                          <span className="badge badge-rose text-[9px]">Revision</span>
                        )}
                      </div>
                      {q.mistake && (
                        <p className="text-[11px] text-rose-300/80 font-mono truncate max-w-md mt-0.5">
                          Trap: {q.mistake}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`badge ${getDifficultyBadge(q.difficulty)} text-[10px]`}>
                        {q.difficulty}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`badge ${getStatusBadge(q.status)} text-[10px]`}>
                        {q.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[11px]">
                      {q.status === 'SOLVED' ? (
                        q.solvedMyself ? (
                          <span className="text-emerald-400 font-medium">✨ Self</span>
                        ) : (
                          <span className="text-amber-400 font-medium">💡 Needed Help</span>
                        )
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                      {q.timeComplexity ? `${q.timeComplexity}` : '—'}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {q.problemUrl && (
                          <a
                            href={q.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-dark-800 rounded-lg transition-colors"
                            title="Open Problem"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => onOpenLogger('DSA', `DSA #${q.number}: ${q.title}`)}
                          className="btn-secondary py-1 px-2 text-[10px]"
                          title="Log study session"
                        >
                          Log Time
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Reflection Modal */}
      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdated={loadDsaQuestions}
        onLogSession={(task) => onOpenLogger('DSA', task)}
      />

      {/* Import Modal */}
      <ImportModal
        type="DSA"
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={loadDsaQuestions}
      />
    </div>
  );
};
