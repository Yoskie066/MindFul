import { Request, Response } from 'express';
import crypto from 'crypto';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  updateUserResetToken,
  findUserByResetToken,
  clearUserResetToken,
  generateUserToken,
  comparePassword,
} from '../../services/AuthService.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validators/AuthValidator.js';

// ============================================================
// USER REGISTER
// POST /api/users/register
// ============================================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: parsed.error.issues  
      });
      return;
    }

    const { email, password } = parsed.data;

    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await createUser({ email, password });
    const token = generateUserToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// ============================================================
// USER LOGIN
// POST /api/users/login
// ============================================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: parsed.error.issues  
      });
      return;
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateUserToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });

    res.status(500).json({
    message: "Registration failed",
    error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// USER FORGOT PASSWORD
// POST /api/users/forgot-password
// ============================================================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: parsed.error.issues  
      });
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
  } catch (error) {
    res.status(500).json({ message: 'Forgot password failed', error });
  }
};

// ============================================================
// USER RESET PASSWORD
// POST /api/users/reset-password
// ============================================================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: parsed.error.issues  
      });
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

    res.status(200).json({ 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Reset password failed', error });
  }
};

// ============================================================
// GET USER PROFILE (Protected)
// GET /api/users/profile
// ============================================================
export const getProfile = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error });
  }
};