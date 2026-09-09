import express from 'express';
import { prisma } from '../db.js';

export const parkingLotRouter = express.Router();

// 1. Get all parked ideas
parkingLotRouter.get('/', async (req, res) => {
  try {
    const ideas = await prisma.parkedIdea.findMany({
      orderBy: [
        { status: 'asc' }, // PARKED first
        { createdAt: 'desc' },
      ],
    });

    const activeCount = ideas.filter((i) => i.status === 'PARKED').length;

    res.json({
      activeCount,
      ideas,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Park a new idea (< 5s capture)
parkingLotRouter.post('/', async (req, res) => {
  try {
    const { title, category, notes } = req.body;
    if (!title) return res.status(400).json({ error: 'Idea title is required.' });

    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const idea = await prisma.parkedIdea.create({
      data: {
        userId: user.id,
        title,
        category: category || 'TECH_IDEA',
        notes: notes || '',
        status: 'PARKED',
      },
    });

    res.json(idea);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update idea status
parkingLotRouter.put('/:id', async (req, res) => {
  try {
    const { title, category, notes, status } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category;
    if (notes !== undefined) data.notes = notes;
    if (status !== undefined) data.status = status;

    const updated = await prisma.parkedIdea.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Graduate idea to Project Feature
parkingLotRouter.post('/:id/graduate', async (req, res) => {
  try {
    const idea = await prisma.parkedIdea.findUnique({ where: { id: req.params.id } });
    if (!idea) return res.status(404).json({ error: 'Idea not found.' });

    const project = await prisma.project.findFirst({ where: { isFlagship: true } });
    if (!project) return res.status(404).json({ error: 'Flagship project not found.' });

    const feature = await prisma.projectFeature.create({
      data: {
        projectId: project.id,
        name: idea.title,
        category: 'FUTURE',
        description: idea.notes || `Graduated from Parking Lot idea: ${idea.title}`,
        priority: 'MEDIUM',
        status: 'PLANNED',
        progress: 0,
        isMvp: false,
        nextAction: `Initial scoping for ${idea.title}`,
      },
    });

    const updatedIdea = await prisma.parkedIdea.update({
      where: { id: req.params.id },
      data: {
        status: 'GRADUATED',
        graduatedFeatureId: feature.id,
      },
    });

    res.json({ success: true, feature, idea: updatedIdea });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete idea
parkingLotRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.parkedIdea.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Idea removed from parking lot.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
