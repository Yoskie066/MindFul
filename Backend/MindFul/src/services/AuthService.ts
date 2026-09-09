import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
import type { User } from '@prisma/client';

const SALT_ROUNDS = 10;

// ============================================================
// HASHING
// ============================================================
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

// ============================================================
// USER CRUD OPERATIONS
// ============================================================
export const createUser = async (data: { email: string; password: string }) => {
  const hashed = await hashPassword(data.password);
  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUserPassword = async (id: number, newPassword: string) => {
  const hashed = await hashPassword(newPassword);
  return await prisma.user.update({
    where: { id },
    data: { password: hashed },
  });
};

export const updateUserResetToken = async (id: number, token: string, expiry: Date) => {
  return await prisma.user.update({
    where: { id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
};

export const findUserByResetToken = async (token: string) => {
  return await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
};

export const clearUserResetToken = async (id: number) => {
  return await prisma.user.update({
    where: { id },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

export const generateUserToken = (user: User) => {
  return generateToken({ id: user.id, email: user.email, role: 'user' });
};