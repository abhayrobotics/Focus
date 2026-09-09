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
} from '../types';

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
    const res = await fetchWithRetry(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // DSA
  getDsaQuestions: async (params?: {
    topic?: string;
    difficulty?: string;
    status?: string;
    needsRevision?: boolean;
    search?: string;
  }): Promise<{ overview: DSAOverview; topicStats: DSATopicStat[]; questions: DSAQuestion[] }> => {
    const query = new URLSearchParams();
    if (params?.topic) query.append('topic', params.topic);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.status) query.append('status', params.status);
    if (params?.needsRevision) query.append('needsRevision', 'true');
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/dsa/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch DSA questions');
    return res.json();
  },

  updateDsaQuestion: async (id: string, data: Partial<DSAQuestion>): Promise<DSAQuestion> => {
    const res = await fetch(`${API_BASE}/dsa/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update DSA question');
    return res.json();
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
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
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
    const res = await fetch(`${API_BASE}/projects/features/${featureId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update feature');
    return res.json();
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
    const query = date ? `?date=${date}` : '';
    const res = await fetch(`${API_BASE}/work-sessions${query}`);
    if (!res.ok) throw new Error('Failed to fetch work sessions');
    return res.json();
  },

  logWorkSession: async (data: {
    category: 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER';
    durationMinutes: number;
    taskTitle: string;
    notes?: string;
    date?: string;
  }): Promise<WorkSession> => {
    const res = await fetch(`${API_BASE}/work-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log work session');
    return res.json();
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
    const res = await fetch(`${API_BASE}/work-sessions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete session');
    return res.json();
  },

  clearDateWorkSessions: async (date: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/work-sessions/date/${encodeURIComponent(date)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear sessions for date');
    return res.json();
  },

  deduplicateWorkSessions: async (): Promise<{ success: boolean; removedCount: number; message: string }> => {
    const res = await fetch(`${API_BASE}/work-sessions/deduplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to deduplicate work sessions');
    return res.json();
  },

  // Parking Lot
  getParkedIdeas: async (): Promise<{ activeCount: number; ideas: ParkedIdea[] }> => {
    const res = await fetch(`${API_BASE}/parking-lot`);
    if (!res.ok) throw new Error('Failed to fetch parked ideas');
    return res.json();
  },

  parkIdea: async (data: { title: string; category?: string; notes?: string }): Promise<ParkedIdea> => {
    const res = await fetch(`${API_BASE}/parking-lot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to park idea');
    return res.json();
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
    const query = year ? `?year=${year}` : '';
    const res = await fetch(`${API_BASE}/growth/heatmap${query}`);
    if (!res.ok) throw new Error('Failed to fetch heatmap data');
    return res.json();
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
    const res = await fetch(`${API_BASE}/roadmap`);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  // Job Applications & Interview Process Tracker
  getApplications: async (): Promise<{ applications: JobApplication[]; stats: ApplicationStats }> => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
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
