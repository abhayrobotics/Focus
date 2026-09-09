import express from 'express';
import { AnalyticsEngine } from '../services/analyticsEngine.js';
import { RecommendationEngine } from '../services/recommendationEngine.js';
import { prisma } from '../db.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/', async (req, res) => {
  res.redirect('/api/dashboard/summary');
});

dashboardRouter.get('/summary', async (req, res) => {
  try {
    const consistency = await AnalyticsEngine.getConsistencyStats();
    const recommendations = await RecommendationEngine.getNextActions(consistency.todayRemainingMinutes);
    const parkedCount = await prisma.parkedIdea.count({ where: { status: 'PARKED' } });

    // Active project snapshot
    const flagshipProject = await prisma.project.findFirst({
      where: { isFlagship: true },
      include: {
        features: {
          where: { isMvp: true },
        },
      },
    });

    const totalFeatures = flagshipProject?.features.length || 1;
    const completedFeatures = flagshipProject?.features.filter((f) => f.status === 'COMPLETE').length || 0;
    const projectProgress = Math.round((completedFeatures / totalFeatures) * 100);

    // DSA snapshot
    const totalDsa = await prisma.dSAQuestion.count();
    const solvedDsa = await prisma.dSAQuestion.count({ where: { status: 'SOLVED' } });
    const inProgressDsa = await prisma.dSAQuestion.count({ where: { status: 'IN_PROGRESS' } });
    const needsRevisionDsa = await prisma.dSAQuestion.count({ where: { needsRevision: true } });

    res.json({
      consistency,
      recommendations,
      parkedCount,
      projectSnapshot: {
        id: flagshipProject?.id,
        name: flagshipProject?.name || 'Employee Grievance Management System',
        progress: projectProgress,
        completedFeatures,
        totalFeatures,
        nextAction: flagshipProject?.features.find((f) => f.status === 'DEVELOPMENT')?.nextAction || 'Implement forwarding workflow API',
      },
      dsaSnapshot: {
        total: totalDsa,
        solved: solvedDsa,
        inProgress: inProgressDsa,
        needsRevision: needsRevisionDsa,
        progressPercent: totalDsa > 0 ? Math.round((solvedDsa / totalDsa) * 100) : 0,
        currentTopic: 'Sliding Window',
      },
    });
  } catch (err: any) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: err.message });
  }
});

dashboardRouter.get('/recommendation', async (req, res) => {
  try {
    const recommendations = await RecommendationEngine.getNextActions();
    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
