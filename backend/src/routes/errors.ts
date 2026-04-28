import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "validation_error",
      details: err.flatten()
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: "internal_error" });
};

