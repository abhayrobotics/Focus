import express from 'express';
import { prisma } from '../db.js';
import { format } from 'date-fns';

export const sessionsRouter = express.Router();

// 1. Get sessions for a date or recent sessions
sessionsRouter.get('/', async (req, res) => {
  try {
    const { date, limit } = req.query;
    const where: any = {};
    if (date) {
      where.date = String(date);
    }

    const sessions = await prisma.workSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(String(limit), 10) : 50,
    });

    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to recalculate daily review stats for a given date
async function recalculateDailyReview(dateStr: string, userId?: string) {
  try {
    const effectiveUserId = userId || (await prisma.user.findFirst())?.id;
    if (!effectiveUserId) return;

    const daySessions = await prisma.workSession.findMany({ where: { date: dateStr } });
    const totalDayMin = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualHours = parseFloat((totalDayMin / 60).toFixed(2));

    const dObj = new Date(dateStr);
    const isWknd = dObj.getDay() === 0 || dObj.getDay() === 6;
    const targetHours = isWknd ? 6.0 : 4.0;

    await prisma.dailyReview.upsert({
      where: {
        userId_date: {
          userId: effectiveUserId,
          date: dateStr,
        },
      },
      update: {
        actualHours,
        didDsa: daySessions.some((s) => s.category === 'DSA'),
        didProject: daySessions.some((s) => s.category === 'PROJECT'),
        didInterview: daySessions.some((s) => s.category === 'INTERVIEW'),
        completedPlanned: actualHours >= 3.5,
      },
      create: {
        userId: effectiveUserId,
        date: dateStr,
        targetHours,
        actualHours,
        didDsa: daySessions.some((s) => s.category === 'DSA'),
        didProject: daySessions.some((s) => s.category === 'PROJECT'),
        didInterview: daySessions.some((s) => s.category === 'INTERVIEW'),
        completedPlanned: actualHours >= 3.5,
      },
    });
  } catch (err) {
    console.error(`Error recalculating review for ${dateStr}:`, err);
  }
}

// 2. Fast Log a new work session (< 10s log) or clear/reset to 0 min
sessionsRouter.post('/', async (req, res) => {
  try {
    const { category, durationMinutes, taskTitle, notes, date, dsaQuestionId, projectFeatureId } = req.body;
    const sessionDate = date || format(new Date(), 'yyyy-MM-dd');
    const numMinutes = parseInt(String(durationMinutes), 10);

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // If duration is 0, user wants to clear / reset logs for this date!
    if (numMinutes === 0) {
      await prisma.workSession.deleteMany({
        where: { date: sessionDate },
      });
      await recalculateDailyReview(sessionDate, user.id);
      return res.json({
        success: true,
        cleared: true,
        message: `Cleared all logged work sessions for ${sessionDate}. Total is reset to 0m.`,
      });
    }

    if (!category || isNaN(numMinutes) || !taskTitle) {
      return res.status(400).json({ error: 'Category, durationMinutes, and taskTitle are required.' });
    }

    const session = await prisma.workSession.create({
      data: {
        userId: user.id,
        date: sessionDate,
        category,
        durationMinutes: numMinutes,
        taskTitle,
        notes: notes || '',
        dsaQuestionId: dsaQuestionId || null,
        projectFeatureId: projectFeatureId || null,
      },
    });

    await recalculateDailyReview(sessionDate, user.id);
    res.json(session);
  } catch (err: any) {
    console.error('Error logging work session:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2b. Clear / Reset all work sessions for a specific date
sessionsRouter.delete('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const user = await prisma.user.findFirst();
    await prisma.workSession.deleteMany({
      where: { date },
    });
    if (user) {
      await recalculateDailyReview(date, user.id);
    }
    res.json({ success: true, message: `Cleared all work sessions for ${date}. Reset to 0m.` });
  } catch (err: any) {
    console.error(`Error clearing sessions for ${req.params.date}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Update / Change an existing work session
sessionsRouter.put('/:id', async (req, res) => {
  try {
    const { category, durationMinutes, taskTitle, notes, date } = req.body;
    const existing = await prisma.workSession.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Session not found.' });

    const numMinutes = durationMinutes !== undefined ? parseInt(String(durationMinutes), 10) : existing.durationMinutes;

    // If updated to 0 min, delete this session and recalculate
    if (numMinutes === 0) {
      await prisma.workSession.delete({ where: { id: req.params.id } });
      await recalculateDailyReview(existing.date);
      return res.json({ success: true, deleted: true, message: 'Session deleted (reset to 0m).' });
    }

    const updated = await prisma.workSession.update({
      where: { id: req.params.id },
      data: {
        category: category !== undefined ? category : existing.category,
        durationMinutes: numMinutes,
        taskTitle: taskTitle !== undefined ? taskTitle : existing.taskTitle,
        notes: notes !== undefined ? notes : existing.notes,
        date: date !== undefined ? date : existing.date,
      },
    });

    // Recalculate review for original date and new date if date changed
    await recalculateDailyReview(existing.date);
    if (updated.date !== existing.date) {
      await recalculateDailyReview(updated.date);
    }

    res.json(updated);
  } catch (err: any) {
    console.error('Error updating work session:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Clean up / Remove duplicate work session logs
sessionsRouter.post('/deduplicate', async (req, res) => {
  try {
    const allSessions = await prisma.workSession.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const seen = new Map<string, string>(); // Key: date|category|taskTitle|duration -> First Session ID
    const duplicateIds: string[] = [];
    const affectedDates = new Set<string>();

    for (const session of allSessions) {
      // Create unique signature
      const key = `${session.date.trim()}|${session.category.trim()}|${session.taskTitle.trim().toLowerCase()}|${session.durationMinutes}`;
      if (seen.has(key)) {
        duplicateIds.push(session.id);
        affectedDates.add(session.date);
      } else {
        seen.set(key, session.id);
      }
    }

    if (duplicateIds.length > 0) {
      await prisma.workSession.deleteMany({
        where: { id: { in: duplicateIds } },
      });

      for (const dStr of affectedDates) {
        await recalculateDailyReview(dStr);
      }
    }

    res.json({
      success: true,
      removedCount: duplicateIds.length,
      affectedDates: Array.from(affectedDates),
      message: duplicateIds.length > 0
        ? `Cleaned up ${duplicateIds.length} duplicate work session log(s).`
        : 'No duplicate work sessions detected. All logs are unique.',
    });
  } catch (err: any) {
    console.error('Error deduplicating sessions:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete session
sessionsRouter.delete('/:id', async (req, res) => {
  try {
    const session = await prisma.workSession.findUnique({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    await prisma.workSession.delete({ where: { id: req.params.id } });
    await recalculateDailyReview(session.date);

    res.json({ success: true, message: 'Session deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
