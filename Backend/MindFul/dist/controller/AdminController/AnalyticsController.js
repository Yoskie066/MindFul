import prisma from '../../config/prisma.js';
// ============================================================
// Online status helper (matches User_ManagementController)
// ============================================================
const ONLINE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const resolveStatus = (status, lastSeen) => {
    if (status !== 'online')
        return 'offline';
    if (!lastSeen)
        return 'offline';
    const isFresh = Date.now() - new Date(lastSeen).getTime() < ONLINE_TIMEOUT_MS;
    return isFresh ? 'online' : 'offline';
};
// ============================================================
// GET ANALYTICS (overall admin dashboard)
// ============================================================
export const getAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalAdmins, totalJournals, totalAIConversations, errorAIConversations, uniqueAIUsers, users, admins, journals,] = await Promise.all([
            prisma.user.count(),
            prisma.admin.count(),
            prisma.journalEntry.count(),
            prisma.aIConversation.count(),
            prisma.aIConversation.count({ where: { isError: true } }),
            prisma.aIConversation.findMany({
                select: { userId: true },
                distinct: ['userId'],
            }),
            prisma.user.findMany({
                select: { id: true, status: true, lastSeen: true, createdAt: true },
            }),
            prisma.admin.findMany({
                select: { id: true, status: true, lastSeen: true, createdAt: true },
            }),
            prisma.journalEntry.findMany({
                orderBy: { dateTime: 'desc' },
                include: {
                    user: { select: { id: true, email: true } },
                },
            }),
        ]);
        // ---------- Online counts ----------
        const onlineUsers = users.filter((u) => resolveStatus(u.status, u.lastSeen) === 'online').length;
        const onlineAdmins = admins.filter((a) => resolveStatus(a.status, a.lastSeen) === 'online').length;
        // ---------- Averages ----------
        const totalJ = journals.length;
        const avgStress = totalJ > 0
            ? journals.reduce((s, j) => s + j.stressLevel, 0) / totalJ
            : 0;
        const avgEnergy = totalJ > 0
            ? journals.reduce((s, j) => s + j.energyLevel, 0) / totalJ
            : 0;
        const avgSleep = totalJ > 0
            ? journals.reduce((s, j) => s + j.sleepHours, 0) / totalJ
            : 0;
        // ---------- Mood distribution ----------
        const moodCounts = {};
        journals.forEach((j) => {
            if (!moodCounts[j.mood]) {
                moodCounts[j.mood] = {
                    count: 0,
                    emoji: j.moodEmoji || '🙂',
                    color: j.moodColor || '#1976D2',
                };
            }
            moodCounts[j.mood].count += 1;
        });
        const moodDistribution = Object.entries(moodCounts)
            .map(([mood, data]) => ({
            mood,
            count: data.count,
            emoji: data.emoji,
            color: data.color,
        }))
            .sort((a, b) => b.count - a.count);
        // ---------- Top tags ----------
        const tagCounts = {};
        journals.forEach((j) => {
            const tags = Array.isArray(j.tags) ? j.tags : [];
            tags.forEach((t) => {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            });
        });
        const topTags = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
        // ---------- Journal trend (last 30 days) ----------
        const journalTrendMap = {};
        const userTrendMap = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            journalTrendMap[key] = 0;
            userTrendMap[key] = 0;
        }
        journals.forEach((j) => {
            const key = new Date(j.dateTime).toISOString().slice(0, 10);
            if (journalTrendMap[key] !== undefined)
                journalTrendMap[key] += 1;
        });
        users.forEach((u) => {
            const key = new Date(u.createdAt).toISOString().slice(0, 10);
            if (userTrendMap[key] !== undefined)
                userTrendMap[key] += 1;
        });
        const journalTrend = Object.entries(journalTrendMap).map(([date, count]) => ({
            date,
            count,
        }));
        const userTrend = Object.entries(userTrendMap).map(([date, count]) => ({
            date,
            count,
        }));
        // ---------- Recent journals ----------
        const recentJournals = journals.slice(0, 6).map((j) => ({
            id: j.id,
            userId: j.user.id,
            userEmail: j.user.email,
            mood: j.mood,
            moodEmoji: j.moodEmoji,
            moodColor: j.moodColor,
            dateTime: j.dateTime,
            feeling: j.feeling,
            stressLevel: j.stressLevel,
            energyLevel: j.energyLevel,
            sleepHours: j.sleepHours,
            tags: Array.isArray(j.tags) ? j.tags : [],
        }));
        res.status(200).json({
            message: 'Analytics fetched successfully',
            stats: {
                totalUsers,
                totalAdmins,
                totalJournals,
                onlineUsers,
                onlineAdmins,
                avgStress: Number(avgStress.toFixed(1)),
                avgEnergy: Number(avgEnergy.toFixed(1)),
                avgSleep: Number(avgSleep.toFixed(1)),
            },
            aiStats: {
                totalConversations: totalAIConversations,
                errorConversations: errorAIConversations,
                successConversations: totalAIConversations - errorAIConversations,
                uniqueUsers: uniqueAIUsers.length,
            },
            moodDistribution,
            topTags,
            journalTrend,
            userTrend,
            recentJournals,
        });
    }
    catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            message: 'Failed to fetch analytics',
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=AnalyticsController.js.map