// src/repositories/UserRepository.ts
import { PrismaClient } from "@/config/prisma";
import { User } from "@prisma/client";

export class UserRepository {
    /**
     * User Prisma Client
     */
    private userClient = PrismaClient.user;

    /**
     * Find all users
     * @returns Array of users with passwords omitted
     */
    public async findAll(): Promise<Omit<User, "password">[]> {
        const users = await this.userClient.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return users;
    }

    /**
     * Find user by ID
     * @param id - The user ID
     * @returns The user if found, null otherwise
     */
    public async findById(id: number): Promise<User | null> {
        return this.userClient.findUnique({
            where: { id },
        });
    }

    /**
     * Update user
     * @param id - The user ID
     * @param data - The data to update
     * @returns The updated user
     */
    public async update(id: number, data: Partial<Omit<User, "id" | "password">>): Promise<User> {
        return this.userClient.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete user
     * @param id - The user ID
     * @returns The deleted user
     */
    public async delete(id: number): Promise<User> {
        return this.userClient.delete({
            where: { id },
        });
    }
}

// Export singleton instance
export const userRepository = new UserRepository();