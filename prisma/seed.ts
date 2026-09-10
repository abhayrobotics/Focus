import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CareerOS database...');

  // 1. Clean existing records
  await prisma.workSession.deleteMany();
  await prisma.dailyReview.deleteMany();
  await prisma.dSAQuestion.deleteMany();
  await prisma.projectFeature.deleteMany();
  await prisma.project.deleteMany();
  await prisma.interviewTopic.deleteMany();
  await prisma.parkedIdea.deleteMany();
  await prisma.roadmapItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create primary user
  const user = await prisma.user.create({
    data: {
      id: 'usr_main_01',
      name: 'Abhay',
    },
  });

  console.log(`👤 Created user: ${user.name}`);

  // 3. Seed 80 Curated DSA Questions across the locked 9-Topic Sequence (Clean 0% Baseline)
  const { MASTER_DSA_QUESTIONS } = await import('../src/data/dsaQuestions.js');
  for (const q of MASTER_DSA_QUESTIONS) {
    await prisma.dSAQuestion.create({
      data: {
        userId: user.id,
        number: q.number,
        leetcodeNumber: q.leetcodeNumber || null,
        phase: q.phase || null,
        topic: q.topic,
        subPattern: q.subPattern || null,
        title: q.title,
        difficulty: q.difficulty,
        problemUrl: q.problemUrl || null,
        status: 'NOT_STARTED',
        solvedMyself: false,
        solution: null,
        approach: q.approach || null,
        mistake: null,
        timeComplexity: null,
        spaceComplexity: null,
        dateSolved: null,
        needsRevision: false,
        revisionNotes: null,
      },
    });
  }

  console.log(`✅ Seeded ${MASTER_DSA_QUESTIONS.length} DSA questions at 0% baseline (all NOT_STARTED, 0 mistakes).`);

  // 4. Seed Project A: GridOps — 25-Step MVP Completion Tracker
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'GridOps: Utility Operations & Grievance Platform',
      description: 'Production-grade utility operations platform with employee grievance lifecycle, SLA deadline tracking, role-based forwarding, and accountability analytics.',
      status: 'IN_PROGRESS',
      isFlagship: true,
      githubUrl: 'https://github.com/abhay/grievance-management-system',
    },
  });

  const gridOpsMvpSteps = [
    // Phase 1 — Product & UI Foundation
    { category: 'PHASE_1', name: '1. Write the MVP scope: Login + Dashboard + Grievance Management + Analytics', description: 'Define minimal viable product boundaries: core authentication, high-level operational dashboard, grievance lifecycle, and summary statistics.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft MVP scope specification and module boundary constraints.', technicalNotes: 'The grievance data model and simple status workflow come directly from your original concept.', isMvp: true },
    { category: 'PHASE_1', name: '2. Define user roles: Admin / Supervisor / Officer', description: 'Define role-based permission matrix across Admin (system/users), Supervisor (assign/escalations), and Officer (field investigation/resolution).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Model RBAC enum and middleware route guards.', technicalNotes: 'Role enum: ADMIN, SUPERVISOR, OFFICER with granular permissions.', isMvp: true },
    { category: 'PHASE_1', name: '3. Define grievance fields: ID, subject, category, consumer, location, dates, deadline, status, owner, priority, description', description: 'Model full schema attributes: Grievance ID, subject, category, consumer name/phone, location, dates, statutory SLA deadline, status, owner, priority, description.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft PostgreSQL schema fields and Zod validation rules.', technicalNotes: 'PostgreSQL indexed columns on status, ownerId, and deadline.', isMvp: true },
    { category: 'PHASE_1', name: '4. Define status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed', description: 'Define linear status state machine and valid transition rules from Received to Closed.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Map allowed status transitions in state machine validator.', technicalNotes: 'Status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed.', isMvp: true },
    { category: 'PHASE_1', name: '5. Design the main screens: Login, Dashboard, Grievance List, Create Grievance, Grievance Details', description: 'Wireframe and design the 5 core user screens: Login, Executive Dashboard, Grievance Table List, Create Grievance Form, and Grievance Details view.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Create UI component wireframes and responsive layouts.', technicalNotes: 'Tailwind CSS + Lucide icons + responsive layouts.', isMvp: true },

    // Phase 2 — Backend & Database
    { category: 'PHASE_2', name: '6. Create backend project using Node.js + Express + TypeScript', description: 'Initialize Node.js + Express + TypeScript project structure with modular architecture and error handling middleware.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Set up Express app, tsconfig.json, and module directory structure.', technicalNotes: 'Your proposed architecture specifically recommends a modular monolith using React/TypeScript → Express → Prisma → PostgreSQL, rather than microservices.', isMvp: true },
    { category: 'PHASE_2', name: '7. Configure PostgreSQL + Prisma', description: 'Set up PostgreSQL connection string in .env and initialize Prisma client ORM configuration.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Configure DATABASE_URL and initialize prisma/schema.prisma.', technicalNotes: 'Prisma client singleton with connection pooling.', isMvp: true },
    { category: 'PHASE_2', name: '8. Design core database tables: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status', description: 'Design relational tables with foreign keys: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write Prisma schema models with relational constraints and cascade rules.', technicalNotes: 'Include GrievanceHistory model for audit trail timestamps and actor tracking.', isMvp: true },
    { category: 'PHASE_2', name: '9. Create Prisma schema and run first migration', description: 'Execute prisma migrate dev --name init to generate PostgreSQL migration and compile Prisma Client.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run initial Prisma migration and verify table generation.', technicalNotes: 'Ensure foreign key relations and indexes are applied in PostgreSQL.', isMvp: true },
    { category: 'PHASE_2', name: '10. Create seed data: users, roles, categories, statuses and 10–20 sample grievances', description: 'Seed script generating Admin, Supervisor, Officer users, office hierarchies, category types, and 10–20 realistic sample grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write prisma/seed.ts with sample utility grievance records.', technicalNotes: 'Include overdue, due today, and pending records to test dashboard metrics.', isMvp: true },

    // Phase 3 — Authentication
    { category: 'PHASE_3', name: '11. Create login API', description: 'Build POST /api/auth/login endpoint accepting email/username and password credentials with validation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement login route handler and credential verification.', technicalNotes: 'Express handler with Zod request body validation.', isMvp: true },
    { category: 'PHASE_3', name: '12. Implement password hashing + JWT authentication', description: 'Secure password verification with bcrypt and issue signed JWT access tokens with user payload.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement bcrypt.compare and JWT token sign / verify utilities.', technicalNotes: 'Store JWT secret in environment variable with expiration time.', isMvp: true },
    { category: 'PHASE_3', name: '13. Create frontend login page and connect it to API', description: 'Build responsive React login form with loading spinners, error banners, and authentication context.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build LoginForm component and link to api.login().', technicalNotes: 'React state for email/password and redirect upon successful auth.', isMvp: true },
    { category: 'PHASE_3', name: '14. Protect dashboard/grievance routes and implement logout', description: 'Implement ProtectedRoute wrapper, auth token persistence in localStorage/cookies, and logout session clearing.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement React Router ProtectedRoute guard and logout button.', technicalNotes: 'Milestone: You can log in → reach dashboard → refresh page → remain authenticated.', isMvp: true },

    // Phase 4 — Grievance Core
    { category: 'PHASE_4', name: '15. Build Create Grievance API + form', description: 'Build POST /api/grievances endpoint with auto-generated registration ID (e.g., GR-1001) and dynamic React form UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement Grievance creation controller and multipart file attachment upload.', technicalNotes: 'This is the heart of the product: create, view, assign, forward and update grievances.', isMvp: true },
    { category: 'PHASE_4', name: '16. Build Grievance List API + table UI', description: 'Build GET /api/grievances with search, category filtering, status tabs, and responsive data table UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTable component with search filter and pagination.', technicalNotes: 'Prisma query with where filters for category, status, and owner.', isMvp: true },
    { category: 'PHASE_4', name: '17. Build Grievance Details page', description: 'Build full grievance detail view showing metadata, timeline, complainant details, attachments, and current owner.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Design GrievanceDetail view with action toolbar and history sidebar.', technicalNotes: 'Fetch grievance by ID with include: { history: true, attachments: true }.', isMvp: true },
    { category: 'PHASE_4', name: '18. Implement Assign / Change Owner', description: 'Enable supervisors to assign or transfer grievance ownership to specific junior engineers / officers.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/assign endpoint and owner selector dropdown.', technicalNotes: 'Prisma transaction: update currentOwnerId + insert GrievanceHistory log.', isMvp: true },
    { category: 'PHASE_4', name: '19. Implement Update Status', description: 'Allow assigned officers to transition grievance status (e.g., Assigned -> In Progress -> Resolved).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/status endpoint with status selection modal.', technicalNotes: 'Validate allowed status transition in state machine before persisting.', isMvp: true },
    { category: 'PHASE_4', name: '20. Implement Forward Grievance with receiving officer + note', description: 'Forwarding engine enabling officers to route grievance to another office/officer with mandatory note.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build Forward Grievance modal dialog with receiving officer picker and forwarding remarks.', technicalNotes: 'Atomic transaction recording forwarding reason in GrievanceHistory.', isMvp: true },

    // Phase 5 — Accountability & Dashboard
    { category: 'PHASE_5', name: '21. Implement Grievance History — record every important action', description: 'Immutable timeline auditing every creation, assignment, forwarding, note, and status update with actor and timestamp.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTimeline component rendering chronological history events.', technicalNotes: 'GrievanceHistory query ordered by timestamp ascending.', isMvp: true },
    { category: 'PHASE_5', name: '22. Add deadline calculation and Pending / Due Today / Overdue logic', description: 'Backend logic computing statutory SLA countdown: > 3 days (Normal), 1-3 days (Due Soon), 0 days (Due Today), < 0 days (Overdue).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement date calculation utility for SLA breach detection and badge color coding.', technicalNotes: 'Compare deadline with new Date() and assign urgency level.', isMvp: true },
    { category: 'PHASE_5', name: '23. Build Dashboard cards: Total / Pending / Due Today / Overdue / Resolved', description: 'High-impact KPI summary cards displaying live counts for Total, Pending, Due Today, Overdue, and Resolved grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build DashboardMetricCards component connected to /api/dashboard/stats.', technicalNotes: 'Single Prisma aggregation query for rapid dashboard load.', isMvp: true },
    { category: 'PHASE_5', name: '24. Build Attention Required table: grievance + owner + deadline + status', description: 'Prominent dashboard table highlighting high-priority overdue and due-today items requiring immediate supervisor escalation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build AttentionRequiredTable component with direct 1-click action buttons.', technicalNotes: 'Prisma query where status != "RESOLVED" and deadline <= today + 2 days.', isMvp: true },
    { category: 'PHASE_5', name: '25. End-to-end test + responsive UI + error/loading states + deploy MVP', description: 'Comprehensive end-to-end testing, mobile responsiveness polish, empty/error state handling, and production MVP deployment.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run complete regression tests and deploy production build.', technicalNotes: 'Build verification with npm run build and cross-device testing.', isMvp: true },

    // Future Ideas (Post-MVP)
    { category: 'FUTURE', name: 'GIS Survey & Field Mapping (Post-MVP)', description: 'MapLibre/Turf.js map interface to pinpoint poles, measure distance, and generate route surveys.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'MapLibre + OpenStreetMap + Turf.js integration.', isMvp: false },
    { category: 'FUTURE', name: 'Meter Challenge Management (Post-MVP)', description: 'Meter dispute workflow tracking testing dates, laboratory reports, and statutory SLA limits.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Follows same core workflow architecture.', isMvp: false },
    { category: 'FUTURE', name: 'Work Orders & Field Maintenance (Post-MVP)', description: 'Work orders for transformer maintenance, pole replacement, and line repairs.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Operational task management engine.', isMvp: false },
    { category: 'FUTURE', name: 'AI Operations Assistant & Summarizer (Post-MVP)', description: 'LLM-powered daily operations attention summaries and grievance history brief generator.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'LLM synthesis layer over structured grievance events.', isMvp: false },
  ];

  for (const step of gridOpsMvpSteps) {
    await prisma.projectFeature.create({
      data: {
        projectId: project.id,
        ...step,
      },
    });
  }

  console.log(`✅ Seeded flagship project: ${project.name} with ${gridOpsMvpSteps.length} items (25 MVP Steps + Post-MVP modules).`);

  // 5. Seed Full Stack Interview Preparation Topics (170 Curated Topics across 10 Categories)
  const { INTERVIEW_TOPICS_CATALOG } = await import('../server/seedInterviewData.js');
  for (const t of INTERVIEW_TOPICS_CATALOG) {
    await prisma.interviewTopic.create({
      data: {
        userId: user.id,
        category: t.category,
        name: t.name,
        status: t.status,
        confidence: t.confidence,
        priority: t.priority,
        phase: t.phase,
        notes: t.notes || '',
        keyQuestions: t.keyQuestions || '',
        practicalTips: t.practicalTips || '',
      },
    });
  }

  console.log(`✅ Seeded all ${INTERVIEW_TOPICS_CATALOG.length} Interview Topics across 10 categories.`);

  // 6. Seed Parked Ideas (Parking Lot Garage)
  const parkedIdeasData = [
    { title: 'Explore Hono framework on Cloudflare Workers for ultra-low latency Grievance API', category: 'TECH_STACK', notes: 'Check edge computing benefits during free time; keep current Node/Express focus active.', status: 'PARKED' },
    { title: 'Learn Rust for high-throughput meter data processing', category: 'COURSE', notes: 'Parked! Do not switch stacks mid-sprint. Master TypeScript/Node first.', status: 'PARKED' },
    { title: 'Build automated PDF export template with React-PDF for Grievance audit', category: 'PROJECT_IDEA', notes: 'Valid post-MVP feature. Review during Sunday triage.', status: 'PARKED' },
  ];

  for (const pi of parkedIdeasData) {
    await prisma.parkedIdea.create({
      data: {
        userId: user.id,
        ...pi,
      },
    });
  }

  console.log(`✅ Seeded ${parkedIdeasData.length} Parked Ideas in Parking Lot.`);

  // 7. Initial Work Sessions & Daily Reviews: Clean Day 1 Start (0 streak, 0 sessions)
  console.log(`✅ Initialized clean Day 1 state (0 logged sessions, 0 streak).`);

  // 8. Seed Roadmap Items
  const roadmapItems = [
    { phase: 'PHASE_1', name: 'Master 80 DSA Questions across 9 Locked Topics', category: 'DSA', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Currently on Topic 4: Sliding Window.' },
    { phase: 'PHASE_1', name: 'Ship Core Workflows of Employee Grievance Management System', category: 'PROJECT', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Core forward flow, pending duration index, SLA countdown.' },
    { phase: 'PHASE_1', name: 'Full Stack Tech Readiness (JS, TS, React, Node, Postgres, Prisma)', category: 'INTERVIEW', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Daily revision of critical concepts.' },
    { phase: 'PHASE_2', name: 'Computer Science Fundamentals (OS, DBMS, Networks)', category: 'CS_CORE', priority: 'UPCOMING', status: 'QUEUED', notes: 'Scheduled for next month. Do not disrupt Phase 1.' },
    { phase: 'PHASE_2', name: 'High-Level System Design & Mock Interviews', category: 'INTERVIEW', priority: 'UPCOMING', status: 'QUEUED', notes: 'Scheduled for next month.' },
  ];

  for (const ri of roadmapItems) {
    await prisma.roadmapItem.create({
      data: {
        userId: user.id,
        ...ri,
      },
    });
  }

  console.log(`✅ Seeded ${roadmapItems.length} Roadmap items.`);
  console.log('🎉 CareerOS Seed Complete! Database is fully initialized.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
