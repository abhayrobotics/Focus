import React, { useState, useEffect } from 'react';
import { X, Check, Code2, FolderGit2, Target, Sparkles, Trash2, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';
import { WorkSession } from '../types';

interface SessionLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged: () => void;
  initialCategory?: 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER';
  initialTask?: string;
  sessionToEdit?: WorkSession | null;
}

export const SessionLoggerModal: React.FC<SessionLoggerModalProps> = ({
  isOpen,
  onClose,
  onSessionLogged,
  initialCategory = 'DSA',
  initialTask = '',
  sessionToEdit = null,
}) => {
  const [category, setCategory] = useState<'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER'>(initialCategory);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [taskTitle, setTaskTitle] = useState(initialTask || 'Solved Sliding Window problem');
  const [notes, setNotes] = useState('');
  const [sessionDate, setSessionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (sessionToEdit) {
      setCategory(sessionToEdit.category as any);
      setDurationMinutes(sessionToEdit.durationMinutes);
      setTaskTitle(sessionToEdit.taskTitle);
      setNotes(sessionToEdit.notes || '');
      setSessionDate(sessionToEdit.date);
    } else {
      setCategory(initialCategory);
      setDurationMinutes(45);
      setTaskTitle(initialTask || '');
      setNotes('');
      setSessionDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [sessionToEdit, initialCategory, initialTask, isOpen]);

  if (!isOpen) return null;

  const quickMinutes = [15, 30, 45, 60, 90, 120];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      setIsSubmitting(true);
      if (sessionToEdit) {
        await api.updateWorkSession(sessionToEdit.id, {
          category,
          durationMinutes,
          taskTitle: taskTitle.trim(),
          notes: notes.trim(),
          date: sessionDate,
        });
      } else {
        await api.logWorkSession({
          category,
          durationMinutes,
          taskTitle: taskTitle.trim(),
          notes: notes.trim(),
          date: sessionDate,
        });
      }
      onSessionLogged();
      onClose();
    } catch (err) {
      console.error('Error saving work session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionToEdit) return;
    if (!window.confirm(`Delete log "${sessionToEdit.taskTitle}" (${sessionToEdit.durationMinutes}m)?`)) return;

    try {
      setIsDeleting(true);
      await api.deleteWorkSession(sessionToEdit.id);
      onSessionLogged();
      onClose();
    } catch (err) {
      console.error('Error deleting work session:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold text-xs">
              {sessionToEdit ? '✏️' : '⚡'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {sessionToEdit ? 'Edit / Correct Work Session Log' : 'Log Verified Work Session'}
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {sessionToEdit ? 'Modify duration, category, or delete duplicate log' : 'Only actual execution counts toward your daily target'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'DSA', label: 'DSA', icon: <Code2 className="w-3.5 h-3.5" /> },
                { id: 'PROJECT', label: 'Project', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
                { id: 'INTERVIEW', label: 'Interview', icon: <Target className="w-3.5 h-3.5" /> },
                { id: 'OTHER', label: 'Other', icon: <Sparkles className="w-3.5 h-3.5" /> },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    category === cat.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                      : 'bg-dark-850 text-slate-300 border-dark-800 hover:border-dark-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector (If editing or logging for past date) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Log Date</span>
              </span>
              <span className="text-slate-400 font-normal">{sessionDate}</span>
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors font-mono"
            />
          </div>

          {/* Quick Duration Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span>Duration</span>
              <span className="text-brand-400 font-bold">{durationMinutes} Minutes ({parseFloat((durationMinutes / 60).toFixed(1))}h)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {quickMinutes.map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    durationMinutes === mins
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                      : 'bg-dark-850 text-slate-300 border-dark-800 hover:border-dark-700'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Task / Detail Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              What did you work on?
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., LC 3 Longest Substring Without Repeating Characters"
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Execution Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key invariant learned, mistake caught, or PR status..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            <div>
              {sessionToEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Log'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
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
                <Check className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Saving...'
                    : sessionToEdit
                    ? 'Save Changes'
                    : 'Save & Update Target'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
