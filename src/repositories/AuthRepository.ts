// src/repositories/AuthRepository.ts
import { PrismaClient } from "@/config/prisma";
import { User } from "@prisma/client";

export class AuthRepository {
    /**
     * User Prisma Client
     */
    private userClient = PrismaClient.user;

    /**
     * Find user by email
     * @param email - The email to search for
     * @returns The user if found, null otherwise
     */
    public async findByEmail(email: string): Promise<User | null> {
        return this.userClient.findUnique({
            where: { email },
        });
    }

    /**
     * Find user by ID
     * @param id - The user ID to search for
     * @returns The user if found, null otherwise
     */
    public async findById(id: number): Promise<User | null> {
        return this.userClient.findUnique({
            where: { id },
        });
    }

    /**
     * Create a new user
     * @param data - The user data
     * @returns The created user
     */
    public async create(data: { email: string; name: string; password: string }): Promise<User> {
        return this.userClient.create({
            data,
        });
    }
}

// Export singleton instance
export const authRepository = new AuthRepository();