import prisma from '../config/prisma.js';

// ============================================================
// CREATE JOURNAL ENTRY
// ============================================================
export const createJournalEntry = async (
  userId: number,
  data: {
    mood: string;
    moodEmoji: string;
    moodColor: string;
    dateTime: string;
    feeling: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    tags: string[];
  }
) => {
  return await prisma.journalEntry.create({
    data: {
      userId,
      mood: data.mood,
      moodEmoji: data.moodEmoji,
      moodColor: data.moodColor,
      dateTime: new Date(data.dateTime),
      feeling: data.feeling,
      stressLevel: data.stressLevel,
      energyLevel: data.energyLevel,
      sleepHours: data.sleepHours,
      tags: data.tags as any,
    },
  });
};

export const getUserJournalEntries = async (userId: number) => {
  return await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { dateTime: 'desc' },
  });
};


