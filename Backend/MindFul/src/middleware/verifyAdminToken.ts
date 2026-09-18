import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AdminPayload } from "../types/index.js";

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || (decoded as AdminPayload).role !== "admin") {
    res.status(401).json({
      message: "Invalid or expired admin token",
    });
    return;
  }

  req.admin = decoded as AdminPayload;

  next();
};