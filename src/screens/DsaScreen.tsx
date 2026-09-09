import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Upload,
  Play,
  Download,
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
            <a
              href="/api/export/dsa"
              download
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-indigo-300 hover:border-indigo-500/40"
              title="Download all 80 DSA questions, approaches, notes & solutions as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </a>
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
                    ? 'btn-primary font-bold shadow-sm'
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
            placeholder="Search by title, topic, LC # (e.g. 1480, 53, 1), or mistakes..."
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

      {/* 3. Question Table (Desktop) & Full-Height Vertical Cards (Mobile) */}
      {/* Mobile View: Vertical Full-Height Cards (No horizontal scroll) */}
      <div className="block md:hidden space-y-3 w-full overflow-hidden">
        {loading ? (
          <div className="panel p-8 text-center text-slate-500 font-mono text-xs">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="panel p-8 text-center text-slate-500 font-mono text-xs">
            No questions found matching your filter criteria.
          </div>
        ) : (
          questions.map((q) => {
            const fallbackSearchUrl = `https://leetcode.com/problemset/all/?search=${q.leetcodeNumber || encodeURIComponent(q.title)}`;
            const directUrl = q.problemUrl || fallbackSearchUrl;

            return (
              <div
                key={q.id}
                onClick={() => openQuestionModal(q)}
                className="panel-card p-4 space-y-3 cursor-pointer group hover:border-brand-500/60 transition-all w-full overflow-hidden flex flex-col justify-between"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{q.number}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      LC #{q.leetcodeNumber || q.number}
                    </span>
                    <span className={`badge ${getDifficultyBadge(q.difficulty)} text-[10px]`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <span className={`badge ${getStatusBadge(q.status)} text-[10px]`}>
                    {q.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Question Title & Revision Badge */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors leading-snug break-words flex-1">
                      {q.title}
                    </h3>
                    {q.needsRevision && (
                      <span className="badge badge-rose text-[9px] shrink-0">Revision</span>
                    )}
                  </div>

                  {/* Trap Box (if present) */}
                  {q.mistake && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-300 font-mono leading-relaxed break-words">
                      <span className="font-bold text-rose-400 mr-1">⚠️ Trap:</span>
                      {q.mistake}
                    </div>
                  )}
                </div>

                {/* Topic & Complexity Metadata */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-800/80 text-[11px] font-mono text-slate-400 flex-wrap">
                  <span className="badge badge-slate text-[10px]">{q.topic}</span>

                  <div className="flex items-center gap-2">
                    {q.timeComplexity && (
                      <span className="text-slate-400 text-[10px] bg-dark-950 px-1.5 py-0.5 rounded border border-dark-800">
                        ⏱️ {q.timeComplexity}
                      </span>
                    )}
                    {q.status === 'SOLVED' && (
                      <span className="text-[10px] font-medium">
                        {q.solvedMyself ? (
                          <span className="text-emerald-400">✨ Self</span>
                        ) : (
                          <span className="text-amber-400">💡 Helped</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-800/80 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-1.5 px-2.5 text-xs flex items-center gap-1 hover:text-brand-400"
                      title={`Open LeetCode #${q.leetcodeNumber || q.number}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LeetCode</span>
                    </a>
                    <a
                      href={fallbackSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-dark-800 rounded-lg border border-dark-800"
                      title="Search LeetCode"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenLogger('DSA', `DSA #${q.number} (LC #${q.leetcodeNumber || q.number}): ${q.title}`)}
                      className="btn-secondary py-1.5 px-2.5 text-xs"
                    >
                      <span>Log Time</span>
                    </button>
                    <button
                      onClick={() => openQuestionModal(q)}
                      className="btn-primary py-1.5 px-3 text-xs font-bold"
                    >
                      <span>Solve / Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop View: Full Data Table (Hidden on Mobile) */}
      <div className="hidden md:block panel overflow-hidden border border-dark-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 border-b border-dark-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-3 w-10 text-center" title="Curriculum Sequence Number (1-80)">#</th>
                <th className="py-3 px-3 w-24 text-center" title="Official LeetCode Problem Number">LeetCode #</th>
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
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    Loading questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    No questions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                questions.map((q) => {
                  const fallbackSearchUrl = `https://leetcode.com/problemset/all/?search=${q.leetcodeNumber || encodeURIComponent(q.title)}`;
                  const directUrl = q.problemUrl || fallbackSearchUrl;

                  return (
                    <tr
                      key={q.id}
                      onClick={() => openQuestionModal(q)}
                      className="table-row-hover cursor-pointer group"
                    >
                      {/* 1. Sequence Number */}
                      <td className="py-3 px-3 text-center font-mono text-slate-400 font-medium">
                        {q.number}
                      </td>

                      {/* 2. Official LeetCode Question Number Badge */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 group-hover:border-amber-400 group-hover:bg-amber-500/20 transition-colors">
                          LC #{q.leetcodeNumber || q.number}
                        </span>
                      </td>

                      {/* 3. Topic */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <span className="badge badge-slate text-[10px]">{q.topic}</span>
                      </td>

                      {/* 4. Title & Mistakes */}
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

                      {/* 5. Difficulty */}
                      <td className="py-3 px-3 text-center">
                        <span className={`badge ${getDifficultyBadge(q.difficulty)} text-[10px]`}>
                          {q.difficulty}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`badge ${getStatusBadge(q.status)} text-[10px]`}>
                          {q.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* 7. Solve Type */}
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

                      {/* 8. Complexity */}
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                        {q.timeComplexity ? `${q.timeComplexity}` : '—'}
                      </td>

                      {/* 9. Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct LeetCode Link */}
                          <a
                            href={directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-dark-800 rounded-lg transition-colors"
                            title={`Open LeetCode #${q.leetcodeNumber || q.number} (${q.title})`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Fallback Search Link (if link is broken or moved) */}
                          <a
                            href={fallbackSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-dark-800 rounded-lg transition-colors"
                            title={`Search LeetCode for #${q.leetcodeNumber || q.number} (Fallback if direct link is broken)`}
                          >
                            <Search className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => onOpenLogger('DSA', `DSA #${q.number} (LC #${q.leetcodeNumber || q.number}): ${q.title}`)}
                            className="btn-secondary py-1 px-2 text-[10px]"
                            title="Log study session"
                          >
                            Log Time
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
