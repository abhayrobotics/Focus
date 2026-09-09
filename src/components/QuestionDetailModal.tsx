import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Save, RotateCcw, AlertCircle, Code2, Clock } from 'lucide-react';
import { DSAQuestion } from '../types';
import { api } from '../services/api';

interface QuestionDetailModalProps {
  question: DSAQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onLogSession?: (taskTitle: string) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  isOpen,
  onClose,
  onUpdated,
  onLogSession,
}) => {
  const [status, setStatus] = useState<string>('NOT_STARTED');
  const [solvedMyself, setSolvedMyself] = useState<boolean>(true);
  const [approach, setApproach] = useState<string>('');
  const [mistake, setMistake] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [timeComplexity, setTimeComplexity] = useState<string>('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('O(1)');
  const [needsRevision, setNeedsRevision] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (question) {
      setStatus(question.status || 'NOT_STARTED');
      setSolvedMyself(question.solvedMyself !== false);
      setApproach(question.approach || '');
      setMistake(question.mistake || '');
      setSolution(question.solution || '');
      setTimeComplexity(question.timeComplexity || 'O(N)');
      setSpaceComplexity(question.spaceComplexity || 'O(1)');
      setNeedsRevision(Boolean(question.needsRevision));
      setRevisionNotes(question.revisionNotes || '');
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.updateDsaQuestion(question.id, {
        status: status as any,
        solvedMyself,
        approach,
        mistake,
        solution,
        timeComplexity,
        spaceComplexity,
        needsRevision,
        revisionNotes,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating question:', err);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-400 font-bold">#{question.number}</span>
              <span className="badge badge-indigo text-[10px]">{question.topic}</span>
              <span className={`badge ${getDifficultyBadge(question.difficulty)} text-[10px]`}>
                {question.difficulty}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{question.title}</span>
              {question.problemUrl && (
                <a
                  href={question.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-400 transition-colors"
                  title="Open on LeetCode"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onLogSession && (
              <button
                type="button"
                onClick={() => onLogSession(`DSA #${question.number}: ${question.title}`)}
                className="btn-secondary text-xs"
              >
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Log Time</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status & Independence Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
              >
                <option value="NOT_STARTED">⚪ Not Started</option>
                <option value="IN_PROGRESS">🟡 In Progress</option>
                <option value="SOLVED">🟢 Solved</option>
                <option value="NEEDS_REVISION">🔴 Needs Revision</option>
              </select>
            </div>

            {/* Honest Solving Metric */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Solving Independence</label>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setSolvedMyself(true)}
                  className={`py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    solvedMyself
                      ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                      : 'bg-dark-900 text-slate-400 border-dark-750 hover:text-slate-200'
                  }`}
                >
                  ✨ Solved Myself
                </button>
                <button
                  type="button"
                  onClick={() => setSolvedMyself(false)}
                  className={`py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    !solvedMyself
                      ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 shadow-sm'
                      : 'bg-dark-900 text-slate-400 border-dark-750 hover:text-slate-200'
                  }`}
                >
                  💡 Needed Help
                </button>
              </div>
            </div>
          </div>

          {/* Pattern & Approach */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">
              Approach & Core Pattern Invariant
            </label>
            <textarea
              rows={2}
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="e.g. Dynamic sliding window with HashMap. Expand right, shrink left when frequency exceeds k..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none font-mono"
            />
          </div>

          {/* Mistakes Made */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Mistakes Made / Traps Encountered</span>
            </label>
            <textarea
              rows={2}
              value={mistake}
              onChange={(e) => setMistake(e.target.value)}
              placeholder="e.g. Forgot to use Math.max(left, map.get(char) + 1) which caused left pointer to jump backwards on duplicate..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3.5 py-2 text-xs text-rose-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none font-mono"
            />
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Time Complexity</label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                placeholder="O(N)"
                className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Space Complexity</label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                placeholder="O(1)"
                className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Code / Solution */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Solution Snippet (TypeScript / JS)</span>
            </label>
            <textarea
              rows={4}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="function solve() { ... }"
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Revision Checkbox */}
          <div className="p-3 rounded-lg bg-dark-850 border border-dark-800 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={needsRevision}
                onChange={(e) => setNeedsRevision(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 bg-dark-900 border-dark-700"
              />
              <span className="text-xs font-semibold text-slate-200">
                Mark for Revision (Schedule re-solving)
              </span>
            </label>

            {needsRevision && (
              <span className="badge badge-amber text-[10px]">Revision Active</span>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Reflection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
