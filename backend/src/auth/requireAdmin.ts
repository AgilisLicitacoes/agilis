import type { RequestHandler } from "express";

import { env } from "../config/env.js";

export const requireAdmin: RequestHandler = (req, res, next) => {
  const email = (req.user.email ?? "").toLowerCase();
  const isAdmin = email && env.adminEmails.includes(email);

  if (!isAdmin) return res.status(403).json({ error: "admin_required" });
  return next();
};

