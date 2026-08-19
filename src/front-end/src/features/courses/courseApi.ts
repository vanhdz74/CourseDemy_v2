import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/services/endpoints";
import type { Category } from "@/types/categoryType";
import type { Course, CourseDetail } from "@/types/courseType";
import type { Lesson, SubLesson } from "@/types/lessonType";
import type { PageResponse } from "@/types/apiType";
import type {
  CourseSearchParams,
  CourseSearchResponse,
  CreateCoursePayload,
  GetCoursesByUserRequest,
  TopCourseRevenue,
} from "@/services/courses";

export type UpdateCourseRequest = {
  courseId: number;
  payload: Partial<Course> & Record<string, unknown>;
};

export type UpdateCourseDetailRequest = {
  courseId: number;
  payload: CourseDetail | Record<string, unknown>;
};

export type UploadCourseImageRequest = {
  courseId: number;
  file: File;
};

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCourses: builder.query<CourseSearchResponse, CourseSearchParams | void>({
      query: (params = {}) => ({
        url: endpoints.courses.search,
        params,
      }),
      transformResponse: (response: PageResponse<Course>) => ({
        courses: response.items,
        totalPages: response.totalPages,
        totalElements: response.totalItems,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.courses.map((course) => ({
                type: "Course" as const,
                id: course.id,
              })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),
    getCourseById: builder.query<Course, number>({
      query: (courseId) => ({ url: endpoints.courses.byId(courseId) }),
      providesTags: (_result, _error, courseId) => [{ type: "Course", id: courseId }],
    }),
    getCoursesByIds: builder.query<Course[], number[]>({
      async queryFn(courseIds) {
        try {
          const courses = await Promise.all(
            courseIds.map(async (courseId) => {
              const { data } = await axiosClient.get<Course>(
                endpoints.courses.byId(courseId)
              );
              return data;
            })
          );

          return { data: courses };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Không tải được khóa học";
          return { error: { message } };
        }
      },
      providesTags: (result) =>
        result
          ? result.map((course) => ({ type: "Course" as const, id: course.id }))
          : [{ type: "Course", id: "LIST" }],
    }),
    getCourseDetail: builder.query<CourseDetail, number>({
      query: (courseId) => ({ url: endpoints.courses.detail(courseId) }),
      providesTags: (_result, _error, courseId) => [
        { type: "Course", id: courseId },
        { type: "Course", id: `DETAIL-${courseId}` },
      ],
    }),
    getCoursesByUser: builder.query<Course[], GetCoursesByUserRequest>({
      query: ({ userId }) => ({ url: endpoints.courses.byUser(userId) }),
      providesTags: (_result, _error, { userId }) => [
        { type: "Course", id: `USER-${userId}` },
      ],
    }),
    createCourse: builder.mutation<ApiMessageResponse, CreateCoursePayload>({
      query: (payload) => ({
        url: endpoints.courses.base,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourse: builder.mutation<ApiMessageResponse, UpdateCourseRequest>({
      query: ({ courseId, payload }) => ({
        url: endpoints.courses.byId(courseId),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "Course", id: "LIST" },
      ],
    }),
    deleteCourse: builder.mutation<ApiMessageResponse, number>({
      query: (courseId) => ({
        url: endpoints.courses.byId(courseId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    updateCourseDetail: builder.mutation<ApiMessageResponse, UpdateCourseDetailRequest>({
      query: ({ courseId, payload }) => ({
        url: endpoints.courses.detailManage(courseId),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "Course", id: `DETAIL-${courseId}` },
      ],
    }),
    uploadCourseImage: builder.mutation<{ url: string }, UploadCourseImageRequest>({
      query: ({ courseId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: endpoints.courses.uploadImage(courseId),
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: endpoints.categories.list }),
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    createCategory: builder.mutation<ApiMessageResponse, Partial<Category>>({
      query: (payload) => ({
        url: endpoints.categories.base,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<ApiMessageResponse, Partial<Category>>({
      query: (payload) => ({
        url: endpoints.categories.base,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    deleteCategory: builder.mutation<ApiMessageResponse, number>({
      query: (categoryId) => ({
        url: endpoints.categories.byId(categoryId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    getTopCourses: builder.query<TopCourseRevenue[], void>({
      query: () => ({ url: endpoints.revenue.topCourses }),
      providesTags: [{ type: "Course", id: "TOP" }],
    }),
    getPublicLessons: builder.query<Lesson[], number>({
      query: (courseId) => ({ url: endpoints.lessons.publicByCourse(courseId) }),
      providesTags: (_result, _error, courseId) => [
        { type: "Lesson", id: `PUBLIC-${courseId}` },
      ],
    }),
    getPublicSubLessons: builder.query<SubLesson[], number>({
      query: (lessonId) => ({ url: endpoints.subLessons.publicByLesson(lessonId) }),
      providesTags: (_result, _error, lessonId) => [
        { type: "Lesson", id: `PUBLIC-SUB-${lessonId}` },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useCreateCourseMutation,
  useDeleteCategoryMutation,
  useDeleteCourseMutation,
  useGetCategoriesQuery,
  useGetCourseByIdQuery,
  useGetCourseDetailQuery,
  useGetCoursesByIdsQuery,
  useGetCoursesByUserQuery,
  useGetPublicLessonsQuery,
  useGetPublicSubLessonsQuery,
  useLazyGetPublicSubLessonsQuery,
  useGetTopCoursesQuery,
  useSearchCoursesQuery,
  useUpdateCategoryMutation,
  useUpdateCourseDetailMutation,
  useUpdateCourseMutation,
  useUploadCourseImageMutation,
} = courseApi;
