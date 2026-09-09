import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Ensure SQLite tables for JobApplication and InterviewRound exist
async function ensureTables() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "JobApplication" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "companyName" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "location" TEXT DEFAULT 'Remote',
        "salaryRange" TEXT,
        "platform" TEXT DEFAULT 'LINKEDIN',
        "jobUrl" TEXT,
        "resumeVersion" TEXT,
        "appliedDate" TEXT NOT NULL,
        "status" TEXT DEFAULT 'APPLIED',
        "contactPerson" TEXT,
        "contactEmail" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InterviewRound" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "applicationId" TEXT NOT NULL,
        "roundNumber" INTEGER NOT NULL DEFAULT 1,
        "roundName" TEXT NOT NULL,
        "status" TEXT DEFAULT 'SCHEDULED',
        "scheduledAt" DATETIME,
        "interviewerName" TEXT,
        "questionsAsked" TEXT,
        "feedback" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("applicationId") REFERENCES "JobApplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    // Seed sample applications if empty
    const user = await prisma.user.findFirst();
    if (user) {
      const count = await prisma.jobApplication.count();
      if (count === 0) {
        const atlassian = await prisma.jobApplication.create({
          data: {
            userId: user.id,
            companyName: 'Atlassian',
            role: 'Full Stack Engineer (SDE 2)',
            location: 'Bengaluru / Remote',
            salaryRange: '₹28 - 36 LPA',
            platform: 'LINKEDIN',
            appliedDate: '2026-09-02',
            status: 'TECH_ROUND_1',
            contactPerson: 'Aditi Sharma (Senior Technical Recruiter)',
            contactEmail: 'aditi.sharma@atlassian.com',
            notes: 'Applied via LinkedIn InMail reachout. Emphasized Fullstack Grievance Portal architecture.',
            rounds: {
              create: [
                {
                  roundNumber: 1,
                  roundName: 'Initial Recruiter Screening',
                  status: 'CLEARED',
                  interviewerName: 'Aditi Sharma',
                  questionsAsked: 'Past project deep dive, salary expectation, notice period, React concurrency and Node.js event loop discussion.',
                  feedback: 'Cleared effortlessly. Recruiter impressed with fullstack grievance tracking portfolio project.',
                },
                {
                  roundNumber: 2,
                  roundName: 'Technical Round 1 (Live DSA & Problem Solving)',
                  status: 'SCHEDULED',
                  interviewerName: 'Staff SDE',
                  scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
                  questionsAsked: 'Focus on Sliding Window / Two Pointers / HashMap invariants (LC 3, LC 11).',
                  feedback: 'Prep checklist: Review sliding window template, practice time complexity narration.',
                },
              ],
            },
          },
        });

        await prisma.jobApplication.create({
          data: {
            userId: user.id,
            companyName: 'Razorpay',
            role: 'Backend Engineer (Payments Core)',
            location: 'Bengaluru (Hybrid)',
            salaryRange: '₹25 - 32 LPA',
            platform: 'INSTAHYRE',
            appliedDate: '2026-09-05',
            status: 'OA_ROUND',
            contactPerson: 'Karan Mehra',
            notes: 'Direct application on Instahyre. Shortlisted within 48 hours.',
            rounds: {
              create: [
                {
                  roundNumber: 1,
                  roundName: 'Online Assessment (HackerRank OA)',
                  status: 'CLEARED',
                  questionsAsked: '2 DSA problems (Array prefix sum + Graph BFS), 10 SQL & DB concurrency MCQs.',
                  feedback: '100% test cases passed on both DSA questions.',
                },
              ],
            },
          },
        });

        await prisma.jobApplication.create({
          data: {
            userId: user.id,
            companyName: 'Uber',
            role: 'Software Engineer II',
            location: 'Hyderabad / Remote',
            salaryRange: '₹32 - 42 LPA',
            platform: 'REFERRAL',
            appliedDate: '2026-09-08',
            status: 'APPLIED',
            contactPerson: 'Siddharth (Batchmate Referrer)',
            notes: 'Referred directly by alumni. Resume forwarded to hiring manager.',
          },
        });
      }

      // Check and seed 170 Curated Interview Preparation Topics to 0% baseline if needed
      const topicCount = await prisma.interviewTopic.count();
      const hasNonZero = (await prisma.interviewTopic.count({ where: { status: { in: ['LEARNING', 'PRACTICED'] } } })) > 0;
      if (topicCount < 100 || hasNonZero) {
        console.log(`⚡ Syncing full 170-topic Interview Preparation checklist to 0% baseline...`);
        await prisma.interviewTopic.deleteMany();
        
        const { INTERVIEW_TOPICS_CATALOG } = await import('./seedInterviewData.js');
        for (const t of INTERVIEW_TOPICS_CATALOG) {
          await prisma.interviewTopic.create({
            data: {
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
            },
          });
        }
        console.log(`✅ Successfully seeded all ${INTERVIEW_TOPICS_CATALOG.length} Interview Topics across 10 categories.`);
      }
    }
  } catch (err) {
    console.error('Error ensuring database tables:', err);
  }
}

ensureTables();


