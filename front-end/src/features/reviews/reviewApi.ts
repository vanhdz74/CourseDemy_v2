import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";

export type RatingChart = Record<number, number>;

export type ReviewItem = {
  id: number;
  parent_id: number | null;
  user_avatar?: string | null;
  user_name?: string | null;
  create_at?: string | null;
  rating?: number | null;
  comment?: string | null;
};

export type ReviewsResponse = {
  ranting?: number;
  rating?: number;
  rating_chart?: RatingChart;
  reviews?: ReviewItem[];
};

export type CreateReviewRequest = {
  courseId: number;
  rating: number;
  comment: string;
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewsByCourse: builder.query<ReviewsResponse, number>({
      query: (courseId) => ({ url: endpoints.reviews.byCourse(courseId) }),
      providesTags: (_result, _error, courseId) => [
        { type: "Review", id: `COURSE-${courseId}` },
      ],
    }),
    createReview: builder.mutation<ApiMessageResponse, CreateReviewRequest>({
      query: ({ courseId, rating, comment }) => ({
        url: endpoints.reviews.createByCourse(courseId),
        method: "POST",
        data: { rating, comment },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Review", id: `COURSE-${courseId}` },
      ],
    }),
    deleteReview: builder.mutation<ReviewItem, number>({
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByCourseQuery,
} = reviewApi;
