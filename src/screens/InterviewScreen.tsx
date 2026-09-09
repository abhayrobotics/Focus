import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Server,
  Terminal,
  Cpu,
  Database,
  ShieldCheck,
  Globe,
  HardDrive,
  Network,
  Zap,
  FileCode,
  Search,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { InterviewTopic } from '../types';
import { api } from '../services/api';
import { DEFAULT_INTERVIEW_TOPICS } from '../data/interviewCatalog';
import { TopicDetailModal } from '../components/TopicDetailModal';
import { ImportModal } from '../components/ImportModal';

interface InterviewScreenProps {
  onOpenLogger: (category?: 'INTERVIEW', taskTitle?: string) => void;
}

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  JAVASCRIPT: { label: 'JavaScript', icon: FileCode, color: 'text-amber-400' },
  TYPESCRIPT: { label: 'TypeScript', icon: Code2, color: 'text-blue-400' },
  REACT: { label: 'React', icon: Zap, color: 'text-cyan-400' },
  NODEJS: { label: 'Node.js', icon: Server, color: 'text-emerald-400' },
  EXPRESS: { label: 'Express.js', icon: Network, color: 'text-indigo-400' },
  POSTGRESQL: { label: 'PostgreSQL / SQL', icon: Database, color: 'text-sky-400' },
  PRISMA: { label: 'Prisma', icon: Layers, color: 'text-teal-400' },
  MONGODB: { label: 'MongoDB', icon: HardDrive, color: 'text-green-500' },
  AUTH_SECURITY: { label: 'Authentication & Security', icon: ShieldCheck, color: 'text-rose-400' },
  CS_FUNDAMENTALS: { label: 'Web / CS Fundamentals', icon: Globe, color: 'text-purple-400' },
};

export const computeCatalogData = (topics: InterviewTopic[]) => {
  const interviewReadyTotal = topics.filter((t) => t.status === 'INTERVIEW_READY').length;
  const practicedTotal = topics.filter((t) => t.status === 'PRACTICED').length;
  const learningTotal = topics.filter((t) => t.status === 'LEARNING').length;
  const notStartedTotal = topics.filter((t) => t.status === 'NOT_STARTED').length;
  const total = topics.length;

  // Track combined practiced & ready for progress percentage
  const readyTotal = interviewReadyTotal + practicedTotal;
  const overallPercent = total > 0 ? Math.round((readyTotal / total) * 100) : 0;
  const avgConfidence =
    total > 0
      ? (topics.reduce((acc, t) => acc + (Number(t.confidence) || 0), 0) / total).toFixed(1)
      : '0.0';

  const categories = [
    'JAVASCRIPT',
    'TYPESCRIPT',
    'REACT',
    'NODEJS',
    'EXPRESS',
    'POSTGRESQL',
    'PRISMA',
    'MONGODB',
    'AUTH_SECURITY',
    'CS_FUNDAMENTALS',
  ];

  const categoryBreakdown = categories.map((cat) => {
    const catTopics = topics.filter((t) => t.category === cat);
    const catInterviewReady = catTopics.filter((t) => t.status === 'INTERVIEW_READY').length;
    const catPracticed = catTopics.filter((t) => t.status === 'PRACTICED').length;
    const catReady = catInterviewReady + catPracticed;
    const catTotal = catTopics.length;
    const catPercent = catTotal > 0 ? Math.round((catReady / catTotal) * 100) : 0;
    const catAvg =
      catTotal > 0
        ? (catTopics.reduce((acc, t) => acc + (Number(t.confidence) || 0), 0) / catTotal).toFixed(1)
        : '0.0';
    return {
      category: cat,
      label: CATEGORY_META[cat]?.label || cat,
      total: catTotal,
      ready: catReady,
      interviewReadyCount: catInterviewReady,
      practicedCount: catPracticed,
      percent: catPercent,
      avgConfidence: catAvg,
      topics: catTopics,
    };
  });

  const weakTopics = topics
    .filter((t) => (Number(t.confidence) || 0) <= 3)
    .sort((a, b) => (Number(a.confidence) || 0) - (Number(b.confidence) || 0));

  return {
    overview: {
      total,
      readyTotal,
      interviewReadyTotal,
      practicedTotal,
      learningTotal,
      notStartedTotal,
      overallPercent,
      avgConfidence,
    },
    categoryBreakdown,
    weakTopics,
    allTopics: topics,
  };
};

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ onOpenLogger }) => {
  const [data, setData] = useState<any>(() => computeCatalogData(DEFAULT_INTERVIEW_TOPICS));
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Topic Form State
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<string>('JAVASCRIPT');
  const [newTopicPriority, setNewTopicPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newTopicConfidence, setNewTopicConfidence] = useState<number>(3);
  const [newTopicTips, setNewTopicTips] = useState('');
  const [newTopicQuestions, setNewTopicQuestions] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadInterviewTopics();
  }, []);

  const loadInterviewTopics = async () => {
    try {
      const res = await api.getInterviewTopics();
      if (res && res.allTopics && res.allTopics.length > 0) {
        setData(res);
      } else {
        // If empty on backend, use default catalog and trigger sync
        setData(computeCatalogData(DEFAULT_INTERVIEW_TOPICS));
        fetch('/api/interview/sync-default', { method: 'POST' }).catch(() => {});
      }
    } catch (err) {
      console.error('Error loading interview topics from backend, using fallback:', err);
      setData(computeCatalogData(DEFAULT_INTERVIEW_TOPICS));
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDefaults = async () => {
    if (
      window.confirm(
        'Synchronize the complete 170-topic curated checklist across all 10 categories (JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Prisma, MongoDB, Auth & Security, Web/CS)?'
      )
    ) {
      try {
        setIsSyncing(true);
        const res = await fetch('/api/interview/sync-default', { method: 'POST' });
        if (res.ok) {
          await loadInterviewTopics();
        }
      } catch (err) {
        console.error('Error syncing topics:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    try {
      setIsCreating(true);
      await api.addInterviewTopic({
        name: newTopicName.trim(),
        category: newTopicCategory as any,
        priority: newTopicPriority,
        confidence: newTopicConfidence,
        phase: newTopicCategory === 'CS_FUNDAMENTALS' ? 'PHASE_2' : 'PHASE_1',
        practicalTips: newTopicTips.trim(),
        keyQuestions: newTopicQuestions.trim(),
        notes: newTopicNotes.trim(),
        status: 'LEARNING',
      });

      // Reset form
      setNewTopicName('');
      setNewTopicTips('');
      setNewTopicQuestions('');
      setNewTopicNotes('');
      setIsAddOpen(false);

      await loadInterviewTopics();
    } catch (err) {
      console.error('Error creating topic:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTopicStatus = async (topic: InterviewTopic, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextConfidence = newStatus === 'INTERVIEW_READY' && topic.confidence < 4 ? 5 : topic.confidence;
    
    // Optimistic local state update
    setData((prev: any) => {
      if (!prev || !prev.allTopics) return prev;
      const updatedTopics = prev.allTopics.map((t: InterviewTopic) =>
        t.id === topic.id ? { ...t, status: newStatus as any, confidence: nextConfidence } : t
      );
      return computeCatalogData(updatedTopics);
    });

    try {
      await api.updateInterviewTopic(topic.id, {
        status: newStatus as any,
        confidence: nextConfidence,
      });
    } catch (err) {
      console.error('Error updating status on server:', err);
    }
  };

  const handleQuickConfidence = async (topic: InterviewTopic, newConf: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let nextStatus = topic.status;
    if (newConf === 5) {
      nextStatus = 'INTERVIEW_READY';
    } else if (newConf >= 4 && topic.status === 'LEARNING') {
      nextStatus = 'PRACTICED';
    } else if (newConf <= 2 && topic.status === 'INTERVIEW_READY') {
      nextStatus = 'PRACTICED';
    }

    // Optimistic local state update
    setData((prev: any) => {
      if (!prev || !prev.allTopics) return prev;
      const updatedTopics = prev.allTopics.map((t: InterviewTopic) =>
        t.id === topic.id ? { ...t, confidence: newConf, status: nextStatus as any } : t
      );
      return computeCatalogData(updatedTopics);
    });

    try {
      await api.updateInterviewTopic(topic.id, {
        confidence: newConf,
        status: nextStatus as any,
      });
    } catch (err) {
      console.error('Error updating confidence on server:', err);
    }
  };

  const handleDeleteTopic = async (topic: InterviewTopic, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete practice topic "${topic.name}"?`)) {
      try {
        await api.deleteInterviewTopic(topic.id);
        await loadInterviewTopics();
      } catch (err) {
        console.error('Error deleting topic:', err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INTERVIEW_READY':
        return 'badge-emerald';
      case 'PRACTICED':
        return 'badge-indigo';
      case 'LEARNING':
        return 'badge-amber';
      default:
        return 'badge-slate';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'badge-rose font-bold';
      case 'HIGH':
        return 'badge-amber';
      case 'MEDIUM':
        return 'badge-indigo';
      case 'LOW':
        return 'badge-emerald';
      default:
        return 'badge-slate';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return '🔴';
      case 'HIGH':
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        Loading interview preparation curriculum...
      </div>
    );
  }

  const { overview, categoryBreakdown = [], weakTopics = [], allTopics = [] } = data;

  // Filtered categories and topics
  const displayedCategoryGroups = categoryBreakdown.filter((group: any) => {
    if (selectedCategoryTab === 'ALL') return true;
    return group.category === selectedCategoryTab;
  });

  return (
    <div className="p-3 sm:p-5 md:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6 w-full">
      {/* 1. Header Overview Bar */}
      <div className="panel p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge badge-indigo text-[10px] font-bold">INTERVIEW MASTERY CURRICULUM</span>
              <span className="badge badge-emerald text-[10px] font-mono font-bold">
                {overview.total || allTopics.length} Curated Topics
              </span>
              <span className="badge badge-slate text-[10px] font-mono">
                10 Core Categories
              </span>
              <span className="badge badge-emerald text-[10px] font-mono font-bold">
                🏆 {overview.interviewReadyTotal || 0} Ready
              </span>
              <span className="badge badge-indigo text-[10px] font-mono font-bold">
                🟢 {overview.practicedTotal || 0} Practiced
              </span>
              <span className="badge badge-amber text-[10px] font-mono font-bold">
                🟡 {overview.learningTotal || 0} Learning
              </span>
              <span className="badge badge-slate text-[10px] font-mono font-bold">
                ⚪ {overview.notStartedTotal || (overview.total - (overview.readyTotal || 0))} Not Started
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2 flex-wrap break-words">
              <span>Interview Preparation Hub</span>
              <span className="text-amber-400 text-base sm:text-lg md:text-xl font-mono">
                ({overview.avgConfidence} / 5.0 Avg Score)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed break-words">
              Structured active recall checklists across JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Prisma, MongoDB, Auth & Security, and Web/CS Fundamentals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setIsAddOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-white"
              title="Add a custom topic"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>Add Topic</span>
            </button>
            <button
              onClick={handleSyncDefaults}
              disabled={isSyncing}
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-amber-300 hover:border-amber-500/40"
              title="Reset & synchronize full 170-topic standard checklist"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync 170 Checklist'}</span>
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-brand-300 hover:border-brand-500/40"
              title="Import practice topics from Excel / CSV file"
            >
              <Upload className="w-3.5 h-3.5 text-brand-400" />
              <span>Import CSV</span>
            </button>
            <a
              href="/api/export/interview"
              download
              className="btn-secondary text-xs flex items-center gap-1.5 hover:text-emerald-300 hover:border-emerald-500/40"
              title="Download all interview practice topics as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={() => onOpenLogger('INTERVIEW', 'Interview active recall revision')}
              className="btn-primary text-xs py-2 px-3 shadow-md shadow-brand-600/20"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Overall Readiness (Covered & Practiced Topics)</span>
            <span className="text-emerald-400 font-bold">
              {overview.readyTotal || 0} / {overview.total || allTopics.length} Covered ({overview.overallPercent || 0}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-dark-950 overflow-hidden border border-dark-800">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, overview.overallPercent || 0))}%` }}
            />
          </div>
        </div>

        {/* Priority Weakness Alert Banner */}
        {weakTopics.length > 0 && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Focus Areas ({weakTopics.length} Topics with Score ≤ 3/5)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">High yield for upcoming technical interviews</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto">
              {weakTopics.slice(0, 15).map((wt: InterviewTopic) => (
                <button
                  key={wt.id}
                  onClick={() => {
                    setSelectedTopic(wt);
                    setIsDetailOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-dark-850 border border-amber-500/30 text-xs text-slate-200 flex items-center gap-1.5 transition-all font-mono hover:scale-102 max-w-full break-words text-left"
                >
                  <span className="text-[10px] font-bold text-amber-400">{getPriorityDot(wt.priority)}</span>
                  <span className="break-words">{wt.name.split('(')[0].trim()}</span>
                  <span className="text-amber-400 font-bold shrink-0">({wt.confidence}/5)</span>
                </button>
              ))}
              {weakTopics.length > 15 && (
                <span className="text-[11px] font-mono text-slate-500 self-center">
                  +{weakTopics.length - 15} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-dark-900 border border-dark-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategoryTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap ${
            selectedCategoryTab === 'ALL'
              ? 'btn-primary shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
          }`}
        >
          All Topics ({overview.total || allTopics.length})
        </button>

        {categoryBreakdown.map((cat: any) => {
          const meta = CATEGORY_META[cat.category] || {
            label: cat.label || cat.category,
            icon: Layers,
            color: 'text-slate-400',
          };
          const Icon = meta.icon;
          const isSelected = selectedCategoryTab === cat.category;

          return (
            <button
              key={cat.category}
              onClick={() => setSelectedCategoryTab(cat.category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'btn-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : meta.color}`} />
              <span>{meta.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-dark-800 text-slate-400'
                }`}
              >
                {cat.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-dark-900/90 border border-dark-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, keywords..."
            className="w-full bg-dark-950 border border-dark-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="INTERVIEW_READY">🏆 Interview Ready</option>
            <option value="PRACTICED">🟢 Practiced</option>
            <option value="LEARNING">🟡 Learning</option>
            <option value="NOT_STARTED">⚪ Not Started</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-dark-950 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Priority</option>
            <option value="HIGH">🟡 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Low Priority</option>
          </select>
        </div>
      </div>

      {/* 4. Categorized Checklists & Grids */}
      <div className="space-y-6">
        {displayedCategoryGroups.map((catGroup: any) => {
          const meta = CATEGORY_META[catGroup.category] || {
            label: catGroup.label || catGroup.category,
            icon: Layers,
            color: 'text-brand-400',
          };
          const Icon = meta.icon;

          // Apply search and status filters to topics
          const filteredTopics = (catGroup.topics || []).filter((t: InterviewTopic) => {
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              const matchName = t.name.toLowerCase().includes(query);
              const matchNotes = t.notes?.toLowerCase().includes(query);
              const matchQuestions = t.keyQuestions?.toLowerCase().includes(query);
              if (!matchName && !matchNotes && !matchQuestions) return false;
            }

            if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
            if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

            return true;
          });

          if (filteredTopics.length === 0 && (searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL')) {
            return null;
          }

          return (
            <div key={catGroup.category} className="panel p-4 sm:p-5 space-y-4 border border-dark-800">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-dark-800/80 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-dark-950 border border-dark-800 shrink-0">
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{meta.label}</span>
                      <span className="text-xs font-mono text-slate-400 font-normal">
                        ({catGroup.ready}/{catGroup.total} Covered)
                      </span>
                    </h2>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Avg Score: <strong className="text-amber-400">{catGroup.avgConfidence}/5.0</strong> •{' '}
                      {catGroup.percent}% Ready & Practiced (🏆 {catGroup.interviewReadyCount || 0} Ready • 🟢 {catGroup.practicedCount || 0} Practiced)
                    </span>
                  </div>
                </div>

                {/* Mini Category Progress Bar */}
                <div className="w-full sm:w-48 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Category Readiness</span>
                    <span className="text-emerald-400 font-bold">{catGroup.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-950 overflow-hidden border border-dark-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${catGroup.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Grid / Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredTopics.map((t: InterviewTopic, idx: number) => {
                  const isCompleted = t.status === 'INTERVIEW_READY';

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTopic(t);
                        setIsDetailOpen(true);
                      }}
                      className="panel-card cursor-pointer group hover:border-brand-500/60 transition-all flex flex-col justify-between p-3.5 sm:p-4 min-w-0 space-y-3 relative"
                    >
                      <div className="space-y-2.5 min-w-0">
                        {/* Header: Priority & Status Badges + Stars */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-mono font-bold text-slate-500 mr-1">
                              #{idx + 1}
                            </span>
                            <span className={`badge ${getPriorityBadge(t.priority)} text-[10px]`}>
                              {getPriorityDot(t.priority)} {t.priority}
                            </span>
                            <span className={`badge ${getStatusBadge(t.status)} text-[10px]`}>
                              {t.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          {/* 1-5 Star Interactive Rating */}
                          <div
                            className="flex items-center gap-0.5 shrink-0"
                            title="Click star to update confidence directly"
                          >
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={(e) => handleQuickConfidence(t, s, e)}
                                className="p-0.5 hover:scale-125 transition-transform"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    t.confidence >= s ? 'text-amber-400 fill-current' : 'text-dark-700 hover:text-amber-400/50'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Title & Notes */}
                        <div className="min-w-0 space-y-1">
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-400 transition-colors break-words flex items-baseline gap-1.5">
                            <span className="break-words">{t.name}</span>
                          </h3>
                          {t.notes && (
                            <p className="text-xs text-slate-400 leading-relaxed break-words line-clamp-2">
                              {t.notes}
                            </p>
                          )}
                        </div>

                        {/* Practical Tip Callout Snippet */}
                        {t.practicalTips && (
                          <div className="p-2 sm:p-2.5 rounded-lg bg-dark-950 border border-dark-800/80 text-[11px] font-mono text-emerald-400 break-words leading-relaxed line-clamp-2">
                            <span className="text-slate-500 font-bold mr-1">Tip:</span>
                            {t.practicalTips}
                          </div>
                        )}
                      </div>

                      {/* Footer: Quick Status Switcher + Action Buttons */}
                      <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between gap-2 flex-wrap">
                        {/* Quick Status Toggle Button */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) =>
                              handleUpdateTopicStatus(
                                t,
                                t.status === 'INTERVIEW_READY'
                                  ? 'LEARNING'
                                  : t.status === 'PRACTICED'
                                  ? 'INTERVIEW_READY'
                                  : 'PRACTICED',
                                e
                              )
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-dark-950 text-slate-400 border border-dark-800 hover:text-white hover:border-dark-700'
                            }`}
                            title="Click to cycle status"
                          >
                            {isCompleted ? '✓ READY' : 'MARK READY'}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTopic(t, e)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLogger('INTERVIEW', `Interview Prep: ${t.name}`);
                            }}
                            className="btn-secondary py-1 px-2.5 text-[11px]"
                          >
                            Log Time
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Add Topic Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-4 animate-scale-in">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Add Interview Practice Topic</h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Topic Name *</label>
                <input
                  type="text"
                  required
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g. JavaScript Event Loop & Microtasks"
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <select
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  >
                    <option value="JAVASCRIPT">JavaScript</option>
                    <option value="TYPESCRIPT">TypeScript</option>
                    <option value="REACT">React</option>
                    <option value="NODEJS">Node.js</option>
                    <option value="EXPRESS">Express.js</option>
                    <option value="POSTGRESQL">PostgreSQL / SQL</option>
                    <option value="PRISMA">Prisma</option>
                    <option value="MONGODB">MongoDB</option>
                    <option value="AUTH_SECURITY">Authentication & Security</option>
                    <option value="CS_FUNDAMENTALS">Web / CS Fundamentals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTopicPriority}
                    onChange={(e) => setNewTopicPriority(e.target.value as any)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                  >
                    <option value="CRITICAL">🔴 CRITICAL</option>
                    <option value="HIGH">🟡 HIGH</option>
                    <option value="MEDIUM">🟡 MEDIUM</option>
                    <option value="LOW">🟢 LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Practical Tip</label>
                <input
                  type="text"
                  value={newTopicTips}
                  onChange={(e) => setNewTopicTips(e.target.value)}
                  placeholder="Key mental model or trap to remember"
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Key Interview Questions</label>
                <textarea
                  rows={2}
                  value={newTopicQuestions}
                  onChange={(e) => setNewTopicQuestions(e.target.value)}
                  placeholder="1. Question 1...&#10;2. Question 2..."
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary text-xs"
                >
                  {isCreating ? 'Adding...' : 'Add Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Detail Active Recall Modal */}
      <TopicDetailModal
        topic={selectedTopic}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTopic(null);
        }}
        onUpdated={loadInterviewTopics}
        onLogSession={(taskTitle) => onOpenLogger('INTERVIEW', taskTitle)}
      />

      {/* 7. Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        type="INTERVIEW"
        onImportSuccess={loadInterviewTopics}
      />
    </div>
  );
};
