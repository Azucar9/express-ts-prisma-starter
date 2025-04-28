import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z.string({
    message: "Password is required",
  }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
