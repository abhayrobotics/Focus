import express from 'express';
import { prisma } from '../db.js';
import { format } from 'date-fns';

export const applicationsRouter = express.Router();
const db = prisma as any;

// 1. Get all job applications with rounds and pipeline stats
applicationsRouter.get('/', async (req, res) => {
  try {
    const applications = await db.jobApplication.findMany({
      include: {
        rounds: {
          orderBy: { roundNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalApplied = applications.length;
    const shortlistedApplications = applications.filter(
      (app: any) => app.status !== 'APPLIED' && app.status !== 'GHOSTED' && (app.rounds.length > 0 || app.status !== 'REJECTED')
    );
    const shortlistedCount = shortlistedApplications.length;
    const interviewingCount = applications.filter((app: any) =>
      ['SHORTLISTED', 'OA_ROUND', 'TECH_ROUND_1', 'TECH_ROUND_2', 'MANAGERIAL_HR'].includes(app.status)
    ).length;
    const offerCount = applications.filter((app: any) => app.status === 'OFFER').length;
    const rejectedCount = applications.filter((app: any) => app.status === 'REJECTED').length;
    const ghostedCount = applications.filter((app: any) => app.status === 'GHOSTED').length;
    const callRatePercent = totalApplied > 0 ? Math.round((shortlistedCount / totalApplied) * 100) : 0;

    res.json({
      applications,
      stats: {
        totalApplied,
        shortlistedCount,
        interviewingCount,
        offerCount,
        rejectedCount,
        ghostedCount,
        callRatePercent,
      },
    });
  } catch (err: any) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Create a new job application
applicationsRouter.post('/', async (req, res) => {
  try {
    const {
      companyName,
      role,
      location,
      salaryRange,
      platform,
      jobUrl,
      resumeVersion,
      appliedDate,
      status,
      contactPerson,
      contactEmail,
      notes,
      initialRound,
    } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ error: 'Company name and Role are required.' });
    }

    const user = await db.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        companyName: companyName.trim(),
        role: role.trim(),
        location: location?.trim() || 'Remote',
        salaryRange: salaryRange?.trim() || null,
        platform: platform || 'LINKEDIN',
        jobUrl: jobUrl?.trim() || null,
        resumeVersion: resumeVersion?.trim() || 'Default Resume',
        appliedDate: appliedDate || format(new Date(), 'yyyy-MM-dd'),
        status: status || 'APPLIED',
        contactPerson: contactPerson?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        notes: notes?.trim() || null,
        rounds: initialRound
          ? {
              create: [
                {
                  roundNumber: 1,
                  roundName: initialRound.roundName || 'Initial Screening',
                  status: initialRound.status || 'SCHEDULED',
                  scheduledAt: initialRound.scheduledAt ? new Date(initialRound.scheduledAt) : null,
                  interviewerName: initialRound.interviewerName || null,
                  questionsAsked: initialRound.questionsAsked || null,
                  feedback: initialRound.feedback || null,
                  notes: initialRound.notes || null,
                },
              ],
            }
          : undefined,
      },
      include: {
        rounds: true,
      },
    });

    res.json(application);
  } catch (err: any) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Update an existing job application
applicationsRouter.put('/:id', async (req, res) => {
  try {
    const {
      companyName,
      role,
      location,
      salaryRange,
      platform,
      jobUrl,
      resumeVersion,
      appliedDate,
      status,
      contactPerson,
      contactEmail,
      notes,
    } = req.body;

    const existing = await db.jobApplication.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Application not found.' });

    const updated = await db.jobApplication.update({
      where: { id: req.params.id },
      data: {
        companyName: companyName !== undefined ? companyName.trim() : existing.companyName,
        role: role !== undefined ? role.trim() : existing.role,
        location: location !== undefined ? location.trim() : existing.location,
        salaryRange: salaryRange !== undefined ? salaryRange.trim() : existing.salaryRange,
        platform: platform !== undefined ? platform : existing.platform,
        jobUrl: jobUrl !== undefined ? jobUrl?.trim() : existing.jobUrl,
        resumeVersion: resumeVersion !== undefined ? resumeVersion?.trim() : existing.resumeVersion,
        appliedDate: appliedDate !== undefined ? appliedDate : existing.appliedDate,
        status: status !== undefined ? status : existing.status,
        contactPerson: contactPerson !== undefined ? contactPerson?.trim() : existing.contactPerson,
        contactEmail: contactEmail !== undefined ? contactEmail?.trim() : existing.contactEmail,
        notes: notes !== undefined ? notes?.trim() : existing.notes,
      },
      include: {
        rounds: {
          orderBy: { roundNumber: 'asc' },
        },
      },
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Error updating application:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete an application
applicationsRouter.delete('/:id', async (req, res) => {
  try {
    await db.jobApplication.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (err: any) {
    console.error('Error deleting application:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Add an Interview Round / Process Step to an Application
applicationsRouter.post('/:id/rounds', async (req, res) => {
  try {
    const { id } = req.params;
    const { roundName, status, scheduledAt, interviewerName, questionsAsked, feedback, notes, roundNumber } = req.body;

    const app = await db.jobApplication.findUnique({
      where: { id },
      include: { rounds: true },
    });
    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const computedRoundNumber = roundNumber !== undefined ? Number(roundNumber) : app.rounds.length + 1;

    const round = await db.interviewRound.create({
      data: {
        applicationId: id,
        roundNumber: computedRoundNumber,
        roundName: roundName || `Round ${computedRoundNumber}`,
        status: status || 'SCHEDULED',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        interviewerName: interviewerName?.trim() || null,
        questionsAsked: questionsAsked?.trim() || null,
        feedback: feedback?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    // If app status is still 'APPLIED', automatically elevate status to 'SHORTLISTED' or appropriate round
    if (app.status === 'APPLIED') {
      await db.jobApplication.update({
        where: { id },
        data: { status: 'SHORTLISTED' },
      });
    }

    const updatedApp = await db.jobApplication.findUnique({
      where: { id },
      include: { rounds: { orderBy: { roundNumber: 'asc' } } },
    });

    res.json({ round, application: updatedApp });
  } catch (err: any) {
    console.error('Error adding interview round:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Update an Interview Round
applicationsRouter.put('/:id/rounds/:roundId', async (req, res) => {
  try {
    const { roundId } = req.params;
    const { roundName, status, scheduledAt, interviewerName, questionsAsked, feedback, notes, roundNumber } = req.body;

    const existing = await db.interviewRound.findUnique({ where: { id: roundId } });
    if (!existing) return res.status(404).json({ error: 'Round not found.' });

    const updatedRound = await db.interviewRound.update({
      where: { id: roundId },
      data: {
        roundName: roundName !== undefined ? roundName : existing.roundName,
        status: status !== undefined ? status : existing.status,
        scheduledAt: scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : existing.scheduledAt,
        interviewerName: interviewerName !== undefined ? interviewerName?.trim() : existing.interviewerName,
        questionsAsked: questionsAsked !== undefined ? questionsAsked?.trim() : existing.questionsAsked,
        feedback: feedback !== undefined ? feedback?.trim() : existing.feedback,
        notes: notes !== undefined ? notes?.trim() : existing.notes,
        roundNumber: roundNumber !== undefined ? Number(roundNumber) : existing.roundNumber,
      },
    });

    const updatedApp = await db.jobApplication.findUnique({
      where: { id: req.params.id },
      include: { rounds: { orderBy: { roundNumber: 'asc' } } },
    });

    res.json({ round: updatedRound, application: updatedApp });
  } catch (err: any) {
    console.error('Error updating interview round:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Delete an Interview Round
applicationsRouter.delete('/:id/rounds/:roundId', async (req, res) => {
  try {
    await db.interviewRound.delete({ where: { id: req.params.roundId } });
    const updatedApp = await db.jobApplication.findUnique({
      where: { id: req.params.id },
      include: { rounds: { orderBy: { roundNumber: 'asc' } } },
    });
    res.json({ success: true, application: updatedApp });
  } catch (err: any) {
    console.error('Error deleting interview round:', err);
    res.status(500).json({ error: err.message });
  }
});
