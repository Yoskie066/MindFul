import { verifyToken } from "../utils/jwt.js";
import prisma from "../config/prisma.js";
export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "user") {
        res.status(401).json({ message: "Invalid or expired user token" });
        return;
    }
    const payload = decoded;
    req.user = payload;
    // ---------- AUTO-HEARTBEAT ----------
    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: { status: true, lastSeen: true },
        });
        if (user) {
            const lastSeenMs = user.lastSeen ? new Date(user.lastSeen).getTime() : 0;
            const stale = Date.now() - lastSeenMs > 30 * 1000;
            const notOnline = user.status !== "online";
            if (stale || notOnline) {
                await prisma.user.update({
                    where: { id: payload.id },
                    data: { status: "online", lastSeen: new Date() },
                });
            }
        }
    }
    catch {
        // non-fatal: don't block the request
    }
    next();
};
//# sourceMappingURL=verifyUserToken.js.map