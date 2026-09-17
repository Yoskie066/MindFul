import { Request, Response } from 'express';
import { createJournalEntry } from '../../services/JournalService.js';
import { createJournalSchema } from '../../validators/JournalValidator.js';

// ============================================================
// CREATE JOURNAL 
// ============================================================
export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const parsed = createJournalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: parsed.error.issues,
      });
      return;
    }

    const entry = await createJournalEntry(userId, parsed.data);

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry,
    });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({
      message: 'Failed to create journal entry',
      error: error instanceof Error ? error.message : error,
    });
  }
};