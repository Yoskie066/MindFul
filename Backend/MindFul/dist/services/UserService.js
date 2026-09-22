import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
const SALT_ROUNDS = 10;
// ============================================================
// HASHING
// ============================================================
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};
// ============================================================
// USER CRUD OPERATIONS
// ============================================================
export const createUser = async (data) => {
    const hashed = await hashPassword(data.password);
    return await prisma.user.create({
        data: {
            email: data.email,
            password: hashed,
        },
    });
};
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};
export const findUserById = async (id) => {
    return await prisma.user.findUnique({ where: { id } });
};
export const updateUserPassword = async (id, newPassword) => {
    const hashed = await hashPassword(newPassword);
    return await prisma.user.update({
        where: { id },
        data: { password: hashed },
    });
};
export const updateUserResetToken = async (id, token, expiry) => {
    return await prisma.user.update({
        where: { id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });
};
export const findUserByResetToken = async (token) => {
    return await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });
};
export const clearUserResetToken = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: {
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
};
export const generateUserToken = (user) => {
    return generateToken({ id: user.id, email: user.email, role: 'user' });
};
//# sourceMappingURL=UserService.js.map