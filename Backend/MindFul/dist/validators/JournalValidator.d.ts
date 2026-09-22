import { z } from 'zod';
export declare const createJournalSchema: z.ZodObject<{
    mood: z.ZodString;
    moodEmoji: z.ZodString;
    moodColor: z.ZodString;
    dateTime: z.ZodString;
    feeling: z.ZodString;
    stressLevel: z.ZodNumber;
    energyLevel: z.ZodNumber;
    sleepHours: z.ZodNumber;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type CreateJournalInput = z.infer<typeof createJournalSchema>;
//# sourceMappingURL=JournalValidator.d.ts.map