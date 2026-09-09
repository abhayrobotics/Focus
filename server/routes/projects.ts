import express from 'express';
import { prisma } from '../db.js';

export const projectsRouter = express.Router();

// 1. Get all projects with feature trees
projectsRouter.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        features: {
          orderBy: [
            { isMvp: 'desc' },
            { priority: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
      orderBy: { isFlagship: 'desc' },
    });

    const enrichedProjects = projects.map((p) => {
      const mvpFeatures = p.features.filter((f) => f.isMvp);
      const futureFeatures = p.features.filter((f) => !f.isMvp);

      const completedMvp = mvpFeatures.filter((f) => f.status === 'COMPLETE').length;
      const progressPercent = mvpFeatures.length > 0 ? Math.round((completedMvp / mvpFeatures.length) * 100) : 0;

      // Find top next action
      const activeFeature = mvpFeatures.find((f) => f.status === 'DEVELOPMENT' && f.nextAction) ||
        mvpFeatures.find((f) => f.status === 'PLANNED' && f.nextAction);

      return {
        ...p,
        progressPercent,
        completedCount: completedMvp,
        totalMvpCount: mvpFeatures.length,
        futureCount: futureFeatures.length,
        currentNextAction: activeFeature?.nextAction || 'Implement forwarding workflow API',
        currentNextFeatureName: activeFeature?.name || 'Forwarding Workflow & Ownership',
        mvpFeatures,
        futureFeatures,
      };
    });

    res.json(enrichedProjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a new feature
projectsRouter.post('/:id/features', async (req, res) => {
  try {
    const { name, category, description, priority, isMvp, targetDate, nextAction, technicalNotes } = req.body;
    if (!name) return res.status(400).json({ error: 'Feature name is required.' });

    const feature = await prisma.projectFeature.create({
      data: {
        projectId: req.params.id,
        name,
        category: category || 'CORE',
        description,
        priority: priority || 'HIGH',
        status: 'PLANNED',
        progress: 0,
        isMvp: isMvp !== false,
        targetDate: targetDate ? new Date(targetDate) : null,
        nextAction,
        technicalNotes,
      },
    });

    res.json(feature);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update feature
projectsRouter.put('/features/:featureId', async (req, res) => {
  try {
    const { name, category, description, status, priority, progress, targetDate, nextAction, technicalNotes, isMvp } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    if (status !== undefined) {
      data.status = status;
      if (status === 'COMPLETE') data.progress = 100;
    }
    if (priority !== undefined) data.priority = priority;
    if (progress !== undefined) data.progress = parseInt(progress, 10);
    if (targetDate !== undefined) data.targetDate = targetDate ? new Date(targetDate) : null;
    if (nextAction !== undefined) data.nextAction = nextAction;
    if (technicalNotes !== undefined) data.technicalNotes = technicalNotes;
    if (isMvp !== undefined) data.isMvp = Boolean(isMvp);

    const updated = await prisma.projectFeature.update({
      where: { id: req.params.featureId },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Import features
projectsRouter.post('/import', async (req, res) => {
  try {
    const { projectId, features } = req.body;
    if (!projectId || !Array.isArray(features)) {
      return res.status(400).json({ error: 'ProjectId and features array are required.' });
    }

    let count = 0;
    for (const f of features) {
      if (!f.name) continue;
      await prisma.projectFeature.create({
        data: {
          projectId,
          name: f.name,
          category: f.category || 'CORE',
          description: f.description || '',
          status: f.status || 'PLANNED',
          priority: f.priority || 'HIGH',
          progress: f.progress || 0,
          nextAction: f.nextAction || '',
          technicalNotes: f.technicalNotes || '',
          isMvp: f.isMvp !== false,
        },
      });
      count++;
    }

    res.json({ success: true, message: `Successfully imported ${count} project features!` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
