"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

const ReviewsTab = ({ courseId }: { courseId: number | undefined }) => {
  const { get } = useApi();

  const [rating, setRating] = useState<number>(0);
  const [ratingChart, setRatingChart] = useState<any>({});
  const [reviewList, setReviewList] = useState<any[]>([]);

  const getReviews = async (courseId: any) => {
    const data = await get(`/reviews/course/${courseId}`);

    setRating(data.ranting || 0);
    setRatingChart(data.rating_chart || {});
    setReviewList(data.reviews || []);

    return data;
  };

  // Tách review cha và review con
  const parents = reviewList.filter((r) => r.parent_id === null);
  const children = reviewList.filter((r) => r.parent_id !== null);

  const getReplies = (parentId: number) => {
    return children.filter((r) => r.parent_id === parentId);
  };

  useEffect(() => {
    if (courseId) getReviews(courseId);
  }, [courseId]);

  return (
    <div className="max-w-3xl mx-auto text-left space-y-8">
      <h3 className="text-2xl font-bold">Phản hồi của học viên</h3>

      {/* Rating Overview */}
      <div className="flex gap-10 items-center">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-yellow-500">
            {typeof rating === "number" ? rating.toFixed(1) : "0"}
          </h3>
          <p className="text-gray-600 mt-1">Điểm trung bình</p>

          <div className="flex items-center justify-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Rating chart */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-8 text-sm font-medium">{star} ★</span>

              <div className="flex-1 bg-gray-200 h-3 rounded-lg overflow-hidden">
                <div
                  className="bg-yellow-500 h-full"
                  style={{
                    width: `${
                      ((ratingChart[star] || 0) / (reviewList.length || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <span className="text-sm text-gray-600">
                {ratingChart[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* Reviews list */}
      <div className="space-y-6">
        {parents.length === 0 && (
          <div className="text-center text-gray-500 italic py-10">
            Chưa có đánh giá nào.
          </div>
        )}

        {parents.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white"
          >
            {/* --- Review cha --- */}
            <div className="flex items-start gap-4">
              {review.user_avatar ? (
                <img
                  src={review.user_avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {review.user_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">
                    {review.user_name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(review.create_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>

            {/* --- Reply của giảng viên/admin --- */}
            {getReplies(review.id).map((reply) => (
              <div
                key={reply.id}
                className="ml-16 mt-4 border-l-4 border-yellow-400 pl-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={reply.user_avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {reply.user_name}{" "}
                      <span className="text-xs text-blue-500">
                        (Giảng viên)
                      </span>
                    </h4>
                    <p className="text-gray-700 mt-1">{reply.comment}</p>
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
