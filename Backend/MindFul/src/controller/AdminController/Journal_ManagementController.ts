import { Request, Response } from 'express';
import prisma from '../../config/prisma.js';

// ============================================================
// GET ALL JOURNALS (with pagination, search, filter)
// ============================================================
export const getAllJournals = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const search = ((req.query.search as string) || '').trim();
    const mood = ((req.query.mood as string) || '').trim();

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { feeling: { contains: search } },
        { mood: { contains: search } },
        { moodEmoji: { contains: search } },
        {
          user: {
            email: { contains: search },
          },
        },
      ];
    }

    if (mood) {
      where.mood = mood;
    }

    const [journals, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateTime: 'desc' },
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
      }),
      prisma.journalEntry.count({ where }),
    ]);

    res.status(200).json({
      journals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all journals error:', error);
    res.status(500).json({
      message: 'Failed to fetch journals',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// GET JOURNAL BY ID
// ============================================================
export const getJournalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid journal ID' });
      return;
    }

    const journal = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    if (!journal) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.status(200).json({ journal });
  } catch (error) {
    console.error('Get journal by id error:', error);
    res.status(500).json({
      message: 'Failed to fetch journal',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// DELETE JOURNAL
// ============================================================
export const deleteJournal = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid journal ID' });
      return;
    }

    const existing = await prisma.journalEntry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    await prisma.journalEntry.delete({ where: { id } });

    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({
      message: 'Failed to delete journal entry',
      error: error instanceof Error ? error.message : error,
    });
  }
};