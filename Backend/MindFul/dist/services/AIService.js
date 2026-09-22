import { GoogleGenAI } from "@google/genai";
import prisma from "../config/prisma.js";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}
const ai = new GoogleGenAI({ apiKey });
// ============================================================
// GEMINI MODELS 
// ============================================================
const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
];
// ============================================================
// TRY EACH MODEL UNTIL ONE SUCCEEDS
// ============================================================
const tryGenerate = async (prompt) => {
    let lastError = null;
    for (const model of MODELS) {
        try {
            console.log(`Trying model: ${model}`);
            const response = await Promise.race([
                ai.models.generateContent({
                    model,
                    contents: prompt,
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 10000)),
            ]);
            console.log(`Model ${model} responded successfully`);
            return response.text ?? "";
        }
        catch (error) {
            lastError = error;
            const status = error?.status || error?.response?.status;
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Model ${model} failed: ${status || errorMessage}`);
            // Try the next model for temporary/unavailable errors
            if (status === 404 ||
                status === 429 ||
                status === 503 ||
                errorMessage === "Request timeout") {
                continue;
            }
            // Stop for other unexpected errors
            throw error;
        }
    }
    console.error("All Gemini models failed:", lastError);
    throw new Error("Gemini AI is temporarily unavailable. Please try again later.");
};
// ============================================================
// READ JOURNAL DATA FROM MYSQL (via Prisma)
// ============================================================
export const getJournalEntriesFromDB = async (userId) => {
    return await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { dateTime: "desc" },
        take: 30,
    });
};
// ============================================================
// CHECK IF MESSAGE IS MINDFULNESS-RELATED
// ============================================================
export const isMindfulnessRelated = async (message) => {
    const prompt = `You are a STRICT message classifier.

Determine if the user's message below is RELATED to any of these wellness topics:
- mindfulness, meditation, breathing, relaxation
- mood, emotion, feelings, mental health
- stress, anxiety, burnout, overwhelm
- sleep, rest, energy, fatigue, tiredness
- journaling, self-reflection, personal growth
- habits, routine, focus, productivity for wellbeing
- wellness tips, self-care, motivation

If RELATED → reply with ONLY the word: YES
If NOT related (e.g. coding, math, news, entertainment, sports, random facts, general knowledge) → reply with ONLY the word: NO

User message: "${message}"

Answer (YES or NO):`;
    try {
        const response = await tryGenerate(prompt);
        const cleaned = response.trim().toUpperCase();
        console.log(`Classification result: "${cleaned}"`);
        return cleaned.startsWith("YES");
    }
    catch (error) {
        console.error("Classification error:", error);
        return true;
    }
};
const buildJournalSummary = (entries) => {
    if (entries.length === 0)
        return "(no entries)";
    return entries
        .map((e) => {
        const date = new Date(e.dateTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        const tags = Array.isArray(e.tags)
            ? e.tags.join(", ")
            : "";
        return `• ${date} | Mood: ${e.mood} | Stress: ${e.stressLevel}/10 | Energy: ${e.energyLevel}/10 | Sleep: ${e.sleepHours}h | Feeling: "${e.feeling}"${tags ? ` | Tags: [${tags}]` : ""}`;
    })
        .join("\n");
};
// ============================================================
// SAVE AI CONVERSATION TO DATABASE
// ============================================================
export const saveAIConversation = async (userId, userMessage, aiResponse, options = {}) => {
    try {
        return await prisma.aIConversation.create({
            data: {
                userId,
                userMessage,
                aiResponse,
                isError: options.isError ?? false,
                entriesAnalyzed: options.entriesAnalyzed ?? 0,
            },
        });
    }
    catch (err) {
        console.error("Failed to save AI conversation:", err);
        return null;
    }
};
// ============================================================
// GET ALL AI CONVERSATIONS (admin, with pagination & filters)
// ============================================================
export const getAllAIConversations = async (params) => {
    const { page, limit, search, userId } = params;
    const skip = (page - 1) * limit;
    const where = {};
    if (userId)
        where.userId = userId;
    if (search) {
        where.OR = [
            { userMessage: { contains: search } },
            { aiResponse: { contains: search } },
            { user: { email: { contains: search } } },
        ];
    }
    const [conversations, total] = await Promise.all([
        prisma.aIConversation.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, email: true } },
            },
        }),
        prisma.aIConversation.count({ where }),
    ]);
    return {
        conversations,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
// ============================================================
// GENERATE AI RESPONSE 
// ============================================================
export const generateAIResponse = async (message, journalEntries) => {
    const summary = buildJournalSummary(journalEntries);
    const prompt = `You are **MindFul AI Assistant**, a warm, supportive, and insightful wellness coach.

Below is the user's REAL journal data from their database (most recent first):
${summary}

The user's question: "${message}"

CRITICAL INSTRUCTIONS:
1. Analyze the journal data above BEFORE answering.
2. Reference the user's ACTUAL numbers (mood, stress, energy, sleep, tags) in your answer.
3. Identify patterns, trends, and correlations (e.g., "Your stress is higher on days when you sleep less than 6 hours").
4. If the user asks about a topic that has NO data in their journal, gently say so and suggest they log more entries.
5. Be warm, empathetic, and encouraging.
6. Give 2–4 actionable suggestions when relevant.
7. Use markdown formatting:
   - **bold** for key points
   - "•" bullet points for lists
   - Short paragraphs for readability.
8. Keep the response 3–6 short paragraphs max.

Answer:`;
    return await tryGenerate(prompt);
};
//# sourceMappingURL=AIService.js.map