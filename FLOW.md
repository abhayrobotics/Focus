# 🌊 CareerOS: End-to-End System Architecture & Data Flows

This document provides a comprehensive technical breakdown of how data flows through **CareerOS** for every core feature — from the **Frontend Component UI** and **API Client** to the **Express Server Routing**, **Service Engines**, **Prisma ORM Queries**, and **SQLite Database Storage**.

---

## 🏛️ High-Level Layered Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (React 18 + Vite + Tailwind)"]
        UI[UI Components & Modals]
        API_CLIENT[src/services/api.ts]
    end

    subgraph Server ["Server Layer (Express.js + TypeScript)"]
        ROUTER[server/routes/*.ts]
        ANALYTICS[AnalyticsEngine.ts]
        RECOMMENDER[RecommendationEngine.ts]
    end

    subgraph Data ["Data & Persistence Layer"]
        PRISMA[Prisma ORM Client]
        SQLITE[(SQLite: career_os.db)]
    end

    UI -->|User Action / Hotkey| API_CLIENT
    API_CLIENT -->|HTTP Fetch / JSON| ROUTER
    ROUTER -->|Compute / Orchestrate| ANALYTICS
    ROUTER -->|Rank Next Action| RECOMMENDER
    ROUTER -->|Direct Query| PRISMA
    ANALYTICS --> PRISMA
    RECOMMENDER --> PRISMA
    PRISMA -->|SQL Transactions / Queries| SQLITE
    SQLITE -->|Row Results| PRISMA
    PRISMA -->|Typed Models| ROUTER
    ROUTER -->|HTTP Response 200| API_CLIENT
    API_CLIENT -->|State Update / Trigger| UI
```

---

## 🔁 Feature Flow 1: Master Dashboard & Smart Recommendation Engine

Eliminates study decision paralysis by computing today's progress, active streaks, 30m micro-win state, and the top 3 highest-leverage actions to do right now.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Dash as DashboardScreen.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/dashboard.ts
    participant Analytics as AnalyticsEngine.ts
    participant Recommender as RecommendationEngine.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    User->>Dash: Opens Dashboard or triggers refresh
    Dash->>Api: getDashboardSummary()
    Api->>Route: GET /api/dashboard/summary
    Route->>Analytics: getConsistencyStats()
    Analytics->>Prisma: workSession.findMany({ where: { date: todayStr } })
    Prisma->>DB: SELECT * FROM WorkSession WHERE date = '2026-09-09'
    DB-->>Analytics: Today's WorkSession rows
    Analytics->>Prisma: workSession.findMany() [All historical sessions]
    Prisma->>DB: SELECT date, durationMinutes FROM WorkSession
    DB-->>Analytics: Grouped session minutes by date
    Analytics-->>Route: ConsistencyStats { todayActualHours, currentStreak, todayStatus, weeklySummary, hasRedAlert }

    Route->>Recommender: getNextActions(todayRemainingMinutes)
    Recommender->>Prisma: dSAQuestion.findMany({ where: { needsRevision: true } })
    Recommender->>Prisma: projectFeature.findFirst({ where: { status: 'DEVELOPMENT' } })
    Recommender->>Prisma: interviewTopic.findMany({ where: { confidence: { lte: 3 } } })
    Prisma->>DB: Execute indexed filter queries
    DB-->>Recommender: Priority candidate records
    Recommender-->>Route: Top 3 prioritized Recommendation objects

    Route->>Prisma: project.findFirst({ where: { isFlagship: true } })
    Route->>Prisma: dSAQuestion.count()
    Prisma->>DB: Aggregation queries
    DB-->>Route: Project & DSA snapshot counts
    Route-->>Api: 200 OK JSON { consistency, recommendations, projectSnapshot, dsaSnapshot }
    Api-->>Dash: DashboardData state updated
    Dash-->>User: Renders Progress Hero, Streak Flame, Next Action Cards & Heatmap
```

### Detailed Trace
1. **Frontend Trigger**: `DashboardScreen.tsx` mounts or receives a `refreshTrigger` increment.
2. **API Request**: `api.getDashboardSummary()` sends `GET /api/dashboard/summary`.
3. **Server Execution**:
   - `server/routes/dashboard.ts` invokes `AnalyticsEngine.getConsistencyStats()`.
   - Computes:
     - `todayActualHours = sum(todaySessions.durationMinutes) / 60`
     - `todayStatus`: `'TARGET_MET'` if $\ge 4\text{h}$, `'STUDIED_PACE'` if $\ge 30\text{m}$, else `'INACTIVE'`.
     - `currentStreak`: Iterates backwards day-by-day counting days where $\text{loggedMinutes} \ge 30$.
     - `hasRedAlert`: Flags `true` if previous 2 consecutive days had 0 minutes logged.
   - Invokes `RecommendationEngine.getNextActions()`:
     - Priority 1: Top un-reviewed or revision DSA question from the current active topic.
     - Priority 2: Next concrete actionable feature from `GridOps Platform`.
     - Priority 3: Lowest confidence interview topic score ($\le 3/5$).
4. **Database Response**: SQLite returns matched records via Prisma.
5. **UI Update**: `DashboardScreen.tsx` renders the hero target bar, streak pill, and 3 one-click start buttons.

---

## ⚡ Feature Flow 2: Fast Work Session Logging (< 10s Execution Capture)

Captures verified deep work in under 10 seconds and instantly updates the consistency bar chart and streak counter.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as SessionLoggerModal.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/sessions.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)
    participant App as App.tsx

    User->>Modal: Hits Ctrl+L or clicks "+ Log Work"
    User->>Modal: Selects Category (DSA), Duration (45m), types Title, clicks Save
    Modal->>Api: logWorkSession({ category, durationMinutes: 45, taskTitle, date })
    Api->>Route: POST /api/work-sessions (Body JSON)
    Route->>Route: Validate duration > 0 and taskTitle non-empty
    Route->>Prisma: workSession.create({ data: { category, durationMinutes, taskTitle, notes, date } })
    Prisma->>DB: INSERT INTO WorkSession (id, userId, date, category, durationMinutes, taskTitle, createdAt) VALUES (...)
    DB-->>Prisma: Inserted WorkSession row
    Prisma-->>Route: WorkSession record
    Route-->>Api: 201 Created JSON
    Api-->>Modal: Success response
    Modal->>App: onSessionLogged() -> handleRefresh()
    App->>App: setRefreshTrigger(prev => prev + 1)
    App-->>User: Modal closes, Dashboard streak & hours bar instantly update
```

### Detailed Trace
1. **Frontend Trigger**: User hits global shortcut **`Ctrl + L`** or clicks **`+ Log Work`** in header.
2. **Form State**: Category chips (`DSA`, `PROJECT`, `INTERVIEW`, `OTHER`), quick-pick duration badges (`15m`, `30m`, `45m`, `1h`, `1.5h`, `2h`), and task input.
3. **API Request**: `api.logWorkSession()` dispatches `POST /api/work-sessions`.
4. **Server Handling**:
   - `server/routes/sessions.ts` verifies session payload.
   - Executes `prisma.workSession.create()`.
5. **Database Execution**: SQLite inserts row into `WorkSession` table.
6. **Reactivity**: `App.tsx` increments `refreshTrigger`, prompting `DashboardScreen` and `Header` to re-fetch summary and re-render progress meters.

---

## 🅿️ Feature Flow 3: Parking Lot (Distraction Capture & Graduation)

Protects sprint focus by parking shiny new tools, frameworks, and side ideas in 5 seconds, with one-click graduation into the project feature tree.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as ParkingLotModal.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/parkingLot.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    Note over User,Modal: 1. Park Distraction Mid-Sprint
    User->>Modal: Hits Ctrl+P -> Enters "Learn WebGPU" -> Clicks "Park It"
    Modal->>Api: parkIdea({ title, category: 'TECH_STACK', notes })
    Api->>Route: POST /api/parking-lot
    Route->>Prisma: parkedIdea.create({ data: { title, category, notes, status: 'PARKED' } })
    Prisma->>DB: INSERT INTO ParkedIdea (...)
    DB-->>Route: Created ParkedIdea
    Route-->>Modal: 201 Created -> Idea added to list

    Note over User,Modal: 2. Graduate Idea to Flagship Project
    User->>Modal: Clicks "Graduate to Project" on parked idea
    Modal->>Api: graduateParkedIdea(ideaId)
    Api->>Route: POST /api/parking-lot/:id/graduate
    Route->>Prisma: project.findFirst({ where: { isFlagship: true } })
    Route->>Prisma: $transaction([ projectFeature.create(...), parkedIdea.update(...) ])
    Prisma->>DB: BEGIN TRANSACTION;
    Prisma->>DB: INSERT INTO ProjectFeature (projectId, name, category, isMvp=false, status='IDEA');
    Prisma->>DB: UPDATE ParkedIdea SET status='GRADUATED', graduatedFeatureId=featId WHERE id=ideaId;
    Prisma->>DB: COMMIT;
    DB-->>Route: Transaction confirmed
    Route-->>Modal: 200 OK -> Idea graduated
    Modal-->>User: Badge shows "Graduated to Project Feature tree!"
```

### Detailed Trace
1. **Distraction Capture**: Hit **`Ctrl + P`** from any page.
2. **API Call**: `POST /api/parking-lot` with title, category, and notes.
3. **Database Insertion**: Stored in `ParkedIdea` table with `status = 'PARKED'`.
4. **Triage & Graduation**: During weekly review, clicking *"Graduate to Project"* calls `POST /api/parking-lot/:id/graduate`.
5. **Prisma Transaction**: In a single `$transaction`, creates a new `ProjectFeature` under the flagship project (`GridOps`) and updates the `ParkedIdea` status to `'GRADUATED'`.

---

## 🎯 Feature Flow 4: Locked 80-Question DSA Tracker

Tracks the curated 80-question curriculum across 9 topic modules with metacognitive solving metrics (*"Solved Myself"* vs *"Needed Help"* and *Mistake Log*).

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Screen as DsaScreen.tsx
    participant Modal as QuestionDetailModal.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/dsa.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    User->>Screen: Navigates to DSA tab / searches / filters by topic
    Screen->>Api: getDsaQuestions({ topic, difficulty, status, search })
    Api->>Route: GET /api/dsa/questions?topic=Arrays&difficulty=Medium
    Route->>Prisma: dSAQuestion.findMany({ where: { ...filters }, orderBy: { number: 'asc' } })
    Route->>Prisma: dSAQuestion.findMany({ select: { topic: true, status: true } })
    Prisma->>DB: SELECT * FROM DSAQuestion WHERE ...
    DB-->>Route: Matched questions + dynamic topic distribution
    Route-->>Screen: JSON { overview, topicStats, questions }
    Screen-->>User: Displays 80-question sequence table with status badges

    User->>Screen: Clicks Question #4 "Product of Array Except Self"
    Screen->>Modal: Opens QuestionDetailModal with question data
    User->>Modal: Selects "Needed Help", logs trap in Mistake Log, marks "Mark for Revision"
    Modal->>Api: updateDsaQuestion(id, { status: 'SOLVED', solvedMyself: false, mistake, needsRevision: true })
    Api->>Route: PUT /api/dsa/questions/:id
    Route->>Prisma: dSAQuestion.update({ where: { id }, data: { ...updates, dateSolved: new Date() } })
    Prisma->>DB: UPDATE DSAQuestion SET status='SOLVED', solvedMyself=0, mistake=... WHERE id='dsa_004'
    DB-->>Route: Updated row
    Route-->>Modal: 200 OK
    Modal->>Screen: onUpdated() -> re-fetches question list
    Screen-->>User: Row highlights as Solved (Needed Help) with Revision tag
```

---

## 🛠️ Feature Flow 5: Flagship Project Tree (GridOps Platform)

Manages the core MVP features, domain lifecycle states, and next immediate engineering actions for the **GridOps: Utility Grievance & Lifecycle Platform**.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Screen as ProjectsScreen.tsx
    participant Modal as FeatureDetailModal.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/projects.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    User->>Screen: Opens Projects Tab
    Screen->>Api: getProjects()
    Api->>Route: GET /api/projects
    Route->>Prisma: project.findMany({ include: { features: { orderBy: { priority: 'asc' } } } })
    Prisma->>DB: SELECT * FROM Project JOIN ProjectFeature ...
    DB-->>Route: Projects with full feature tree
    Route-->>Screen: JSON Array of Project objects with MVP vs Future groupings
    Screen-->>User: Displays Next Action Hero banner + Category cards

    User->>Screen: Clicks "Forwarding & Custody Transfer Workflow"
    Screen->>Modal: Opens FeatureDetailModal
    User->>Modal: Updates Progress to 100%, changes Status to 'COMPLETE'
    Modal->>Api: updateProjectFeature(featureId, { status: 'COMPLETE', progress: 100 })
    Api->>Route: PUT /api/projects/features/:featureId
    Route->>Prisma: projectFeature.update({ where: { id: featureId }, data: { status: 'COMPLETE', progress: 100 } })
    Prisma->>DB: UPDATE ProjectFeature SET status='COMPLETE', progress=100 WHERE id=featId
    DB-->>Route: Updated Feature
    Route-->>Modal: 200 OK
    Modal->>Screen: onUpdated() -> re-renders feature tree & MVP progress bar
```

---

## 📝 Feature Flow 6: 2-Minute Daily Growth & Consistency Heatmap

Locks in learnings at the end of each day, tracks decision paralysis loops, and generates the 365-day GitHub consistency heatmap.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as DailyReviewModal.tsx
    participant Screen as GrowthScreen.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/growth.ts
    participant Analytics as AnalyticsEngine.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    User->>Modal: Clicks "2-Min Reflection"
    User->>Modal: Rates Energy (4/5), Focus (5/5), logs "Sliding window shrinkage", sets Tomorrow's Priority
    Modal->>Api: submitDailyReview({ date: '2026-09-09', energy: 4, focus: 5, oneThingLearned, tomorrowPriority })
    Api->>Route: POST /api/growth/review
    Route->>Prisma: workSession.findMany({ where: { date: todayStr } })
    Route->>Prisma: dailyReview.upsert({ where: { userId_date }, create: { ... }, update: { ... } })
    Prisma->>DB: INSERT INTO DailyReview (...) ON CONFLICT(userId, date) DO UPDATE ...
    DB-->>Route: Saved DailyReview
    Route-->>Modal: 200 OK

    Note over Screen,DB: 365-Day Heatmap Generation
    Screen->>Api: getHeatmapData(2026)
    Api->>Route: GET /api/growth/heatmap?year=2026
    Route->>Analytics: generateYearHeatmap(2026)
    Analytics->>Prisma: workSession.findMany({ where: { date: { gte: '2026-01-01', lte: '2026-12-31' } } })
    Prisma->>DB: SELECT date, durationMinutes, category FROM WorkSession WHERE ...
    DB-->>Analytics: All year sessions
    Analytics->>Analytics: Maps every day in 365-day interval to intensity level (0: 0m, 1: >=30m, 2: >=2h, 3: >=4h)
    Analytics-->>Route: Array of 365 HeatmapDay objects
    Route-->>Api: 200 OK JSON HeatmapDay[]
    Api-->>Screen: Renders 52-week intensity matrix & 7-day hours chart
```

---

## 📥 Feature Flow 7: In-App Excel / CSV / JSON Importer

Allows bulk dataset loading (such as 80 questions from Excel or custom project backlog features) without manual database scripting.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Modal as ImportModal.tsx
    participant Api as src/services/api.ts
    participant Route as server/routes/dsa.ts
    participant Prisma as Prisma Client
    participant DB as SQLite (career_os.db)

    User->>Modal: Opens "Import Excel / CSV" on DSA screen
    User->>Modal: Pastes tab-separated or comma-separated rows from Excel
    Modal->>Modal: Client parser extracts columns: #, Topic, Problem Title, Difficulty, URL
    User->>Modal: Clicks "Import Data"
    Modal->>Api: importDsaQuestions(parsedArray, replaceAll=false)
    Api->>Route: POST /api/dsa/import (Body: { questions, replaceAll })
    alt replaceAll is true
        Route->>Prisma: dSAQuestion.deleteMany({ where: { userId } })
        Prisma->>DB: DELETE FROM DSAQuestion WHERE userId = 'usr_main_01'
    end
    Route->>Prisma: dSAQuestion.createMany({ data: formattedQuestions })
    Prisma->>DB: INSERT INTO DSAQuestion (id, userId, number, topic, title, difficulty, problemUrl, status) VALUES ...
    DB-->>Route: Inserted batch count
    Route-->>Api: 200 OK JSON { message: "Imported 80 questions successfully" }
    Api-->>Modal: Success callback -> closes modal
    Modal-->>User: DSA table re-renders with the newly imported question set
```

---

## 🗄️ Database Entity-Relationship (ER) Schema

```mermaid
erDiagram
    User ||--o{ DSAQuestion : tracks
    User ||--o{ Project : owns
    User ||--o{ InterviewTopic : prepares
    User ||--o{ WorkSession : logs
    User ||--o{ DailyReview : reflects
    User ||--o{ ParkedIdea : parks
    User ||--o{ RoadmapItem : schedules

    Project ||--o{ ProjectFeature : contains

    User {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }

    DSAQuestion {
        string id PK
        string userId FK
        int number
        string topic
        string title
        string difficulty
        string problemUrl
        string status
        boolean solvedMyself
        string approach
        string mistake
        string timeComplexity
        string spaceComplexity
        boolean needsRevision
        datetime dateSolved
    }

    Project {
        string id PK
        string userId FK
        string name
        string description
        string status
        string githubUrl
        boolean isFlagship
    }

    ProjectFeature {
        string id PK
        string projectId FK
        string category
        string name
        string description
        string status
        string priority
        int progress
        string nextAction
        string technicalNotes
        boolean isMvp
    }

    InterviewTopic {
        string id PK
        string userId FK
        string category
        string name
        string status
        int confidence
        string priority
        string phase
        string keyQuestions
        string practicalTips
    }

    WorkSession {
        string id PK
        string userId FK
        string date
        string category
        int durationMinutes
        string taskTitle
        string notes
        datetime createdAt
    }

    DailyReview {
        string id PK
        string userId FK
        string date UK
        float targetHours
        float actualHours
        int energy
        int focus
        boolean completedPlanned
        boolean spentTooMuchTimeDeciding
        string oneThingLearned
        string oneMistake
        string tomorrowPriority
    }

    ParkedIdea {
        string id PK
        string userId FK
        string title
        string category
        string notes
        string status
        string graduatedFeatureId
    }

    RoadmapItem {
        string id PK
        string userId FK
        string phase
        string name
        string category
        string priority
        string status
    }
```

---

## 🛠️ Summary of API Endpoints

| Category | HTTP Method & Route | Handled In | Key Database Model | Primary Output |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET /api/dashboard/summary` | `server/routes/dashboard.ts` | `WorkSession`, `DSAQuestion`, `Project` | Streaks, hours, next actions & snapshot counts |
| **Work Sessions** | `GET /api/work-sessions` | `server/routes/sessions.ts` | `WorkSession` | History of logged sessions |
| **Work Sessions** | `POST /api/work-sessions` | `server/routes/sessions.ts` | `WorkSession` | Creates verified work log |
| **Work Sessions** | `DELETE /api/work-sessions/:id`| `server/routes/sessions.ts` | `WorkSession` | Removes accidentally logged session |
| **DSA Tracker** | `GET /api/dsa/questions` | `server/routes/dsa.ts` | `DSAQuestion` | 80 questions + dynamic topic percent stats |
| **DSA Tracker** | `PUT /api/dsa/questions/:id` | `server/routes/dsa.ts` | `DSAQuestion` | Updates solve state, mistakes & revision tag |
| **DSA Tracker** | `POST /api/dsa/import` | `server/routes/dsa.ts` | `DSAQuestion` | Bulk batch insert/replace |
| **Projects** | `GET /api/projects` | `server/routes/projects.ts` | `Project`, `ProjectFeature` | Flagship system feature tree |
| **Projects** | `PUT /api/projects/features/:id`| `server/routes/projects.ts`| `ProjectFeature` | Updates feature status, progress & next action |
| **Projects** | `POST /api/projects/import` | `server/routes/projects.ts` | `ProjectFeature` | Bulk imports features into project |
| **Parking Lot** | `GET /api/parking-lot` | `server/routes/parkingLot.ts` | `ParkedIdea` | List of parked distractions |
| **Parking Lot** | `POST /api/parking-lot` | `server/routes/parkingLot.ts` | `ParkedIdea` | Quick 5-second distraction capture |
| **Parking Lot** | `POST /api/parking-lot/:id/graduate`| `server/routes/parkingLot.ts`| `ParkedIdea`, `ProjectFeature` | Transactional graduation to Project feature |
| **Daily Growth** | `GET /api/growth/heatmap` | `server/routes/growth.ts` | `WorkSession` | 365-day intensity block matrix |
| **Daily Growth** | `GET /api/growth/review` | `server/routes/growth.ts` | `DailyReview`, `WorkSession` | Today's reflection + day's total minutes |
| **Daily Growth** | `POST /api/growth/review` | `server/routes/growth.ts` | `DailyReview` | Upserts daily reflection form |
| **Roadmap** | `GET /api/roadmap` | `server/routes/roadmap.ts` | `RoadmapItem`, `DSAQuestion` | Phase 1 vs Phase 2 milestones & metrics |
