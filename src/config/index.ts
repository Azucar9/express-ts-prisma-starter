// config.ts
import { config } from "dotenv";
import crypto from "crypto";
config();

const {
  PORT,
  HOST,
  JWT_SECRET,
  APP_NAME,
  NODE_ENV,
  REFRESH_TOKEN_SECRET,
  APP_SECRET
} = process.env;

// Generate secure secrets if not provided in environment
const generateSecureSecret = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const JWT_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days

export const Config = Object.freeze({
  // App
  APP_NAME: APP_NAME || "express-template",
  REFRESH_TOKEN_NAME: `${APP_NAME || "express-template"}-rt`,
  ORIGIN: ["http://localhost:5173", "http://localhost:3000"],
  JWT_BEARER_REGEX: /^Bearer\s+([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)$/,
  NODE_ENV: NODE_ENV || "development",
  HOST: HOST || "localhost",
  PORT: PORT || 3000,

  // JWT
  JWT_SECRET: JWT_SECRET || generateSecureSecret(),
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET || generateSecureSecret(),

  // APP_SECRET: Used for CSRF protection and other app-specific cryptographic operations
  APP_SECRET: APP_SECRET || generateSecureSecret(),

  JWT_TOKEN_EXPIRES_IN,
  JWT_TOKEN_EXPIRES_IN_MS: JWT_TOKEN_EXPIRES_IN * 1000,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN_MS: REFRESH_TOKEN_EXPIRES_IN * 1000,

  // CSRF
  CSRF_PATH: "/csrf-token",
  CSRF_COOKIE_NAME: `${APP_NAME || "express-template"}-csrf`,
  CSRF_HEADER_NAME: `x-csrf-token`,
  CSRF_IGNORE_METHODS: ["GET", "HEAD", "OPTIONS"],
});

// Log a warning if using auto-generated secrets in production
if (NODE_ENV === 'production') {
  if (!JWT_SECRET) console.warn('WARNING: No JWT_SECRET provided in production environment');
  if (!REFRESH_TOKEN_SECRET) console.warn('WARNING: No REFRESH_TOKEN_SECRET provided in production environment');
  if (!APP_SECRET) console.warn('WARNING: No APP_SECRET provided in production environment');
}