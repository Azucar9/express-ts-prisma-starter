import { Logger } from "@/config/logger";
import { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { Prisma } from "@prisma/client";

export class ErrorHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static handler = (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal server error";
    let errors: Record<string, string[]> | undefined = undefined;

    // Handle HTTP errors
    if ('statusCode' in err) {
      statusCode = err.statusCode;
      message = err.message;
      errors = (err as HttpError).errors;
    }

    // Handle Prisma specific errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violations
      if (err.code === 'P2002') {
        statusCode = 409; // Conflict
        const target = err.meta?.target as string[] || [];
        message = `${target.join(', ')} already exists`;
        errors = {
          [target[0] || 'field']: [`${target.join(', ')} already exists`]
        };
      }
      // Handle foreign key constraint violations
      else if (err.code === 'P2003') {
        statusCode = 400; // Bad Request
        message = "Related record not found";
      }
      // Handle record not found errors
      else if (err.code === 'P2001' || err.code === 'P2018') {
        statusCode = 404; // Not Found
        message = "Record not found";
      }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      statusCode = 400; // Bad Request
      message = "Validation error";
    }

    // Standardized error response based on status code
    switch (statusCode) {
      case 422: // UnprocessableEntity
        res.status(statusCode).json({
          message: message || "The given data was invalid.",
          errors,
        });
        break;
      case 404: // NotFound
        res.status(statusCode).json({
          message,
        });
        break;
      case 400: // BadRequest
        res.status(statusCode).json({
          message,
          errors,
        });
        break;
      case 401: // Unauthorized
        res.status(statusCode).json({
          message: message || "Unauthorized access",
        });
        break;
      case 403: // Forbidden
        res.status(statusCode).json({
          message: message || "Forbidden access",
        });
        break;
      case 409: // Conflict
        res.status(statusCode).json({
          message,
          errors,
        });
        break;
      default: // 500 and others
        Logger.error({
          message: message || "Internal server error",
          path: req.url,
          method: req.method,
          code: statusCode,
          stack: err.stack,
          timestamp: new Date().toISOString(),
        });
        res.status(statusCode).json({
          message: message || "Internal server error",
          path: req.path,
          method: req.method,
        });
        break;
    }
  };

  static notFound = (req: Request, res: Response, next: NextFunction) => {
    Logger.error({
      message: `Cannot ${req.method} ${req.url}`,
      path: req.url,
      code: 404,
      timestamp: new Date().toISOString(),
    });

    next(createHttpError.NotFound(`Cannot ${req.method} ${req.url}`));
  };
}