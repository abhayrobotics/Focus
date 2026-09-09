import express from 'express';
import { prisma } from '../db.js';
import { format } from 'date-fns';

export const exportRouter = express.Router();

// Helper to escape CSV cell value according to RFC 4180
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // If string contains quotes, commas, newlines, or carriage returns, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvString(rows: (string | number | boolean | null | undefined)[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

// 1. Export DSA Questions & Notes CSV
exportRouter.get('/dsa', async (req, res) => {
  try {
    const questions = await prisma.dSAQuestion.findMany({
      orderBy: { number: 'asc' },
    });

    const headers = [
      'Sequence_Number',
      'Topic',
      'LeetCode_Number',
      'Title',
      'Difficulty',
      'Status',
      'Solved_Myself',
      'Date_Solved',
      'Time_Complexity',
      'Space_Complexity',
      'Approach_Pattern',
      'Mistake_Trap',
      'Solution_Code',
      'Needs_Revision',
      'Revision_Notes',
      'Problem_URL',
    ];

    const rows = [
      headers,
      ...questions.map((q: any) => [
        q.number,
        q.topic,
        q.leetcodeNumber || '',
        q.title,
        q.difficulty,
        q.status,
        q.solvedMyself ? 'YES' : 'NO (Needed Help)',
        q.dateSolved ? format(new Date(q.dateSolved), 'yyyy-MM-dd HH:mm:ss') : '',
        q.timeComplexity || '',
        q.spaceComplexity || '',
        q.approach || '',
        q.mistake || '',
        q.solution || '',
        q.needsRevision ? 'YES' : 'NO',
        q.revisionNotes || '',
        q.problemUrl || '',
      ]),
    ];

    const csvData = toCsvString(rows);
    const filename = `CareerOS_DSA_Questions_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Export Work Sessions & Study Logs CSV
exportRouter.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.workSession.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    const headers = [
      'Date',
      'Category',
      'Duration_Minutes',
      'Duration_Hours',
      'Task_Title',
      'Notes',
      'Created_At',
    ];

    const rows = [
      headers,
      ...sessions.map((s: any) => [
        s.date,
        s.category,
        s.durationMinutes,
        parseFloat((s.durationMinutes / 60).toFixed(2)),
        s.taskTitle,
        s.notes || '',
        format(new Date(s.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]),
    ];

    const csvData = toCsvString(rows);
    const filename = `CareerOS_Work_Sessions_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Export Daily Reflections CSV
exportRouter.get('/reviews', async (req, res) => {
  try {
    const reviews = await prisma.dailyReview.findMany({
      orderBy: { date: 'desc' },
    });

    const headers = [
      'Date',
      'Target_Hours',
      'Actual_Hours',
      'Energy_Score_1_to_5',
      'Focus_Score_1_to_5',
      'Completed_Planned',
      'Deciding_Loop_Trap',
      'Did_DSA',
      'Did_Project',
      'Did_Interview',
      'Learned_Invariant',
      'Mistake_Trap',
      'Tomorrow_Priority',
      'Planning_Changes',
    ];

    const rows = [
      headers,
      ...reviews.map((r: any) => [
        r.date,
        r.targetHours,
        r.actualHours,
        r.energy,
        r.focus,
        r.completedPlanned ? 'YES' : 'NO',
        r.spentTooMuchTimeDeciding ? 'YES' : 'NO',
        r.didDsa ? 'YES' : 'NO',
        r.didProject ? 'YES' : 'NO',
        r.didInterview ? 'YES' : 'NO',
        r.oneThingLearned || '',
        r.oneMistake || '',
        r.tomorrowPriority || '',
        r.planningChanges,
      ]),
    ];

    const csvData = toCsvString(rows);
    const filename = `CareerOS_Daily_Reflections_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Export Project Features CSV
exportRouter.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        features: {
          orderBy: [{ isMvp: 'desc' }, { priority: 'asc' }],
        },
      },
    });

    const headers = [
      'Project_Name',
      'Is_Flagship',
      'Category',
      'Feature_Name',
      'Status',
      'Priority',
      'Progress_Percent',
      'Is_MVP',
      'Target_Date',
      'Next_Action',
      'Description',
      'Technical_Notes',
    ];

    const rows: (string | number | boolean | null | undefined)[][] = [headers];

    for (const p of projects as any[]) {
      for (const f of (p.features || []) as any[]) {
        rows.push([
          p.name,
          p.isFlagship ? 'YES' : 'NO',
          f.category,
          f.name,
          f.status,
          f.priority,
          `${f.progress}%`,
          f.isMvp ? 'YES' : 'NO (Future Phase)',
          f.targetDate ? format(new Date(f.targetDate), 'yyyy-MM-dd') : '',
          f.nextAction || '',
          f.description || '',
          f.technicalNotes || '',
        ]);
      }
    }

    const csvData = toCsvString(rows);
    const filename = `CareerOS_Project_Features_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4.5 Export Interview Practice Topics CSV (Excel-Compatible)
exportRouter.get('/interview', async (req, res) => {
  try {
    const topics = await prisma.interviewTopic.findMany({
      orderBy: [{ phase: 'asc' }, { category: 'asc' }, { priority: 'asc' }],
    });

    const headers = [
      'Category',
      'Topic_Name',
      'Priority',
      'Status',
      'Confidence_1_to_5',
      'Phase',
      'Practical_Tips',
      'Key_Questions',
      'Notes',
    ];

    const rows = [
      headers,
      ...topics.map((t: any) => [
        t.category,
        t.name,
        t.priority,
        t.status,
        t.confidence,
        t.phase,
        t.practicalTips || '',
        t.keyQuestions || '',
        t.notes || '',
      ]),
    ];

    const csvData = toCsvString(rows);
    const filename = `CareerOS_Interview_Topics_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4.8 Export Job Applications & Interview Pipeline CSV (Excel-Compatible)
exportRouter.get('/applications', async (req, res) => {
  try {
    const db = prisma as any;
    const applications = await db.jobApplication.findMany({
      include: {
        rounds: {
          orderBy: { roundNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Company_Name',
      'Role',
      'Location',
      'Current_Status',
      'Platform_Source',
      'Applied_Date',
      'Salary_Range',
      'Total_Rounds_Count',
      'Latest_Round_Name',
      'Latest_Round_Status',
      'Latest_Round_Scheduled',
      'All_Questions_Asked',
      'All_Feedback_Learnings',
      'Contact_Person',
      'Contact_Email',
      'Resume_Version',
      'Job_URL',
      'Notes',
    ];

    const rows = [
      headers,
      ...applications.map((app: any) => {
        const rounds = app.rounds || [];
        const latestRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
        const allQuestions = rounds
          .filter((r: any) => r.questionsAsked)
          .map((r: any) => `[R${r.roundNumber} - ${r.roundName}]: ${r.questionsAsked}`)
          .join(' | ');
        const allFeedback = rounds
          .filter((r: any) => r.feedback)
          .map((r: any) => `[R${r.roundNumber} - ${r.roundName}]: ${r.feedback}`)
          .join(' | ');

        return [
          app.companyName,
          app.role,
          app.location || 'Remote',
          app.status,
          app.platform,
          app.appliedDate,
          app.salaryRange || '',
          rounds.length,
          latestRound ? latestRound.roundName : '',
          latestRound ? latestRound.status : '',
          latestRound && latestRound.scheduledAt ? format(new Date(latestRound.scheduledAt), 'yyyy-MM-dd HH:mm') : '',
          allQuestions,
          allFeedback,
          app.contactPerson || '',
          app.contactEmail || '',
          app.resumeVersion || '',
          app.jobUrl || '',
          app.notes || '',
        ];
      }),
    ];

    const csvData = toCsvString(rows);
    const filename = `CareerOS_Job_Applications_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err: any) {
    console.error('Error exporting applications CSV:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Complete All-In-One Formatted Database Backup CSV
exportRouter.get('/full-backup', async (req, res) => {
  try {
    const db = prisma as any;
    const [questions, sessions, reviews, projects, interviewTopics, parkedIdeas, applications] = await Promise.all([
      db.dSAQuestion.findMany({ orderBy: { number: 'asc' } }),
      db.workSession.findMany({ orderBy: { date: 'desc' } }),
      db.dailyReview.findMany({ orderBy: { date: 'desc' } }),
      db.project.findMany({ include: { features: true } }),
      db.interviewTopic.findMany({ orderBy: { category: 'asc' } }),
      db.parkedIdea.findMany({ orderBy: { createdAt: 'desc' } }),
      db.jobApplication.findMany({ include: { rounds: { orderBy: { roundNumber: 'asc' } } }, orderBy: { createdAt: 'desc' } }),
    ]);

    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const sections: string[] = [];

    // Header Meta
    sections.push(`=== CAREEROS DATABASE FULL BACKUP ===\r\nGenerated_At: ${timestamp}\r\nTotal_DSA_Questions: ${questions.length}\r\nTotal_Work_Sessions: ${sessions.length}\r\nTotal_Daily_Reviews: ${reviews.length}\r\nTotal_Job_Applications: ${applications.length}\r\n\r\n`);

    // Section 1: DSA
    sections.push('### SECTION 1: DSA CURRICULUM & NOTES ###');
    sections.push(
      toCsvString([
        [
          'Sequence_Number',
          'Topic',
          'LeetCode_Number',
          'Title',
          'Difficulty',
          'Status',
          'Solved_Myself',
          'Date_Solved',
          'Time_Complexity',
          'Space_Complexity',
          'Approach_Pattern',
          'Mistake_Trap',
          'Revision_Notes',
          'Needs_Revision',
          'Problem_URL',
        ],
        ...questions.map((q: any) => [
          q.number,
          q.topic,
          q.leetcodeNumber || '',
          q.title,
          q.difficulty,
          q.status,
          q.solvedMyself ? 'YES' : 'NO',
          q.dateSolved ? format(new Date(q.dateSolved), 'yyyy-MM-dd') : '',
          q.timeComplexity || '',
          q.spaceComplexity || '',
          q.approach || '',
          q.mistake || '',
          q.revisionNotes || '',
          q.needsRevision ? 'YES' : 'NO',
          q.problemUrl || '',
        ]),
      ])
    );

    // Section 2: Work Sessions
    sections.push('\r\n### SECTION 2: WORK SESSIONS LOG ###');
    sections.push(
      toCsvString([
        ['Date', 'Category', 'Duration_Minutes', 'Task_Title', 'Notes', 'Created_At'],
        ...sessions.map((s: any) => [
          s.date,
          s.category,
          s.durationMinutes,
          s.taskTitle,
          s.notes || '',
          format(new Date(s.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        ]),
      ])
    );

    // Section 3: Daily Reflections
    sections.push('\r\n### SECTION 3: DAILY GROWTH REFLECTIONS ###');
    sections.push(
      toCsvString([
        [
          'Date',
          'Target_Hours',
          'Actual_Hours',
          'Energy_1_to_5',
          'Focus_1_to_5',
          'Completed_Planned',
          'Deciding_Loop',
          'Learned_Invariant',
          'Mistake_Trap',
          'Tomorrow_Priority',
        ],
        ...reviews.map((r: any) => [
          r.date,
          r.targetHours,
          r.actualHours,
          r.energy,
          r.focus,
          r.completedPlanned ? 'YES' : 'NO',
          r.spentTooMuchTimeDeciding ? 'YES' : 'NO',
          r.oneThingLearned || '',
          r.oneMistake || '',
          r.tomorrowPriority || '',
        ]),
      ])
    );

    // Section 4: Projects & Features
    sections.push('\r\n### SECTION 4: PROJECT FEATURES & MVP ###');
    const projectRows: (string | number | boolean | null | undefined)[][] = [
      ['Project_Name', 'Category', 'Feature_Name', 'Status', 'Priority', 'Progress', 'Next_Action', 'Technical_Notes'],
    ];
    for (const p of projects as any[]) {
      for (const f of (p.features || []) as any[]) {
        projectRows.push([
          p.name,
          f.category,
          f.name,
          f.status,
          f.priority,
          `${f.progress}%`,
          f.nextAction || '',
          f.technicalNotes || '',
        ]);
      }
    }
    sections.push(toCsvString(projectRows));

    // Section 5: Interview Topics
    sections.push('\r\n### SECTION 5: INTERVIEW TOPICS ###');
    sections.push(
      toCsvString([
        ['Category', 'Topic_Name', 'Status', 'Confidence_1_to_5', 'Priority', 'Phase', 'Key_Questions', 'Practical_Tips'],
        ...interviewTopics.map((t: any) => [
          t.category,
          t.name,
          t.status,
          t.confidence,
          t.priority,
          t.phase,
          t.keyQuestions || '',
          t.practicalTips || '',
        ]),
      ])
    );

    // Section 6: Parked Ideas
    sections.push('\r\n### SECTION 6: PARKING LOT (PARKED IDEAS) ###');
    sections.push(
      toCsvString([
        ['Title', 'Category', 'Status', 'Notes', 'Created_At'],
        ...parkedIdeas.map((pi: any) => [
          pi.title,
          pi.category,
          pi.status,
          pi.notes || '',
          format(new Date(pi.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        ]),
      ])
    );

    // Section 7: Job & Interview Applications
    sections.push('\r\n### SECTION 7: JOB & INTERVIEW APPLICATIONS PIPELINE ###');
    const appRows: (string | number | boolean | null | undefined)[][] = [
      ['Company_Name', 'Role', 'Location', 'Status', 'Platform', 'Applied_Date', 'Salary_Range', 'Rounds_Count', 'Latest_Round', 'Questions_Asked', 'Feedback_Learnings'],
    ];
    for (const app of applications as any[]) {
      const rounds = app.rounds || [];
      const latestRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
      const allQuestions = rounds
        .filter((r: any) => r.questionsAsked)
        .map((r: any) => `[${r.roundName}]: ${r.questionsAsked}`)
        .join(' | ');
      const allFeedback = rounds
        .filter((r: any) => r.feedback)
        .map((r: any) => `[${r.roundName}]: ${r.feedback}`)
        .join(' | ');

      appRows.push([
        app.companyName,
        app.role,
        app.location || 'Remote',
        app.status,
        app.platform,
        app.appliedDate,
        app.salaryRange || '',
        rounds.length,
        latestRound ? `${latestRound.roundName} (${latestRound.status})` : 'None',
        allQuestions,
        allFeedback,
      ]);
    }
    sections.push(toCsvString(appRows));

    const fullCsv = sections.join('\r\n');
    const filename = `CareerOS_Full_Backup_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(fullCsv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
