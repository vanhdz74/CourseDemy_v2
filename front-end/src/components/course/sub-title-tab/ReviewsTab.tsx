"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

type RatingChart = Record<number, number>;

type ReviewItem = {
  id: number;
  parent_id: number | null;
  user_avatar?: string | null;
  user_name?: string | null;
  create_at?: string | null;
  rating?: number | null;
  comment?: string | null;
};

type ReviewsResponse = {
  ranting?: number;
  rating?: number;
  rating_chart?: RatingChart;
  reviews?: ReviewItem[];
};

const emptyReviews = {
  rating: 0,
  ratingChart: {} as RatingChart,
  reviews: [] as ReviewItem[],
};

const ReviewsTab = ({ courseId }: { courseId: number | undefined }) => {
  const { get } = useApi();

  const [rating, setRating] = useState(emptyReviews.rating);
  const [ratingChart, setRatingChart] = useState<RatingChart>(
    emptyReviews.ratingChart,
  );
  const [reviewList, setReviewList] = useState<ReviewItem[]>(emptyReviews.reviews);

  useEffect(() => {
    const getReviews = async () => {
      if (!courseId || !Number.isFinite(courseId)) {
        setRating(emptyReviews.rating);
        setRatingChart(emptyReviews.ratingChart);
        setReviewList(emptyReviews.reviews);
        return;
      }

      try {
        const data = await get<ReviewsResponse>(`/reviews/course/${courseId}`);

        setRating(data.ranting || data.rating || 0);
        setRatingChart(data.rating_chart || {});
        setReviewList(data.reviews || []);
      } catch {
        setRating(emptyReviews.rating);
        setRatingChart(emptyReviews.ratingChart);
        setReviewList(emptyReviews.reviews);
      }
    };

    getReviews();
  }, [courseId, get]);

  const parents = reviewList.filter((review) => review.parent_id === null);
  const children = reviewList.filter((review) => review.parent_id !== null);
  const getReplies = (parentId: number) =>
    children.filter((review) => review.parent_id === parentId);

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-left">
      <h3 className="text-2xl font-bold text-foreground">Phản hồi của học viên</h3>

      <div className="flex flex-col gap-8 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-yellow-500">
            {rating.toFixed(1)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Điểm trung bình</p>

          <div className="mt-2 flex items-center justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`text-xl ${
                  index < Math.round(rating) ? "text-yellow-500" : "text-muted"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-8 text-sm font-medium text-foreground">
                {star} ★
              </span>

              <div className="h-3 flex-1 overflow-hidden rounded-lg bg-muted">
                <div
                  className="h-full bg-yellow-500"
                  style={{
                    width: `${
                      ((ratingChart[star] || 0) / (reviewList.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>

              <span className="text-sm text-muted-foreground">
                {ratingChart[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {parents.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
            Chưa có đánh giá nào.
          </div>
        )}

        {parents.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start gap-4">
              {review.user_avatar ? (
                <img
                  src={review.user_avatar}
                  alt={review.user_name || "Avatar"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                  {review.user_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold text-foreground">
                    {review.user_name || "Học viên"}
                  </h4>
                  {review.create_at && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.create_at).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < Number(review.rating || 0)
                          ? "text-yellow-500"
                          : "text-muted"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </div>

            {getReplies(review.id).map((reply) => (
              <div key={reply.id} className="ml-16 mt-4 border-l border-border pl-4">
                <div className="flex items-start gap-3">
                  {reply.user_avatar ? (
                    <img
                      src={reply.user_avatar}
                      alt={reply.user_name || "Avatar"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {reply.user_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {reply.user_name || "Giảng viên"}{" "}
                      <span className="text-xs text-primary">(Giảng viên)</span>
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {reply.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
