import { z } from "zod";

export const roleSchema = z.enum(["EMPLOYEE", "ADMIN"]);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(100),
  password: z.string().min(8).max(255),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(1).max(255),
});

export const authUserSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(100),
  role: roleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
