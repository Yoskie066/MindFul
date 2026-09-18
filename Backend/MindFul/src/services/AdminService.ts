import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
import type { Admin } from '@prisma/client';

const SALT_ROUNDS = 10;

// ============================================================
// HASHING
// ============================================================
export const hashAdminPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const compareAdminPassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

// ============================================================
// ADMIN CRUD OPERATIONS
// ============================================================
export const createAdmin = async (data: { email: string; password: string }) => {
  const hashed = await hashAdminPassword(data.password);
  return await prisma.admin.create({
    data: {
      email: data.email,
      password: hashed,
    },
  });
};

export const findAdminByEmail = async (email: string) => {
  return await prisma.admin.findUnique({ where: { email } });
};

export const findAdminById = async (id: number) => {
  return await prisma.admin.findUnique({ where: { id } });
};

export const updateAdminPassword = async (id: number, newPassword: string) => {
  const hashed = await hashAdminPassword(newPassword);
  return await prisma.admin.update({
    where: { id },
    data: { password: hashed },
  });
};

export const updateAdminResetToken = async (
  id: number,
  token: string,
  expiry: Date
) => {
  return await prisma.admin.update({
    where: { id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
};

export const findAdminByResetToken = async (token: string) => {
  return await prisma.admin.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
};

export const clearAdminResetToken = async (id: number) => {
  return await prisma.admin.update({
    where: { id },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

export const generateAdminToken = (admin: Admin) => {
  return generateToken({ id: admin.id, email: admin.email, role: 'admin' });
};