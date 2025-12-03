"use client";
import publicClient from "@/api/publicClient";
import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import { CourseDetail } from "@/types/courseType";
import React, { useEffect, useState } from "react";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "qa", label: "Hỏi đáp" },
  { id: "reviews", label: "Đánh giá" },
];
const SubTitle = () => {
  const course = useAppSelector((state) => state.course);
  const [activeTab, setActiveTab] = useState("overview");
  const [courseDetail, setCourseDetail] = useState<CourseDetail>();
  const [qaList, setQaList] = useState<any[]>([]);
  const [reviews, setReviews] = useState([]);

  // Lấy chi tiết khoá học
  const getCourseDetail = async (course_id: any) => {
    const data = await publicClient.get(`/course-detail/${course_id}`);
    setCourseDetail(data.data);
    console.log(data.data);
  };

  useEffect(() => {
    getCourseDetail(course.courseId);
  }, []);

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex gap-6 text-lg font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Nội dung hiển thị theo tab */}
      <div className="mt-4 text-center">
        {/* Over view */}
        {activeTab === "overview" && (
          <div className="text-gray-800 leading-relaxed space-y-6 max-w-4xl mx-auto text-left">
            {/* Tiêu đề khóa học */}
            <h2 className="text-3xl font-bold text-gray-900">
              {courseDetail?.course.title}
            </h2>

            {/* Mô tả ngắn */}
            <p className="text-lg text-gray-700 italic">
              {courseDetail?.course.description}
            </p>

            {/* Box "Bạn sẽ học được" giống Udemy */}
            <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                🎯 Bạn sẽ học được gì?
              </h3>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseDetail?.content
                  ?.split(".")
                  .filter((s) => s.trim() !== "")
                  .map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">✔</span>
                      <span>{item.trim()}.</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Yêu cầu đầu vào */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                📌 Yêu cầu đầu vào
              </h3>
              <p className="text-gray-700">{courseDetail?.request}</p>
            </div>

            {/* Bao gồm */}
            <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-green-700">
                📦 Khóa học bao gồm
              </h3>
              <ul className="list-disc ml-6 space-y-2">
                {courseDetail?.course_include?.split("\n").map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    {item.replace("-", "").trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Qa */}
        {activeTab === "qa" && (
          <div className="max-w-3xl mx-auto text-left space-y-6">
            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-gray-900">Hỏi & Đáp</h2>
            <p className="text-gray-600">
              Bạn có câu hỏi gì về khóa học? Giảng viên và học viên sẽ hỗ trợ
              bạn.
            </p>

            {/* Form đặt câu hỏi */}
            <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 space-y-3">
              <h3 className="font-semibold text-lg">Đặt câu hỏi</h3>

              <textarea
                placeholder="Nhập câu hỏi tại đây..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Gửi câu hỏi
              </button>
            </div>

            {/* Danh sách câu hỏi */}
            <div className="space-y-4">
              {qaList.length === 0 && (
                <div className="text-center text-gray-500 italic py-10">
                  Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
                </div>
              )}

              {qaList.map((item, index) => (
                <details
                  key={index}
                  className="group border border-gray-200 rounded-lg p-4 shadow-sm transition"
                >
                  <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                    <span>{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <div className="mt-3 pl-2 text-gray-700">
                    {item.answer ? (
                      item.answer
                    ) : (
                      <span className="italic text-gray-500">
                        Chưa có câu trả lời
                      </span>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Review */}
        {activeTab === "reviews" && (
          <div className="max-w-3xl mx-auto text-left space-y-8">
            {/* Tổng quan đánh giá */}

            <h3 className="text-2xl font-bold">Phản hồi của học viên</h3>
            <div className="flex gap-10 items-center">
              {/* Điểm trung bình */}
              <div className="text-center">
                <h3 className="text-5xl font-bold text-yellow-500">
                  {courseDetail?.rating_average || "4.8"}
                </h3>
                <p className="text-gray-600 mt-1">Điểm trung bình</p>

                {/* Sao */}
                <div className="flex items-center justify-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.round(courseDetail?.rating_average || 5)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Thanh biểu đồ từng mức sao */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-8 text-sm font-medium">{star} ★</span>

                    <div className="flex-1 bg-gray-200 h-3 rounded-lg overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full"
                        style={{
                          width: `${
                            courseDetail?.rating_chart?.[star] * 10 || 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <span className="text-sm text-gray-600">
                      {courseDetail?.rating_chart?.[star] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-6" />

            {/* Danh sách đánh giá */}
            <div className="space-y-6">
              {courseDetail?.reviews?.length === 0 && (
                <div className="text-center text-gray-500 italic py-10">
                  Chưa có đánh giá nào.
                </div>
              )}

              {courseDetail?.reviews?.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1">
                      {/* Tên + ngày */}
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-900">
                          {review.user?.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {review.created_at}
                        </span>
                      </div>

                      {/* Sao */}
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Nội dung */}
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTitle;
