import { Router } from 'express';
import * as AdminController from '../../controller/AdminController/AdminController.js';
import * as UserManagementController from '../../controller/AdminController/User_ManagementController.js';
import * as JournalManagementController from '../../controller/AdminController/Journal_ManagementController.js';
import * as AnalyticsController from '../../controller/AdminController/AnalyticsController.js';
import * as AIManagementController from '../../controller/AdminController/AI_ManagementController.js';
import { authenticateAdmin } from '../../middleware/verifyAdminToken.js';
const router = Router();
// ============================================================
// ADMIN AUTH ROUTES
// ============================================================
router.post('/admin-register', AdminController.register);
router.post('/admin-login', AdminController.login);
router.post('/admin-forgot-password', AdminController.forgotPassword);
router.post('/admin-reset-password', AdminController.resetPassword);
router.post('/admin-logout', authenticateAdmin, AdminController.logout);
// ============================================================
// ADMIN PROFILE (Protected)
// ============================================================
router.get('/admin-profile', authenticateAdmin, AdminController.getProfile);
// ============================================================
// ANALYTICS (Protected)
// ============================================================
router.get('/analytics', authenticateAdmin, AnalyticsController.getAnalytics);
// ============================================================
// USER MANAGEMENT (Protected)
// ============================================================
router.get('/accounts', authenticateAdmin, UserManagementController.getAllAccounts);
router.delete('/accounts/:role/:id', authenticateAdmin, UserManagementController.deleteAccount);
// ============================================================
// JOURNAL MANAGEMENT (Protected)
// ============================================================
router.get('/journals', authenticateAdmin, JournalManagementController.getAllJournals);
router.get('/journals/:id', authenticateAdmin, JournalManagementController.getJournalById);
router.delete('/journals/:id', authenticateAdmin, JournalManagementController.deleteJournal);
// ============================================================
// AI MANAGEMENT (Protected)
// ============================================================
router.get('/ai-conversations', authenticateAdmin, AIManagementController.getAllConversations);
router.get('/ai-conversations/:id', authenticateAdmin, AIManagementController.getConversationById);
router.delete('/ai-conversations/:id', authenticateAdmin, AIManagementController.deleteConversation);
export default router;
//# sourceMappingURL=AdminRoutes.js.map