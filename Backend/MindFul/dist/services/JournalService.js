import prisma from '../config/prisma.js';
// ============================================================
// CREATE JOURNAL ENTRY
// ============================================================
export const createJournalEntry = async (userId, data) => {
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
            tags: data.tags,
        },
    });
};
export const getUserJournalEntries = async (userId) => {
    return await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { dateTime: 'desc' },
    });
};
//# sourceMappingURL=JournalService.js.map