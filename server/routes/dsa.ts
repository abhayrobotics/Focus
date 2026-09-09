import express from 'express';
import { prisma } from '../db.js';

export const dsaRouter = express.Router();

// 1. Get all 80 questions with topic stats & filter options
dsaRouter.get('/questions', async (req, res) => {
  try {
    const { topic, difficulty, status, needsRevision, search } = req.query;

    const where: any = {};
    if (topic && topic !== 'ALL') where.topic = String(topic);
    if (difficulty && difficulty !== 'ALL') where.difficulty = String(difficulty);
    if (status && status !== 'ALL') where.status = String(status);
    if (needsRevision === 'true') where.needsRevision = true;
    if (search) {
      const searchStr = String(search).trim();
      const numMatch = searchStr.replace(/[^0-9]/g, '');
      const orConditions: any[] = [
        { title: { contains: searchStr } },
        { topic: { contains: searchStr } },
        { mistake: { contains: searchStr } },
        { approach: { contains: searchStr } },
      ];
      if (numMatch) {
        const parsedNum = parseInt(numMatch, 10);
        orConditions.push({ leetcodeNumber: parsedNum });
        orConditions.push({ number: parsedNum });
      }
      where.OR = orConditions;
    }

    const questions = await prisma.dSAQuestion.findMany({
      where,
      orderBy: { number: 'asc' },
    });

    const total = await prisma.dSAQuestion.count();
    const solved = await prisma.dSAQuestion.count({ where: { status: 'SOLVED' } });
    const inProgress = await prisma.dSAQuestion.count({ where: { status: 'IN_PROGRESS' } });
    const notStarted = await prisma.dSAQuestion.count({ where: { status: 'NOT_STARTED' } });
    const needsRevisionCount = await prisma.dSAQuestion.count({ where: { needsRevision: true } });
    const solvedMyselfCount = await prisma.dSAQuestion.count({ where: { status: 'SOLVED', solvedMyself: true } });
    const neededHelpCount = await prisma.dSAQuestion.count({ where: { status: 'SOLVED', solvedMyself: false } });

    // Dynamic topic breakdown from database
    const allQuestions = await prisma.dSAQuestion.findMany({
      select: { topic: true, status: true },
    });

    const topicMap: Record<string, { total: number; solved: number }> = {};
    for (const q of allQuestions) {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { total: 0, solved: 0 };
      }
      topicMap[q.topic].total += 1;
      if (q.status === 'SOLVED') {
        topicMap[q.topic].solved += 1;
      }
    }

    const topicStats = Object.entries(topicMap).map(([t, stat]) => ({
      topic: t,
      total: stat.total,
      solved: stat.solved,
      percent: stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0,
    }));

    // Current topic in sequence
    const currentTopicObj = topicStats.find((ts) => ts.percent < 100) || topicStats[0];

    // Next recommended problem
    const nextRecommended = await prisma.dSAQuestion.findFirst({
      where: { status: { in: ['IN_PROGRESS', 'NOT_STARTED', 'NEEDS_REVISION'] } },
      orderBy: [{ status: 'asc' }, { number: 'asc' }],
    });

    res.json({
      overview: {
        total,
        solved,
        inProgress,
        notStarted,
        needsRevisionCount,
        solvedMyselfCount,
        neededHelpCount,
        completionPercent: total > 0 ? Math.round((solved / total) * 100) : 0,
        currentTopic: currentTopicObj.topic,
        nextRecommended,
      },
      topicStats,
      questions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single question
dsaRouter.get('/questions/:id', async (req, res) => {
  try {
    const question = await prisma.dSAQuestion.findUnique({
      where: { id: req.params.id },
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update question (Solve status, self/help, mistake, solution, complexity, revision)
dsaRouter.put('/questions/:id', async (req, res) => {
  try {
    const {
      status,
      solvedMyself,
      solution,
      approach,
      mistake,
      timeComplexity,
      spaceComplexity,
      needsRevision,
      revisionNotes,
      problemUrl,
      leetcodeNumber,
    } = req.body;

    const data: any = {};
    if (status !== undefined) {
      data.status = status;
      if (status === 'SOLVED') {
        const existing = await prisma.dSAQuestion.findUnique({ where: { id: req.params.id } });
        if (!existing?.dateSolved) {
          data.dateSolved = new Date();
        }
      } else if (status === 'NOT_STARTED' || status === 'IN_PROGRESS') {
        data.dateSolved = null;
      }
    }
    if (solvedMyself !== undefined) data.solvedMyself = Boolean(solvedMyself);
    if (solution !== undefined) data.solution = solution;
    if (approach !== undefined) data.approach = approach;
    if (mistake !== undefined) data.mistake = mistake;
    if (timeComplexity !== undefined) data.timeComplexity = timeComplexity;
    if (spaceComplexity !== undefined) data.spaceComplexity = spaceComplexity;
    if (needsRevision !== undefined) data.needsRevision = Boolean(needsRevision);
    if (revisionNotes !== undefined) data.revisionNotes = revisionNotes;
    if (problemUrl !== undefined) data.problemUrl = problemUrl;
    if (leetcodeNumber !== undefined) data.leetcodeNumber = leetcodeNumber ? parseInt(String(leetcodeNumber), 10) : null;

    const updated = await prisma.dSAQuestion.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. In-App Import / Upload questions (from JSON or CSV parsed rows)
dsaRouter.post('/import', async (req, res) => {
  try {
    const { questions, replaceAll } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array is required.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (replaceAll) {
      await prisma.dSAQuestion.deleteMany();
    }

    let count = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.title) continue;

      const lcNum = q.leetcodeNumber || q.leetcodeNum || q.lcNumber || null;

      await prisma.dSAQuestion.create({
        data: {
          userId: user.id,
          number: q.number || i + 1,
          leetcodeNumber: lcNum ? parseInt(String(lcNum), 10) : null,
          topic: q.topic || 'Array',
          title: q.title,
          difficulty: q.difficulty || 'Medium',
          problemUrl: q.problemUrl || q.url || '',
          status: q.status || 'NOT_STARTED',
          solvedMyself: q.solvedMyself !== false,
          solution: q.solution || '',
          approach: q.approach || '',
          mistake: q.mistake || '',
          timeComplexity: q.timeComplexity || '',
          spaceComplexity: q.spaceComplexity || '',
          needsRevision: Boolean(q.needsRevision),
          revisionNotes: q.revisionNotes || '',
        },
      });
      count++;
    }

    res.json({ success: true, message: `Successfully imported ${count} questions!` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
