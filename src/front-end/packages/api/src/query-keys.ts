import type { CourseSearchParams } from "./courses/courses.api";

export const queryKeys = {
  cart: {
    byUser: (userId: number) => ["cart", userId] as const,
    courseIds: (userId: number) => ["cart", userId, "course-ids"] as const,
    detailed: (userId: number) => ["cart", userId, "detailed"] as const,
  },
  courses: {
    all: ["courses"] as const,
    byUser: (userId: number) => ["courses", "user", userId] as const,
    detail: (courseId: number) => ["courses", courseId, "detail"] as const,
    lessons: (courseId: number) => ["courses", courseId, "lessons"] as const,
    search: (params: CourseSearchParams) => ["courses", "search", params] as const,
    subLessons: (lessonId: number) => ["lessons", lessonId, "sublessons"] as const,
    top: ["courses", "top"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  settings: {
    advanced: ["settings", "advanced"] as const,
    appearance: ["settings", "appearance"] as const,
    notifications: ["settings", "notifications"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
  },
  users: {
    all: ["users"] as const,
    byCourse: (courseId: number) => ["users", "course", courseId] as const,
  },
};
