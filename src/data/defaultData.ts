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
    solved: 28,
    inProgress: 1,
    needsRevision: 1,
    progressPercent: 35,
    currentTopic: 'Sliding Window',
  },
};

export const DEFAULT_DSA_QUESTIONS: DSAQuestion[] = [
  // Array
  { id: 'dsa_1', number: 1, topic: 'Array', title: 'Two Sum', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/two-sum/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'HashMap complement lookup in single pass.', mistake: 'Checked for map.has before setting value.', needsRevision: false },
  { id: 'dsa_2', number: 2, topic: 'Array', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Track minimum price so far and compute profit at each element.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_3', number: 3, topic: 'Array', title: 'Contains Duplicate', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/contains-duplicate/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Set length vs array length comparison.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_4', number: 4, topic: 'Array', title: 'Product of Array Except Self', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/product-of-array-except-self/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Prefix products pass from left, postfix products pass from right.', mistake: 'Initial attempt used division which fails on multiple zeros.', needsRevision: false },
  { id: 'dsa_5', number: 5, topic: 'Array', title: 'Maximum Subarray (Kadane’s)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/maximum-subarray/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Kadane algorithm: currentMax = Math.max(num, currentMax + num).', mistake: 'Resetting to 0 instead of considering negative single elements.', needsRevision: false },
  { id: 'dsa_6', number: 6, topic: 'Array', title: 'Maximum Product Subarray', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/maximum-product-subarray/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Maintain both max and min product because negative times negative is positive.', mistake: 'Forgot to swap max and min when encountering a negative number.', needsRevision: false },
  { id: 'dsa_7', number: 7, topic: 'Array', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Binary search comparing mid to right pointer.', mistake: 'Used right = mid - 1 which skipped the minimum element.', needsRevision: false },
  { id: 'dsa_8', number: 8, topic: 'Array', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Identify which half is strictly sorted, then check if target lies within bounds.', mistake: 'Forgot <= edge case when target matches boundary.', needsRevision: false },
  { id: 'dsa_9', number: 9, topic: 'Array', title: 'Merge Intervals', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/merge-intervals/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', approach: 'Sort by start time using nums.sort((a,b)=>a[0]-b[0]) then merge overlapping.', mistake: 'Forgot JS sort is alphabetical by default without comparator.', needsRevision: false },
  { id: 'dsa_10', number: 10, topic: 'Array', title: 'Non-overlapping Intervals', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', approach: 'Greedy sort by end time; count removals when next interval start < prev end.', mistake: 'Sorted by start time instead of end time.', needsRevision: false },

  // HashMap / HashSet
  { id: 'dsa_11', number: 11, topic: 'HashMap / HashSet', title: 'Valid Anagram', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-anagram/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Frequency array of size 26 or Map.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_12', number: 12, topic: 'HashMap / HashSet', title: 'Group Anagrams', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/group-anagrams/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N * K log K)', spaceComplexity: 'O(N * K)', approach: 'Sort string characters as map key or use frequency count tuple.', mistake: 'Mutated original array while grouping.', needsRevision: false },
  { id: 'dsa_13', number: 13, topic: 'HashMap / HashSet', title: 'Top K Frequent Elements', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Bucket sort using array of frequencies.', mistake: 'Tried sorting keys in O(N log N) initially.', needsRevision: false },
  { id: 'dsa_14', number: 14, topic: 'HashMap / HashSet', title: 'Longest Consecutive Sequence', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Set lookup. Only start counting sequence if (num - 1) is NOT in set.', mistake: 'Checked every number without starting condition causing O(N^2) TLE.', needsRevision: false },
  { id: 'dsa_15', number: 15, topic: 'HashMap / HashSet', title: 'Encode and Decode Strings', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/encode-and-decode-strings/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Length-delimited prefix: len + "#" + word.', mistake: 'Used special character delimiter without escaping.', needsRevision: false },
  { id: 'dsa_16', number: 16, topic: 'HashMap / HashSet', title: 'First Unique Character in a String', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/first-unique-character-in-a-string/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: '2 passes: frequency count map, then find first char with count 1.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_17', number: 17, topic: 'HashMap / HashSet', title: 'Subarray Sum Equals K', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Prefix sum hashmap tracking frequency of (sum - k).', mistake: 'Forgot map.set(0, 1) base case.', needsRevision: false },
  { id: 'dsa_18', number: 18, topic: 'HashMap / HashSet', title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/insert-delete-getrandom-o1/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(N)', approach: 'Combine Array for random index lookup with Map for value-to-index mapping. Swap with last element to delete in O(1).', mistake: 'Array.splice is O(N). Must swap with tail.', needsRevision: false },
  { id: 'dsa_19', number: 19, topic: 'HashMap / HashSet', title: 'Isomorphic Strings', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/isomorphic-strings/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Two directional mappings mapS->T and mapT->S.', mistake: 'Only mapped one direction which allowed duplicate targets.', needsRevision: false },

  // Two Pointer
  { id: 'dsa_20', number: 20, topic: 'Two Pointer', title: 'Valid Palindrome', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-palindrome/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left and right pointers skipping non-alphanumeric chars.', mistake: 'Regex matching regex was slightly slow; pointer is cleaner.', needsRevision: false },
  { id: 'dsa_21', number: 21, topic: 'Two Pointer', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left at 0, Right at len-1. If sum > target, right--; else left++.', mistake: '1-indexed output requirement.', needsRevision: false },
  { id: 'dsa_22', number: 22, topic: 'Two Pointer', title: '3Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/3sum/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', approach: 'Sort array. Fix first element, then two-pointer for remaining two. Skip duplicates carefully.', mistake: 'Duplicate skipping logic missed right pointer advancement.', needsRevision: false },
  { id: 'dsa_23', number: 23, topic: 'Two Pointer', title: 'Container With Most Water', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/container-with-most-water/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Pointers at both ends. Always advance the shorter wall.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_24', number: 24, topic: 'Two Pointer', title: 'Trapping Rain Water', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/trapping-rain-water/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left and right pointers with maxLeft and maxRight boundaries.', mistake: 'Needed help understanding why min(maxL, maxR) guarantees correct water level.', needsRevision: false },
  { id: 'dsa_25', number: 25, topic: 'Two Pointer', title: '3Sum Closest', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/3sum-closest/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', approach: 'Similar to 3Sum; track minimum absolute difference to target.', mistake: 'Initialized closest with 0 instead of Infinity/first sum.', needsRevision: false },
  { id: 'dsa_26', number: 26, topic: 'Two Pointer', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Slow pointer tracks write index, fast pointer reads unique values.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_27', number: 27, topic: 'Two Pointer', title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/sort-colors/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Three pointers: low, mid, high. Swap 0s to low, 2s to high.', mistake: 'Did not advance mid pointer when swapping 0.', needsRevision: false },

  // Sliding Window
  { id: 'dsa_28', number: 28, topic: 'Sliding Window', title: 'Maximum Average Subarray I', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window of size k. Subtract outgoing element, add incoming.', mistake: 'None.', needsRevision: false },
  { id: 'dsa_29', number: 29, topic: 'Sliding Window', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', status: 'IN_PROGRESS', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(min(N, M))', approach: 'Dynamic window with Map tracking char last seen index. left = Math.max(left, map.get(char) + 1).', mistake: 'Forgot Math.max check which causes left pointer to jump backwards on duplicate outside window.', needsRevision: true, revisionNotes: 'Practice dynamic window shrinkage invariant.' },
  { id: 'dsa_30', number: 30, topic: 'Sliding Window', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Window valid if (windowLen - maxFreq) <= k. Shrink left when invalid.', needsRevision: false },
  { id: 'dsa_31', number: 31, topic: 'Sliding Window', title: 'Permutation in String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/permutation-in-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window of size s1.length with 26-char frequency match count.', needsRevision: false },
  { id: 'dsa_32', number: 32, topic: 'Sliding Window', title: 'Minimum Size Subarray Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/minimum-size-subarray-sum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Expand right until sum >= target, then shrink left while valid to find min length.', needsRevision: false },
  { id: 'dsa_33', number: 33, topic: 'Sliding Window', title: 'Minimum Window Substring', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/minimum-window-substring/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(M)', approach: 'Two maps (need and window). Expand right until have == needCount, shrink left to optimize.', needsRevision: false },
  { id: 'dsa_34', number: 34, topic: 'Sliding Window', title: 'Sliding Window Maximum', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/sliding-window-maximum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(K)', approach: 'Monotonic decreasing Deque storing indices.', needsRevision: false },
  { id: 'dsa_35', number: 35, topic: 'Sliding Window', title: 'Find All Anagrams in a String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window with match counter.', needsRevision: false },
  { id: 'dsa_36', number: 36, topic: 'Sliding Window', title: 'Fruit Into Baskets', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/fruit-into-baskets/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Dynamic window maintaining at most 2 distinct elements in frequency map.', needsRevision: false },

  // Binary Search
  { id: 'dsa_37', number: 37, topic: 'Binary Search', title: 'Binary Search', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/binary-search/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Standard mid = left + Math.floor((right - left) / 2).', needsRevision: false },
  { id: 'dsa_38', number: 38, topic: 'Binary Search', title: 'Search Insert Position', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/search-insert-position/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Return left index when loop terminates.', needsRevision: false },
  { id: 'dsa_39', number: 39, topic: 'Binary Search', title: 'Search a 2D Matrix', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log(M*N))', spaceComplexity: 'O(1)', approach: 'Flatten 2D matrix into virtual 1D array: row = Math.floor(mid / cols), col = mid % cols.', needsRevision: false },
  { id: 'dsa_40', number: 40, topic: 'Binary Search', title: 'Koko Eating Bananas', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/koko-eating-bananas/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log(max(piles)))', spaceComplexity: 'O(1)', approach: 'Binary search on answer speed k from 1 to max(piles).', needsRevision: false },
  { id: 'dsa_41', number: 41, topic: 'Binary Search', title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Two binary searches: one biasing left, one biasing right.', needsRevision: false },
  { id: 'dsa_42', number: 42, topic: 'Binary Search', title: 'Find Peak Element', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-peak-element/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Compare mid with mid + 1 to navigate ascending slope.', needsRevision: false },
  { id: 'dsa_43', number: 43, topic: 'Binary Search', title: 'Time Based Key-Value Store', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/time-based-key-value-store/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', approach: 'Map of key to array of { timestamp, val }; binary search on timestamp.', needsRevision: false },
  { id: 'dsa_44', number: 44, topic: 'Binary Search', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log(min(N, M)))', spaceComplexity: 'O(1)', approach: 'Binary search on partition point of smaller array.', needsRevision: false },

  // Stack
  { id: 'dsa_45', number: 45, topic: 'Stack', title: 'Valid Parentheses', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-parentheses/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Stack with hashmap of matching pairs.', needsRevision: false },
  { id: 'dsa_46', number: 46, topic: 'Stack', title: 'Min Stack', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/min-stack/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(N)', approach: 'Dual stack or stack of pairs [val, currentMin].', needsRevision: false },
  { id: 'dsa_47', number: 47, topic: 'Stack', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Push numbers; on operator pop top 2 and apply operation.', needsRevision: false },
  { id: 'dsa_48', number: 48, topic: 'Stack', title: 'Daily Temperatures', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/daily-temperatures/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Monotonic decreasing stack storing indices.', needsRevision: false },
  { id: 'dsa_49', number: 49, topic: 'Stack', title: 'Car Fleet', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/car-fleet/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', approach: 'Sort by starting position descending; compute arrival times; stack fleet reduction.', needsRevision: false },
  { id: 'dsa_50', number: 50, topic: 'Stack', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Monotonic increasing stack of [index, height]; extend index backwards when popped.', needsRevision: false },
  { id: 'dsa_51', number: 51, topic: 'Stack', title: 'Decode String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/decode-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Dual stack for counts and string buffers.', needsRevision: false },
  { id: 'dsa_52', number: 52, topic: 'Stack', title: 'Asteroid Collision', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/asteroid-collision/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Stack simulation; resolve collisions when top > 0 and incoming < 0.', needsRevision: false },

  // Queue
  { id: 'dsa_53', number: 53, topic: 'Queue', title: 'Implement Stack using Queues', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/implement-stack-using-queues/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Rotate queue on push: queue.push(x) then rotate n-1 elements.', needsRevision: false },
  { id: 'dsa_54', number: 54, topic: 'Queue', title: 'Number of Recent Calls', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/number-of-recent-calls/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(W)', approach: 'Queue tracking timestamps; pop while front < t - 3000.', needsRevision: false },
  { id: 'dsa_55', number: 55, topic: 'Queue', title: 'Design Circular Queue', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/design-circular-queue/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(K)', approach: 'Fixed array with head, tail, and size pointers.', needsRevision: false },
  { id: 'dsa_56', number: 56, topic: 'Queue', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'BFS queue. For each level, loop over current queue.length.', needsRevision: false },
  { id: 'dsa_57', number: 57, topic: 'Queue', title: 'Rotting Oranges', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/rotting-oranges/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(M*N)', spaceComplexity: 'O(M*N)', approach: 'Multi-source BFS queue seeded with all initial rotten oranges.', needsRevision: false },
  { id: 'dsa_58', number: 58, topic: 'Queue', title: '01 Matrix', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/01-matrix/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(M*N)', spaceComplexity: 'O(M*N)', approach: 'Multi-source BFS starting from all 0s outward to 1s.', needsRevision: false },

  // Linked List
  { id: 'dsa_59', number: 59, topic: 'Linked List', title: 'Reverse Linked List', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/reverse-linked-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Iterative 3-pointer: prev = null, curr = head, next.', needsRevision: false },
  { id: 'dsa_60', number: 60, topic: 'Linked List', title: 'Merge Two Sorted Lists', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', approach: 'Dummy head node. Compare l1.val and l2.val.', needsRevision: false },
  { id: 'dsa_61', number: 61, topic: 'Linked List', title: 'Linked List Cycle', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/linked-list-cycle/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Floyd cycle detection: slow (1 step), fast (2 steps).', needsRevision: false },
  { id: 'dsa_62', number: 62, topic: 'Linked List', title: 'Linked List Cycle II', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'After collision, reset slow to head. Advance both 1 step to meet at cycle entry.', needsRevision: false },
  { id: 'dsa_63', number: 63, topic: 'Linked List', title: 'Reorder List', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/reorder-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: '1: Find middle, 2: Reverse second half, 3: Merge two halves.', needsRevision: false },
  { id: 'dsa_64', number: 64, topic: 'Linked List', title: 'Remove Nth Node From End of List', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Dummy node. Advance fast pointer n steps ahead, then move both.', needsRevision: false },
  { id: 'dsa_65', number: 65, topic: 'Linked List', title: 'Copy List with Random Pointer', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Map of oldNode -> newNode or interweaving node clones.', needsRevision: false },
  { id: 'dsa_66', number: 66, topic: 'Linked List', title: 'Add Two Numbers', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/add-two-numbers/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(max(N,M))', spaceComplexity: 'O(1)', approach: 'Dummy node, carry tracking loop while l1 || l2 || carry.', needsRevision: false },
  { id: 'dsa_67', number: 67, topic: 'Linked List', title: 'Merge k Sorted Lists', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log K)', spaceComplexity: 'O(1)', approach: 'Divide and conquer pairwise list merging.', needsRevision: false },
  { id: 'dsa_68', number: 68, topic: 'Linked List', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Check if k nodes remain, reverse k nodes, splice back into list.', needsRevision: false },
  { id: 'dsa_69', number: 69, topic: 'Linked List', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', approach: 'Two pointers pA and pB. When reaching null, redirect to opposite list head.', needsRevision: false },

  // Recursion
  { id: 'dsa_70', number: 70, topic: 'Recursion', title: 'Fibonacci Number', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/fibonacci-number/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Memoized recursion or bottom-up constant space DP.', needsRevision: false },
  { id: 'dsa_71', number: 71, topic: 'Recursion', title: 'Climbing Stairs', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/climbing-stairs/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Base cases n=1 (1), n=2 (2). dp[i] = dp[i-1] + dp[i-2].', needsRevision: false },
  { id: 'dsa_72', number: 72, topic: 'Recursion', title: 'Subsets', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subsets/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Backtracking: include or exclude current element at index i.', needsRevision: false },
  { id: 'dsa_73', number: 73, topic: 'Recursion', title: 'Combination Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/combination-sum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(2^T)', spaceComplexity: 'O(T)', approach: 'Backtracking allowing reuse of current candidate element.', needsRevision: false },
  { id: 'dsa_74', number: 74, topic: 'Recursion', title: 'Permutations', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/permutations/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N! * N)', spaceComplexity: 'O(N)', approach: 'Backtracking with used array or element swapping.', needsRevision: false },
  { id: 'dsa_75', number: 75, topic: 'Recursion', title: 'Subsets II', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subsets-ii/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Sort array first. Skip duplicate candidate if nums[i] === nums[i-1] when i > startIndex.', needsRevision: false },
  { id: 'dsa_76', number: 76, topic: 'Recursion', title: 'Word Search', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/word-search/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * M * 4^L)', spaceComplexity: 'O(L)', approach: 'DFS grid traversal; mark visited cells in-place with temp char "#".', needsRevision: false },
  { id: 'dsa_77', number: 77, topic: 'Recursion', title: 'Palindrome Partitioning', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/palindrome-partitioning/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Backtracking: if substring(start, i) is palindrome, recurse on remainder.', needsRevision: false },
  { id: 'dsa_78', number: 78, topic: 'Recursion', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(4^N)', spaceComplexity: 'O(N)', approach: 'Digit-to-char mapping backtrack recursion.', needsRevision: false },
  { id: 'dsa_79', number: 79, topic: 'Recursion', title: 'Generate Parentheses', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/generate-parentheses/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(4^N / sqrt(N))', spaceComplexity: 'O(N)', approach: 'Add open if open < n; add close if close < open.', needsRevision: false },
  { id: 'dsa_80', number: 80, topic: 'Recursion', title: 'N-Queens', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/n-queens/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N!)', spaceComplexity: 'O(N)', approach: 'Row by row backtracking with sets for cols, positive diagonals (r+c), and negative diagonals (r-c).', needsRevision: false },
];

export const DEFAULT_DSA_TOPIC_STATS: DSATopicStat[] = [
  { topic: 'Array', total: 10, solved: 10, percent: 100 },
  { topic: 'HashMap / HashSet', total: 9, solved: 9, percent: 100 },
  { topic: 'Two Pointer', total: 8, solved: 8, percent: 100 },
  { topic: 'Sliding Window', total: 9, solved: 1, percent: 11 },
  { topic: 'Binary Search', total: 8, solved: 0, percent: 0 },
  { topic: 'Stack', total: 8, solved: 0, percent: 0 },
  { topic: 'Queue', total: 6, solved: 0, percent: 0 },
  { topic: 'Linked List', total: 11, solved: 0, percent: 0 },
  { topic: 'Recursion', total: 11, solved: 0, percent: 0 },
];

export const DEFAULT_DSA_OVERVIEW: DSAOverview = {
  total: 80,
  solved: 28,
  inProgress: 1,
  notStarted: 51,
  needsRevisionCount: 1,
  solvedMyselfCount: 22,
  neededHelpCount: 6,
  completionPercent: 35,
  currentTopic: 'Sliding Window',
  nextRecommended: DEFAULT_DSA_QUESTIONS.find((q) => q.status !== 'SOLVED'),
};

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
