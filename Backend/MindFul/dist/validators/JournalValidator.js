import { z } from 'zod';
export const createJournalSchema = z.object({
    mood: z.string().min(1, 'Mood is required'),
    moodEmoji: z.string().min(1, 'Mood emoji is required'),
    moodColor: z.string().min(1, 'Mood color is required'),
    dateTime: z.string().min(1, 'Date & time is required'),
    feeling: z.string().min(1, 'Feeling is required'),
    stressLevel: z.number().int().min(1).max(10),
    energyLevel: z.number().int().min(1).max(10),
    sleepHours: z.number().min(0).max(24),
    tags: z.array(z.string()).optional().default([]),
});
//# sourceMappingURL=JournalValidator.js.map