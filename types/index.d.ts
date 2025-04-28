import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: number;
  }
}

declare module "http-errors" {
  interface HttpError {
    errors?: Record<string, string[]>;
  }
}

// Add this to fix the Prisma type error with async password hashing
declare module "@prisma/client" {
  interface UserCreateInput {
    password: string;
  }
}