import { Router } from 'express';
import * as AdminController from '../../controller/AdminController/AdminController.js';
import * as UserManagementController from '../../controller/AdminController/User_ManagementController.js';
import * as JournalManagementController from '../../controller/AdminController/Journal_ManagementController.js';
import { authenticateAdmin } from '../../middleware/VerifyAdminToken.js';

const router = Router();

// ============================================================
// ADMIN ROUTES 
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

export default router;