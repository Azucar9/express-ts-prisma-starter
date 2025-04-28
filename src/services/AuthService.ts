// src/services/AuthService.ts
import { authRepository } from "@/repositories/AuthRepository";
import { hashPassword, verifyPassword } from "@/utils/hash";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { User } from "@prisma/client";
import createHttpError from "http-errors";

export class AuthService {
    /**
     * Login a user
     * @param email - The user's email
     * @param password - The user's password
     * @returns The user data and tokens
     */
    public async login(email: string, password: string): Promise<{
        user: Omit<User, "password">;
        token: string;
        refreshToken: string;
    }> {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            const error = createHttpError.UnprocessableEntity();
            error.errors = { email: ["Invalid credentials"] };
            throw error;
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            const error = createHttpError.UnprocessableEntity();
            error.errors = { email: ["Invalid credentials"] };
            throw error;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user;

        const token = generateAccessToken({ id: user.id });
        const refreshToken = generateRefreshToken({ id: user.id });

        return {
            user: userData,
            token,
            refreshToken,
        };
    }

    /**
     * Register a new user
     * @param email - The user's email
     * @param password - The user's password
     * @param name - The user's name
     * @returns The created user
     */
    public async register(email: string, password: string, name: string): Promise<Omit<User, "password">> {
        const existingUser = await authRepository.findByEmail(email);

        if (existingUser) {
            const error = createHttpError.UnprocessableEntity();
            error.errors = { email: ["User already exists"] };
            throw error;
        }

        const hashedPassword = await hashPassword(password);

        const createdUser = await authRepository.create({
            email,
            name,
            password: hashedPassword,
        });

        // Remove password from response
        const { password: _, ...userData } = createdUser;

        return userData;
    }

    /**
     * Refresh access token
     * @param userId - The user ID
     * @returns New access token and refresh token
     */
    public async refreshToken(userId: number): Promise<{
        token: string;
        refreshToken: string;
    }> {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw createHttpError.Unauthorized("Unauthorized");
        }

        const token = generateAccessToken({ id: userId });
        const refreshToken = generateRefreshToken({ id: userId });

        return {
            token,
            refreshToken,
        };
    }

    /**
     * Get user profile
     * @param userId - The user ID
     * @returns User data without password
     */
    public async getUserProfile(userId: number): Promise<Omit<User, "password">> {
        const user = await authRepository.findById(userId);

        if (!user) {
            throw createHttpError.NotFound("User not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user;

        return userData;
    }
}

// Export singleton instance
export const authService = new AuthService();