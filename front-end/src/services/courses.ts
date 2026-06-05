import axiosClient from "@/api/axiosClient";
import publicClient from "@/api/publicClient";
import { endpoints } from "@/services/endpoints";
import { Category } from "@/types/categoryType";
import { Course, CourseDetail } from "@/types/courseType";
import { Lesson, SubLesson } from "@/types/lessonType";
import { PageResponse } from "@/types/apiType";

export interface CourseSearchResponse {
  courses: Course[];
  totalPages: number;
  totalElements: number;
}

export interface CourseSearchParams {
  keyword?: string;
  category_id?: string;
  min_price?: string;
  max_price?: string;
  p?: number;
  teacher_id?: string;
}

export interface TopCourseRevenue {
  course: Course;
  students: number;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  price: string;
  category_id: number;
  teacher_id: number;
  level?: number;
  quantity?: number;
}

export function buildCourseSearchUrl(params: CourseSearchParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return `${endpoints.courses.search}${query.toString() ? `?${query.toString()}` : ""}`;
}

export async function searchCourses(params: CourseSearchParams = {}) {
  const { data } = await publicClient.get<PageResponse<Course>>(
    buildCourseSearchUrl(params)
  );
  return {
    courses: data.items,
    totalPages: data.totalPages,
    totalElements: data.totalItems,
  } satisfies CourseSearchResponse;
}

export async function getCourseById(courseId: number) {
  const { data } = await publicClient.get<Course>(endpoints.courses.byId(courseId));
  return data;
}

export async function getCourseDetail(courseId: number) {
  const { data } = await publicClient.get<CourseDetail>(
    endpoints.courses.detail(courseId)
  );
  return data;
}

export async function createCourse(payload: CreateCoursePayload) {
  const { data } = await axiosClient.post<{ message?: string }>(
    endpoints.courses.base,
    payload
  );
  return data;
}

export async function updateCourseDetail(
  courseId: number,
  payload: CourseDetail | Record<string, unknown>
) {
  const { data } = await axiosClient.put<{ message: string }>(
    endpoints.courses.detailManage(courseId),
    payload
  );
  return data;
}

export async function uploadCourseImage(courseId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post<{ url: string }>(
    endpoints.courses.uploadImage(courseId),
    formData
  );
  return data.url;
}

export async function getCategories() {
  const { data } = await publicClient.get<Category[]>(endpoints.categories.list);
  return data;
}

export async function getTopCourses() {
  const { data } =
    await publicClient.get<TopCourseRevenue[]>(endpoints.revenue.topCourses);
  return data;
}

export async function getPublicLessons(courseId: number) {
  const { data } = await publicClient.get<Lesson[]>(
    endpoints.lessons.publicByCourse(courseId)
  );
  return data;
}

export async function getPublicSubLessons(lessonId: number) {
  const { data } = await publicClient.get<SubLesson[]>(
    endpoints.subLessons.publicByLesson(lessonId)
  );
  return data;
}

export async function getCoursesByUser(userId: number) {
  const { data } = await axiosClient.get<Course[]>(endpoints.courses.byUser(userId));
  return data;
}

export async function updateSubLesson(
  subLessonId: number,
  payload: Partial<Pick<SubLesson, "title" | "video_url">>
) {
  const { data } = await axiosClient.put<{ message: string }>(
    endpoints.subLessons.update(subLessonId),
    payload
  );
  return data;
}

export async function addRelativeSubLesson({
  lessonId,
  referenceSubLessonId,
  insertAfter,
  payload,
}: {
  lessonId: number;
  referenceSubLessonId: number;
  insertAfter: boolean;
  payload: Pick<SubLesson, "title" | "video_url">;
}) {
  const { data } = await axiosClient.post<{ message: string }>(
    `/lesson/${lessonId}/sublesson/add-relative?referenceSubLessonId=${referenceSubLessonId}&insertAfter=${insertAfter}`,
    payload
  );
  return data;
}

export async function uploadVideo(subLessonId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post<{ url: string }>(
    endpoints.subLessons.uploadVideo(subLessonId),
    formData
  );
  return data.url;
}
