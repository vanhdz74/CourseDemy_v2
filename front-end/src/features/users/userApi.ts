import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";
import type { RegisterPayload, UserProfileForm } from "@/services/users";
import type { User } from "@/types/userType";

export type UpdateProfileRequest = {
  userId: number | string;
  payload: UserProfileForm;
};

export type UploadAvatarRequest = {
  userId: number | string;
  file: File;
};

export type AddStudentToCourseRequest = {
  courseId: number;
  email: string;
};

export type RemoveStudentFromCourseRequest = {
  courseId: number;
  userId: number;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<ApiMessageResponse, RegisterPayload>({
      query: (payload) => ({
        url: endpoints.auth.register,
        method: "POST",
        data: payload,
      }),
    }),
    getProfile: builder.query<UserProfileForm, number | string>({
      query: (userId) => ({ url: endpoints.users.byId(Number(userId)) }),
      providesTags: (_result, _error, userId) => [{ type: "User", id: Number(userId) }],
    }),
    updateProfile: builder.mutation<ApiMessageResponse, UpdateProfileRequest>({
      query: ({ userId, payload }) => ({
        url: endpoints.users.update(Number(userId)),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: Number(userId) },
        { type: "User", id: "LIST" },
      ],
    }),
    uploadAvatar: builder.mutation<{ url: string }, UploadAvatarRequest>({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: endpoints.users.uploadAvatar(Number(userId)),
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: Number(userId) },
      ],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => ({ url: endpoints.users.all }),
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    createUser: builder.mutation<ApiMessageResponse, Partial<UserProfileForm>>({
      query: (payload) => ({
        url: endpoints.users.base,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getUsersByCourse: builder.query<User[], number>({
      query: (courseId) => ({ url: endpoints.users.byCourse(courseId) }),
      providesTags: (_result, _error, courseId) => [
        { type: "User", id: `COURSE-${courseId}` },
      ],
    }),
    updateUser: builder.mutation<ApiMessageResponse, UpdateProfileRequest>({
      query: ({ userId, payload }) => ({
        url: endpoints.users.update(Number(userId)),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation<ApiMessageResponse, number>({
      query: (userId) => ({
        url: endpoints.users.byId(userId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    addStudentToCourse: builder.mutation<ApiMessageResponse, AddStudentToCourseRequest>({
      query: ({ courseId, email }) => ({
        url: endpoints.courses.students(courseId),
        method: "POST",
        data: { email },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "User", id: `COURSE-${courseId}` },
      ],
    }),
    removeStudentFromCourse: builder.mutation<
      ApiMessageResponse,
      RemoveStudentFromCourseRequest
    >({
      query: ({ courseId, userId }) => ({
        url: `${endpoints.courses.students(courseId)}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "User", id: `COURSE-${courseId}` },
      ],
    }),
  }),
});

export const {
  useAddStudentToCourseMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetProfileQuery,
  useGetUsersByCourseQuery,
  useRegisterUserMutation,
  useRemoveStudentFromCourseMutation,
  useUpdateProfileMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} = userApi;
