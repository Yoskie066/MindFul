export interface UserPayload {
    id: number;
    email: string;
    role: "user";
}
export interface AdminPayload {
    id: number;
    email: string;
    role: "admin";
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
            admin?: AdminPayload;
        }
    }
}
//# sourceMappingURL=index.d.ts.map