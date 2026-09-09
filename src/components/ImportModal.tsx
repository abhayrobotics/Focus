import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { api } from '../services/api';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'DSA' | 'PROJECT';
  projectId?: string;
  onImportSuccess: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  type,
  projectId,
  onImportSuccess,
}) => {
  const [inputText, setInputText] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Try parsing as JSON first
      let items: any[] = [];
      try {
        items = JSON.parse(inputText);
      } catch {
        // If not JSON, parse as CSV (Comma or Tab separated)
        const lines = inputText.trim().split('\n');
        items = lines.map((line, idx) => {
          const cols = line.split(/[,\t]/).map((c) => c.trim());
          if (type === 'DSA') {
            return {
              number: parseInt(cols[0], 10) || idx + 1,
              topic: cols[1] || 'Array',
              title: cols[2] || cols[0] || `Problem ${idx + 1}`,
              difficulty: cols[3] || 'Medium',
              problemUrl: cols[4] || '',
            };
          } else {
            return {
              name: cols[0] || `Feature ${idx + 1}`,
              category: cols[1] || 'CORE',
              priority: cols[2] || 'HIGH',
              description: cols[3] || '',
              nextAction: cols[4] || '',
            };
          }
        });
      }

      if (type === 'DSA') {
        await api.importDsaQuestions(items, replaceAll);
      } else if (projectId) {
        await api.importProjectFeatures(projectId, items);
      }

      onImportSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to import data. Please check the format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Import {type === 'DSA' ? 'DSA Questions' : 'Project Features'} from Excel / CSV / JSON
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleImport} className="p-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Paste your Excel table rows (CSV/tab-separated) or JSON array below.
          </p>

          <div className="p-3 rounded-lg bg-dark-950 border border-dark-800 text-[11px] font-mono text-slate-400 space-y-1">
            <span className="text-brand-400 font-bold block">Expected CSV Columns:</span>
            {type === 'DSA' ? (
              <code>#, Topic, Problem Title, Difficulty, LeetCode URL</code>
            ) : (
              <code>Feature Name, Category, Priority, Description, Next Action</code>
            )}
          </div>

          <textarea
            rows={8}
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              type === 'DSA'
                ? "1, Array, Two Sum, Easy, https://leetcode.com/problems/two-sum/\n2, Array, Best Time to Buy Stock, Easy, ..."
                : "Grievance Creation, CORE, HIGH, Creation form, Implement zod validation"
            }
            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
          />

          {type === 'DSA' && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 bg-dark-950 border-dark-750"
              />
              <span>Replace existing questions with this imported list</span>
            </label>
          )}

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

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
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Importing...' : 'Import Data'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
