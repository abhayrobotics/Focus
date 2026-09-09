import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'DSA' | 'PROJECT' | 'INTERVIEW';
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
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please ensure it is a valid text/CSV file.');
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    let headers = '';
    let sampleData = '';
    let filename = '';

    if (type === 'INTERVIEW') {
      filename = 'interview_practice_topics_template.csv';
      headers = 'Category,Topic Name,Priority,Status,Confidence,Phase,Practical Tips,Key Questions,Notes';
      sampleData = [
        'FRONTEND,React (Hooks Fiber Optimization),CRITICAL,LEARNING,3,PHASE_1,"Colocate state to eliminate re-renders before useMemo","1. How does React Fiber work under the hood? 2. State batching in React 18","Master useEffect cleanup and custom hooks."',
        'BACKEND,Node.js (Streams Clusters Libuv Concurrency),CRITICAL,LEARNING,3,PHASE_1,"Never block event loop with heavy sync loops","1. How does Node.js handle concurrent I/O? 2. Process.nextTick vs setImmediate","Focus on Streams piping and worker threads."',
        'BACKEND,PostgreSQL & Relational Database Design,HIGH,PRACTICED,4,PHASE_1,"Always index foreign keys and query search columns","1. Explain Index Scan vs Seq Scan in EXPLAIN ANALYZE","B-Tree indexing and ACID transaction isolation."',
        'CODING,Two Pointer & Sliding Window Patterns,CRITICAL,INTERVIEW_READY,5,PHASE_1,"Monotonic window invariants","1. How to maintain dynamic window bounds without O(N^2) shrinkage?","Master left/right boundary pointers."',
        'CS_FUNDAMENTALS,Operating Systems (Processes Threads Concurrency),HIGH,NOT_STARTED,2,PHASE_2,"4 Coffman deadlock conditions","1. Process vs thread memory layout 2. Mutex vs Semaphore","Phase 2 priority (next month)."',
      ].join('\r\n');
    } else if (type === 'DSA') {
      filename = 'dsa_questions_template.csv';
      headers = 'Sequence_Number,Topic,Problem Title,Difficulty,LeetCode URL';
      sampleData = [
        '1,Array,Two Sum,Easy,https://leetcode.com/problems/two-sum/',
        '2,Array,Best Time to Buy and Sell Stock,Easy,https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        '3,Sliding Window,Longest Substring Without Repeating Characters,Medium,https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      ].join('\r\n');
    } else {
      filename = 'project_features_template.csv';
      headers = 'Feature Name,Category,Priority,Description,Next Action';
      sampleData = [
        'Grievance Creation Form,PHASE_1,HIGH,Dynamic creation flow with category selection,Implement form validation with Zod',
        'Forwarding Workflow Engine,PHASE_4,HIGH,Routing between officers with audit note,Build forward modal and API endpoint',
      ].join('\r\n');
    }

    const csvContent = `${headers}\r\n${sampleData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please paste table data or upload an Excel/CSV file.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let items: any[] = [];

      // Try parsing as JSON first
      try {
        const parsed = JSON.parse(inputText);
        if (Array.isArray(parsed)) {
          items = parsed;
        }
      } catch {
        // Parse as CSV / Tab-Delimited (from Excel copy-paste or CSV file)
        const lines = inputText
          .trim()
          .split(/\r?\n/)
          .filter((line) => line.trim().length > 0);

        // Check if line 1 is a header row
        const firstLine = lines[0].toLowerCase();
        const hasHeader =
          firstLine.includes('category') ||
          firstLine.includes('topic') ||
          firstLine.includes('feature') ||
          firstLine.includes('sequence') ||
          firstLine.includes('difficulty') ||
          firstLine.includes('name');

        const dataLines = hasHeader ? lines.slice(1) : lines;

        items = dataLines.map((line, idx) => {
          // Parse CSV / TSV with regex to support quoted fields with commas
          const regex = /(?:,|\t|^)("(?:(?:"")*[^"]*)*"|[^,\t]*)/g;
          const cols: string[] = [];
          let match;
          while ((match = regex.exec(line)) !== null) {
            let val = match[1] || '';
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.slice(1, -1).replace(/""/g, '"');
            }
            cols.push(val.trim());
          }

          // Fallback simple split if regex produced 0 cols
          const cleanCols = cols.length > 0 ? cols : line.split(/[,\t]/).map((c) => c.trim());

          if (type === 'INTERVIEW') {
            return {
              category: cleanCols[0] || 'FRONTEND',
              name: cleanCols[1] || `Interview Topic ${idx + 1}`,
              priority: cleanCols[2] || 'HIGH',
              status: cleanCols[3] || 'LEARNING',
              confidence: parseInt(cleanCols[4], 10) || 3,
              phase: cleanCols[5] || 'PHASE_1',
              practicalTips: cleanCols[6] || '',
              keyQuestions: cleanCols[7] || '',
              notes: cleanCols[8] || '',
            };
          } else if (type === 'DSA') {
            return {
              number: parseInt(cleanCols[0], 10) || idx + 1,
              topic: cleanCols[1] || 'Array',
              title: cleanCols[2] || cleanCols[0] || `Problem ${idx + 1}`,
              difficulty: cleanCols[3] || 'Medium',
              problemUrl: cleanCols[4] || '',
            };
          } else {
            return {
              name: cleanCols[0] || `Feature ${idx + 1}`,
              category: cleanCols[1] || 'CORE',
              priority: cleanCols[2] || 'HIGH',
              description: cleanCols[3] || '',
              nextAction: cleanCols[4] || '',
            };
          }
        });
      }

      if (items.length === 0) {
        throw new Error('No valid records found in the input. Please check your data format.');
      }

      if (type === 'INTERVIEW') {
        await api.importInterviewTopics(items, replaceAll);
      } else if (type === 'DSA') {
        await api.importDsaQuestions(items, replaceAll);
      } else if (projectId) {
        await api.importProjectFeatures(projectId, items);
      }

      onImportSuccess();
      onClose();
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import data. Please check the format and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'INTERVIEW':
        return 'Import Interview Practice Topics (Excel / CSV)';
      case 'DSA':
        return 'Import DSA Questions (Excel / CSV)';
      case 'PROJECT':
        return 'Import Project Features (Excel / CSV)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">{getTitle()}</h2>
              <span className="text-[11px] font-mono text-slate-400">
                Upload .csv/.xlsx text or paste cells copied directly from Excel
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleImport} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* File Upload / Template Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-dark-950 border border-dark-800">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Excel/CSV File</span>
              </button>
              {fileName && (
                <span className="text-xs font-mono text-emerald-400 truncate max-w-[160px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {fileName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-300 hover:text-brand-300"
              title="Download pre-formatted Excel / CSV template"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Expected Columns Guide */}
          <div className="p-3 rounded-lg bg-dark-950 border border-dark-800 text-[11px] font-mono text-slate-400 space-y-1">
            <span className="text-brand-400 font-bold block">Expected Columns Format:</span>
            {type === 'INTERVIEW' ? (
              <code className="block break-words whitespace-normal text-slate-300">
                Category, Topic Name, Priority, Status, Confidence (1-5), Phase, Practical Tips, Key Questions, Notes
              </code>
            ) : type === 'DSA' ? (
              <code className="block break-words whitespace-normal text-slate-300">
                Sequence #, Topic, Problem Title, Difficulty, LeetCode URL
              </code>
            ) : (
              <code className="block break-words whitespace-normal text-slate-300">
                Feature Name, Category, Priority, Description, Next Action
              </code>
            )}
          </div>

          {/* Textarea Paste Area */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 font-bold flex justify-between">
              <span>Paste Excel Table Cells or CSV Text Below:</span>
              <span className="text-slate-500 font-normal font-sans text-[11px]">Supports Tab & Comma separated values</span>
            </label>
            <textarea
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                type === 'INTERVIEW'
                  ? "FRONTEND, React 18 Fiber & Optimization, CRITICAL, LEARNING, 3, PHASE_1, Colocate state, 1. How does Fiber batching work?\nBACKEND, Node.js Streams & Concurrency, CRITICAL, LEARNING, 3, PHASE_1, Never block event loop, 1. Libuv worker pool?"
                  : type === 'DSA'
                  ? "1, Array, Two Sum, Easy, https://leetcode.com/problems/two-sum/\n2, Array, Best Time to Buy Stock, Easy, ..."
                  : "Grievance Creation, CORE, HIGH, Creation form, Implement zod validation"
              }
              className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
            />
          </div>

          {/* Replace vs Append Mode Selection */}
          {(type === 'INTERVIEW' || type === 'DSA') && (
            <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <span className="text-xs font-mono text-slate-300 font-bold block">
                Import Mode (Add vs Remove Old):
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="radio"
                    name="importMode"
                    checked={!replaceAll}
                    onChange={() => setReplaceAll(false)}
                    className="w-4 h-4 text-brand-600 bg-dark-950 border-dark-700"
                  />
                  <span>
                    <strong className="text-emerald-400">Append & Merge:</strong> Add new practice topics to existing list
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="radio"
                    name="importMode"
                    checked={replaceAll}
                    onChange={() => setReplaceAll(true)}
                    className="w-4 h-4 text-rose-500 bg-dark-950 border-dark-700"
                  />
                  <span>
                    <strong className="text-rose-400">Replace & Overwrite:</strong> Remove all old topics and replace completely
                  </span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !inputText.trim()}
              className="btn-primary text-xs py-2 px-4 shadow-md shadow-brand-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Importing...' : 'Import Practice Topics'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
