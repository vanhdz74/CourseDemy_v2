import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";
import type { Lesson, SubLesson } from "@/types/lessonType";

export type CreateLessonRequest = {
  courseId: number;
  payload: Partial<Lesson>;
};

export type UpdateLessonRequest = {
  lessonId: number;
  payload: Partial<Lesson>;
};

export type CreateSubLessonRequest = {
  lessonId: number;
  payload: Partial<Pick<SubLesson, "title" | "video_url">>;
};

export type UpdateSubLessonRequest = {
  subLessonId: number;
  payload: Partial<Pick<SubLesson, "title" | "video_url">>;
};

export type AddRelativeSubLessonRequest = {
  lessonId: number;
  referenceSubLessonId: number;
  insertAfter: boolean;
  payload: Pick<SubLesson, "title" | "video_url">;
};

export type UploadVideoRequest = {
  subLessonId: number;
  file: File;
};

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsByCourse: builder.query<Lesson[], number>({
      query: (courseId) => ({ url: endpoints.lessons.byCourse(courseId) }),
      providesTags: (_result, _error, courseId) => [
        { type: "Lesson", id: `COURSE-${courseId}` },
      ],
    }),
    createLesson: builder.mutation<ApiMessageResponse, CreateLessonRequest>({
      query: ({ courseId, payload }) => ({
        url: endpoints.lessons.createByCourse(courseId),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Lesson", id: `COURSE-${courseId}` },
      ],
    }),
    updateLesson: builder.mutation<ApiMessageResponse, UpdateLessonRequest>({
      query: ({ lessonId, payload }) => ({
        url: endpoints.lessons.byId(lessonId),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    deleteLesson: builder.mutation<ApiMessageResponse, number>({
      query: (lessonId) => ({
        url: endpoints.lessons.byId(lessonId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    getSubLessonsByLesson: builder.query<SubLesson[], number>({
      query: (lessonId) => ({ url: endpoints.subLessons.byLesson(lessonId) }),
      providesTags: (_result, _error, lessonId) => [
        { type: "Lesson", id: `SUB-${lessonId}` },
      ],
    }),
    getSubLessonById: builder.query<SubLesson, number>({
      query: (subLessonId) => ({ url: endpoints.subLessons.byId(subLessonId) }),
      providesTags: (_result, _error, subLessonId) => [
        { type: "Lesson", id: `SUBLESSON-${subLessonId}` },
      ],
    }),
    createSubLesson: builder.mutation<ApiMessageResponse, CreateSubLessonRequest>({
      query: ({ lessonId, payload }) => ({
        url: endpoints.subLessons.createByLesson(lessonId),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Lesson", id: `SUB-${lessonId}` },
      ],
    }),
    updateSubLesson: builder.mutation<ApiMessageResponse, UpdateSubLessonRequest>({
      query: ({ subLessonId, payload }) => ({
        url: endpoints.subLessons.update(subLessonId),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { subLessonId }) => [
        { type: "Lesson", id: `SUBLESSON-${subLessonId}` },
        { type: "Lesson", id: "LIST" },
      ],
    }),
    addRelativeSubLesson: builder.mutation<ApiMessageResponse, AddRelativeSubLessonRequest>({
      query: ({ lessonId, referenceSubLessonId, insertAfter, payload }) => ({
        url: `/lesson/${lessonId}/sublesson/add-relative`,
        method: "POST",
        params: { referenceSubLessonId, insertAfter },
        data: payload,
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Lesson", id: `SUB-${lessonId}` },
      ],
    }),
    deleteSubLesson: builder.mutation<ApiMessageResponse, number>({
      query: (subLessonId) => ({
        url: endpoints.subLessons.byId(subLessonId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    uploadVideo: builder.mutation<{ url: string }, UploadVideoRequest>({
      query: ({ subLessonId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: endpoints.subLessons.uploadVideo(subLessonId),
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: (_result, _error, { subLessonId }) => [
        { type: "Lesson", id: `SUBLESSON-${subLessonId}` },
      ],
    }),
    reorderLessons: builder.mutation<ApiMessageResponse, Array<Record<string, unknown>>>({
      query: (payload) => ({
        url: endpoints.lessons.reorder,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    reorderSubLessons: builder.mutation<ApiMessageResponse, Array<Record<string, unknown>>>({
      query: (payload) => ({
        url: "/sublesson/reorder",
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
  }),
});

export const {
  useAddRelativeSubLessonMutation,
  useCreateLessonMutation,
  useCreateSubLessonMutation,
  useDeleteLessonMutation,
  useDeleteSubLessonMutation,
  useGetLessonsByCourseQuery,
  useGetSubLessonByIdQuery,
  useGetSubLessonsByLessonQuery,
  useLazyGetSubLessonByIdQuery,
  useLazyGetSubLessonsByLessonQuery,
  useReorderLessonsMutation,
  useReorderSubLessonsMutation,
  useUpdateLessonMutation,
  useUpdateSubLessonMutation,
  useUploadVideoMutation,
} = lessonApi;
