import { PrismaClient } from "@/config/prisma";
import { validateAndGetToken, verifyAccessToken } from "@/utils/jwt";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    const error = createHttpError.Unauthorized("Unauthorized");
    return next(error);
  }

  const token = validateAndGetToken(accessToken);

  if (!token) {
    const error = createHttpError.Unauthorized("Unauthorized");
    return next(error);
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    const error = createHttpError.Unauthorized("Unauthorized");
    return next(error);
  }

  try {
    const user = await PrismaClient.user.findUnique({
      where: { id: decoded.id },
      omit: { password: true },
    });

    if (!user) {
      const error = createHttpError.Unauthorized("Unauthorized");
      return next(error);
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError.Unauthorized("Unauthorized"));
  }
};
