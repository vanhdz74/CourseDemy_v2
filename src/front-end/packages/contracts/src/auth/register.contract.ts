import { z } from "zod";

export const RegisterSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  retype_password: z.string().min(1),
  role: z.string(),
  is_active: z.number().optional(),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;
