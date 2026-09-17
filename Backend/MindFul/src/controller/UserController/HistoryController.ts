import { Request, Response } from 'express';
import { getUserJournalEntries } from '../../services/JournalService.js';

// ============================================================
// GET HISTORY 
// ============================================================
export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const entries = await getUserJournalEntries(userId);

    const formatted = entries.map((entry) => ({
      id: entry.id,
      mood: entry.mood,
      moodEmoji: entry.moodEmoji,
      moodColor: entry.moodColor,
      dateTime: entry.dateTime,
      feeling: entry.feeling,
      stressLevel: entry.stressLevel,
      energyLevel: entry.energyLevel,
      sleepHours: entry.sleepHours,
      tags: entry.tags || [],
      createdAt: entry.createdAt,
    }));

    res.status(200).json({
      message: 'History fetched successfully',
      entries: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      message: 'Failed to fetch history',
      error: error instanceof Error ? error.message : error,
    });
  }
};