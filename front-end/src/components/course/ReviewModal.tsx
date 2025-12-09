"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[450px]">
        <h2 className="text-2xl font-bold mb-4">Đánh giá khóa học</h2>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={i}
                className={`w-8 h-8 cursor-pointer ${
                  starValue <= (hover || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(starValue)}
              />
            );
          })}
        </div>

        {/* Comment Textarea */}
        <textarea
          className="w-full border rounded-lg p-3 h-28 mb-4"
          placeholder="Hãy chia sẻ trải nghiệm của bạn về khóa học..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-yellow-500 rounded-lg text-white"
            onClick={() => {
              onSubmit(rating, comment);
              onClose();
            }}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
