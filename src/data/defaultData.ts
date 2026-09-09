import {
  DashboardData,
  Project,
  DSAQuestion,
  DSAOverview,
  DSATopicStat,
  JobApplication,
  ApplicationStats,
  ConsistencyStats,
  ParkedIdea,
  WorkSession,
  HeatmapDay,
} from '../types';

export const DEFAULT_CONSISTENCY: ConsistencyStats = {
  todayTargetHours: 4.0,
  todayActualHours: 0.0,
  todayProgressPercent: 0,
  todayRemainingMinutes: 240,
  todayStatus: 'INACTIVE',
  hasRedAlert: false,
  redAlertMessage: null,
  currentStreak: 0,
  longestStreak: 5,
  daysCompletedThisMonth: 0,
  totalHoursLoggedAllTime: 12.5,
  weeklySummary: {
    weekTargetHours: 28.0,
    weekActualHours: 12.5,
    weekProgressPercent: 45,
    days: [
      { dayName: 'Mon', date: '2026-09-04', targetHours: 4, actualHours: 4.5, status: 'TARGET_MET', dsaMinutes: 120, projectMinutes: 120, interviewMinutes: 30 },
      { dayName: 'Tue', date: '2026-09-05', targetHours: 4, actualHours: 4.0, status: 'TARGET_MET', dsaMinutes: 90, projectMinutes: 120, interviewMinutes: 30 },
      { dayName: 'Wed', date: '2026-09-06', targetHours: 4, actualHours: 4.0, status: 'TARGET_MET', dsaMinutes: 90, projectMinutes: 120, interviewMinutes: 30 },
      { dayName: 'Thu', date: '2026-09-07', targetHours: 4, actualHours: 0.0, status: 'INACTIVE', dsaMinutes: 0, projectMinutes: 0, interviewMinutes: 0 },
      { dayName: 'Fri', date: '2026-09-08', targetHours: 4, actualHours: 0.0, status: 'INACTIVE', dsaMinutes: 0, projectMinutes: 0, interviewMinutes: 0 },
      { dayName: 'Sat', date: '2026-09-09', targetHours: 4, actualHours: 0.0, status: 'INACTIVE', dsaMinutes: 0, projectMinutes: 0, interviewMinutes: 0 },
      { dayName: 'Sun', date: '2026-09-10', targetHours: 4, actualHours: 0.0, status: 'INACTIVE', dsaMinutes: 0, projectMinutes: 0, interviewMinutes: 0 },
    ],
  },
  executionVsPlanning: {
    workSessionsCount: 8,
    planningChangesCount: 2,
    executionRatio: 80,
  },
};

export const DEFAULT_PROJECTS_DATA: Project[] = [
  {
    id: 'proj_gridops_01',
    name: 'GridOps: Utility Operations & Grievance Platform',
    description: 'Production-grade utility operations platform with employee grievance lifecycle, SLA deadline tracking, role-based forwarding, and accountability analytics.',
    status: 'IN_PROGRESS',
    isFlagship: true,
    githubUrl: 'https://github.com/abhay/grievance-management-system',
    progressPercent: 0,
    completedCount: 0,
    totalMvpCount: 25,
    futureCount: 4,
    currentNextAction: 'Draft MVP scope specification and module boundary constraints.',
    currentNextFeatureName: '1. Write the MVP scope: Login + Dashboard + Grievance Management + Analytics',
    mvpFeatures: [
      // Phase 1
      { id: 'f_1', projectId: 'proj_gridops_01', category: 'PHASE_1', name: '1. Write the MVP scope: Login + Dashboard + Grievance Management + Analytics', description: 'Define minimal viable product boundaries: core authentication, high-level operational dashboard, grievance lifecycle, and summary statistics.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft MVP scope specification and module boundary constraints.', technicalNotes: 'The grievance data model and simple status workflow come directly from your original concept.', isMvp: true },
      { id: 'f_2', projectId: 'proj_gridops_01', category: 'PHASE_1', name: '2. Define user roles: Admin / Supervisor / Officer', description: 'Define role-based permission matrix across Admin (system/users), Supervisor (assign/escalations), and Officer (field investigation/resolution).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Model RBAC enum and middleware route guards.', technicalNotes: 'Role enum: ADMIN, SUPERVISOR, OFFICER with granular permissions.', isMvp: true },
      { id: 'f_3', projectId: 'proj_gridops_01', category: 'PHASE_1', name: '3. Define grievance fields: ID, subject, category, consumer, location, dates, deadline, status, owner, priority, description', description: 'Model full schema attributes: Grievance ID, subject, category, consumer name/phone, location, dates, statutory SLA deadline, status, owner, priority, description.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft PostgreSQL schema fields and Zod validation rules.', technicalNotes: 'PostgreSQL indexed columns on status, ownerId, and deadline.', isMvp: true },
      { id: 'f_4', projectId: 'proj_gridops_01', category: 'PHASE_1', name: '4. Define status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed', description: 'Define linear status state machine and valid transition rules from Received to Closed.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Map allowed status transitions in state machine validator.', technicalNotes: 'Status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed.', isMvp: true },
      { id: 'f_5', projectId: 'proj_gridops_01', category: 'PHASE_1', name: '5. Design the main screens: Login, Dashboard, Grievance List, Create Grievance, Grievance Details', description: 'Wireframe and design the 5 core user screens: Login, Executive Dashboard, Grievance Table List, Create Grievance Form, and Grievance Details view.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Create UI component wireframes and responsive layouts.', technicalNotes: 'Tailwind CSS + Lucide icons + responsive layouts.', isMvp: true },

      // Phase 2
      { id: 'f_6', projectId: 'proj_gridops_01', category: 'PHASE_2', name: '6. Create backend project using Node.js + Express + TypeScript', description: 'Initialize Node.js + Express + TypeScript project structure with modular architecture and error handling middleware.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Set up Express app, tsconfig.json, and module directory structure.', technicalNotes: 'Your proposed architecture specifically recommends a modular monolith using React/TypeScript → Express → Prisma → PostgreSQL, rather than microservices.', isMvp: true },
      { id: 'f_7', projectId: 'proj_gridops_01', category: 'PHASE_2', name: '7. Configure PostgreSQL + Prisma', description: 'Set up PostgreSQL connection string in .env and initialize Prisma client ORM configuration.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Configure DATABASE_URL and initialize prisma/schema.prisma.', technicalNotes: 'Prisma client singleton with connection pooling.', isMvp: true },
      { id: 'f_8', projectId: 'proj_gridops_01', category: 'PHASE_2', name: '8. Design core database tables: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status', description: 'Design relational tables with foreign keys: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write Prisma schema models with relational constraints and cascade rules.', technicalNotes: 'Include GrievanceHistory model for audit trail timestamps and actor tracking.', isMvp: true },
      { id: 'f_9', projectId: 'proj_gridops_01', category: 'PHASE_2', name: '9. Create Prisma schema and run first migration', description: 'Execute prisma migrate dev --name init to generate PostgreSQL migration and compile Prisma Client.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run initial Prisma migration and verify table generation.', technicalNotes: 'Ensure foreign key relations and indexes are applied in PostgreSQL.', isMvp: true },
      { id: 'f_10', projectId: 'proj_gridops_01', category: 'PHASE_2', name: '10. Create seed data: users, roles, categories, statuses and 10–20 sample grievances', description: 'Seed script generating Admin, Supervisor, Officer users, office hierarchies, category types, and 10–20 realistic sample grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write prisma/seed.ts with sample utility grievance records.', technicalNotes: 'Include overdue, due today, and pending records to test dashboard metrics.', isMvp: true },

      // Phase 3
      { id: 'f_11', projectId: 'proj_gridops_01', category: 'PHASE_3', name: '11. Create login API', description: 'Build POST /api/auth/login endpoint accepting email/username and password credentials with validation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement login route handler and credential verification.', technicalNotes: 'Express handler with Zod request body validation.', isMvp: true },
      { id: 'f_12', projectId: 'proj_gridops_01', category: 'PHASE_3', name: '12. Implement password hashing + JWT authentication', description: 'Secure password verification with bcrypt and issue signed JWT access tokens with user payload.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement bcrypt.compare and JWT token sign / verify utilities.', technicalNotes: 'Store JWT secret in environment variable with expiration time.', isMvp: true },
      { id: 'f_13', projectId: 'proj_gridops_01', category: 'PHASE_3', name: '13. Create frontend login page and connect it to API', description: 'Build responsive React login form with loading spinners, error banners, and authentication context.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build LoginForm component and link to api.login().', technicalNotes: 'React state for email/password and redirect upon successful auth.', isMvp: true },
      { id: 'f_14', projectId: 'proj_gridops_01', category: 'PHASE_3', name: '14. Protect dashboard/grievance routes and implement logout', description: 'Implement ProtectedRoute wrapper, auth token persistence in localStorage/cookies, and logout session clearing.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement React Router ProtectedRoute guard and logout button.', technicalNotes: 'Milestone: You can log in → reach dashboard → refresh page → remain authenticated.', isMvp: true },

      // Phase 4
      { id: 'f_15', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '15. Build Create Grievance API + form', description: 'Build POST /api/grievances endpoint with auto-generated registration ID (e.g., GR-1001) and dynamic React form UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement Grievance creation controller and multipart file attachment upload.', technicalNotes: 'This is the heart of the product: create, view, assign, forward and update grievances.', isMvp: true },
      { id: 'f_16', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '16. Build Grievance List API + table UI', description: 'Build GET /api/grievances with search, category filtering, status tabs, and responsive data table UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTable component with search filter and pagination.', technicalNotes: 'Prisma query with where filters for category, status, and owner.', isMvp: true },
      { id: 'f_17', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '17. Build Grievance Details page', description: 'Build full grievance detail view showing metadata, timeline, complainant details, attachments, and current owner.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Design GrievanceDetail view with action toolbar and history sidebar.', technicalNotes: 'Fetch grievance by ID with include: { history: true, attachments: true }.', isMvp: true },
      { id: 'f_18', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '18. Implement Assign / Change Owner', description: 'Enable supervisors to assign or transfer grievance ownership to specific junior engineers / officers.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/assign endpoint and owner selector dropdown.', technicalNotes: 'Prisma transaction: update currentOwnerId + insert GrievanceHistory log.', isMvp: true },
      { id: 'f_19', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '19. Implement Update Status', description: 'Allow assigned officers to transition grievance status (e.g., Assigned -> In Progress -> Resolved).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/status endpoint with status selection modal.', technicalNotes: 'Validate allowed status transition in state machine before persisting.', isMvp: true },
      { id: 'f_20', projectId: 'proj_gridops_01', category: 'PHASE_4', name: '20. Implement Forward Grievance with receiving officer + note', description: 'Forwarding engine enabling officers to route grievance to another office/officer with mandatory note.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build Forward Grievance modal dialog with receiving officer picker and forwarding remarks.', technicalNotes: 'Atomic transaction recording forwarding reason in GrievanceHistory.', isMvp: true },

      // Phase 5
      { id: 'f_21', projectId: 'proj_gridops_01', category: 'PHASE_5', name: '21. Implement Grievance History — record every important action', description: 'Immutable timeline auditing every creation, assignment, forwarding, note, and status update with actor and timestamp.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTimeline component rendering chronological history events.', technicalNotes: 'GrievanceHistory query ordered by timestamp ascending.', isMvp: true },
      { id: 'f_22', projectId: 'proj_gridops_01', category: 'PHASE_5', name: '22. Add deadline calculation and Pending / Due Today / Overdue logic', description: 'Backend logic computing statutory SLA countdown: > 3 days (Normal), 1-3 days (Due Soon), 0 days (Due Today), < 0 days (Overdue).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement date calculation utility for SLA breach detection and badge color coding.', technicalNotes: 'Compare deadline with new Date() and assign urgency level.', isMvp: true },
      { id: 'f_23', projectId: 'proj_gridops_01', category: 'PHASE_5', name: '23. Build Dashboard cards: Total / Pending / Due Today / Overdue / Resolved', description: 'High-impact KPI summary cards displaying live counts for Total, Pending, Due Today, Overdue, and Resolved grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build DashboardMetricCards component connected to /api/dashboard/stats.', technicalNotes: 'Single Prisma aggregation query for rapid dashboard load.', isMvp: true },
      { id: 'f_24', projectId: 'proj_gridops_01', category: 'PHASE_5', name: '24. Build Attention Required table: grievance + owner + deadline + status', description: 'Prominent dashboard table highlighting high-priority overdue and due-today items requiring immediate supervisor escalation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build AttentionRequiredTable component with direct 1-click action buttons.', technicalNotes: 'Prisma query where status != "RESOLVED" and deadline <= today + 2 days.', isMvp: true },
      { id: 'f_25', projectId: 'proj_gridops_01', category: 'PHASE_5', name: '25. End-to-end test + responsive UI + error/loading states + deploy MVP', description: 'Comprehensive end-to-end testing, mobile responsiveness polish, empty/error state handling, and production MVP deployment.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run complete regression tests and deploy production build.', technicalNotes: 'Build verification with npm run build and cross-device testing.', isMvp: true },
    ],
    futureFeatures: [
      { id: 'f_26', projectId: 'proj_gridops_01', category: 'FUTURE', name: 'GIS Survey & Field Mapping (Post-MVP)', description: 'MapLibre/Turf.js map interface to pinpoint poles, measure distance, and generate route surveys.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'MapLibre + OpenStreetMap + Turf.js integration.', isMvp: false },
      { id: 'f_27', projectId: 'proj_gridops_01', category: 'FUTURE', name: 'Meter Challenge Management (Post-MVP)', description: 'Meter dispute workflow tracking testing dates, laboratory reports, and statutory SLA limits.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Follows same core workflow architecture.', isMvp: false },
      { id: 'f_28', projectId: 'proj_gridops_01', category: 'FUTURE', name: 'Work Orders & Field Maintenance (Post-MVP)', description: 'Work orders for transformer maintenance, pole replacement, and line repairs.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Operational task management engine.', isMvp: false },
      { id: 'f_29', projectId: 'proj_gridops_01', category: 'FUTURE', name: 'AI Operations Assistant & Summarizer (Post-MVP)', description: 'LLM-powered daily operations attention summaries and grievance history brief generator.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'LLM synthesis layer over structured grievance events.', isMvp: false },
    ],
  },
];

export const DEFAULT_DASHBOARD_DATA: DashboardData = {
  consistency: DEFAULT_CONSISTENCY,
  recommendations: [
    {
      id: 'rec_1',
      category: 'PROJECT',
      title: 'GridOps: Define MVP Scope & Core Architecture',
      subtitle: 'Write the MVP boundary: Auth + Grievance Lifecycle + Analytics',
      durationMinutes: 90,
      priorityScore: 95,
      reason: 'Flagship project core architecture is the #1 priority for technical interviews.',
    },
    {
      id: 'rec_2',
      category: 'DSA',
      title: 'DSA Practice: Sliding Window & Two Pointers',
      subtitle: 'LC 3: Longest Substring Without Repeating Characters',
      durationMinutes: 45,
      priorityScore: 88,
      reason: 'Sliding window template mastery is critical for product company coding rounds.',
    },
    {
      id: 'rec_3',
      category: 'INTERVIEW',
      title: 'Interview Prep: JavaScript Event Loop & Microtasks',
      subtitle: 'Review Promise queue vs Macrotask execution order',
      durationMinutes: 30,
      priorityScore: 80,
      reason: 'Daily active recall solidifies frontend invariants.',
    },
  ],
  parkedCount: 3,
  projectSnapshot: {
    id: 'proj_gridops_01',
    name: 'GridOps: Utility Operations & Grievance Platform',
    progress: 0,
    completedFeatures: 0,
    totalFeatures: 25,
    nextAction: 'Draft MVP scope specification and module boundary constraints.',
  },
  dsaSnapshot: {
    total: 80,
    solved: 0,
    inProgress: 0,
    needsRevision: 0,
    progressPercent: 0,
    currentTopic: 'Arrays',
  },
};

export {
  MASTER_DSA_QUESTIONS as DEFAULT_DSA_QUESTIONS,
  MASTER_DSA_TOPIC_STATS as DEFAULT_DSA_TOPIC_STATS,
  MASTER_DSA_OVERVIEW as DEFAULT_DSA_OVERVIEW,
} from './dsaQuestions';

export const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    userId: 'usr_main_01',
    companyName: 'Atlassian',
    role: 'Full Stack Engineer (SDE 2)',
    location: 'Bengaluru / Remote',
    salaryRange: '₹28 - 36 LPA',
    platform: 'LINKEDIN',
    appliedDate: '2026-09-02',
    status: 'TECH_ROUND_1',
    contactPerson: 'Aditi Sharma (Senior Technical Recruiter)',
    contactEmail: 'aditi.sharma@atlassian.com',
    notes: 'Applied via LinkedIn InMail reachout. Emphasized Fullstack Grievance Portal architecture.',
    rounds: [
      {
        id: 'rnd_1',
        applicationId: 'app_1',
        roundNumber: 1,
        roundName: 'Initial Recruiter Screening',
        status: 'CLEARED',
        interviewerName: 'Aditi Sharma',
        questionsAsked: 'Past project deep dive, salary expectation, notice period, React concurrency and Node.js event loop discussion.',
        feedback: 'Cleared effortlessly. Recruiter impressed with fullstack grievance tracking portfolio project.',
      },
      {
        id: 'rnd_2',
        applicationId: 'app_1',
        roundNumber: 2,
        roundName: 'Technical Round 1 (Live DSA & Problem Solving)',
        status: 'SCHEDULED',
        interviewerName: 'Staff SDE',
        scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        questionsAsked: 'Focus on Sliding Window / Two Pointers / HashMap invariants (LC 3, LC 11).',
        feedback: 'Prep checklist: Review sliding window template, practice time complexity narration.',
      },
    ],
  },
  {
    id: 'app_2',
    userId: 'usr_main_01',
    companyName: 'Razorpay',
    role: 'Backend Engineer (Payments Core)',
    location: 'Bengaluru (Hybrid)',
    salaryRange: '₹25 - 32 LPA',
    platform: 'INSTAHYRE',
    appliedDate: '2026-09-05',
    status: 'OA_ROUND',
    contactPerson: 'Karan Mehra',
    notes: 'Direct application on Instahyre. Shortlisted within 48 hours.',
    rounds: [
      {
        id: 'rnd_3',
        applicationId: 'app_2',
        roundNumber: 1,
        roundName: 'Online Assessment (HackerRank OA)',
        status: 'CLEARED',
        questionsAsked: '2 DSA problems (Array prefix sum + Graph BFS), 10 SQL & DB concurrency MCQs.',
        feedback: '100% test cases passed on both DSA questions.',
      },
    ],
  },
  {
    id: 'app_3',
    userId: 'usr_main_01',
    companyName: 'Uber',
    role: 'Software Engineer II',
    location: 'Hyderabad / Remote',
    salaryRange: '₹32 - 42 LPA',
    platform: 'REFERRAL',
    appliedDate: '2026-09-08',
    status: 'APPLIED',
    contactPerson: 'Siddharth (Batchmate Referrer)',
    notes: 'Referred directly by alumni. Resume forwarded to hiring manager.',
    rounds: [],
  },
];

export const DEFAULT_APPLICATION_STATS: ApplicationStats = {
  total: 3,
  applied: 1,
  inReview: 0,
  oa: 1,
  tech1: 1,
  tech2: 0,
  systemDesign: 0,
  managerial: 0,
  hr: 0,
  offer: 0,
  rejected: 0,
  withdrawn: 0,
  activeCount: 3,
  conversionRate: 67,
  upcomingRoundsCount: 1,
};

export const DEFAULT_PARKED_IDEAS: ParkedIdea[] = [
  {
    id: 'park_1',
    title: 'Explore Golang Microservices Architecture',
    category: 'Architecture Exploration',
    notes: 'Parked until Phase 1 locked roadmap is fully executed. Focus strictly on Node.js/TypeScript first.',
    status: 'PARKED',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'park_2',
    title: 'Kubernetes Cluster Auto-scaling Deployment',
    category: 'DevOps / Cloud',
    notes: 'Defer to Phase 2 after GridOps MVP deployment is solid.',
    status: 'PARKED',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'park_3',
    title: 'GraphQL API Federation Layer',
    category: 'Backend',
    notes: 'Keep REST API clean first. Do not add premature abstraction.',
    status: 'PARKED',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const DEFAULT_WORK_SESSIONS: WorkSession[] = [
  {
    id: 'ws_1',
    date: '2026-09-06',
    category: 'PROJECT',
    durationMinutes: 120,
    taskTitle: 'GridOps: PostgreSQL Prisma schema modeling & migrations',
    notes: 'Created User, Role, Grievance, and GrievanceHistory relational schema.',
    createdAt: '2026-09-06T18:00:00.000Z',
  },
  {
    id: 'ws_2',
    date: '2026-09-06',
    category: 'DSA',
    durationMinutes: 90,
    taskTitle: 'Solved Dutch National Flag & 3Sum Closest (Two Pointer topic)',
    notes: 'Reviewed 3-pointer boundary checks and duplicate skipping logic.',
    createdAt: '2026-09-06T20:30:00.000Z',
  },
  {
    id: 'ws_3',
    date: '2026-09-06',
    category: 'INTERVIEW',
    durationMinutes: 30,
    taskTitle: 'JavaScript Event Loop & Microtasks active recall',
    notes: 'Solidified macrotask vs microtask queuing rules in Node and browser.',
    createdAt: '2026-09-06T21:15:00.000Z',
  },
];

export const DEFAULT_ROADMAP_DATA = {
  phase1: {
    status: 'LOCKED',
    label: 'Phase 1: Foundation & Mastery',
    duration: 'Sep 2026 – Nov 2026',
    metrics: {
      dsa: { total: 80, solved: 28, percent: 35 },
      project: { total: 25, complete: 0, percent: 0 },
      interview: { total: 170, ready: 0, percent: 0 },
    },
    deliverables: [
      { id: 'del_1', name: '80 Curated DSA Problems across 9 Core Patterns', status: 'IN_PROGRESS', progress: 35 },
      { id: 'del_2', name: 'GridOps: Utility Operations & Grievance Platform (25-Step MVP)', status: 'IN_PROGRESS', progress: 0 },
      { id: 'del_3', name: '170 Essential Fullstack Interview Concepts Mastery', status: 'IN_PROGRESS', progress: 0 },
    ],
  },
  phase2: {
    status: 'UPCOMING',
    label: 'Phase 2: High-Volume Applications & Conversion',
    duration: 'Dec 2026 – Feb 2027',
    targetApplications: 50,
    targetOffers: 3,
  },
};

export const DEFAULT_HEATMAP_DATA: HeatmapDay[] = Array.from({ length: 365 }).map((_, i) => {
  const d = new Date(2026, 0, 1 + i);
  const dateStr = d.toISOString().split('T')[0];
  const isPast = d < new Date();
  const hours = isPast ? (i % 7 === 0 || i % 7 === 1 ? 0 : 3.5 + (i % 3) * 0.5) : 0;
  return {
    date: dateStr,
    hours,
    targetHours: 4,
    percentage: Math.min(100, Math.round((hours / 4) * 100)),
    level: hours >= 4 ? 3 : hours >= 2 ? 2 : hours > 0 ? 1 : 0,
    dsaMinutes: hours > 0 ? 90 : 0,
    projectMinutes: hours > 0 ? 120 : 0,
    interviewMinutes: hours > 0 ? 30 : 0,
    tasks: hours > 0 ? ['DSA Practice', 'GridOps Development'] : [],
  };
});
