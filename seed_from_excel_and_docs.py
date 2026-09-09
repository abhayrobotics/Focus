import sqlite3
import json
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

db_path = r"d:\Code\RoadMap 2026\Project\CareerTracker\prisma\career_os.db"
excel_json_path = r"d:\Code\RoadMap 2026\Project\CareerTracker\resources\parsed_excel.json"

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Fetch user
cur.execute("SELECT id, name FROM User LIMIT 1")
user = cur.fetchone()
if not user:
    user_id = 'usr_main_01'
    cur.execute("INSERT INTO User (id, name, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))", (user_id, 'Abhay'))
else:
    user_id = user[0]

print(f"Using User ID: {user_id}")

# 2. Parse Excel Questions
with open(excel_json_path, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)['Sheet2']

headers = raw_data[0]
rows = raw_data[1:]

print(f"Total rows in Excel: {len(rows)}")

# Clear old questions
cur.execute("DELETE FROM DSAQuestion WHERE userId = ?", (user_id,))

def get_col(row, idx, default=''):
    return row[idx].strip() if idx < len(row) and row[idx] else default

def make_slug(title):
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    return re.sub(r'[\s_]+', '-', clean)

questions_to_insert = []
for idx, r in enumerate(rows):
    sl_no = int(get_col(r, 0, str(idx + 1)))
    phase = get_col(r, 1, 'Phase 1A')
    leetcode_num_str = get_col(r, 2, str(sl_no))
    leetcode_num = int(re.sub(r'[^0-9]', '', leetcode_num_str)) if re.sub(r'[^0-9]', '', leetcode_num_str) else sl_no
    topic = get_col(r, 3, 'Arrays')
    pattern = get_col(r, 4, '')
    problem_name = get_col(r, 5, f"Problem {sl_no}")
    difficulty = get_col(r, 6, 'Medium')
    excel_status = get_col(r, 7, 'Todo').lower()
    confidence = get_col(r, 8, '3')
    key_insight = get_col(r, 9, '')
    time_comp = get_col(r, 10, '')
    space_comp = get_col(r, 11, '')
    mistake = get_col(r, 15, '')
    revision_needed_str = get_col(r, 16, '').lower()
    needs_revision = 1 if 'yes' in revision_needed_str or 'true' in revision_needed_str else 0

    # Status mapping
    if 'done' in excel_status or 'solved' in excel_status:
        db_status = 'SOLVED'
    elif 'progress' in excel_status or 'doing' in excel_status:
        db_status = 'IN_PROGRESS'
    elif 'revision' in excel_status:
        db_status = 'NEEDS_REVISION'
        needs_revision = 1
    else:
        db_status = 'NOT_STARTED'

    # Combine topic and pattern
    full_topic = topic
    full_approach = f"Pattern: {pattern}. {key_insight}" if pattern else key_insight

    slug = make_slug(problem_name)
    problem_url = f"https://leetcode.com/problems/{slug}/"

    q_id = f"dsa_{sl_no:03d}"
    questions_to_insert.append((
        q_id,
        user_id,
        sl_no,
        full_topic,
        problem_name,
        difficulty,
        problem_url,
        db_status,
        1, # solvedMyself
        None, # solution
        full_approach,
        mistake if mistake else None,
        time_comp if time_comp else 'O(N)',
        space_comp if space_comp else 'O(1)',
        None, # dateSolved
        needs_revision,
        None, # revisionNotes
    ))

cur.executemany("""
INSERT INTO DSAQuestion (
    id, userId, number, topic, title, difficulty, problemUrl, status,
    solvedMyself, solution, approach, mistake, timeComplexity, spaceComplexity,
    dateSolved, needsRevision, revisionNotes, createdAt, updatedAt
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
""", questions_to_insert)

print(f"✅ Successfully inserted {len(questions_to_insert)} questions from Master Career Tracker.xlsx into DSAQuestion table.")

# 3. Seed GridOps Project with Features from product thinking.docx & Grievance handling portal.docx
cur.execute("DELETE FROM ProjectFeature WHERE projectId IN (SELECT id FROM Project WHERE userId = ?)", (user_id,))
cur.execute("DELETE FROM Project WHERE userId = ?", (user_id,))

project_id = "proj_gridops_01"
cur.execute("""
INSERT INTO Project (
    id, userId, name, description, status, githubUrl, demoUrl, isFlagship, createdAt, updatedAt
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
""", (
    project_id,
    user_id,
    "GridOps: Utility Grievance & Lifecycle Platform",
    "Centralized operational utility management and field intelligence platform for grievance workflow, holder forwarding, SLA deadline tracking, and audit accountability.",
    "IN_PROGRESS",
    "https://github.com/abhay/gridops-platform",
    "https://gridops.internal.dev",
    1
))

gridops_features = [
    # MVP Core Features
    ("feat_01", project_id, "CORE", "Grievance Domain Model & Lifecycle State Machine", "Received -> Assigned -> In Progress -> Forwarded -> Resolved -> Closed state transitions with transition invariants.", "COMPLETE", "HIGH", 100, "Review state transition unit tests", "Finite State Machine with TypeScript enum guards", 1),
    ("feat_02", project_id, "CORE", "Role-Based Access Control & Hierarchy", "Consumer, Junior Engineer (JE), SDO / AE, Executive Engineer (EE), and Admin roles with scoping.", "COMPLETE", "HIGH", 100, "Add middleware tests for SDO delegation permissions", "JWT + Role Middleware", 1),
    ("feat_03", project_id, "CORE", "Grievance Creation & Dynamic SLA Calculation", "Intake form with category (Power outage, Billing, Meter defect, Line hazard), location, and 24h/72h SLA timer.", "COMPLETE", "HIGH", 100, "Wire up Zod validation on creation endpoint", "Zod schema validation + auto-calculated deadline", 1),
    ("feat_04", project_id, "CORE", "Forwarding & Custody Transfer Workflow", "Current Holder -> Forward To -> Transfer Reason/Note -> New Holder with mandatory non-empty audit remark.", "DEVELOPMENT", "HIGH", 75, "Implement POST /api/grievances/:id/forward endpoint with transactional holder change", "Prisma interactive transaction ($transaction)", 1),
    ("feat_05", project_id, "CORE", "SLA Deadline & Overdue Alert Engine", "Live timer calculating minutes remaining; flags Red Overdue when deadline passes without resolution.", "DEVELOPMENT", "HIGH", 60, "Build background cron / query for overdue calculation and priority boost", "Calculated on query + scheduled status checker", 1),
    ("feat_06", project_id, "CORE", "Immutable Activity Audit Trail & Timeline", "Every status change, holder transfer, document upload, and resolution note logged immutably with timestamp & actor.", "DEVELOPMENT", "HIGH", 50, "Connect timeline UI component to audit history endpoint", "Append-only AuditLog table", 1),
    ("feat_07", project_id, "CORE", "Document & Inspection Proof Attachments", "Photo/PDF attachment upload support for site inspection reports and consumer meter bills.", "PLANNED", "MEDIUM", 20, "Configure Multer / S3-compatible presigned URL upload handler", "File metadata table with storage key", 1),
    ("feat_08", project_id, "CORE", "Resolution Verification & Digital Closure Sign-Off", "Resolution summary, action taken proof, and supervisor confirmation before moving to Closed state.", "PLANNED", "HIGH", 0, "Build resolution modal with mandatory action report", "Closing signature / OTP confirmation", 1),
    ("feat_09", project_id, "REPORTS", "Operational SLA & Section Bottleneck Dashboard", "Visual dashboard showing Total, Pending, Due Today, Overdue, and bottleneck breakdown by section office.", "PLANNED", "HIGH", 10, "Create aggregate SQL / Prisma queries for section metrics", "Aggregated counts with indexed status/office", 1),
    ("feat_10", project_id, "DOCS", "Product B: Architecture Decision Records (ADRs)", "Engineering documentation: ADR-001 Modular Monolith, ADR-002 PostgreSQL/Prisma, ADR-003 REST API & State Machine.", "PLANNED", "HIGH", 30, "Draft ADR-001 in docs/09-architecture-decisions/", "Markdown ADR format in repo docs/", 1),
    
    # Phase 2 & Future Ideas (Parked from product thinking)
    ("feat_11", project_id, "METER", "Challenge Meter Handling & Bill Cycle Forecasting", "Tracking disputed meters, test bench verification appointments, and upcoming bill cycle alerts.", "IDEA", "MEDIUM", 0, "Specify test bench lab integration schema", "Phase 2 scope", 0),
    ("feat_12", project_id, "GIS", "GIS Survey & Geolocation Line Distance Measurement", "Field survey mapping, feeder line distance calculator, and mockup drawings based on GPS coordinates.", "IDEA", "LOW", 0, "Research Leaflet / OpenStreetMap GeoJSON layers", "Phase 3 scope", 0),
    ("feat_13", project_id, "AI", "Labour Audio-to-Text Field Report Transcription", "Speech-to-text recording by field crew converted into structured English/local work logs.", "IDEA", "LOW", 0, "Evaluate Whisper API vs on-device transcription", "Future AI layer", 0),
]

for feat in gridops_features:
    cur.execute("""
    INSERT INTO ProjectFeature (
        id, projectId, category, name, description, status, priority, progress,
        nextAction, technicalNotes, isMvp, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    """, feat)

print(f"✅ Successfully seeded {len(gridops_features)} features for GridOps Platform.")

# 4. Seed Parked Ideas (Distractions caught and parked)
cur.execute("DELETE FROM ParkedIdea WHERE userId = ?", (user_id,))
parked_ideas = [
    ("park_01", user_id, "GIS Survey & Line Distance Measurement", "GIS", "Draw mockup drawings on real geolocation and calculate feeder distance. (Parked for Phase 3 so MVP stays lean).", "PARKED", "feat_12"),
    ("park_02", user_id, "Labour Audio Field Logs via Whisper AI", "AI", "Speech-to-text for field crew voice notes converted into text in English and local languages. (Parked for post-MVP AI layer).", "PARKED", "feat_13"),
    ("park_03", user_id, "IPO News & GMP Tracker", "GENERAL", "Track IPO GMP, last application dates, and allotment results. (Parked personal side idea).", "PARKED", None),
    ("park_04", user_id, "Challenge Meter Bill Cycle Approaching Alerts", "METER", "Automated notifications when consumer meter challenges approach the billing cut-off date.", "PARKED", "feat_11"),
]

for p in parked_ideas:
    cur.execute("""
    INSERT INTO ParkedIdea (
        id, userId, title, category, notes, status, graduatedFeatureId, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    """, p)

print(f"✅ Successfully seeded {len(parked_ideas)} Parked Ideas.")

conn.commit()
conn.close()
print("🎉 All database seeding from Excel and Product Thinking docx completed successfully!")
