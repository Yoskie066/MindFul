import type { User } from '@prisma/client';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashed: string) => Promise<boolean>;
export declare const createUser: (data: {
    email: string;
    password: string;
}) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const findUserByEmail: (email: string) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const findUserById: (id: number) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const updateUserPassword: (id: number, newPassword: string) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateUserResetToken: (id: number, token: string, expiry: Date) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const findUserByResetToken: (token: string) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const clearUserResetToken: (id: number) => Promise<{
    id: number;
    email: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    status: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const generateUserToken: (user: User) => string;
//# sourceMappingURL=UserService.d.ts.map