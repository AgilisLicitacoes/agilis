import type { RequestHandler } from "express";

import { prisma } from "../db/prisma.js";

export const requireApproved: RequestHandler = async (req, res, next) => {
  const uid = req.user.uid;
  const user = await prisma.user.findUnique({
    where: { uid },
    select: { approved: true }
  });

  if (!user?.approved) return res.status(403).json({ error: "approval_required" });
  return next();
};

