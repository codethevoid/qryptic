import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter a password" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
