// src/services/UserService.ts
import { userRepository } from "@/repositories/UserRepository";
import { User } from "@prisma/client";
import createHttpError from "http-errors";

export class UserService {
    /**
     * Get all users
     * @returns Array of users with passwords omitted
     */
    public async getAllUsers(): Promise<Omit<User, "password">[]> {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     * @param id - The user ID
     * @returns User data without password
     */
    public async getUserById(id: number): Promise<Omit<User, "password">> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw createHttpError.NotFound("User not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user;

        return userData;
    }

    /**
     * Update user
     * @param id - The user ID
     * @param data - The data to update
     * @returns Updated user data without password
     */
    public async updateUser(id: number, data: Partial<Omit<User, "id" | "password">>): Promise<Omit<User, "password">> {
        // Check if user exists
        const existingUser = await userRepository.findById(id);

        if (!existingUser) {
            throw createHttpError.NotFound("User not found");
        }

        const updatedUser = await userRepository.update(id, data);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = updatedUser;

        return userData;
    }

    /**
     * Delete user
     * @param id - The user ID
     * @returns Deleted user data without password
     */
    public async deleteUser(id: number): Promise<Omit<User, "password">> {
        // Check if user exists
        const existingUser = await userRepository.findById(id);

        if (!existingUser) {
            throw createHttpError.NotFound("User not found");
        }

        const deletedUser = await userRepository.delete(id);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = deletedUser;

        return userData;
    }
}

// Export singleton instance
export const userService = new UserService();