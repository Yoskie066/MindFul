export declare const createJournalEntry: (userId: number, data: {
    mood: string;
    moodEmoji: string;
    moodColor: string;
    dateTime: string;
    feeling: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    tags: string[];
}) => Promise<{
    id: number;
    userId: number;
    mood: string;
    moodEmoji: string;
    moodColor: string;
    dateTime: Date;
    feeling: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    tags: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getUserJournalEntries: (userId: number) => Promise<{
    id: number;
    userId: number;
    mood: string;
    moodEmoji: string;
    moodColor: string;
    dateTime: Date;
    feeling: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    tags: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
//# sourceMappingURL=JournalService.d.ts.map