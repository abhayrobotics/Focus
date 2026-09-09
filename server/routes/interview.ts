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

// 3. Create a single new interview topic
interviewRouter.post('/topics', async (req, res) => {
  try {
    const { category, name, status, confidence, priority, phase, notes, keyQuestions, practicalTips } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Topic name is required.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let cat = (category || 'FRONTEND').toUpperCase().trim();
    if (!['FRONTEND', 'BACKEND', 'CODING', 'CS_FUNDAMENTALS'].includes(cat)) {
      cat = 'FRONTEND';
    }

    let ph = (phase || 'PHASE_1').toUpperCase().trim();
    if (!['PHASE_1', 'PHASE_2'].includes(ph)) {
      ph = 'PHASE_1';
    }

    const topic = await prisma.interviewTopic.create({
      data: {
        userId: user.id,
        category: cat,
        name: name.trim(),
        status: status || 'LEARNING',
        confidence: confidence ? parseInt(confidence, 10) : 3,
        priority: priority || 'HIGH',
        phase: ph,
        notes: notes || '',
        keyQuestions: keyQuestions || '',
        practicalTips: practicalTips || '',
      },
    });

    res.json(topic);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete an interview topic
interviewRouter.delete('/topics/:id', async (req, res) => {
  try {
    await prisma.interviewTopic.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Topic deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Import Interview Topics from Excel / CSV (with replace or append option)
interviewRouter.post('/import', async (req, res) => {
  try {
    const { topics, replaceAll } = req.body;
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Topics array is required and must not be empty.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // If replaceAll is true, remove existing interview topics
    if (replaceAll) {
      await prisma.interviewTopic.deleteMany();
    }

    let importedCount = 0;
    for (const t of topics) {
      if (!t.name || !t.name.trim()) continue;

      let cat = (t.category || 'FRONTEND').toUpperCase().trim();
      if (!['FRONTEND', 'BACKEND', 'CODING', 'CS_FUNDAMENTALS'].includes(cat)) {
        if (cat.includes('FRONT')) cat = 'FRONTEND';
        else if (cat.includes('BACK')) cat = 'BACKEND';
        else if (cat.includes('CODE') || cat.includes('DSA') || cat.includes('ALGO')) cat = 'CODING';
        else if (cat.includes('CS') || cat.includes('OS') || cat.includes('NETWORK') || cat.includes('DBMS')) cat = 'CS_FUNDAMENTALS';
        else cat = 'FRONTEND';
      }

      let stat = (t.status || 'LEARNING').toUpperCase().trim().replace(/ /g, '_');
      if (!['NOT_STARTED', 'LEARNING', 'PRACTICED', 'INTERVIEW_READY'].includes(stat)) {
        if (stat.includes('READY')) stat = 'INTERVIEW_READY';
        else if (stat.includes('PRACTIC')) stat = 'PRACTICED';
        else if (stat.includes('NOT')) stat = 'NOT_STARTED';
        else stat = 'LEARNING';
      }

      let prio = (t.priority || 'HIGH').toUpperCase().trim();
      if (!['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(prio)) {
        prio = 'HIGH';
      }

      let ph = (t.phase || (cat === 'CS_FUNDAMENTALS' ? 'PHASE_2' : 'PHASE_1')).toUpperCase().trim();
      if (!['PHASE_1', 'PHASE_2'].includes(ph)) {
        ph = 'PHASE_1';
      }

      const conf = t.confidence ? Math.max(1, Math.min(5, parseInt(t.confidence, 10) || 3)) : 3;

      await prisma.interviewTopic.create({
        data: {
          userId: user.id,
          category: cat,
          name: t.name.trim(),
          status: stat,
          confidence: conf,
          priority: prio,
          phase: ph,
          notes: t.notes || '',
          keyQuestions: t.keyQuestions || '',
          practicalTips: t.practicalTips || '',
        },
      });
      importedCount++;
    }

    res.json({
      success: true,
      importedCount,
      replaceAll: Boolean(replaceAll),
      message: `Successfully imported ${importedCount} interview practice topics.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

