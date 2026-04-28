import admin from "firebase-admin";
import type { RequestHandler } from "express";

type AuthedUser = {
  uid: string;
  email?: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: AuthedUser;
    }
  }
}

function getAdminApp() {
  if (admin.apps.length > 0) return admin.app();
  return admin.initializeApp();
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const header = req.header("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "missing_bearer_token" });

  try {
    const app = getAdminApp();
    const decoded = await app.auth().verifyIdToken(token, true);

    req.user = {
      uid: decoded.uid,
      email: typeof decoded.email === "string" ? decoded.email : undefined
    };

    return next();
  } catch (_err) {
    return res.status(401).json({ error: "invalid_token" });
  }
};

