import { z } from "zod";

export const CourseSchema = z.object({
  id: z.number(),
  img: z.string(),
  title: z.string(),
  description: z.string(),
  teacher_name: z.string(),
  completeSpeed: z.number().optional(),
  star: z.number().optional(),
  price: z.number(),
  quantity: z.number().optional(),
  level: z.number().optional(),
  category_name: z.string().optional(),
  category_id: z.number().optional(),
  beginLessonId: z.number().optional(),
  update_at: z.union([z.string(), z.number()]).optional(),
  course_img: z.string(),
});

export const CourseDetailSchema = z.object({
  course: CourseSchema,
  id: z.number(),
  content: z.string(),
  request: z.string(),
  description: z.string(),
  course_include: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseDetail = z.infer<typeof CourseDetailSchema>;
