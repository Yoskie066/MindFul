import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
const SALT_ROUNDS = 10;
// ============================================================
// HASHING
// ============================================================
export const hashAdminPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};
export const compareAdminPassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};
// ============================================================
// ADMIN CRUD OPERATIONS
// ============================================================
export const createAdmin = async (data) => {
    const hashed = await hashAdminPassword(data.password);
    return await prisma.admin.create({
        data: {
            email: data.email,
            password: hashed,
        },
    });
};
export const findAdminByEmail = async (email) => {
    return await prisma.admin.findUnique({ where: { email } });
};
export const findAdminById = async (id) => {
    return await prisma.admin.findUnique({ where: { id } });
};
export const updateAdminPassword = async (id, newPassword) => {
    const hashed = await hashAdminPassword(newPassword);
    return await prisma.admin.update({
        where: { id },
        data: { password: hashed },
    });
};
export const updateAdminResetToken = async (id, token, expiry) => {
    return await prisma.admin.update({
        where: { id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });
};
export const findAdminByResetToken = async (token) => {
    return await prisma.admin.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });
};
export const clearAdminResetToken = async (id) => {
    return await prisma.admin.update({
        where: { id },
        data: {
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
};
export const generateAdminToken = (admin) => {
    return generateToken({ id: admin.id, email: admin.email, role: 'admin' });
};
//# sourceMappingURL=AdminService.js.map