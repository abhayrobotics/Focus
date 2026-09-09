import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Star, CheckSquare, Save } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [energy, setEnergy] = useState<number>(4);
  const [focus, setFocus] = useState<number>(4);
  const [completedPlanned, setCompletedPlanned] = useState<boolean>(true);
  const [spentTooMuchTimeDeciding, setSpentTooMuchTimeDeciding] = useState<boolean>(false);
  const [oneThingLearned, setOneThingLearned] = useState<string>('');
  const [oneMistake, setOneMistake] = useState<string>('');
  const [tomorrowPriority, setTomorrowPriority] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTodayReview();
    }
  }, [isOpen]);

  const loadTodayReview = async () => {
    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const data = await api.getDailyReview(todayStr);
      if (data.review) {
        setEnergy(data.review.energy || 4);
        setFocus(data.review.focus || 4);
        setCompletedPlanned(Boolean(data.review.completedPlanned));
        setSpentTooMuchTimeDeciding(Boolean(data.review.spentTooMuchTimeDeciding));
        setOneThingLearned(data.review.oneThingLearned || '');
        setOneMistake(data.review.oneMistake || '');
        setTomorrowPriority(data.review.tomorrowPriority || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.submitDailyReview({
        date: format(new Date(), 'yyyy-MM-dd'),
        energy,
        focus,
        completedPlanned,
        spentTooMuchTimeDeciding,
        oneThingLearned,
        oneMistake,
        tomorrowPriority,
      });
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      console.error('Error submitting daily review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">2-Minute Daily Growth Reflection</h2>
              <span className="text-[11px] font-mono text-slate-400">Lock in today's learnings & set tomorrow's first action</span>
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
          {/* Energy & Focus Ratings */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-dark-850 border border-dark-800">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 font-bold block">Energy ({energy}/5)</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setEnergy(star)}
                    className={`p-1 rounded ${energy >= star ? 'text-amber-400' : 'text-slate-600'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 font-bold block">Focus ({focus}/5)</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFocus(star)}
                    className={`p-1 rounded ${focus >= star ? 'text-brand-400' : 'text-slate-600'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick True/False Toggles */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-dark-850 border border-dark-800">
              <input
                type="checkbox"
                checked={completedPlanned}
                onChange={(e) => setCompletedPlanned(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 bg-dark-900 border-dark-750"
              />
              <span className="text-slate-200">Did I complete my planned study/work target today?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-dark-850 border border-dark-800">
              <input
                type="checkbox"
                checked={spentTooMuchTimeDeciding}
                onChange={(e) => setSpentTooMuchTimeDeciding(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 bg-dark-900 border-dark-750"
              />
              <span className="text-slate-200">Did I spend too much time deciding what to study?</span>
            </label>
          </div>

          {/* One Thing Learned */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 font-bold uppercase">One Key Invariant / Thing Learned</label>
            <input
              type="text"
              value={oneThingLearned}
              onChange={(e) => setOneThingLearned(e.target.value)}
              placeholder="e.g. Sliding window shrinkage condition; Prisma transaction boundaries..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* One Mistake */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-rose-400 font-bold uppercase">One Mistake / Distraction Encountered</label>
            <input
              type="text"
              value={oneMistake}
              onChange={(e) => setOneMistake(e.target.value)}
              placeholder="e.g. Forgot Math.max on duplicate character; opened random YouTube video..."
              className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-2 text-xs text-rose-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Tomorrow Priority */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-brand-400 font-bold uppercase">Tomorrow's Single Non-Negotiable Priority</label>
            <input
              type="text"
              required
              value={tomorrowPriority}
              onChange={(e) => setTomorrowPriority(e.target.value)}
              placeholder="e.g. Implement grievance forwarding API first thing"
              className="w-full bg-dark-950 border border-brand-500/40 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium"
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
              <span>{isSubmitting ? 'Saving...' : 'Save & Close Day'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
