import { Router } from 'express';
import * as UserController from '../../controller/UserController/UserController.js';
import * as DailyJournalController from '../../controller/UserController/DailyJournalController.js';
import * as HistoryController from '../../controller/UserController/HistoryController.js';
import * as DashboardController from '../../controller/UserController/DashboardController.js';
import * as AI_AssistantController from '../../controller/UserController/AI_AssistantController.js';
import { authenticateUser } from '../../middleware/verifyUserToken.js';

const router = Router();

// ============================================================
// AUTH ROUTES 
// ============================================================
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// ============================================================
// USER PROFILE (Protected)
// ============================================================
router.get('/profile', authenticateUser, UserController.getProfile);

// ============================================================
// DASHBOARD (Protected)
// ============================================================
router.get('/dashboard', authenticateUser, DashboardController.getDashboard);

// ============================================================
// DAILY JOURNAL (Protected)
// ============================================================
router.post('/daily-journal', authenticateUser, DailyJournalController.createEntry);

// ============================================================
// HISTORY (Protected)
// ============================================================
router.get('/history', authenticateUser, HistoryController.getHistory);

// ============================================================
// AI ASSISTANT (Protected)
// ============================================================
router.post('/ai-assistant', authenticateUser, AI_AssistantController.chatWithAI);


export default router;