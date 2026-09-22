import { Request, Response } from 'express';
import {
  generateAIResponse,
  isMindfulnessRelated,
  getJournalEntriesFromDB,
  saveAIConversation,
} from '../../services/AIService.js';

// ============================================================
// CHAT WITH AI
// ============================================================
export const chatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    // ============================================================
    // STEP 1: READ from MySQL
    // ============================================================
    const entries = await getJournalEntriesFromDB(userId);

    if (!entries || entries.length === 0) {
      const noEntriesMsg =
        "I can't analyze your wellness yet. Please enter a Daily Journal entry first";

      // Save even this exchange so admin can see
      await saveAIConversation(userId, message, noEntriesMsg, {
        isError: true,
        entriesAnalyzed: 0,
      });

      res.status(400).json({ message: noEntriesMsg });
      return;
    }

    console.log(`Found ${entries.length} journal entries for user ${userId}`);

    // ============================================================
    // STEP 2: Validate message relevance
    // ============================================================
    const isRelevant = await isMindfulnessRelated(message);

    if (!isRelevant) {
      const notRelevantMsg =
        "Sorry, I can only help with mindfulness, mood, stress, sleep, energy, journaling, and mental wellness. Please ask something related to your wellness journey";

      // Save the exchange
      await saveAIConversation(userId, message, notRelevantMsg, {
        isError: true,
        entriesAnalyzed: entries.length,
      });

      res.status(400).json({ message: notRelevantMsg });
      return;
    }

    // ============================================================
    // STEP 3: Generate AI response based on MySQL data
    // ============================================================
    const response = await generateAIResponse(message, entries);

    // ============================================================
    // STEP 4: Save the conversation
    // ============================================================
    await saveAIConversation(userId, message, response, {
      isError: false,
      entriesAnalyzed: entries.length,
    });

    res.status(200).json({
      response,
      entriesAnalyzed: entries.length,
    });
  } catch (error: any) {
    console.error('AI Assistant error:', error);

    const status = error?.status || error?.response?.status;

    if (status === 503) {
      res.status(503).json({
        message:
          'The AI service is currently busy. Please try again in a few seconds.',
      });
      return;
    }

    if (status === 429) {
      res.status(429).json({
        message: 'Too many requests. Please wait a moment and try again.',
      });
      return;
    }

    res.status(500).json({
      message: error?.message || 'Failed to generate AI response',
    });
  }
};