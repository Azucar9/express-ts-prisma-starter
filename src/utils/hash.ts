import crypto from 'crypto';
import argon2 from 'argon2';
import { Config } from '@/config';

/**
 * Hashes a password using Argon2id
 * @param password - The password to hash
 * @returns The hashed password string
 */
async function hashPassword(password: string): Promise<string> {
  try {
    // Argon2 automatically generates a secure random salt
    return await argon2.hash(password, {
      // Argon2id variant combines Argon2i and Argon2d for best security
      type: argon2.argon2id,
      // Memory cost (in KiB)
      memoryCost: 19456, // 19MB - suitable for web servers
      // Time cost (number of iterations)
      timeCost: 2,
      // Parallelism factor
      parallelism: 1,
      // Output hash length
      hashLength: 32
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
}

/**
 * Verifies a password against a stored hash
 * @param password - The password to verify
 * @param hash - The stored hash
 * @returns True if the password matches the hash, false otherwise
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Password verification failed');
  }
}

/**
 * Generates a secure random token
 * @param length - The length of the token in bytes (default: 32)
 * @returns The generated token as a hexadecimal string
 */
function generateRandomToken(length: number = 16): string {
  const nonce = crypto.randomBytes(length).toString("hex");
  const signature = crypto
    .createHmac("sha256", Config.APP_SECRET as string)
    .update(nonce)
    .digest("hex");
  return `${nonce}:${signature}`;
}

export { hashPassword, verifyPassword, generateRandomToken };