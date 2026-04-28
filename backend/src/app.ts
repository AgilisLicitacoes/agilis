import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { adminRouter } from "./routes/admin.js";
import { errorHandler } from "./routes/errors.js";
import { meRouter } from "./routes/me.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

  app.use("/api/me", meRouter);
  app.use("/api/admin", adminRouter);

  app.use(errorHandler);

  return app;
}

