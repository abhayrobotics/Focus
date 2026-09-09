import React, { useState, useEffect } from 'react';
import { X, Check, Code2, FolderGit2, Target, Sparkles, Trash2, Calendar, AlertTriangle, RotateCcw } from 'lucide-react';
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

  const quickMinutes = [
    { mins: 0, label: '0m (No Log / Reset)', isZero: true },
    { mins: 15, label: '15m' },
    { mins: 30, label: '30m' },
    { mins: 45, label: '45m' },
    { mins: 60, label: '1h' },
    { mins: 90, label: '1.5h' },
    { mins: 120, label: '2h' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Handle 0m / No Log Reset
      if (durationMinutes === 0) {
        if (sessionToEdit) {
          await api.deleteWorkSession(sessionToEdit.id);
        } else {
          await api.clearDateWorkSessions(sessionDate);
        }
        onSessionLogged();
        onClose();
        return;
      }

      if (!taskTitle.trim()) return;

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

  const handleClearTodayDirectly = async () => {
    if (!window.confirm(`Are you sure you want to clear all work session logs for ${sessionDate} and reset logged time back to 0h?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.clearDateWorkSessions(sessionDate);
      onSessionLogged();
      onClose();
    } catch (err) {
      console.error('Error clearing date sessions:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isToday = sessionDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              durationMinutes === 0
                ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60'
            }`}>
              {durationMinutes === 0 ? '🧹' : sessionToEdit ? '✏️' : '⚡'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {sessionToEdit
                  ? 'Edit / Correct Work Session Log'
                  : durationMinutes === 0
                  ? 'Clear / Reset Work Log (0 min)'
                  : 'Log Verified Work Session'}
              </h2>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {durationMinutes === 0
                  ? `Reset logged hours for ${sessionDate} back to 0h`
                  : sessionToEdit
                  ? 'Modify duration, category, or delete accidental duplicate log'
                  : 'Only actual execution counts toward your daily target'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 0 Min / Reset Alert Banner */}
          {durationMinutes === 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>0 Min (No Log Today / Clear Mistake) Selected</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-700/90 dark:text-rose-300/90">
                {sessionToEdit
                  ? 'Saving with 0m will delete this work session log from your history and recalculate your daily target.'
                  : `Submitting will remove all logged work sessions for ${sessionDate} (${isToday ? 'Today' : sessionDate}) and reset tracked execution time back to 0h. Perfect for clearing accidental clicks.`}
              </p>
            </div>
          )}

          {/* Category Selector (Hidden or disabled in 0m reset mode for cleaner UI) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
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
                      ? 'btn-primary shadow-sm'
                      : 'bg-slate-50 dark:bg-dark-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Log Date</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">{sessionDate}</span>
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors font-mono"
            />
          </div>

          {/* Duration Chips (with 0m / No Log Option) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Duration
              </label>
              <span className={durationMinutes === 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-brand-600 dark:text-brand-400 font-bold'}>
                {durationMinutes === 0
                  ? '0 Minutes (No Log / Reset)'
                  : `${durationMinutes} Minutes (${parseFloat((durationMinutes / 60).toFixed(1))}h)`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickMinutes.map((chip) => {
                const isSelected = durationMinutes === chip.mins;
                return (
                  <button
                    type="button"
                    key={chip.mins}
                    onClick={() => setDurationMinutes(chip.mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      isSelected
                        ? chip.isZero
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'btn-primary shadow-sm'
                        : chip.isZero
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-950/40'
                        : 'bg-slate-50 dark:bg-dark-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Reset Helper Button if logged by mistake */}
            {durationMinutes !== 0 && !sessionToEdit && (
              <div className="flex items-center justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setDurationMinutes(0)}
                  className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 underline flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Logged by mistake? Select 0min / clear today</span>
                </button>
              </div>
            )}
          </div>

          {/* Task / Detail Description (Optional if 0m reset) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              {durationMinutes === 0 ? 'Reason / Note (Optional)' : 'What did you work on? *'}
            </label>
            <input
              type="text"
              required={durationMinutes > 0}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={
                durationMinutes === 0
                  ? 'e.g., Cleared accidental work log'
                  : 'e.g., LC 3 Longest Substring Without Repeating Characters'
              }
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Optional Notes (if not 0m) */}
          {durationMinutes > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Execution Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key invariant learned, mistake caught, or PR status..."
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-dark-800 flex items-center justify-between gap-2.5">
            <div>
              {sessionToEdit ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Log'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClearTodayDirectly}
                  disabled={isSubmitting}
                  className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-mono flex items-center gap-1 transition-colors px-1"
                  title="Clear all sessions for this date immediately"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear {isToday ? 'Today' : sessionDate} (0m)</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  durationMinutes === 0
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                    : 'btn-primary'
                }`}
              >
                {durationMinutes === 0 ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Clearing...'
                        : sessionToEdit
                        ? 'Delete Log (0m)'
                        : `Reset to 0m (Clear)`}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Saving...'
                        : sessionToEdit
                        ? 'Save Changes'
                        : 'Save & Update Target'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
