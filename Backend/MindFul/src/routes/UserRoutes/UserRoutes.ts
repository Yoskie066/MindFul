import { Router } from 'express';
import * as UserController from '../../controller/UserController/UserController.js';
import { authenticate } from '../../middleware/verifyToken.js';

const router = Router();

// ============================================================
// PUBLIC ROUTES (for UserLogin, UserRegister, UserForgotPassword)
// ============================================================
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// ============================================================
// PROTECTED ROUTES (requires authentication)
// ============================================================
router.get('/profile', authenticate, UserController.getProfile);

export default router;