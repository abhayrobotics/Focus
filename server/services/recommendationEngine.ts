import { prisma } from '../db.js';

export interface RecommendedAction {
  id: string;
  category: 'DSA' | 'PROJECT' | 'INTERVIEW';
  title: string;
  subtitle: string;
  durationMinutes: number;
  priorityScore: number; // Higher is top priority
  reason: string;
  actionUrl?: string;
  targetId?: string;
}

export class RecommendationEngine {
  static async getNextActions(remainingMinutes: number = 120): Promise<RecommendedAction[]> {
    const actions: RecommendedAction[] = [];

    // 1. Next Priority DSA Question (Locked Sequence Order)
    const nextDsaQuestion = await prisma.dSAQuestion.findFirst({
      where: {
        status: { in: ['IN_PROGRESS', 'NEEDS_REVISION', 'NOT_STARTED'] },
      },
      orderBy: [
        { status: 'asc' }, // IN_PROGRESS first
        { number: 'asc' }, // Then sequential order 1..80
      ],
    });

    if (nextDsaQuestion) {
      const lcBadge = nextDsaQuestion.leetcodeNumber ? ` (LC #${nextDsaQuestion.leetcodeNumber})` : '';
      actions.push({
        id: `rec_dsa_${nextDsaQuestion.id}`,
        category: 'DSA',
        title: `Solve DSA #${nextDsaQuestion.number}${lcBadge} — ${nextDsaQuestion.topic}`,
        subtitle: `${nextDsaQuestion.title} (${nextDsaQuestion.difficulty})`,
        durationMinutes: nextDsaQuestion.difficulty === 'Easy' ? 30 : nextDsaQuestion.difficulty === 'Medium' ? 45 : 60,
        priorityScore: 98,
        reason: nextDsaQuestion.needsRevision
          ? `Marked for revision. Reinforce invariant: ${nextDsaQuestion.mistake || 'Practice dynamic window shrinkage.'}`
          : `Next in 80-question sequence. Focus topic: ${nextDsaQuestion.topic}.`,
        actionUrl: nextDsaQuestion.problemUrl || undefined,
        targetId: nextDsaQuestion.id,
      });
    }

    // 2. Next Project Feature Action (Employee Grievance Management System)
    const nextProjectFeature = await prisma.projectFeature.findFirst({
      where: {
        isMvp: true,
        status: { in: ['DEVELOPMENT', 'PLANNED'] },
        nextAction: { not: null },
      },
      orderBy: [
        { priority: 'asc' }, // HIGH first
        { progress: 'desc' }, // Almost complete first
      ],
      include: {
        project: true,
      },
    });

    if (nextProjectFeature && nextProjectFeature.nextAction) {
      const projName = nextProjectFeature.project?.name || 'Employee Grievance Management System';
      actions.push({
        id: `rec_proj_${nextProjectFeature.id}`,
        category: 'PROJECT',
        title: `Project Deliverable — ${nextProjectFeature.name}`,
        subtitle: nextProjectFeature.nextAction,
        durationMinutes: 90,
        priorityScore: 95,
        reason: `Primary MVP deliverable for ${projName} (${nextProjectFeature.progress}% complete).`,
        targetId: nextProjectFeature.id,
      });
    }

    // 3. Weakest Interview Preparation Topic
    const weakTopic = await prisma.interviewTopic.findFirst({
      where: {
        phase: 'PHASE_1',
        confidence: { lte: 3 },
      },
      orderBy: [
        { confidence: 'asc' }, // lowest confidence first
        { priority: 'asc' }, // CRITICAL first
      ],
    });

    if (weakTopic) {
      actions.push({
        id: `rec_int_${weakTopic.id}`,
        category: 'INTERVIEW',
        title: `Interview Active Recall — ${weakTopic.name}`,
        subtitle: `Target: Score ${weakTopic.confidence}/5 -> 4/5 readiness`,
        durationMinutes: 45,
        priorityScore: 88,
        reason: `High-frequency interview topic with current confidence ${weakTopic.confidence}/5. Review edge cases and key questions.`,
        targetId: weakTopic.id,
      });
    }

    // Return strictly top 1 to 3 actions
    return actions.slice(0, 3);
  }
}
