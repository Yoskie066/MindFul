import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AdminPayload } from "../types/index.js";
import prisma from "../config/prisma.js";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || (decoded as AdminPayload).role !== "admin") {
    res.status(401).json({ message: "Invalid or expired admin token" });
    return;
  }

  const payload = decoded as AdminPayload;
  req.admin = payload;

  // ---------- AUTO-HEARTBEAT ----------
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { status: true, lastSeen: true },
    });

    if (admin) {
      const lastSeenMs = admin.lastSeen ? new Date(admin.lastSeen).getTime() : 0;
      const stale = Date.now() - lastSeenMs > 30 * 1000;
      const notOnline = admin.status !== "online";

      if (stale || notOnline) {
        await prisma.admin.update({
          where: { id: payload.id },
          data: { status: "online", lastSeen: new Date() },
        });
      }
    }
  } catch {
    // non-fatal
  }

  next();
};