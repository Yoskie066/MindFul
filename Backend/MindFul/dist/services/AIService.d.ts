export declare const getJournalEntriesFromDB: (userId: number) => Promise<{
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
export declare const isMindfulnessRelated: (message: string) => Promise<boolean>;
type JournalRow = {
    dateTime: Date;
    mood: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    feeling: string;
    tags: any;
};
export declare const saveAIConversation: (userId: number, userMessage: string, aiResponse: string, options?: {
    isError?: boolean;
    entriesAnalyzed?: number;
}) => Promise<{
    id: number;
    userId: number;
    userMessage: string;
    aiResponse: string;
    isError: boolean;
    entriesAnalyzed: number;
    createdAt: Date;
} | null>;
export declare const getAllAIConversations: (params: {
    page: number;
    limit: number;
    search?: string;
    userId?: number;
}) => Promise<{
    conversations: ({
        user: {
            email: string;
            id: number;
        };
    } & {
        id: number;
        userId: number;
        userMessage: string;
        aiResponse: string;
        isError: boolean;
        entriesAnalyzed: number;
        createdAt: Date;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const generateAIResponse: (message: string, journalEntries: JournalRow[]) => Promise<string>;
export {};
//# sourceMappingURL=AIService.d.ts.map