import { Request, Response, NextFunction, Router } from "express";
import createHttpError from "http-errors";
import { generateRandomToken } from "@/utils/hash";
import { Config } from "@/config";

const csrf = Router();

// CSRF protection middleware
csrf.use((req: Request, res: Response, next: NextFunction) => {
  if (Config.CSRF_IGNORE_METHODS?.includes(req.method)) {
    return next();
  }

  if (req.method === "GET" && req.path === Config.CSRF_PATH) {
    return next();
  }

  const csrfToken = req.headers[Config.CSRF_HEADER_NAME?.toLowerCase() as string];

  if (!csrfToken) {
    const error = createHttpError.Forbidden("CSRF token is required");
    return next(error);
  }

  const sessionToken = req.cookies[Config.CSRF_COOKIE_NAME];

  if (!sessionToken) {
    const error = createHttpError.Forbidden("CSRF token is required");
    return next(error);
  }

  if (csrfToken !== sessionToken) {
    const error = createHttpError.Forbidden("CSRF token is invalid");
    return next(error);
  }

  next();
});

// Generate a CSRF token
csrf.get(Config.CSRF_PATH, (req: Request, res: Response) => {
  const token = generateRandomToken();

  res.cookie(Config.CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });

  res.json({ token });
});

export { csrf };
