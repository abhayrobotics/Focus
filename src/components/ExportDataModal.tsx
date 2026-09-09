import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  Code2,
  Clock,
  Sparkles,
  FolderGit2,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({ isOpen, onClose }) => {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (
    type: 'full-backup' | 'dsa' | 'sessions' | 'reviews' | 'projects' | 'interview' | 'applications',
    label: string
  ) => {
    try {
      setDownloadingType(type);
      setDownloadSuccess(null);

      // Trigger direct browser download
      const downloadUrl = `/api/export/${type}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(`Downloaded ${label} successfully!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="panel max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 bg-dark-900 border border-dark-750 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Export & Download Database (CSV)</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Cleanly formatted RFC 4180 CSV exports for Excel, Sheets, Notion & Backups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* 1. Full Database Backup Option (Prominent Banner) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-dark-850 to-dark-850 border border-emerald-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald text-[10px]">ALL-IN-ONE BUNDLE</span>
                <span className="text-xs font-bold text-white">Complete CareerOS Full Backup</span>
              </div>
              <p className="text-xs text-slate-300">
                Exports all 7 modules: DSA Questions, Session Logs, Reflections, Projects, Interview Prep, Job Applications Pipeline & Rounds, and Parked Ideas.
              </p>
            </div>

            <button
              onClick={() => handleDownload('full-backup', 'Full Database Backup')}
              disabled={downloadingType === 'full-backup'}
              className="btn-primary py-2 px-4 text-xs font-bold shrink-0 shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingType === 'full-backup' ? 'Exporting...' : 'Download Full CSV'}</span>
            </button>
          </div>
        </div>

        {/* 2. Individual Module Export Grid */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Individual Module CSV Downloads
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Job Applications & Interview Rounds */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-blue-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">Job Applications Pipeline</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Companies applied, stages, interview round questions, feedback notes, salary, and platform sources.
                </p>
              </div>

              <button
                onClick={() => handleDownload('applications', 'Job Applications CSV')}
                disabled={downloadingType === 'applications'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-blue-300 hover:border-blue-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Applications CSV</span>
              </button>
            </div>

            {/* DSA Notes */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white">DSA Questions & Notes</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  80 sequence questions, approach patterns, mistake notes, complexities, and solution code.
                </p>
              </div>

              <button
                onClick={() => handleDownload('dsa', 'DSA Questions CSV')}
                disabled={downloadingType === 'dsa'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-indigo-300 hover:border-indigo-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DSA CSV</span>
              </button>
            </div>

            {/* Work Sessions */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-brand-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <h4 className="text-xs font-bold text-white">Logged Work Sessions</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Every work log with exact duration, category, date, task titles, and notes.
                </p>
              </div>

              <button
                onClick={() => handleDownload('sessions', 'Work Sessions CSV')}
                disabled={downloadingType === 'sessions'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-brand-300 hover:border-brand-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Sessions CSV</span>
              </button>
            </div>

            {/* Daily Reflections */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">Daily Growth Reflections</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  2-minute check-ins, invariant lessons, mistake traps, and energy/focus logs.
                </p>
              </div>

              <button
                onClick={() => handleDownload('reviews', 'Daily Reflections CSV')}
                disabled={downloadingType === 'reviews'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-amber-300 hover:border-amber-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Reflections CSV</span>
              </button>
            </div>

            {/* Project Modules */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Project Feature Trees</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Enterprise features, MVP status, priority tags, next action items, and technical notes.
                </p>
              </div>

              <button
                onClick={() => handleDownload('projects', 'Project Features CSV')}
                disabled={downloadingType === 'projects'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-emerald-300 hover:border-emerald-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Projects CSV</span>
              </button>
            </div>

            {/* Interview Prep */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 hover:border-purple-500/40 transition-colors flex flex-col justify-between gap-3 font-mono">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">Interview Practice Topics</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Category topics, key questions, confidence scores, practical invariants, and study notes.
                </p>
              </div>

              <button
                onClick={() => handleDownload('interview' as any, 'Interview Topics CSV')}
                disabled={downloadingType === 'interview'}
                className="btn-secondary py-1.5 px-3 text-xs w-full justify-center text-purple-300 hover:border-purple-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Interview CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct SQLite Export &bull; RFC 4180 Compliant</span>
          </span>
          <button onClick={onClose} className="hover:text-slate-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

