import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../../config/prisma.js';
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
  findAdminByGoogleId,
  createAdminWithGoogle,
  linkGoogleToAdmin,
  updateGoogleProfile,
} from '../../services/AdminService.js';
import {
  verifyGoogleToken,
  verifyGoogleAccessToken,
} from '../../services/GoogleAuthService.js';
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
      res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
      return;
    }

    const { email, password } = parsed.data;

    const existing = await findAdminByEmail(email);
    if (existing) {
      res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
      return;
    }

    const admin = await createAdmin({ email, password });
    const token = generateAdminToken(admin);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin.id, email: admin.email, name: admin.name, picture: admin.picture },
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
      res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
      return;
    }

    const { email, password } = parsed.data;
    const admin = await findAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!admin.password) {
      res.status(401).json({ message: 'This admin uses Google Sign-In. Please continue with Google.' });
      return;
    }

    const isMatch = await compareAdminPassword(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { status: 'online', lastSeen: new Date() },
    });

    const token = generateAdminToken(admin);

    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin.id, email: admin.email, name: admin.name, picture: admin.picture },
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
// ADMIN LOGOUT
// ============================================================
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await prisma.admin.update({
      where: { id: adminId },
      data: { status: 'offline', lastSeen: new Date() },
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({
      message: 'Logout failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ============================================================
// FORGOT PASSWORD
// ============================================================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
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
// RESET PASSWORD
// ============================================================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation error', errors: parsed.error.issues });
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

    res.status(200).json({ message: 'Password reset successfully' });
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
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const admin = await findAdminById(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    res.status(200).json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      picture: admin.picture,
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

// ============================================================
// GOOGLE AUTH
// ============================================================
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, accessToken } = req.body as {
      idToken?: string;
      accessToken?: string;
    };

    if (!idToken && !accessToken) {
      res.status(400).json({ message: 'idToken or accessToken is required' });
      return;
    }

    const googleUser = idToken
      ? await verifyGoogleToken(idToken)
      : await verifyGoogleAccessToken(accessToken!);

    if (!googleUser.email.toLowerCase().endsWith('@gmail.com')) {
      res.status(400).json({ message: 'Only @gmail.com accounts are allowed' });
      return;
    }
    
    // 1) Lookup by Google ID
    let admin = await findAdminByGoogleId(googleUser.googleId);

    // 2) Lookup by email — link
    if (!admin) {
      const existing = await findAdminByEmail(googleUser.email);
      if (existing) {
        admin = await linkGoogleToAdmin(
          existing.id,
          googleUser.googleId,
          googleUser.name,
          googleUser.picture
        );
      }
    }

    if (!admin) {
      admin = await createAdminWithGoogle({
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name,
        picture: googleUser.picture,
      });
      
    } else {
      admin = await updateGoogleProfile(admin.id, googleUser.name, googleUser.picture);
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { status: 'online', lastSeen: new Date() },
    });

    const token = generateAdminToken(admin);

    res.status(200).json({
      message: 'Google login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        picture: admin.picture,
      },
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: 'Google authentication failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};