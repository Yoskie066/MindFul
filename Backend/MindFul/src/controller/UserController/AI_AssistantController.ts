import { Request, Response } from 'express';
import {
  generateAIResponse,
  isMindfulnessRelated,
  getJournalEntriesFromDB,
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
      res.status(400).json({
        message:
          "I can't analyze your wellness yet. Please enter a Daily Journal entry first",
      });
      return;
    }

    console.log(`Found ${entries.length} journal entries for user ${userId}`);

    // ============================================================
    // STEP 2: Validate message relevance
    // ============================================================
    const isRelevant = await isMindfulnessRelated(message);

    if (!isRelevant) {
      res.status(400).json({
        message:
          "Sorry, I can only help with mindfulness, mood, stress, sleep, energy, journaling, and mental wellness. Please ask something related to your wellness journey",
      });
      return;
    }

    // ============================================================
    // STEP 3: Generate AI response based on MySQL data
    // ============================================================
    const response = await generateAIResponse(message, entries);

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