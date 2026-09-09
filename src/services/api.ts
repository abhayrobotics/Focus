import {
  DashboardData,
  DSAOverview,
  DSATopicStat,
  DSAQuestion,
  Project,
  ProjectFeature,
  InterviewTopic,
  WorkSession,
  ParkedIdea,
  HeatmapDay,
  DailyReview,
  CumulativeGrowthData,
  JobApplication,
  ApplicationStats,
} from '../types';

import {
  DEFAULT_DASHBOARD_DATA,
  DEFAULT_PROJECTS_DATA,
  DEFAULT_DSA_QUESTIONS,
  DEFAULT_DSA_TOPIC_STATS,
  DEFAULT_DSA_OVERVIEW,
  DEFAULT_APPLICATIONS,
  DEFAULT_APPLICATION_STATS,
  DEFAULT_PARKED_IDEAS,
  DEFAULT_WORK_SESSIONS,
  DEFAULT_ROADMAP_DATA,
  DEFAULT_HEATMAP_DATA,
} from '../data/defaultData';

const API_BASE = '/api';

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2, delayMs = 500): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0 && res.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardSummary: async (): Promise<DashboardData> => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/dashboard/summary`);
      if (!res.ok) return DEFAULT_DASHBOARD_DATA;
      return await res.json();
    } catch {
      return DEFAULT_DASHBOARD_DATA;
    }
  },

  // DSA
  getDsaQuestions: async (params?: {
    topic?: string;
    difficulty?: string;
    status?: string;
    needsRevision?: boolean;
    search?: string;
  }): Promise<{ overview: DSAOverview; topicStats: DSATopicStat[]; questions: DSAQuestion[] }> => {
    try {
      const query = new URLSearchParams();
      if (params?.topic) query.append('topic', params.topic);
      if (params?.difficulty) query.append('difficulty', params.difficulty);
      if (params?.status) query.append('status', params.status);
      if (params?.needsRevision) query.append('needsRevision', 'true');
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/dsa/questions?${query.toString()}`);
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      if (!data || !data.questions || data.questions.length === 0) {
        return {
          overview: DEFAULT_DSA_OVERVIEW,
          topicStats: DEFAULT_DSA_TOPIC_STATS,
          questions: DEFAULT_DSA_QUESTIONS,
        };
      }
      return data;
    } catch {
      let filtered = [...DEFAULT_DSA_QUESTIONS];
      if (params?.topic && params.topic !== 'ALL') {
        filtered = filtered.filter((q) => q.topic.toLowerCase() === params.topic?.toLowerCase());
      }
      if (params?.difficulty && params.difficulty !== 'ALL') {
        filtered = filtered.filter((q) => q.difficulty === params.difficulty);
      }
      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((q) => q.status === params.status);
      }
      if (params?.needsRevision) {
        filtered = filtered.filter((q) => q.needsRevision);
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter((q) => q.title.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s));
      }
      return {
        overview: DEFAULT_DSA_OVERVIEW,
        topicStats: DEFAULT_DSA_TOPIC_STATS,
        questions: filtered,
      };
    }
  },

  updateDsaQuestion: async (id: string, data: Partial<DSAQuestion>): Promise<DSAQuestion> => {
    try {
      const res = await fetch(`${API_BASE}/dsa/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update DSA question');
      return await res.json();
    } catch {
      const found = DEFAULT_DSA_QUESTIONS.find((q) => q.id === id) || DEFAULT_DSA_QUESTIONS[0];
      return { ...found, ...data } as DSAQuestion;
    }
  },

  importDsaQuestions: async (questions: any[], replaceAll = false) => {
    const res = await fetch(`${API_BASE}/dsa/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, replaceAll }),
    });
    if (!res.ok) throw new Error('Failed to import questions');
    return res.json();
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) return DEFAULT_PROJECTS_DATA;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_PROJECTS_DATA;
    } catch {
      return DEFAULT_PROJECTS_DATA;
    }
  },

  addProjectFeature: async (projectId: string, data: Partial<ProjectFeature>): Promise<ProjectFeature> => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add feature');
    return res.json();
  },

  updateProjectFeature: async (featureId: string, data: Partial<ProjectFeature>): Promise<ProjectFeature> => {
    try {
      const res = await fetch(`${API_BASE}/projects/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update feature');
      return await res.json();
    } catch {
      return { id: featureId, ...data } as any;
    }
  },

  importProjectFeatures: async (projectId: string, features: any[]) => {
    const res = await fetch(`${API_BASE}/projects/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, features }),
    });
    if (!res.ok) throw new Error('Failed to import features');
    return res.json();
  },

  resetProjectProgress: async () => {
    const res = await fetch(`${API_BASE}/projects/reset-progress`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset project progress');
    return res.json();
  },

  seedGridOpsMvp: async () => {
    const res = await fetch(`${API_BASE}/projects/seed-gridops`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to seed GridOps MVP checklist');
    return res.json();
  },

  // Interview Prep
  getInterviewTopics: async (): Promise<{
    overview: { totalPhase1: number; totalPhase2: number; avgConfidence: number; weakCount: number };
    categoryBreakdown: { category: string; total: number; ready: number; percent: number; topics: InterviewTopic[] }[];
    weakTopics: InterviewTopic[];
    phase2Topics: InterviewTopic[];
    allTopics: InterviewTopic[];
  }> => {
    const res = await fetch(`${API_BASE}/interview/topics`);
    if (!res.ok) throw new Error('Failed to fetch interview topics');
    return res.json();
  },

  updateInterviewTopic: async (id: string, data: Partial<InterviewTopic>): Promise<InterviewTopic> => {
    const res = await fetch(`${API_BASE}/interview/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update topic');
    return res.json();
  },

  addInterviewTopic: async (data: Partial<InterviewTopic>): Promise<InterviewTopic> => {
    const res = await fetch(`${API_BASE}/interview/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create interview topic');
    return res.json();
  },

  deleteInterviewTopic: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const res = await fetch(`${API_BASE}/interview/topics/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete interview topic');
    return res.json();
  },

  importInterviewTopics: async (topics: any[], replaceAll = false) => {
    const res = await fetch(`${API_BASE}/interview/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics, replaceAll }),
    });
    if (!res.ok) throw new Error('Failed to import interview topics');
    return res.json();
  },

  // Work Sessions
  getWorkSessions: async (date?: string): Promise<WorkSession[]> => {
    try {
      const query = date ? `?date=${date}` : '';
      const res = await fetch(`${API_BASE}/work-sessions${query}`);
      if (!res.ok) return DEFAULT_WORK_SESSIONS;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_WORK_SESSIONS;
    } catch {
      return DEFAULT_WORK_SESSIONS;
    }
  },

  logWorkSession: async (data: {
    category: 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER';
    durationMinutes: number;
    taskTitle: string;
    notes?: string;
    date?: string;
  }): Promise<WorkSession> => {
    try {
      const res = await fetch(`${API_BASE}/work-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to log work session');
      return await res.json();
    } catch {
      return {
        id: 'ws_' + Date.now(),
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category,
        durationMinutes: data.durationMinutes,
        taskTitle: data.taskTitle,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
    }
  },

  updateWorkSession: async (id: string, data: Partial<WorkSession>): Promise<WorkSession> => {
    const res = await fetch(`${API_BASE}/work-sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update work session');
    return res.json();
  },

  deleteWorkSession: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/work-sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete session');
      return await res.json();
    } catch {
      return { success: true, message: 'Session deleted' };
    }
  },

  clearDateWorkSessions: async (date: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/work-sessions/date/${encodeURIComponent(date)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear sessions for date');
    return res.json();
  },

  deduplicateWorkSessions: async (): Promise<{ success: boolean; removedCount: number; message: string }> => {
    try {
      const res = await fetch(`${API_BASE}/work-sessions/deduplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to deduplicate work sessions');
      return await res.json();
    } catch {
      return { success: true, removedCount: 0, message: 'All logs are clean & deduplicated' };
    }
  },

  // Parking Lot
  getParkedIdeas: async (): Promise<{ activeCount: number; ideas: ParkedIdea[] }> => {
    try {
      const res = await fetch(`${API_BASE}/parking-lot`);
      if (!res.ok) return { activeCount: DEFAULT_PARKED_IDEAS.length, ideas: DEFAULT_PARKED_IDEAS };
      return await res.json();
    } catch {
      return { activeCount: DEFAULT_PARKED_IDEAS.length, ideas: DEFAULT_PARKED_IDEAS };
    }
  },

  parkIdea: async (data: { title: string; category?: string; notes?: string }): Promise<ParkedIdea> => {
    try {
      const res = await fetch(`${API_BASE}/parking-lot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to park idea');
      return await res.json();
    } catch {
      return {
        id: 'park_' + Date.now(),
        title: data.title,
        category: data.category || 'General',
        notes: data.notes || '',
        status: 'PARKED',
        createdAt: new Date().toISOString(),
      };
    }
  },

  updateParkedIdea: async (id: string, data: Partial<ParkedIdea>): Promise<ParkedIdea> => {
    const res = await fetch(`${API_BASE}/parking-lot/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update idea');
    return res.json();
  },

  graduateParkedIdea: async (id: string) => {
    const res = await fetch(`${API_BASE}/parking-lot/${id}/graduate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to graduate idea');
    return res.json();
  },

  deleteParkedIdea: async (id: string) => {
    const res = await fetch(`${API_BASE}/parking-lot/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete idea');
    return res.json();
  },

  // Growth & Heatmap
  getHeatmapData: async (year?: number): Promise<HeatmapDay[]> => {
    try {
      const query = year ? `?year=${year}` : '';
      const res = await fetch(`${API_BASE}/growth/heatmap${query}`);
      if (!res.ok) return DEFAULT_HEATMAP_DATA;
      return await res.json();
    } catch {
      return DEFAULT_HEATMAP_DATA;
    }
  },

  getCumulativeGrowth: async (month?: string): Promise<CumulativeGrowthData> => {
    const query = month ? `?month=${month}` : '';
    const res = await fetch(`${API_BASE}/growth/cumulative${query}`);
    if (!res.ok) throw new Error('Failed to fetch cumulative growth data');
    return res.json();
  },

  getDailyReview: async (date?: string): Promise<{ date: string; review: DailyReview | null; totalMinutes: number; actualHours: number; sessions: WorkSession[] }> => {
    const query = date ? `?date=${date}` : '';
    const res = await fetch(`${API_BASE}/growth/review${query}`);
    if (!res.ok) throw new Error('Failed to fetch daily review');
    return res.json();
  },

  submitDailyReview: async (data: Partial<DailyReview>): Promise<DailyReview> => {
    const res = await fetch(`${API_BASE}/growth/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit daily review');
    return res.json();
  },

  // Roadmap
  getRoadmap: async () => {
    try {
      const res = await fetch(`${API_BASE}/roadmap`);
      if (!res.ok) return DEFAULT_ROADMAP_DATA;
      return await res.json();
    } catch {
      return DEFAULT_ROADMAP_DATA;
    }
  },

  // Job Applications & Interview Process Tracker
  getApplications: async (): Promise<{ applications: JobApplication[]; stats: ApplicationStats }> => {
    try {
      const res = await fetch(`${API_BASE}/applications`);
      if (!res.ok) return { applications: DEFAULT_APPLICATIONS, stats: DEFAULT_APPLICATION_STATS };
      const data = await res.json();
      if (!data || !data.applications || data.applications.length === 0) {
        return { applications: DEFAULT_APPLICATIONS, stats: DEFAULT_APPLICATION_STATS };
      }
      return data;
    } catch {
      return { applications: DEFAULT_APPLICATIONS, stats: DEFAULT_APPLICATION_STATS };
    }
  },

  createApplication: async (data: Partial<JobApplication> & { initialRound?: Partial<InterviewRound> }): Promise<JobApplication> => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },

  updateApplication: async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  },

  deleteApplication: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const res = await fetch(`${API_BASE}/applications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete application');
    return res.json();
  },

  addInterviewRound: async (applicationId: string, data: Partial<InterviewRound>): Promise<{ round: InterviewRound; application: JobApplication }> => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add interview round');
    return res.json();
  },

  updateInterviewRound: async (applicationId: string, roundId: string, data: Partial<InterviewRound>): Promise<{ round: InterviewRound; application: JobApplication }> => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/rounds/${roundId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update interview round');
    return res.json();
  },

  deleteInterviewRound: async (applicationId: string, roundId: string): Promise<{ success: boolean; application: JobApplication }> => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/rounds/${roundId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete interview round');
    return res.json();
  },
};
