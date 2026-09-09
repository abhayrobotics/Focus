import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Trophy,
  Trash2,
  Edit2,
  FileText,
  User,
  TrendingUp,
  Building2,
  DollarSign,
  HelpCircle,
  Check,
  X,
} from 'lucide-react';
import { JobApplication, InterviewRound, ApplicationStats, ApplicationStatus, RoundStatus } from '../types';
import { api } from '../services/api';
import { format } from 'date-fns';

interface ApplicationsScreenProps {
  onRefreshParent?: () => void;
}

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ onRefreshParent }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'APPLIED' | 'OFFER' | 'REJECTED'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  // Expanded rounds visibility state map
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});

  // Application Modal state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // Round Modal state
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [selectedAppForRound, setSelectedAppForRound] = useState<JobApplication | null>(null);
  const [editingRound, setEditingRound] = useState<InterviewRound | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getApplications();
      setApplications(res.applications);
      setStats(res.stats);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoundsExpand = (appId: string) => {
    setExpandedRounds((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  const handleDeleteApp = async (app: JobApplication) => {
    if (!window.confirm(`Are you sure you want to delete application for "${app.companyName} - ${app.role}"?`)) {
      return;
    }
    try {
      await api.deleteApplication(app.id);
      await loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const handleUpdateStatus = async (app: JobApplication, newStatus: ApplicationStatus) => {
    try {
      await api.updateApplication(app.id, { status: newStatus });
      await loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteRound = async (appId: string, roundId: string) => {
    if (!window.confirm('Delete this interview round?')) return;
    try {
      await api.deleteInterviewRound(appId, roundId);
      await loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      console.error('Error deleting round:', err);
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.rounds.some(
        (r) =>
          r.roundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.questionsAsked && r.questionsAsked.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (r.feedback && r.feedback.toLowerCase().includes(searchQuery.toLowerCase()))
      );

    if (!matchesSearch) return false;

    if (platformFilter !== 'ALL' && app.platform !== platformFilter) return false;

    if (statusFilter === 'ACTIVE') {
      return ['SHORTLISTED', 'OA_ROUND', 'TECH_ROUND_1', 'TECH_ROUND_2', 'MANAGERIAL_HR'].includes(app.status);
    }
    if (statusFilter === 'APPLIED') {
      return app.status === 'APPLIED';
    }
    if (statusFilter === 'OFFER') {
      return app.status === 'OFFER';
    }
    if (statusFilter === 'REJECTED') {
      return app.status === 'REJECTED' || app.status === 'GHOSTED';
    }

    return true;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'OFFER':
        return (
          <span className="badge bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
            <Trophy className="w-3 h-3 text-emerald-500" />
            <span>Offer Received 🎉</span>
          </span>
        );
      case 'SHORTLISTED':
      case 'OA_ROUND':
      case 'TECH_ROUND_1':
      case 'TECH_ROUND_2':
      case 'MANAGERIAL_HR':
        return (
          <span className="badge bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/40 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>{status.replace(/_/g, ' ')}</span>
          </span>
        );
      case 'APPLIED':
        return (
          <span className="badge bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Applied</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Rejected</span>
          </span>
        );
      case 'GHOSTED':
        return (
          <span className="badge bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>Ghosted</span>
          </span>
        );
      default:
        return <span className="badge badge-indigo">{status}</span>;
    }
  };

  const getRoundStatusBadge = (status: RoundStatus) => {
    switch (status) {
      case 'CLEARED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Cleared</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Scheduled</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Failed</span>
          </span>
        );
      case 'PENDING_FEEDBACK':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>Pending Feedback</span>
          </span>
        );
      default:
        return <span className="text-[10px] font-mono text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* 1. Header & Stats Strip */}
      <div className="panel p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo">PIPELINE & STAGES</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Applications &bull; Interview Rounds &bull; Feedback</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
              <Briefcase className="w-6 h-6 text-brand-500" />
              <span>Job & Interview Applications Pipeline</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/api/export/applications"
              download
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
              title="Download entire application pipeline as Excel-ready CSV"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={() => {
                setEditingApp(null);
                setIsAppModalOpen(true);
              }}
              className="btn-primary text-xs py-2 px-4 shadow-md shadow-brand-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span> Add Application</span>
            </button>
          </div>
        </div>

        {/* Top Analytics Metrics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-dark-800">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-dark-800 font-mono">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Applied</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.totalApplied} <span className="text-xs font-normal text-slate-400">Jobs</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-dark-800 font-mono">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Call / Response Rate</span>
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{stats.callRatePercent}%</span>
                <span className="text-[10px] text-slate-400 font-normal">({stats.shortlistedCount} called)</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-dark-800 font-mono">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Interviewing / In Rounds</span>
              <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
                ⚡ {stats.interviewingCount} <span className="text-xs font-normal text-slate-400">Active</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-dark-800 font-mono">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Offers Received</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                🏆 {stats.offerCount} <span className="text-xs font-normal text-slate-400">Offers</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Filters & Search Controls */}
      <div className="panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, role, DSA question asked, feedback..."
            className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'ALL', label: `All (${applications.length})` },
            { id: 'ACTIVE', label: `In Rounds (${stats?.interviewingCount || 0})` },
            { id: 'APPLIED', label: `Applied (${applications.filter((a) => a.status === 'APPLIED').length})` },
            { id: 'OFFER', label: `Offer (${stats?.offerCount || 0})` },
            { id: 'REJECTED', label: `Rejected / Ghosted` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`py-1.5 px-3 rounded-lg border text-[11px] transition-all ${statusFilter === tab.id
                ? 'btn-primary font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-dark-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Applications List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-slate-500">
          Loading job applications and interview stages...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="panel p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Applications Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No applications match your search query.'
              : 'You have not added any job applications yet. Click "+ Add Application" above to track your first job!'}
          </p>
          <button
            onClick={() => {
              setEditingApp(null);
              setIsAppModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span> Add First Application</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isRoundsExpanded = expandedRounds[app.id] ?? (app.rounds.length > 0 && app.status !== 'REJECTED');

            return (
              <div
                key={app.id}
                className="panel p-5 space-y-4 border border-slate-200 dark:border-dark-800 hover:border-brand-500/50 transition-all shadow-sm"
              >
                {/* Top Strip: Company, Role, Status, and Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-brand-500" />
                        <span>{app.companyName}</span>
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        &bull; {app.role}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Applied: {app.appliedDate}</span>
                      </span>

                      {app.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{app.location}</span>
                        </span>
                      )}

                      {app.salaryRange && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <DollarSign className="w-3 h-3" />
                          <span>{app.salaryRange}</span>
                        </span>
                      )}

                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-700">
                        {app.platform}
                      </span>

                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>Job Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Top Action Toolbar */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quick Stage Progression Dropdown */}
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlisted (Called)</option>
                        <option value="OA_ROUND">OA (Online Assessment)</option>
                        <option value="TECH_ROUND_1">Technical Round 1 (DSA)</option>
                        <option value="TECH_ROUND_2">Technical Round 2 (Design)</option>
                        <option value="MANAGERIAL_HR">Managerial / HR</option>
                        <option value="OFFER">🎉 Offer Received</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="GHOSTED">Ghosted</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAppForRound(app);
                        setEditingRound(null);
                        setIsRoundModalOpen(true);
                      }}
                      className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 hover:border-brand-500"
                      title="Add interview round or process stage"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-500" />
                      <span className="hidden sm:inline">+ Add Round</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingApp(app);
                        setIsAppModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 border border-slate-200 dark:border-dark-800 transition-colors"
                      title="Edit application details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteApp(app)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-dark-800 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional Notes / Contact Details */}
                {(app.notes || app.contactPerson || app.contactEmail) && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200 dark:border-dark-800/80 text-xs space-y-1">
                    {app.contactPerson && (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Recruiter / Contact: {app.contactPerson} {app.contactEmail ? `(${app.contactEmail})` : ''}</span>
                      </div>
                    )}
                    {app.notes && (
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                )}

                {/* Interview Rounds & Process Stages */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleRoundsExpand(app.id)}
                      className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-brand-500 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Interview Process & Rounds ({app.rounds.length})</span>
                      {isRoundsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {app.rounds.length === 0 && (
                      <button
                        onClick={() => {
                          setSelectedAppForRound(app);
                          setEditingRound(null);
                          setIsRoundModalOpen(true);
                        }}
                        className="text-[11px] font-mono text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Got called? Log screening / interview round</span>
                      </button>
                    )}
                  </div>

                  {isRoundsExpanded && (
                    <div className="space-y-2.5 pt-1 animate-fade-in">
                      {app.rounds.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950/40 border border-dashed border-slate-300 dark:border-dark-800 text-center text-xs font-mono text-slate-500">
                          No interview rounds logged yet. Click "+ Add Round" when the recruiter calls or sends an OA!
                        </div>
                      ) : (
                        app.rounds.map((round) => (
                          <div
                            key={round.id}
                            className="p-3.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 space-y-2 relative group hover:border-slate-300 dark:hover:border-dark-700 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400 font-mono text-xs font-bold flex items-center justify-center border border-brand-500/20">
                                  R{round.roundNumber}
                                </span>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {round.roundName}
                                </h3>
                                {getRoundStatusBadge(round.status)}
                              </div>

                              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {round.scheduledAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{format(new Date(round.scheduledAt), 'MMM d, yyyy h:mm a')}</span>
                                  </span>
                                )}

                                {round.interviewerName && (
                                  <span className="text-slate-400">
                                    &bull; {round.interviewerName}
                                  </span>
                                )}

                                <div className="flex items-center gap-1 pl-2">
                                  <button
                                    onClick={() => {
                                      setSelectedAppForRound(app);
                                      setEditingRound(round);
                                      setIsRoundModalOpen(true);
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800"
                                    title="Edit round notes & feedback"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRound(app.id, round.id)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    title="Delete round"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Questions Asked & Invariants */}
                            {round.questionsAsked && (
                              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800/60 text-xs space-y-1">
                                <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 uppercase font-bold block">
                                  💡 Technical & DSA Questions Asked
                                </span>
                                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                                  {round.questionsAsked}
                                </p>
                              </div>
                            )}

                            {/* Feedback & Learnings */}
                            {round.feedback && (
                              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase font-bold block">
                                  🎯 Self-Evaluation & Recruiter Feedback
                                </span>
                                <p className="text-amber-900 dark:text-amber-200 whitespace-pre-wrap leading-relaxed">
                                  {round.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add / Edit Application Modal */}
      {isAppModalOpen && (
        <ApplicationModal
          isOpen={isAppModalOpen}
          onClose={() => {
            setIsAppModalOpen(false);
            setEditingApp(null);
          }}
          initialData={editingApp}
          onSaved={() => {
            loadData();
            if (onRefreshParent) onRefreshParent();
          }}
        />
      )}

      {/* 5. Add / Edit Interview Round Modal */}
      {isRoundModalOpen && selectedAppForRound && (
        <RoundModal
          isOpen={isRoundModalOpen}
          onClose={() => {
            setIsRoundModalOpen(false);
            setSelectedAppForRound(null);
            setEditingRound(null);
          }}
          application={selectedAppForRound}
          initialData={editingRound}
          onSaved={() => {
            loadData();
            if (onRefreshParent) onRefreshParent();
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// MODAL 1: ADD / EDIT JOB APPLICATION
// ==========================================
interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JobApplication | null;
  onSaved: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, initialData, onSaved }) => {
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [role, setRole] = useState(initialData?.role || 'Full Stack Engineer');
  const [location, setLocation] = useState(initialData?.location || 'Remote');
  const [salaryRange, setSalaryRange] = useState(initialData?.salaryRange || '');
  const [platform, setPlatform] = useState(initialData?.platform || 'LINKEDIN');
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || '');
  const [appliedDate, setAppliedDate] = useState(initialData?.appliedDate || format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState<ApplicationStatus>(initialData?.status || 'APPLIED');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    try {
      setIsSubmitting(true);
      if (initialData) {
        await api.updateApplication(initialData.id, {
          companyName: companyName.trim(),
          role: role.trim(),
          location: location.trim(),
          salaryRange: salaryRange.trim() || undefined,
          platform,
          jobUrl: jobUrl.trim() || undefined,
          appliedDate,
          status,
          contactPerson: contactPerson.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await api.createApplication({
          companyName: companyName.trim(),
          role: role.trim(),
          location: location.trim(),
          salaryRange: salaryRange.trim() || undefined,
          platform,
          jobUrl: jobUrl.trim() || undefined,
          appliedDate,
          status,
          contactPerson: contactPerson.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error saving application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-5 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 flex items-center justify-center font-bold text-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {initialData ? 'Edit Job Application' : 'Log New Job Application'}
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Track companies, stages, and recruiter contacts
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Atlassian, Razorpay, Google"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Target Role *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Full Stack Engineer (SDE 2)"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Platform / Source</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="INSTAHYRE">Instahyre</option>
                <option value="NAUKRI">Naukri</option>
                <option value="REFERRAL">Referral</option>
                <option value="DIRECT">Company Website</option>
                <option value="WELLFOUND">Wellfound / AngelList</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Remote / Bangalore"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Applied Date</label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Current Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="APPLIED">Applied (Pending Review)</option>
                <option value="SHORTLISTED">Shortlisted / Recruiter Called</option>
                <option value="OA_ROUND">Online Assessment (OA)</option>
                <option value="TECH_ROUND_1">Technical Round 1 (DSA / Live Coding)</option>
                <option value="TECH_ROUND_2">Technical Round 2 (System Design)</option>
                <option value="MANAGERIAL_HR">Managerial / Culture / HR</option>
                <option value="OFFER">🎉 Offer Received</option>
                <option value="REJECTED">Rejected</option>
                <option value="GHOSTED">Ghosted</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Target CTC / Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g., ₹22-30 LPA or $140k"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-500 uppercase font-semibold">Job Posting URL (Optional)</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://linkedin.com/jobs/view/..."
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Recruiter / Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g., Sarah Jenkins (Lead Recruiter)"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Recruiter Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-500 uppercase font-semibold">Application Notes & Context</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referred by batchmate, applied with Fullstack Grievance resume V3..."
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-dark-800 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// MODAL 2: ADD / EDIT INTERVIEW ROUND
// ==========================================
interface RoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication;
  initialData?: InterviewRound | null;
  onSaved: () => void;
}

const RoundModal: React.FC<RoundModalProps> = ({ isOpen, onClose, application, initialData, onSaved }) => {
  const [roundNumber, setRoundNumber] = useState<number>(initialData?.roundNumber || application.rounds.length + 1);
  const [roundName, setRoundName] = useState(initialData?.roundName || 'Technical Round 1 (DSA)');
  const [status, setStatus] = useState<RoundStatus>(initialData?.status || 'SCHEDULED');
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? format(new Date(initialData.scheduledAt), "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [interviewerName, setInterviewerName] = useState(initialData?.interviewerName || '');
  const [questionsAsked, setQuestionsAsked] = useState(initialData?.questionsAsked || '');
  const [feedback, setFeedback] = useState(initialData?.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickRoundPresets = [
    'Initial Recruiter Screening',
    'Online Assessment (OA)',
    'Technical Round 1 (DSA & Problem Solving)',
    'Technical Round 2 (System Design / Architecture)',
    'Managerial & Behavioral Round',
    'HR & Compensation Discussion',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName.trim()) return;

    try {
      setIsSubmitting(true);
      if (initialData) {
        await api.updateInterviewRound(application.id, initialData.id, {
          roundNumber,
          roundName: roundName.trim(),
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
          interviewerName: interviewerName.trim() || undefined,
          questionsAsked: questionsAsked.trim() || undefined,
          feedback: feedback.trim() || undefined,
        });
      } else {
        await api.addInterviewRound(application.id, {
          roundNumber,
          roundName: roundName.trim(),
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
          interviewerName: interviewerName.trim() || undefined,
          questionsAsked: questionsAsked.trim() || undefined,
          feedback: feedback.trim() || undefined,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error saving round:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-dark-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-5 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {initialData ? `Edit Round ${initialData.roundNumber}` : `Add Interview Round — ${application.companyName}`}
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Log questions asked, feedback notes, and track stage outcomes
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Quick Round Presets */}
          <div className="space-y-1.5">
            <label className="font-mono text-slate-500 uppercase font-semibold">Quick Stage Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {quickRoundPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setRoundName(preset)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition-all ${roundName === preset
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-50 dark:bg-dark-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-800 hover:border-slate-300'
                    }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Round #</label>
              <input
                type="number"
                min={1}
                value={roundNumber}
                onChange={(e) => setRoundNumber(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-mono text-slate-500 uppercase font-semibold">Round Name *</label>
              <input
                type="text"
                required
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                placeholder="e.g., Technical Round 1 (DSA)"
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Round Outcome / Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoundStatus)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              >
                <option value="SCHEDULED">Scheduled / Upcoming</option>
                <option value="CLEARED">✅ Cleared (Advancing)</option>
                <option value="FAILED">❌ Rejected / Failed</option>
                <option value="PENDING_FEEDBACK">⏳ Awaiting Decision</option>
                <option value="SKIPPED">Skipped / Waived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-500 uppercase font-semibold">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-500 uppercase font-semibold">Interviewer Name & Designation</label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder="e.g., Alex Kumar (Staff Engineer / Bar Raiser)"
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-500 uppercase font-semibold">
              Technical & DSA Questions Asked
            </label>
            <textarea
              rows={3}
              value={questionsAsked}
              onChange={(e) => setQuestionsAsked(e.target.value)}
              placeholder="e.g., LC 3 Longest Substring with non-repeating chars, Design Rate Limiter with Redis sliding window..."
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-xs resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-slate-500 uppercase font-semibold">
              Self-Evaluation & Feedback Notes
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explained time complexity clearly O(N), hesitated on edge case empty string, good cultural resonance..."
              className="w-full bg-slate-50 dark:bg-dark-950 border border-slate-300 dark:border-dark-800 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 text-xs resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-dark-800 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Save Round' : 'Add Round'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
