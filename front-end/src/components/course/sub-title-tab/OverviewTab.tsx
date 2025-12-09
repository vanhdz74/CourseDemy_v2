import React from "react";
import { CourseDetail } from "@/types/courseType";

const OverviewTab = ({ courseDetail }: { courseDetail?: CourseDetail }) => {
  return (
    <div className="text-gray-800 leading-relaxed space-y-6 max-w-4xl mx-auto text-left">
      <h2 className="text-3xl font-bold text-gray-900">
        {courseDetail?.course.title}
      </h2>

      <p className="text-lg text-gray-700 italic">
        {courseDetail?.course.description}
      </p>

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

      <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
        <h3 className="text-xl font-semibold mb-3 text-blue-700">
          📌 Yêu cầu đầu vào
        </h3>
        <p className="text-gray-700">{courseDetail?.request}</p>
      </div>

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
  );
};

export default OverviewTab;
