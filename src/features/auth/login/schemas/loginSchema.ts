import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Username atau Email minimal 3 karakter" })
    .max(50, { message: "Username atau Email maksimal 50 karakter" })
    .trim(),
  password: z
    .string()
    .min(3, { message: "Password minimal 3 karakter" }) // Keeping it lenient as per user request/existing logic, but safe
    .trim(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
