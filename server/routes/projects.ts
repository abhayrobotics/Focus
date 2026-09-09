import express from 'express';
import { prisma } from '../db.js';

export const projectsRouter = express.Router();

// 1. Get all projects with feature trees
projectsRouter.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        features: {
          orderBy: [
            { isMvp: 'desc' },
            { priority: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
      orderBy: { isFlagship: 'desc' },
    });

    const enrichedProjects = projects.map((p) => {
      const mvpFeatures = p.features.filter((f) => f.isMvp);
      const futureFeatures = p.features.filter((f) => !f.isMvp);

      const completedMvp = mvpFeatures.filter((f) => f.status === 'COMPLETE').length;
      const progressPercent = mvpFeatures.length > 0 ? Math.round((completedMvp / mvpFeatures.length) * 100) : 0;

      // Find top next action
      const activeFeature = mvpFeatures.find((f) => f.status === 'DEVELOPMENT' && f.nextAction) ||
        mvpFeatures.find((f) => f.status === 'PLANNED' && f.nextAction);

      return {
        ...p,
        progressPercent,
        completedCount: completedMvp,
        totalMvpCount: mvpFeatures.length,
        futureCount: futureFeatures.length,
        currentNextAction: activeFeature?.nextAction || 'Implement forwarding workflow API',
        currentNextFeatureName: activeFeature?.name || 'Forwarding Workflow & Ownership',
        mvpFeatures,
        futureFeatures,
      };
    });

    res.json(enrichedProjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a new feature
projectsRouter.post('/:id/features', async (req, res) => {
  try {
    const { name, category, description, priority, isMvp, targetDate, nextAction, technicalNotes } = req.body;
    if (!name) return res.status(400).json({ error: 'Feature name is required.' });

    const feature = await prisma.projectFeature.create({
      data: {
        projectId: req.params.id,
        name,
        category: category || 'CORE',
        description,
        priority: priority || 'HIGH',
        status: 'PLANNED',
        progress: 0,
        isMvp: isMvp !== false,
        targetDate: targetDate ? new Date(targetDate) : null,
        nextAction,
        technicalNotes,
      },
    });

    res.json(feature);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update feature
projectsRouter.put('/features/:featureId', async (req, res) => {
  try {
    const { name, category, description, status, priority, progress, targetDate, nextAction, technicalNotes, isMvp } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    if (status !== undefined) {
      data.status = status;
      if (status === 'COMPLETE') data.progress = 100;
    }
    if (priority !== undefined) data.priority = priority;
    if (progress !== undefined) data.progress = parseInt(progress, 10);
    if (targetDate !== undefined) data.targetDate = targetDate ? new Date(targetDate) : null;
    if (nextAction !== undefined) data.nextAction = nextAction;
    if (technicalNotes !== undefined) data.technicalNotes = technicalNotes;
    if (isMvp !== undefined) data.isMvp = Boolean(isMvp);

    const updated = await prisma.projectFeature.update({
      where: { id: req.params.featureId },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Import features
projectsRouter.post('/import', async (req, res) => {
  try {
    const { projectId, features } = req.body;
    if (!projectId || !Array.isArray(features)) {
      return res.status(400).json({ error: 'ProjectId and features array are required.' });
    }

    let count = 0;
    for (const f of features) {
      if (!f.name || !f.name.trim()) continue;

      let prio = (f.priority || 'HIGH').toUpperCase().trim();
      if (!['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(prio)) {
        prio = 'HIGH';
      }

      let stat = (f.status || 'PLANNED').toUpperCase().trim();
      if (!['PLANNED', 'DEVELOPMENT', 'COMPLETE'].includes(stat)) {
        stat = 'PLANNED';
      }

      await prisma.projectFeature.create({
        data: {
          projectId,
          name: f.name.trim(),
          category: f.category || 'CORE',
          description: f.description || '',
          priority: prio,
          isMvp: f.isMvp !== undefined ? Boolean(f.isMvp) : true,
          status: stat,
          progress: typeof f.progress === 'number' ? Math.min(100, Math.max(0, f.progress)) : 0,
          targetDate: f.targetDate || null,
          nextAction: f.nextAction || null,
          technicalNotes: f.technicalNotes || null,
        },
      });
      count++;
    }

    res.json({ success: true, importedCount: count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Reset all features to PLANNED and 0% progress
projectsRouter.post('/reset-progress', async (req, res) => {
  try {
    await prisma.projectFeature.updateMany({
      data: {
        status: 'PLANNED',
        progress: 0,
      },
    });
    res.json({ success: true, message: 'All project features reset to 0% progress (PLANNED).' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Seed / Sync GridOps 25-Step MVP Features
projectsRouter.post('/seed-gridops', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let project = await prisma.project.findFirst({ where: { isFlagship: true } });
    if (!project) {
      project = await prisma.project.create({
        data: {
          userId: user.id,
          name: 'GridOps: Utility Operations & Grievance Platform',
          description: 'Production-grade utility operations platform with employee grievance lifecycle, SLA deadline tracking, role-based forwarding, and accountability analytics.',
          status: 'IN_PROGRESS',
          isFlagship: true,
          githubUrl: 'https://github.com/abhay/grievance-management-system',
        },
      });
    } else {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          name: 'GridOps: Utility Operations & Grievance Platform',
          description: 'Production-grade utility operations platform with employee grievance lifecycle, SLA deadline tracking, role-based forwarding, and accountability analytics.',
        },
      });
    }

    // Delete existing features for this project to re-seed cleanly
    await prisma.projectFeature.deleteMany({ where: { projectId: project.id } });

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

    res.json({ success: true, count: gridOpsMvpSteps.length, message: 'Seeded GridOps 25-Step MVP Completion Tracker.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


