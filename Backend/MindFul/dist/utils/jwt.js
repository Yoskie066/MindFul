import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}
if (!JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined in .env");
}
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map