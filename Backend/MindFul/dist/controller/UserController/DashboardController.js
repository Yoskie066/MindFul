import { getUserJournalEntries } from '../../services/JournalService.js';
// ============================================================
// GET DASHBOARD DATA 
// ============================================================
export const getDashboard = async (req, res) => {
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
            message: 'Dashboard data fetched successfully',
            entries: formatted,
            total: formatted.length,
        });
    }
    catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            message: 'Failed to fetch dashboard data',
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=DashboardController.js.map