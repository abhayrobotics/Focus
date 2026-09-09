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

// 2. Fast Log a new work session (< 10s log)
sessionsRouter.post('/', async (req, res) => {
  try {
    const { category, durationMinutes, taskTitle, notes, date, dsaQuestionId, projectFeatureId } = req.body;
    if (!category || !durationMinutes || !taskTitle) {
      return res.status(400).json({ error: 'Category, durationMinutes, and taskTitle are required.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const sessionDate = date || format(new Date(), 'yyyy-MM-dd');

    const session = await prisma.workSession.create({
      data: {
        userId: user.id,
        date: sessionDate,
        category,
        durationMinutes: parseInt(durationMinutes, 10),
        taskTitle,
        notes: notes || '',
        dsaQuestionId: dsaQuestionId || null,
        projectFeatureId: projectFeatureId || null,
      },
    });

    // Automatically recalculate and upsert daily review stats
    const daySessions = await prisma.workSession.findMany({ where: { date: sessionDate } });
    const totalDayMin = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualHours = parseFloat((totalDayMin / 60).toFixed(2));
    
    const dObj = new Date(sessionDate);
    const isWknd = dObj.getDay() === 0 || dObj.getDay() === 6;
    const targetHours = isWknd ? 6.0 : 4.0;

    await prisma.dailyReview.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: sessionDate,
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
        userId: user.id,
        date: sessionDate,
        targetHours,
        actualHours,
        didDsa: daySessions.some((s) => s.category === 'DSA'),
        didProject: daySessions.some((s) => s.category === 'PROJECT'),
        didInterview: daySessions.some((s) => s.category === 'INTERVIEW'),
        completedPlanned: actualHours >= 3.5,
      },
    });

    res.json(session);
  } catch (err: any) {
    console.error('Error logging work session:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete session
sessionsRouter.delete('/:id', async (req, res) => {
  try {
    const session = await prisma.workSession.findUnique({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ error: 'Session not found.' });

    await prisma.workSession.delete({ where: { id: req.params.id } });

    // Recalculate daily review
    const daySessions = await prisma.workSession.findMany({ where: { date: session.date } });
    const totalDayMin = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualHours = parseFloat((totalDayMin / 60).toFixed(2));

    await prisma.dailyReview.updateMany({
      where: { date: session.date },
      data: { actualHours },
    });

    res.json({ success: true, message: 'Session deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
