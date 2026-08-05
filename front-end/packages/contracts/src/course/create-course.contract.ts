import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string(),
  category_id: z.number(),
  teacher_id: z.number(),
  level: z.number().optional(),
  quantity: z.number().optional(),
});

export type CreateCoursePayload = z.infer<typeof CreateCourseSchema>;
