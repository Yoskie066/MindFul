import type { Admin } from '@prisma/client';
export declare const hashAdminPassword: (password: string) => Promise<string>;
export declare const compareAdminPassword: (password: string, hashed: string) => Promise<boolean>;
export declare const createAdmin: (data: {
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
export declare const findAdminByEmail: (email: string) => Promise<{
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
export declare const findAdminById: (id: number) => Promise<{
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
export declare const updateAdminPassword: (id: number, newPassword: string) => Promise<{
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
export declare const updateAdminResetToken: (id: number, token: string, expiry: Date) => Promise<{
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
export declare const findAdminByResetToken: (token: string) => Promise<{
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
export declare const clearAdminResetToken: (id: number) => Promise<{
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
export declare const generateAdminToken: (admin: Admin) => string;
//# sourceMappingURL=AdminService.d.ts.map