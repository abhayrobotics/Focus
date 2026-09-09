import express from 'express';
import { prisma } from '../db.js';
import { AnalyticsEngine } from '../services/analyticsEngine.js';
import { format } from 'date-fns';

export const growthRouter = express.Router();

// 1. Get 365-day Consistency Heatmap
growthRouter.get('/heatmap', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(String(req.query.year), 10) : new Date().getFullYear();
    const heatmap = await AnalyticsEngine.getYearlyHeatmap(year);
    res.json(heatmap);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1.5 Get Month Cumulative Growth Trajectory (DSA 80 Target, Project 100% Target, Missed Day Penalties)
growthRouter.get('/cumulative', async (req, res) => {
  try {
    const month = req.query.month ? String(req.query.month) : undefined;
    const metrics = await AnalyticsEngine.getCumulativeGrowthMetrics(month);
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get review for a date
growthRouter.get('/review', async (req, res) => {
  try {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const date = req.query.date ? String(req.query.date) : todayStr;

    const review = await prisma.dailyReview.findFirst({
      where: { date },
    });

    const sessions = await prisma.workSession.findMany({
      where: { date },
    });

    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    res.json({
      date,
      review: review || null,
      totalMinutes,
      actualHours: parseFloat((totalMinutes / 60).toFixed(2)),
      sessions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Submit 2-Minute Daily Growth Reflection
growthRouter.post('/review', async (req, res) => {
  try {
    const {
      date,
      energy,
      focus,
      completedPlanned,
      spentTooMuchTimeDeciding,
      oneThingLearned,
      oneMistake,
      tomorrowPriority,
      planningChanges,
    } = req.body;

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const reviewDate = date || format(new Date(), 'yyyy-MM-dd');

    const sessions = await prisma.workSession.findMany({ where: { date: reviewDate } });
    const totalMin = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualHours = parseFloat((totalMin / 60).toFixed(2));

    const dObj = new Date(reviewDate);
    const isWknd = dObj.getDay() === 0 || dObj.getDay() === 6;
    const targetHours = isWknd ? 6.0 : 4.0;

    const review = await prisma.dailyReview.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: reviewDate,
        },
      },
      update: {
        energy: energy ? parseInt(energy, 10) : 3,
        focus: focus ? parseInt(focus, 10) : 3,
        completedPlanned: Boolean(completedPlanned),
        spentTooMuchTimeDeciding: Boolean(spentTooMuchTimeDeciding),
        oneThingLearned: oneThingLearned || '',
        oneMistake: oneMistake || '',
        tomorrowPriority: tomorrowPriority || '',
        planningChanges: planningChanges ? parseInt(planningChanges, 10) : 0,
        didDsa: sessions.some((s) => s.category === 'DSA'),
        didProject: sessions.some((s) => s.category === 'PROJECT'),
        didInterview: sessions.some((s) => s.category === 'INTERVIEW'),
      },
      create: {
        userId: user.id,
        date: reviewDate,
        targetHours,
        actualHours,
        energy: energy ? parseInt(energy, 10) : 3,
        focus: focus ? parseInt(focus, 10) : 3,
        completedPlanned: Boolean(completedPlanned),
        spentTooMuchTimeDeciding: Boolean(spentTooMuchTimeDeciding),
        oneThingLearned: oneThingLearned || '',
        oneMistake: oneMistake || '',
        tomorrowPriority: tomorrowPriority || '',
        planningChanges: planningChanges ? parseInt(planningChanges, 10) : 0,
        didDsa: sessions.some((s) => s.category === 'DSA'),
        didProject: sessions.some((s) => s.category === 'PROJECT'),
        didInterview: sessions.some((s) => s.category === 'INTERVIEW'),
      },
    });

    res.json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get reflection history
growthRouter.get('/history', async (req, res) => {
  try {
    const reviews = await prisma.dailyReview.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    });
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
