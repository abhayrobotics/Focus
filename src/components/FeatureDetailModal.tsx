import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Layers, ArrowRight } from 'lucide-react';
import { ProjectFeature } from '../types';
import { api } from '../services/api';

interface FeatureDetailModalProps {
  feature: ProjectFeature | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onLogSession?: (taskTitle: string) => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  feature,
  isOpen,
  onClose,
  onUpdated,
  onLogSession,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('CORE');
  const [status, setStatus] = useState<string>('PLANNED');
  const [priority, setPriority] = useState<string>('HIGH');
  const [progress, setProgress] = useState<number>(0);
  const [nextAction, setNextAction] = useState('');
  const [description, setDescription] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [isMvp, setIsMvp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (feature) {
      setName(feature.name);
      setCategory(feature.category || 'CORE');
      setStatus(feature.status || 'PLANNED');
      setPriority(feature.priority || 'HIGH');
      setProgress(feature.progress || 0);
      setNextAction(feature.nextAction || '');
      setDescription(feature.description || '');
      setTechnicalNotes(feature.technicalNotes || '');
      setIsMvp(feature.isMvp !== false);
    }
  }, [feature]);

  if (!isOpen || !feature) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.updateProjectFeature(feature.id, {
        name,
        category,
        status: status as any,
        priority: priority as any,
        progress,
        nextAction,
        description,
        technicalNotes,
        isMvp,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating feature:', err);
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
              <span className="badge badge-slate text-[10px]">{category}</span>
              <span className={`badge ${priority === 'HIGH' ? 'badge-rose' : priority === 'MEDIUM' ? 'badge-amber' : 'badge-slate'} text-[10px]`}>
                {priority} Priority
              </span>
              {isMvp ? (
                <span className="badge badge-indigo text-[10px]">Active MVP Feature</span>
              ) : (
                <span className="badge badge-slate text-[10px]">Future Phase Idea</span>
              )}
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">{name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {onLogSession && (
              <button
                type="button"
                onClick={() => onLogSession(`Project: ${name}`)}
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
          {/* Status & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
              >
                <option value="IDEA">💡 Idea</option>
                <option value="PLANNED">📋 Planned</option>
                <option value="DEVELOPMENT">⚡ In Development</option>
                <option value="TESTING">🧪 Testing</option>
                <option value="COMPLETE">✅ Complete</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">Progress</span>
                <span className="text-brand-400 font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Prominent Next Action */}
          <div className="space-y-1 p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/30">
            <label className="text-xs font-mono text-brand-400 font-bold uppercase flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Next Concrete Action to Code</span>
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Implement grievance forwarding API endpoint with audit history logging..."
              className="w-full bg-dark-950 border border-brand-500/40 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">Feature Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Feature functional overview..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Technical Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">Technical & Schema Notes</label>
            <textarea
              rows={3}
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
              placeholder="Prisma models, database indexes, state management details..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-brand-500 resize-none"
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
              <span>{isSubmitting ? 'Saving...' : 'Save Feature'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
