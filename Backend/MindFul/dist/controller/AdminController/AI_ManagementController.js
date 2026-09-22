import prisma from '../../config/prisma.js';
import { getAllAIConversations } from '../../services/AIService.js';
// ============================================================
// GET ALL AI CONVERSATIONS (with pagination, search, filter)
// ============================================================
export const getAllConversations = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const search = (req.query.search || '').trim();
        const userIdRaw = req.query.userId;
        const userId = userIdRaw ? parseInt(userIdRaw) : undefined;
        const result = await getAllAIConversations({
            page,
            limit,
            search,
            userId: userId && !isNaN(userId) ? userId : undefined,
        });
        res.status(200).json({
            conversations: result.conversations,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error('Get all AI conversations error:', error);
        res.status(500).json({
            message: 'Failed to fetch AI conversations',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// GET CONVERSATION BY ID
// ============================================================
export const getConversationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid conversation ID' });
            return;
        }
        const conversation = await prisma.aIConversation.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true } },
            },
        });
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        res.status(200).json({ conversation });
    }
    catch (error) {
        console.error('Get conversation by id error:', error);
        res.status(500).json({
            message: 'Failed to fetch conversation',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// DELETE CONVERSATION
// ============================================================
export const deleteConversation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid conversation ID' });
            return;
        }
        const existing = await prisma.aIConversation.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        await prisma.aIConversation.delete({ where: { id } });
        res.status(200).json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({
            message: 'Failed to delete conversation',
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=AI_ManagementController.js.map