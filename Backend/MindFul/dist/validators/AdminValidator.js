import { z } from 'zod';
// Admin Register
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
// Admin Login
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});
// Admin Forgot Password
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});
// Admin Reset Password
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
//# sourceMappingURL=AdminValidator.js.map