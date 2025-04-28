import { Config } from "@/config";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Generates a JWT access token for the given user ID
 * @param userId - The ID of the user to generate the token for
 * @returns The generated JWT access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, Config.JWT_SECRET as string, {
    expiresIn: Config.JWT_TOKEN_EXPIRES_IN,
  });
};

/**
 * Generates a JWT refresh token for the given user ID
 * @param userId - The ID of the user to generate the refresh token for
 * @returns The generated JWT refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, Config.REFRESH_TOKEN_SECRET as string, {
    expiresIn: Config.REFRESH_TOKEN_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token - The JWT token to verify
 * @param secret - The secret used to verify the token
 * @returns The decoded JWT payload or null if verification fails
 */
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, Config.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Verifies a JWT refresh token and returns the decoded payload
 * @param token - The JWT refresh token to verify
 * @returns The decoded JWT payload or null if verification fails
 */
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, Config.REFRESH_TOKEN_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Validates an Authorization header and returns the token
 * @param header - The Authorization header to validate
 * @returns The token from the Authorization header or false if the header is invalid
 */
export const validateAndGetToken = (header: string) => {
  if (typeof header !== "string") {
    return false;
  }

  // Match "Bearer <token>" where <token> is any non‑empty string
  const match = header.match(Config.JWT_BEARER_REGEX);
  if (!match) {
    return false;
  }

  const token = match[1];
  return token;
};
