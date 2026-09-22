import { Request, Response } from 'express';
import prisma from '../../config/prisma.js';

// A user/admin is considered "online" only if the DB says so
// AND their last heartbeat was within this window.
// This handles the case where a user closes the browser
// without clicking "Logout".
const ONLINE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// ============================================================
// Determine effective status
// ============================================================
const resolveStatus = (
  status: string | null | undefined,
  lastSeen: Date | null | undefined
): 'online' | 'offline' => {
  if (status !== 'online') return 'offline';
  if (!lastSeen) return 'offline';
  const isFresh = Date.now() - new Date(lastSeen).getTime() < ONLINE_TIMEOUT_MS;
  return isFresh ? 'online' : 'offline';
};

// ============================================================
// GET ALL ACCOUNTS (Users + Admins combined)
// Supports pagination, search, status filter, role filter
// ============================================================
export const getAllAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit as string) || 10, 1),
      100
    );
    const search = ((req.query.search as string) || '').trim();
    const status = ((req.query.status as string) || '').trim().toLowerCase();
    const role = ((req.query.role as string) || '').trim().toLowerCase();

    // Build base where clauses
    const userWhere: any = {};
    const adminWhere: any = {};

    if (search) {
      userWhere.email = { contains: search };
      adminWhere.email = { contains: search };
    }

    // We can only apply status/role at the DB level for role.
    // Status is resolved post-query (see resolveStatus).

    // ---------- Fetch from both tables in parallel ----------
    const shouldFetchUsers = !role || role === 'user';
    const shouldFetchAdmins = !role || role === 'admin';

    const [users, admins] = await Promise.all([
      shouldFetchUsers
        ? prisma.user.findMany({
            where: userWhere,
            select: {
              id: true,
              email: true,
              status: true,
              lastSeen: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
      shouldFetchAdmins
        ? prisma.admin.findMany({
            where: adminWhere,
            select: {
              id: true,
              email: true,
              status: true,
              lastSeen: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    // ---------- Merge & normalize ----------
    const combined = [
      ...users.map((u) => ({
        id: u.id,
        email: u.email,
        role: 'user' as const,
        status: resolveStatus(u.status, u.lastSeen),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      ...admins.map((a) => ({
        id: a.id,
        email: a.email,
        role: 'admin' as const,
        status: resolveStatus(a.status, a.lastSeen),
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    ];

    // ---------- Filter by status (post-query) ----------
    let filtered = combined;
    if (status === 'online' || status === 'offline') {
      filtered = combined.filter((c) => c.status === status);
    }

    // ---------- Sort by createdAt desc ----------
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // ---------- Paginate ----------
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paged = filtered.slice(skip, skip + limit);

    res.status(200).json({
      accounts: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all accounts error:', error);
    res.status(500).json({
      message: 'Failed to fetch accounts',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// DELETE ACCOUNT 
// ============================================================
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = (req.params.role as string || '').toLowerCase();
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid account ID' });
      return;
    }

    if (role === 'user') {
      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: 'User deleted successfully' });
      return;
    }

    if (role === 'admin') {
      const existing = await prisma.admin.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      await prisma.admin.delete({ where: { id } });
      res.status(200).json({ message: 'Admin deleted successfully' });
      return;
    }

    res.status(400).json({ message: 'Invalid role. Must be "user" or "admin".' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'Failed to delete account',
      error: error instanceof Error ? error.message : error,
    });
  }
};