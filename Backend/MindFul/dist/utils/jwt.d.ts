import jwt from "jsonwebtoken";
export declare const generateToken: (payload: object) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map