import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Save, RotateCcw, AlertCircle, Code2, Clock, Copy, Search, Link as LinkIcon } from 'lucide-react';
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
  const [leetcodeNumber, setLeetcodeNumber] = useState<string>('');
  const [problemUrl, setProblemUrl] = useState<string>('');
  const [approach, setApproach] = useState<string>('');
  const [mistake, setMistake] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [timeComplexity, setTimeComplexity] = useState<string>('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('O(1)');
  const [needsRevision, setNeedsRevision] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (question) {
      setStatus(question.status || 'NOT_STARTED');
      setSolvedMyself(question.solvedMyself !== false);
      setLeetcodeNumber(question.leetcodeNumber ? String(question.leetcodeNumber) : '');
      setProblemUrl(question.problemUrl || '');
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

  const handleCopy = () => {
    const text = `LeetCode #${question.leetcodeNumber || question.number}: ${question.title}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.updateDsaQuestion(question.id, {
        status: status as any,
        solvedMyself,
        leetcodeNumber: leetcodeNumber ? parseInt(leetcodeNumber, 10) : undefined,
        problemUrl: problemUrl || undefined,
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

  const lcNum = question.leetcodeNumber || question.number;
  const fallbackSearchUrl = `https://leetcode.com/problemset/all/?search=${lcNum || encodeURIComponent(question.title)}`;
  const directUrl = question.problemUrl || fallbackSearchUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold" title="Curriculum Sequence Index">
                Seq #{question.number}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                LC #{lcNum}
              </span>
              <span className="badge badge-indigo text-[10px]">{question.topic}</span>
              <span className={`badge ${getDifficultyBadge(question.difficulty)} text-[10px]`}>
                {question.difficulty}
              </span>
            </div>

            {/* Title & Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <h2 className="text-base font-bold text-white tracking-tight truncate max-w-md">
                {question.title}
              </h2>

              <div className="flex items-center gap-1.5">
                {/* Copy Name & Number Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 px-2 text-[11px] font-mono rounded-md bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 flex items-center gap-1 transition-colors"
                  title="Copy LeetCode # and Title to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Direct Link */}
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 px-2 text-[11px] font-mono rounded-md bg-brand-600/15 hover:bg-brand-600/25 text-brand-300 hover:text-white border border-brand-500/30 flex items-center gap-1 transition-colors"
                  title="Open direct LeetCode link"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>LeetCode</span>
                </a>

                {/* Fallback Search Link */}
                <a
                  href={fallbackSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 px-2 text-[11px] font-mono rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 flex items-center gap-1 transition-colors"
                  title="Search LeetCode (Fallback if direct problem link fails or 404s)"
                >
                  <Search className="w-3 h-3" />
                  <span>Search Fallback</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogSession && (
              <button
                type="button"
                onClick={() => onLogSession(`DSA #${question.number} (LC #${lcNum}): ${question.title}`)}
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

          {/* LeetCode Number & Direct URL Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-dark-850/60 border border-dark-800">
            <div className="space-y-1">
              <label className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center gap-1">
                <span>LeetCode #</span>
              </label>
              <input
                type="number"
                value={leetcodeNumber}
                onChange={(e) => setLeetcodeNumber(e.target.value)}
                placeholder="e.g. 1480"
                className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                <span>Problem URL</span>
              </label>
              <input
                type="text"
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
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
