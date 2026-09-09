import express from 'express';
import { prisma } from '../db.js';

export const interviewRouter = express.Router();

interviewRouter.get('/topics', async (req, res) => {
  try {
    const topics = await prisma.interviewTopic.findMany({
      orderBy: [
        { phase: 'asc' },
        { category: 'asc' },
        { priority: 'asc' },
      ],
    });

    const phase1Topics = topics.filter((t) => t.phase === 'PHASE_1');
    const phase2Topics = topics.filter((t) => t.phase === 'PHASE_2');

    // Identify weak spots (confidence <= 3 in Phase 1)
    const weakTopics = phase1Topics.filter((t) => t.confidence <= 3);

    // Calculate average readiness
    const avgConfidence = phase1Topics.length > 0
      ? (phase1Topics.reduce((acc, t) => acc + t.confidence, 0) / phase1Topics.length).toFixed(1)
      : '3.0';

    const categories = ['FRONTEND', 'BACKEND', 'CODING'];
    const categoryBreakdown = categories.map((cat) => {
      const catTopics = phase1Topics.filter((t) => t.category === cat);
      const readyCount = catTopics.filter((t) => t.status === 'INTERVIEW_READY' || t.status === 'PRACTICED').length;
      return {
        category: cat,
        total: catTopics.length,
        ready: readyCount,
        percent: catTopics.length > 0 ? Math.round((readyCount / catTopics.length) * 100) : 0,
        topics: catTopics,
      };
    });

    res.json({
      overview: {
        totalPhase1: phase1Topics.length,
        totalPhase2: phase2Topics.length,
        avgConfidence: parseFloat(avgConfidence),
        weakCount: weakTopics.length,
      },
      categoryBreakdown,
      weakTopics,
      phase2Topics,
      allTopics: topics,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

interviewRouter.put('/topics/:id', async (req, res) => {
  try {
    const { status, confidence, notes, keyQuestions, practicalTips } = req.body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (confidence !== undefined) data.confidence = parseInt(confidence, 10);
    if (notes !== undefined) data.notes = notes;
    if (keyQuestions !== undefined) data.keyQuestions = keyQuestions;
    if (practicalTips !== undefined) data.practicalTips = practicalTips;
    data.lastStudied = new Date();

    const updated = await prisma.interviewTopic.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
