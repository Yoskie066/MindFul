import { Router } from 'express';
import * as AdminController from '../../controller/AdminController/AdminController.js';
import { authenticateAdmin } from '../../middleware/VerifyAdminToken.js';

const router = Router();

// ============================================================
// ADMIN ROUTES 
// ============================================================
router.post('/admin-register', AdminController.register);
router.post('/admin-login', AdminController.login);
router.post('/admin-forgot-password', AdminController.forgotPassword);
router.post('/admin-reset-password', AdminController.resetPassword);

// ============================================================
// USER PROFILE (Protected)
// ============================================================
router.get('/admin-profile', authenticateAdmin, AdminController.getProfile);

export default router;