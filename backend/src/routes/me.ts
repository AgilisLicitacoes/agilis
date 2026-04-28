import { Router } from "express";
import { z } from "zod";

import { requireApproved } from "../auth/requireApproved.js";
import { requireAuth } from "../auth/verifyIdToken.js";
import { prisma } from "../db/prisma.js";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req, res) => {
  const uid = req.user.uid;
  const user = await prisma.user.findUnique({ where: { uid } });

  return res.json({
    uid,
    email: req.user.email ?? user?.email ?? null,
    fullName: user?.fullName ?? null,
    approved: user?.approved ?? false,
    role: user?.role ?? "user"
  });
});

meRouter.get("/approved", requireAuth, requireApproved, async (_req, res) => {
  return res.status(200).json({ ok: true });
});

const ProfileSchema = z.object({
  fullName: z.string().min(2).max(200)
});

meRouter.post("/profile", requireAuth, async (req, res) => {
  const { fullName } = ProfileSchema.parse(req.body);

  const uid = req.user.uid;
  const email = (req.user.email ?? "").toLowerCase();

  const user = await prisma.user.upsert({
    where: { uid },
    create: {
      uid,
      email,
      fullName,
      approved: false,
      role: "user",
      lastLoginAt: new Date()
    },
    update: {
      email,
      fullName,
      lastLoginAt: new Date()
    }
  });

  return res.status(200).json({
    uid: user.uid,
    email: user.email,
    fullName: user.fullName,
    approved: user.approved,
    role: user.role
  });
});

