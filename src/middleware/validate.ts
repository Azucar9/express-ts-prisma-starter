import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { ZodError, ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formatted: Record<string, string[]> = {};

        for (const issue of error.errors) {
          const key = issue.path.join(".");
          if (!formatted[key]) {
            formatted[key] = [];
          }
          formatted[key].push(issue.message);
        }

        const err = createHttpError.UnprocessableEntity();
        err.errors = formatted;
        next(err);
      }
    }
  };
};
