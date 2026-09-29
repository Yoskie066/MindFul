import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import { createUser, findUserByEmail, findUserById, updateUserPassword, updateUserResetToken, findUserByResetToken, clearUserResetToken, generateUserToken, comparePassword, findUserByGoogleId, createUserWithGoogle, linkGoogleToUser, } from '../../services/UserService.js';
import { verifyGoogleToken, verifyGoogleAccessToken, } from '../../services/GoogleAuthService.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, } from '../../validators/UserValidator.js';
// ============================================================
// USER REGISTER
// ============================================================
export const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: parsed.error.issues,
            });
            return;
        }
        const { email, password } = parsed.data;
        const existing = await findUserByEmail(email);
        if (existing) {
            res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
            return;
        }
        const user = await createUser({ email, password });
        const token = generateUserToken(user);
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email },
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Registration failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// USER LOGIN
// ============================================================
export const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: parsed.error.issues,
            });
            return;
        }
        const { email, password } = parsed.data;
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: 'This account uses Google Sign-In. Please continue with Google.' });
            return;
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { status: 'online', lastSeen: new Date() },
        });
        const token = generateUserToken(user);
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Login failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// USER LOGOUT
// ============================================================
export const logout = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'offline', lastSeen: new Date() },
        });
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Logout failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// USER FORGOT PASSWORD
// ============================================================
export const forgotPassword = async (req, res) => {
    try {
        const parsed = forgotPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
            return;
        }
        const { email } = parsed.data;
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await updateUserResetToken(user.id, resetToken, resetTokenExpiry);
        res.status(200).json({
            message: 'Password reset token generated successfully',
            resetToken,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Forgot password failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// USER RESET PASSWORD
// ============================================================
export const resetPassword = async (req, res) => {
    try {
        const parsed = resetPasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
            return;
        }
        const { token, newPassword } = parsed.data;
        const user = await findUserByResetToken(token);
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }
        await updateUserPassword(user.id, newPassword);
        await clearUserResetToken(user.id);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Reset password failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// GET USER PROFILE
// ============================================================
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to get profile',
            error: error instanceof Error ? error.message : error,
        });
    }
};
// ============================================================
// GOOGLE AUTH
// ============================================================
export const googleAuth = async (req, res) => {
    try {
        const { idToken, accessToken } = req.body;
        if (!idToken && !accessToken) {
            res.status(400).json({ message: 'idToken or accessToken is required' });
            return;
        }
        const googleUser = idToken
            ? await verifyGoogleToken(idToken)
            : await verifyGoogleAccessToken(accessToken);
        // Gmail-only rule
        if (!googleUser.email.toLowerCase().endsWith('@gmail.com')) {
            res.status(400).json({ message: 'Only @gmail.com accounts are allowed' });
            return;
        }
        // 1) Look up by Google ID
        let user = await findUserByGoogleId(googleUser.googleId);
        // 2) Look up by email — link if exists
        if (!user) {
            const existing = await findUserByEmail(googleUser.email);
            if (existing) {
                user = await linkGoogleToUser(existing.id, googleUser.googleId);
            }
        }
        // 3) Otherwise create a fresh Google-only user
        if (!user) {
            user = await createUserWithGoogle({
                email: googleUser.email,
                googleId: googleUser.googleId,
            });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { status: 'online', lastSeen: new Date() },
        });
        const token = generateUserToken(user);
        res.status(200).json({
            message: 'Google login successful',
            user: { id: user.id, email: user.email },
            token,
        });
    }
    catch (error) {
        res.status(401).json({
            message: 'Google authentication failed',
            error: error instanceof Error ? error.message : error,
        });
    }
};
//# sourceMappingURL=UserController.js.map