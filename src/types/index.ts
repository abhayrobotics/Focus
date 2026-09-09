export type NavTab = 'DASHBOARD' | 'DSA' | 'PROJECTS' | 'INTERVIEW' | 'GROWTH' | 'ROADMAP';

export interface ConsistencyStats {
  todayTargetHours: number;
  todayActualHours: number;
  todayProgressPercent: number;
  todayRemainingMinutes: number;
  todayStatus: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET';
  hasRedAlert: boolean;
  redAlertMessage: string | null;
  currentStreak: number;
  longestStreak: number;
  daysCompletedThisMonth: number;
  totalHoursLoggedAllTime: number;
  weeklySummary: {
    weekTargetHours: number;
    weekActualHours: number;
    weekProgressPercent: number;
    days: {
      dayName: string;
      date: string;
      targetHours: number;
      actualHours: number;
      status: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET';
      dsaMinutes: number;
      projectMinutes: number;
      interviewMinutes: number;
    }[];
  };
  executionVsPlanning: {
    workSessionsCount: number;
    planningChangesCount: number;
    executionRatio: number;
  };
}

export interface RecommendedAction {
  id: string;
  category: 'DSA' | 'PROJECT' | 'INTERVIEW';
  title: string;
  subtitle: string;
  durationMinutes: number;
  priorityScore: number;
  reason: string;
  actionUrl?: string;
  targetId?: string;
}

export interface DashboardData {
  consistency: ConsistencyStats;
  recommendations: RecommendedAction[];
  parkedCount: number;
  projectSnapshot: {
    id?: string;
    name: string;
    progress: number;
    completedFeatures: number;
    totalFeatures: number;
    nextAction: string;
  };
  dsaSnapshot: {
    total: number;
    solved: number;
    inProgress: number;
    needsRevision: number;
    progressPercent: number;
    currentTopic: string;
  };
}

export interface DSAQuestion {
  id: string;
  number: number;
  leetcodeNumber?: number;
  topic: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemUrl?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SOLVED' | 'NEEDS_REVISION';
  solvedMyself: boolean;
  solution?: string;
  approach?: string;
  mistake?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  dateSolved?: string;
  needsRevision: boolean;
  revisionNotes?: string;
}

export interface DSAOverview {
  total: number;
  solved: number;
  inProgress: number;
  notStarted: number;
  needsRevisionCount: number;
  solvedMyselfCount: number;
  neededHelpCount: number;
  completionPercent: number;
  currentTopic: string;
  nextRecommended?: DSAQuestion;
}

export interface DSATopicStat {
  topic: string;
  total: number;
  solved: number;
  percent: number;
}

export interface ProjectFeature {
  id: string;
  projectId: string;
  category: string;
  name: string;
  description?: string;
  status: 'IDEA' | 'PLANNED' | 'DEVELOPMENT' | 'TESTING' | 'COMPLETE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  progress: number;
  targetDate?: string;
  nextAction?: string;
  technicalNotes?: string;
  isMvp: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  githubUrl?: string;
  demoUrl?: string;
  isFlagship: boolean;
  progressPercent: number;
  completedCount: number;
  totalMvpCount: number;
  futureCount: number;
  currentNextAction: string;
  currentNextFeatureName: string;
  mvpFeatures: ProjectFeature[];
  futureFeatures: ProjectFeature[];
}

export interface InterviewTopic {
  id: string;
  category: 'FRONTEND' | 'BACKEND' | 'CODING' | 'CS_FUNDAMENTALS';
  name: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'PRACTICED' | 'INTERVIEW_READY';
  confidence: number; // 1 to 5
  priority: string;
  phase: string;
  lastStudied?: string;
  nextReview?: string;
  notes?: string;
  keyQuestions?: string;
  practicalTips?: string;
}

export interface WorkSession {
  id: string;
  date: string;
  category: 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER';
  durationMinutes: number;
  taskTitle: string;
  notes?: string;
  createdAt: string;
}

export interface ParkedIdea {
  id: string;
  title: string;
  category: string;
  notes?: string;
  status: 'PARKED' | 'GRADUATED' | 'DISMISSED';
  createdAt: string;
}

export interface HeatmapDay {
  date: string;
  hours: number;
  targetHours: number;
  percentage: number;
  level: number; // 0, 1, 2, 3
  dsaMinutes: number;
  projectMinutes: number;
  interviewMinutes: number;
  tasks: string[];
}

export interface DailyReview {
  id: string;
  date: string;
  targetHours: number;
  actualHours: number;
  energy: number;
  focus: number;
  completedPlanned: boolean;
  spentTooMuchTimeDeciding: boolean;
  didDsa: boolean;
  didProject: boolean;
  didInterview: boolean;
  oneThingLearned?: string;
  oneMistake?: string;
  tomorrowPriority?: string;
  planningChanges: number;
}

export interface CumulativeGrowthDay {
  day: number;
  date: string;
  dayName: string;
  isPastOrToday: boolean;
  isToday: boolean;
  dsaSolved: number;
  isMissed: boolean;
  dsaPenalty: number;
  dsaDelta: number;
  dsaCumulative: number | null;
  dsaTargetPace: number;
  dsaGoal: number;
  featuresDeployed: number;
  projectDelta: number;
  projectCumulative: number | null;
  projectTargetPace: number;
  projectGoal: number;
  totalMinutes: number;
  taskTitles: string[];
}

export interface CumulativeGrowthData {
  month: string;
  monthName: string;
  totalDays: number;
  currentDay: number;
  dsaTargetGoal: number;
  currentDsaCumulative: number;
  dsaPercentOfGoal: number;
  projectTargetGoal: number;
  currentProjectCumulative: number;
  projectPercentOfGoal: number;
  totalMissedDays: number;
  totalPenalties: number;
  totalRecovered: number;
  days: CumulativeGrowthDay[];
}

