import React, { useState, useEffect } from 'react';
import { X, Save, Star, Clock } from 'lucide-react';
import { InterviewTopic } from '../types';
import { api } from '../services/api';

interface TopicDetailModalProps {
  topic: InterviewTopic | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onLogSession?: (taskTitle: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  isOpen,
  onClose,
  onUpdated,
  onLogSession,
}) => {
  const [status, setStatus] = useState<string>('LEARNING');
  const [confidence, setConfidence] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [keyQuestions, setKeyQuestions] = useState('');
  const [practicalTips, setPracticalTips] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (topic) {
      setStatus(topic.status || 'LEARNING');
      setConfidence(topic.confidence || 3);
      setNotes(topic.notes || '');
      setKeyQuestions(topic.keyQuestions || '');
      setPracticalTips(topic.practicalTips || '');
    }
  }, [topic]);

  if (!isOpen || !topic) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.updateInterviewTopic(topic.id, {
        status: status as any,
        confidence,
        notes,
        keyQuestions,
        practicalTips,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating interview topic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-indigo text-[10px]">{topic.category}</span>
              <span className="badge badge-slate text-[10px]">{topic.phase}</span>
              {confidence <= 3 && (
                <span className="badge badge-amber text-[10px]">Priority Focus</span>
              )}
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">{topic.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {onLogSession && (
              <button
                type="button"
                onClick={() => onLogSession(`Interview Prep: ${topic.name}`)}
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
          {/* Status & Confidence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Readiness Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
              >
                <option value="NOT_STARTED">⚪ Not Started</option>
                <option value="LEARNING">🟡 Learning Concepts</option>
                <option value="PRACTICED">🔵 Practiced</option>
                <option value="INTERVIEW_READY">🟢 Interview Ready</option>
              </select>
            </div>

            {/* Confidence Score (1-5) */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase flex items-center justify-between">
                <span>Confidence Score</span>
                <span className="text-amber-400 font-bold">{confidence} / 5</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setConfidence(star)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      confidence >= star
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-dark-950 text-slate-600 border-dark-800 hover:text-slate-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Questions */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">
              Must-Know Interview Questions & Tricky Scenarios
            </label>
            <textarea
              rows={4}
              value={keyQuestions}
              onChange={(e) => setKeyQuestions(e.target.value)}
              placeholder="1. Question 1...\n2. Question 2..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Practical Invariants & Code Tips */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">
              Practical Invariants & Talking Points
            </label>
            <textarea
              rows={2}
              value={practicalTips}
              onChange={(e) => setPracticalTips(e.target.value)}
              placeholder="e.g. Always explain state colocation to eliminate 90% of re-renders before mentioning useMemo..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono resize-none"
            />
          </div>

          {/* Personal Architecture Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">
              Personal Study Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Trade-offs, memory leak considerations..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Footer */}
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
              <span>{isSubmitting ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
