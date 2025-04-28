import rateLimit, { Options } from "express-rate-limit";
import { Config } from "@/config";

/**
 * Creates a rate limiter with common configuration
 * @param options - Rate limiter options to override defaults
 * @returns Configured rate limiter middleware
 */
export function createRateLimiter(options: Partial<Options>) {
    return rateLimit({
        // Default options
        standardHeaders: true,
        legacyHeaders: false,
        // Skip rate limiting in development for easier testing
        skip: () => Config.NODE_ENV !== "production",
        // Override with provided options
        ...options
    });
}

// Pre-configured rate limiters
export const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests, please try again later",
    }
});

export const loginLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: {
        code: "TOO_MANY_LOGIN_ATTEMPTS",
        message: "Too many login attempts, please try again later",
    }
});

export const apiLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 300, // 1 request per second on average
    message: {
        code: "API_RATE_LIMIT_EXCEEDED",
        message: "API rate limit exceeded, please slow down your requests",
    }
});