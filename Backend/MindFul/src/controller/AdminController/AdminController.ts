import { Request, Response } from 'express';
import crypto from 'crypto';
import {
  createAdmin,
  findAdminByEmail,
  findAdminById,
  updateAdminPassword,
  updateAdminResetToken,
  findAdminByResetToken,
  clearAdminResetToken,
  generateAdminToken,
  compareAdminPassword,
} from '../../services/AdminService.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validators/AdminValidator.js';

// ============================================================
// ADMIN REGISTER
// ============================================================
export const register = async (req: Request, res: Response): Promise<void> => {
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

    const existing = await findAdminByEmail(email);
    if (existing) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const admin = await createAdmin({ email, password });
    const token = generateAdminToken(admin);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// ADMIN LOGIN
// ============================================================
export const login = async (req: Request, res: Response): Promise<void> => {
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

    const admin = await findAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await compareAdminPassword(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateAdminToken(admin);

    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// ADMIN FORGOT PASSWORD
// ============================================================
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: parsed.error.issues,
      });
      return;
    }

    const { email } = parsed.data;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await updateAdminResetToken(admin.id, resetToken, resetTokenExpiry);

    res.status(200).json({
      message: 'Password reset token generated successfully',
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Forgot password failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// ADMIN RESET PASSWORD
// ============================================================
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: parsed.error.issues,
      });
      return;
    }

    const { token, newPassword } = parsed.data;

    const admin = await findAdminByResetToken(token);
    if (!admin) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    await updateAdminPassword(admin.id, newPassword);
    await clearAdminResetToken(admin.id);

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Reset password failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// GET ADMIN PROFILE 
// ============================================================
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.admin?.id;

    if (!adminId) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const admin = await findAdminById(adminId);

    if (!admin) {
      res.status(404).json({
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      id: admin.id,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get profile',
      error: error instanceof Error ? error.message : error,
    });
  }
};