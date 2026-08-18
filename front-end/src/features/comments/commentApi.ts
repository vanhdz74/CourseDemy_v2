import { baseApi } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";

export type CommentItem = {
  id: number;
  comment: string;
  parent_id: number | null;
  create_at?: string | Date | null;
  update_at?: string | Date | null;
  user_id?: number;
  user_name?: string;
  user_avatar?: string | null;
  sublesson_id: number;
  me?: number;
};

export type CommentPayload = {
  comment: string;
  sublesson_id: number;
  parent_id: number | null;
};

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsBySubLesson: builder.query<CommentItem[], number>({
      query: (subLessonId) => ({ url: endpoints.comments.bySubLesson(subLessonId) }),
      providesTags: (_result, _error, subLessonId) => [
        { type: "Comment", id: `SUB-${subLessonId}` },
      ],
    }),
    createComment: builder.mutation<CommentItem, CommentPayload>({
      query: (payload) => ({
        url: endpoints.comments.base,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { sublesson_id }) => [
        { type: "Comment", id: `SUB-${sublesson_id}` },
      ],
    }),
    deleteComment: builder.mutation<CommentItem, number>({
      query: (commentId) => ({
        url: endpoints.comments.byId(commentId),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsBySubLessonQuery,
} = commentApi;
