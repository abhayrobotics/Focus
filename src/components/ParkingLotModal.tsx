import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ParkedIdea } from '../types';
import { api } from '../services/api';

interface ParkingLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const ParkingLotModal: React.FC<ParkingLotModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [ideas, setIdeas] = useState<ParkedIdea[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TECH_STACK');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadParkedIdeas();
    }
  }, [isOpen]);

  const loadParkedIdeas = async () => {
    try {
      setLoading(true);
      const res = await api.getParkedIdeas();
      setIdeas(res.ideas);
    } catch (err) {
      console.error('Error loading parked ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParkIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await api.parkIdea({
        title: title.trim(),
        category,
        notes: notes.trim(),
      });
      setTitle('');
      setNotes('');
      setFeedback('Idea safely parked for free-time review!');
      setTimeout(() => setFeedback(null), 3500);
      loadParkedIdeas();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Error parking idea:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGraduate = async (id: string) => {
    try {
      await api.graduateParkedIdea(id);
      setFeedback('Graduated to Project Feature tree!');
      setTimeout(() => setFeedback(null), 3500);
      loadParkedIdeas();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteParkedIdea(id);
      loadParkedIdeas();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const activeIdeas = ideas.filter((i) => i.status === 'PARKED');
  const pastIdeas = ideas.filter((i) => i.status !== 'PARKED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
              🅿️
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Parking Lot (Distraction Garage)</h2>
              <span className="text-[11px] font-mono text-slate-400">
                Park new frameworks, courses, or side ideas here without disrupting your active sprint
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

        {/* Feedback Alert */}
        {feedback && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-2.5 px-5 text-xs text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Park Form */}
          <form onSubmit={handleParkIdea} className="p-4 rounded-xl bg-dark-850 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Park an Idea in 5 Seconds
              </span>
              <span className="text-[10px] font-mono text-amber-400">Protects Active Sprint</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Try Hono.js on Cloudflare Workers..."
                className="sm:col-span-2 bg-dark-950 border border-dark-750 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-dark-950 border border-dark-750 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
              >
                <option value="TECH_STACK">Tech Stack / Tool</option>
                <option value="COURSE">New Course / Tutorial</option>
                <option value="PROJECT_IDEA">Project Feature Idea</option>
                <option value="GENERAL">General Distraction</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Brief reason or link..."
                className="flex-1 bg-dark-950 border border-dark-750 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-1.5 px-3 whitespace-nowrap text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Park It</span>
              </button>
            </div>
          </form>

          {/* Active Parked Ideas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Currently Parked Ideas ({activeIdeas.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Triage during Sunday Review / Free Time</span>
            </div>

            {loading ? (
              <div className="text-center py-6 text-xs font-mono text-slate-500">Loading parked ideas...</div>
            ) : activeIdeas.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-dark-950/40 border border-dark-800 text-xs text-slate-500 font-mono">
                No distractions currently parked. Your focus is clean! 🎯
              </div>
            ) : (
              <div className="space-y-2">
                {activeIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3.5 rounded-xl bg-dark-850 border border-dark-800 hover:border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-slate text-[10px]">{idea.category}</span>
                        <h4 className="text-xs font-semibold text-white">{idea.title}</h4>
                      </div>
                      {idea.notes && (
                        <p className="text-[11px] text-slate-400 pl-1">{idea.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleGraduate(idea.id)}
                        title="Graduate into Employee Grievance Management System features"
                        className="btn-secondary py-1 px-2.5 text-[11px]"
                      >
                        <span>Graduate to Project</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-dark-800 transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
