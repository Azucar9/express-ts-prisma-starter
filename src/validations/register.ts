import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(1, {
        message: "Name must be at least 1 character long",
      }),
    email: z
      .string({
        message: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters long",
      }),
    confirmPassword: z.string({
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
