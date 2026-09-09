import { prisma } from '../db.js';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

export interface ConsistencyStats {
  todayTargetHours: number;
  todayActualHours: number;
  todayProgressPercent: number;
  todayRemainingMinutes: number;
  todayStatus: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET';
  hasRedAlert: boolean;
  redAlertMessage: string | null;
  currentStreak: number;
  longestStreak: number;
  daysCompletedThisMonth: number;
  totalHoursLoggedAllTime: number;
  weeklySummary: {
    weekTargetHours: number;
    weekActualHours: number;
    weekProgressPercent: number;
    days: {
      dayName: string;
      date: string;
      targetHours: number;
      actualHours: number;
      status: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET';
      dsaMinutes: number;
      projectMinutes: number;
      interviewMinutes: number;
    }[];
  };
  executionVsPlanning: {
    workSessionsCount: number;
    planningChangesCount: number;
    executionRatio: number; // 0 - 100%
  };
}

export class AnalyticsEngine {
  static async getConsistencyStats(): Promise<ConsistencyStats> {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    const todayTargetHours = isWeekend ? 6.0 : 4.0;

    // 1. Calculate today's logged hours
    const todaySessions = await prisma.workSession.findMany({
      where: { date: todayStr },
    });

    const todayTotalMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const todayActualHours = parseFloat((todayTotalMinutes / 60).toFixed(2));
    const todayProgressPercent = Math.min(100, Math.round((todayActualHours / todayTargetHours) * 100));
    const todayRemainingMinutes = Math.max(0, Math.round(todayTargetHours * 60 - todayTotalMinutes));

    let todayStatus: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET' = 'INACTIVE';
    if (todayTotalMinutes >= todayTargetHours * 60) {
      todayStatus = 'TARGET_MET';
    } else if (todayTotalMinutes >= 30) {
      todayStatus = 'STUDIED_PACE';
    }

    // 2. 🚨 2-Day Consecutive Blank Red Alert Check
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
    const dayBeforeYesterdayStr = format(subDays(today, 2), 'yyyy-MM-dd');

    const yesterdaySessions = await prisma.workSession.findMany({ where: { date: yesterdayStr } });
    const dayBeforeSessions = await prisma.workSession.findMany({ where: { date: dayBeforeYesterdayStr } });

    const yesterdayMin = yesterdaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const dayBeforeMin = dayBeforeSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    const allSessionsCount = await prisma.workSession.count();

    let hasRedAlert = false;
    let redAlertMessage: string | null = null;

    // Only trigger Red Alert if there is past session history and 2 consecutive blank days occurred
    if (allSessionsCount > 0 && yesterdayMin === 0 && dayBeforeMin === 0 && todayTotalMinutes === 0) {
      hasRedAlert = true;
      redAlertMessage = '🚨 RED ALERT: 2 consecutive days with 0 minutes logged! Habit momentum is collapsing. Log an immediate 15–30 minute micro-session now to reset momentum.';
    }

    // 3. Calculate Streaks (Counting any day with >= 30 minutes as a win)
    const allSessions = await prisma.workSession.findMany();
    const minutesByDate = new Map<string, number>();
    for (const s of allSessions) {
      minutesByDate.set(s.date, (minutesByDate.get(s.date) || 0) + s.durationMinutes);
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check backwards from today or yesterday
    let checkDate = new Date();
    // If today has >= 30 min, count today; else start from yesterday
    if ((minutesByDate.get(todayStr) || 0) >= 30) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      checkDate = subDays(checkDate, 1);
    }

    while (true) {
      const dStr = format(checkDate, 'yyyy-MM-dd');
      const min = minutesByDate.get(dStr) || 0;
      if (min >= 30) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    // Compute longest streak across all recorded history
    const sortedDates = Array.from(minutesByDate.keys()).sort();
    tempStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      const min = minutesByDate.get(sortedDates[i]) || 0;
      if (min >= 30) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    // Days completed this month (>= 30 min)
    const currentMonthPrefix = format(today, 'yyyy-MM');
    let daysCompletedThisMonth = 0;
    for (const [dStr, min] of minutesByDate.entries()) {
      if (dStr.startsWith(currentMonthPrefix) && min >= 30) {
        daysCompletedThisMonth++;
      }
    }

    // Total hours all time
    const totalMinutesAllTime = allSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalHoursLoggedAllTime = parseFloat((totalMinutesAllTime / 60).toFixed(1));

    // 4. Weekly Summary (Monday through Sunday)
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

    let weekTargetHours = 0;
    let weekActualHours = 0;

    const daysSummary = weekDays.map((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const dayName = format(d, 'EEE');
      const isWknd = d.getDay() === 0 || d.getDay() === 6;
      const target = isWknd ? 6.0 : 4.0;
      weekTargetHours += target;

      const sessionsOnDay = allSessions.filter((s) => s.date === dStr);
      const dayMin = sessionsOnDay.reduce((acc, s) => acc + s.durationMinutes, 0);
      const actual = parseFloat((dayMin / 60).toFixed(2));
      weekActualHours += actual;

      const dsaMin = sessionsOnDay.filter((s) => s.category === 'DSA').reduce((acc, s) => acc + s.durationMinutes, 0);
      const projMin = sessionsOnDay.filter((s) => s.category === 'PROJECT').reduce((acc, s) => acc + s.durationMinutes, 0);
      const intMin = sessionsOnDay.filter((s) => s.category === 'INTERVIEW').reduce((acc, s) => acc + s.durationMinutes, 0);

      let status: 'INACTIVE' | 'STUDIED_PACE' | 'TARGET_MET' = 'INACTIVE';
      if (dayMin >= target * 60) {
        status = 'TARGET_MET';
      } else if (dayMin >= 30) {
        status = 'STUDIED_PACE';
      }

      return {
        dayName,
        date: dStr,
        targetHours: target,
        actualHours: actual,
        status,
        dsaMinutes: dsaMin,
        projectMinutes: projMin,
        interviewMinutes: intMin,
      };
    });

    weekActualHours = parseFloat(weekActualHours.toFixed(2));
    const weekProgressPercent = Math.min(100, Math.round((weekActualHours / weekTargetHours) * 100));

    // 5. Execution vs Planning
    const workSessionsCount = allSessions.length;
    const allReviews = await prisma.dailyReview.findMany();
    const totalPlanningChanges = allReviews.reduce((acc, r) => acc + r.planningChanges, 0);
    const executionRatio = workSessionsCount === 0 && totalPlanningChanges === 0
      ? 100
      : Math.round((workSessionsCount / (workSessionsCount + totalPlanningChanges || 1)) * 100);

    return {
      todayTargetHours,
      todayActualHours,
      todayProgressPercent,
      todayRemainingMinutes,
      todayStatus,
      hasRedAlert,
      redAlertMessage,
      currentStreak,
      longestStreak,
      daysCompletedThisMonth,
      totalHoursLoggedAllTime,
      weeklySummary: {
        weekTargetHours,
        weekActualHours,
        weekProgressPercent,
        days: daysSummary,
      },
      executionVsPlanning: {
        workSessionsCount,
        planningChangesCount: totalPlanningChanges,
        executionRatio,
      },
    };
  }

  static async getYearlyHeatmap(year: number = new Date().getFullYear()) {
    const allSessions = await prisma.workSession.findMany();
    const dateMap = new Map<string, { minutes: number; dsaMin: number; projMin: number; intMin: number; tasks: string[] }>();

    for (const s of allSessions) {
      const existing = dateMap.get(s.date) || { minutes: 0, dsaMin: 0, projMin: 0, intMin: 0, tasks: [] };
      existing.minutes += s.durationMinutes;
      if (s.category === 'DSA') existing.dsaMin += s.durationMinutes;
      if (s.category === 'PROJECT') existing.projMin += s.durationMinutes;
      if (s.category === 'INTERVIEW') existing.intMin += s.durationMinutes;
      if (s.taskTitle) existing.tasks.push(s.taskTitle);
      dateMap.set(s.date, existing);
    }

    // Generate 365 days
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const isWknd = d.getDay() === 0 || d.getDay() === 6;
      const targetHours = isWknd ? 6.0 : 4.0;
      const dayData = dateMap.get(dStr) || { minutes: 0, dsaMin: 0, projMin: 0, intMin: 0, tasks: [] };
      const hours = parseFloat((dayData.minutes / 60).toFixed(2));
      const percentage = Math.min(150, Math.round((hours / targetHours) * 100));

      // Level 0: 0m, Level 1: 30m-1h59m (Consistent win), Level 2: 2h-3h59m, Level 3: 4h+ (Goal Met)
      let level = 0;
      if (dayData.minutes >= targetHours * 60) {
        level = 3; // Emerald
      } else if (dayData.minutes >= 120) {
        level = 2; // Indigo bright
      } else if (dayData.minutes >= 30) {
        level = 1; // Blue consistent win
      }

      return {
        date: dStr,
        hours,
        targetHours,
        percentage,
        level,
        dsaMinutes: dayData.dsaMin,
        projectMinutes: dayData.projMin,
        interviewMinutes: dayData.intMin,
        tasks: dayData.tasks,
      };
    });
  }
}
