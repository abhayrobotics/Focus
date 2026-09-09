import express from 'express';
import { prisma } from '../db.js';

export const roadmapRouter = express.Router();

roadmapRouter.get('/', async (req, res) => {
  try {
    const items = await prisma.roadmapItem.findMany({
      orderBy: [
        { phase: 'asc' },
        { priority: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    const phase1 = items.filter((i) => i.phase === 'PHASE_1');
    const phase2 = items.filter((i) => i.phase === 'PHASE_2');

    // Counts from actual data
    const dsaTotal = await prisma.dSAQuestion.count();
    const dsaSolved = await prisma.dSAQuestion.count({ where: { status: 'SOLVED' } });
    
    const flagshipProject = await prisma.project.findFirst({
      where: { isFlagship: true },
      include: { features: true },
    });
    const projectMvpTotal = flagshipProject?.features.filter((f) => f.isMvp).length || 0;
    const projectMvpComplete = flagshipProject?.features.filter((f) => f.isMvp && f.status === 'COMPLETE').length || 0;

    const interviewTopics = await prisma.interviewTopic.findMany({ where: { phase: 'PHASE_1' } });
    const interviewReady = interviewTopics.filter((t) => t.status === 'INTERVIEW_READY' || t.status === 'PRACTICED').length;

    res.json({
      activePhase: 'Phase 1 — Current Month (DSA 80 + Grievance Core + Full Stack Tech)',
      nextPhase: 'Phase 2 — Next Month (CS Fundamentals: OS, DBMS, Networks & Mock Interviews)',
      phase1: {
        items: phase1,
        metrics: {
          dsa: { solved: dsaSolved, total: dsaTotal, percent: dsaTotal > 0 ? Math.round((dsaSolved / dsaTotal) * 100) : 0 },
          project: { complete: projectMvpComplete, total: projectMvpTotal, percent: projectMvpTotal > 0 ? Math.round((projectMvpComplete / projectMvpTotal) * 100) : 0 },
          interview: { ready: interviewReady, total: interviewTopics.length, percent: interviewTopics.length > 0 ? Math.round((interviewReady / interviewTopics.length) * 100) : 0 },
        },
      },
      phase2: {
        items: phase2,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
