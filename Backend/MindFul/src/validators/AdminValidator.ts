import { z } from 'zod';

const gmailEmail = z
  .string()
  .email('Invalid email format')
  .refine((val) => val.toLowerCase().endsWith('@gmail.com'), {
    message: 'Email must end with @gmail.com',
  });

export const registerSchema = z.object({
  email: gmailEmail,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: gmailEmail,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: gmailEmail,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;