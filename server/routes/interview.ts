import express from 'express';
import { prisma } from '../db.js';
import { INTERVIEW_TOPICS_CATALOG } from '../seedInterviewData.js';

export const interviewRouter = express.Router();

export const CANONICAL_CATEGORIES = [
  { id: 'JAVASCRIPT', label: 'JavaScript', icon: 'FileCode', targetCount: 20 },
  { id: 'TYPESCRIPT', label: 'TypeScript', icon: 'Code2', targetCount: 15 },
  { id: 'REACT', label: 'React', icon: 'Atom', targetCount: 20 },
  { id: 'NODEJS', label: 'Node.js', icon: 'Server', targetCount: 15 },
  { id: 'EXPRESS', label: 'Express.js', icon: 'Network', targetCount: 15 },
  { id: 'POSTGRESQL', label: 'PostgreSQL / SQL', icon: 'Database', targetCount: 20 },
  { id: 'PRISMA', label: 'Prisma', icon: 'Layers', targetCount: 15 },
  { id: 'MONGODB', label: 'MongoDB', icon: 'HardDrive', targetCount: 15 },
  { id: 'AUTH_SECURITY', label: 'Authentication & Security', icon: 'ShieldCheck', targetCount: 15 },
  { id: 'CS_FUNDAMENTALS', label: 'Web / CS Fundamentals', icon: 'Globe', targetCount: 20 },
];

// 1. Get all interview preparation topics organized by category
interviewRouter.get('/topics', async (req, res) => {
  try {
    let topics = await prisma.interviewTopic.findMany({
      orderBy: [
        { phase: 'asc' },
        { category: 'asc' },
        { priority: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Auto-seed all 170 topics if empty, legacy, or missing canonical categories
    const needsSync =
      topics.length < 100 ||
      !topics.some((t) => t.category === 'JAVASCRIPT') ||
      topics.some((t) => t.status === 'LEARNING' || t.status === 'PRACTICED');
    if (needsSync) {
      console.log('⚡ Reseeding 170 Curated Interview Preparation Topics to 0% baseline...');
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: 'usr_main_01',
            name: 'Engineer',
          },
        });
      }

      await prisma.interviewTopic.deleteMany();

      await prisma.interviewTopic.createMany({
        data: INTERVIEW_TOPICS_CATALOG.map((t, idx) => ({
          id: `top_${t.category.toLowerCase()}_${idx + 1}`,
          userId: user.id,
          category: t.category,
          name: t.name,
          status: t.status,
          confidence: t.confidence,
          priority: t.priority,
          phase: t.phase,
          notes: t.notes || '',
          keyQuestions: t.keyQuestions || '',
          practicalTips: t.practicalTips || '',
        })),
      });

      topics = await prisma.interviewTopic.findMany({
        orderBy: [
          { phase: 'asc' },
          { category: 'asc' },
          { priority: 'asc' },
          { createdAt: 'asc' },
        ],
      });
    }

    // Identify weak spots (confidence <= 3)
    const weakTopics = topics.filter((t) => t.confidence <= 3);

    // Calculate global average readiness
    const avgConfidence = topics.length > 0
      ? (topics.reduce((acc, t) => acc + t.confidence, 0) / topics.length).toFixed(1)
      : '3.0';

    const readyTotal = topics.filter((t) => t.status === 'INTERVIEW_READY' || t.status === 'PRACTICED').length;

    // Collect all unique categories from DB, starting with canonical ones
    const dbCategorySet = new Set(topics.map((t) => t.category));
    const allCategoryKeys = [
      ...CANONICAL_CATEGORIES.map((c) => c.id),
      ...Array.from(dbCategorySet).filter((c) => !CANONICAL_CATEGORIES.some((canon) => canon.id === c)),
    ];

    const categoryBreakdown = allCategoryKeys
      .map((catKey) => {
        const catInfo = CANONICAL_CATEGORIES.find((c) => c.id === catKey) || {
          id: catKey,
          label: catKey.replace(/_/g, ' '),
          icon: 'Layers',
          targetCount: 0,
        };

        const catTopics = topics.filter((t) => t.category === catKey);
        const readyCount = catTopics.filter((t) => t.status === 'INTERVIEW_READY' || t.status === 'PRACTICED').length;
        const interviewReadyCount = catTopics.filter((t) => t.status === 'INTERVIEW_READY').length;
        const practicedCount = catTopics.filter((t) => t.status === 'PRACTICED').length;
        const learningCount = catTopics.filter((t) => t.status === 'LEARNING').length;
        const notStartedCount = catTopics.filter((t) => t.status === 'NOT_STARTED').length;

        const catAvgConfidence = catTopics.length > 0
          ? (catTopics.reduce((acc, t) => acc + t.confidence, 0) / catTopics.length).toFixed(1)
          : '0.0';

        return {
          id: catKey,
          category: catKey,
          label: catInfo.label,
          icon: catInfo.icon,
          total: catTopics.length,
          ready: readyCount,
          interviewReadyCount,
          practicedCount,
          learningCount,
          notStartedCount,
          percent: catTopics.length > 0 ? Math.round((readyCount / catTopics.length) * 100) : 0,
          avgConfidence: parseFloat(catAvgConfidence),
          topics: catTopics,
        };
      })
      .filter((group) => group.total > 0 || CANONICAL_CATEGORIES.some((c) => c.id === group.id));

    res.json({
      overview: {
        total: topics.length,
        totalPhase1: topics.filter((t) => t.phase === 'PHASE_1').length,
        totalPhase2: topics.filter((t) => t.phase === 'PHASE_2').length,
        readyTotal,
        interviewReadyTotal: topics.filter((t) => t.status === 'INTERVIEW_READY').length,
        practicedTotal: topics.filter((t) => t.status === 'PRACTICED').length,
        learningTotal: topics.filter((t) => t.status === 'LEARNING').length,
        notStartedTotal: topics.filter((t) => t.status === 'NOT_STARTED').length,
        overallPercent: topics.length > 0 ? Math.round((readyTotal / topics.length) * 100) : 0,
        avgConfidence: parseFloat(avgConfidence),
        weakCount: weakTopics.length,
        categoriesCount: categoryBreakdown.length,
      },
      categories: CANONICAL_CATEGORIES,
      categoryBreakdown,
      weakTopics,
      allTopics: topics,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update an interview topic
interviewRouter.put('/topics/:id', async (req, res) => {
  try {
    const { status, confidence, notes, keyQuestions, practicalTips, priority, name, category } = req.body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (confidence !== undefined) data.confidence = parseInt(confidence, 10);
    if (notes !== undefined) data.notes = notes;
    if (keyQuestions !== undefined) data.keyQuestions = keyQuestions;
    if (practicalTips !== undefined) data.practicalTips = practicalTips;
    if (priority !== undefined) data.priority = priority;
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
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

    let cat = (category || 'JAVASCRIPT').toUpperCase().trim();
    let ph = (phase || (cat === 'CS_FUNDAMENTALS' ? 'PHASE_2' : 'PHASE_1')).toUpperCase().trim();

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

// 5. Restore & Sync Full 170-Topic Curated Checklist
interviewRouter.post('/sync-default', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    await prisma.interviewTopic.deleteMany();

    await prisma.interviewTopic.createMany({
      data: INTERVIEW_TOPICS_CATALOG.map((t, idx) => ({
        id: `top_${t.category.toLowerCase()}_${idx + 1}`,
        userId: user.id,
        category: t.category,
        name: t.name,
        status: t.status,
        confidence: t.confidence,
        priority: t.priority,
        phase: t.phase,
        notes: t.notes || '',
        keyQuestions: t.keyQuestions || '',
        practicalTips: t.practicalTips || '',
      })),
    });

    res.json({
      success: true,
      count: INTERVIEW_TOPICS_CATALOG.length,
      message: `Successfully synchronized ${INTERVIEW_TOPICS_CATALOG.length} interview topics across 10 categories.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Import Interview Topics from Excel / CSV
interviewRouter.post('/import', async (req, res) => {
  try {
    const { topics, replaceAll } = req.body;
    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Topics array is required and must not be empty.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (replaceAll) {
      await prisma.interviewTopic.deleteMany();
    }

    let importedCount = 0;
    for (const t of topics) {
      if (!t.name || !t.name.trim()) continue;

      let cat = (t.category || 'JAVASCRIPT').toUpperCase().trim().replace(/[\s.-]/g, '_');
      let stat = (t.status || 'LEARNING').toUpperCase().trim().replace(/ /g, '_');
      if (!['NOT_STARTED', 'LEARNING', 'PRACTICED', 'INTERVIEW_READY'].includes(stat)) {
        if (stat.includes('READY')) stat = 'INTERVIEW_READY';
        else if (stat.includes('PRACTIC')) stat = 'PRACTICED';
        else if (stat.includes('NOT')) stat = 'NOT_STARTED';
        else stat = 'LEARNING';
      }

      let prio = (t.priority || 'HIGH').toUpperCase().trim();
      if (!['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(prio)) {
        if (prio.includes('CRIT') || prio.includes('🔴')) prio = 'CRITICAL';
        else if (prio.includes('MED') || prio.includes('🟡')) prio = 'MEDIUM';
        else if (prio.includes('LOW') || prio.includes('🟢')) prio = 'LOW';
        else prio = 'HIGH';
      }

      let ph = (t.phase || (cat === 'CS_FUNDAMENTALS' ? 'PHASE_2' : 'PHASE_1')).toUpperCase().trim();
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
