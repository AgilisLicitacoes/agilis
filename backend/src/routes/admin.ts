import { Router } from "express";
import { z } from "zod";

import { requireAdmin } from "../auth/requireAdmin.js";
import { requireAuth } from "../auth/verifyIdToken.js";
import { prisma } from "../db/prisma.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/users", async (req, res) => {
  const ApprovedQuery = z
    .object({
      approved: z.enum(["true", "false"]).optional()
    })
    .parse(req.query);

  const where =
    ApprovedQuery.approved === undefined
      ? {}
      : { approved: ApprovedQuery.approved === "true" };

  const users = await prisma.user.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    select: {
      uid: true,
      email: true,
      fullName: true,
      approved: true,
      role: true,
      createdAt: true,
      approvedAt: true,
      approvedBy: true,
      lastLoginAt: true
    }
  });

  return res.json({ users });
});

adminRouter.post("/users/:uid/approve", async (req, res) => {
  const Params = z.object({ uid: z.string().min(1) }).parse(req.params);
  const now = new Date();

  const updated = await prisma.user.update({
    where: { uid: Params.uid },
    data: {
      approved: true,
      approvedAt: now,
      approvedBy: req.user.uid
    }
  });

  return res.json({
    uid: updated.uid,
    approved: updated.approved,
    approvedAt: updated.approvedAt,
    approvedBy: updated.approvedBy
  });
});

adminRouter.post("/users/:uid/revoke", async (req, res) => {
  const Params = z.object({ uid: z.string().min(1) }).parse(req.params);

  const updated = await prisma.user.update({
    where: { uid: Params.uid },
    data: {
      approved: false,
      approvedAt: null,
      approvedBy: null
    }
  });

  return res.json({
    uid: updated.uid,
    approved: updated.approved,
    approvedAt: updated.approvedAt,
    approvedBy: updated.approvedBy
  });
});

