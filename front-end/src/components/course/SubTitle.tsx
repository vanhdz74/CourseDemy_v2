"use client";
import React, { useState } from "react";

const SubTitle = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "qa", label: "Hỏi đáp" },
    { id: "reviews", label: "Đánh giá" },
  ];

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
      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="text-gray-700">
            Đây là phần tổng quan khóa học. ;xs
          </div>
        )}
        {activeTab === "qa" && (
          <div className="text-gray-700">
            Đây là phần hỏi đáp giữa học viên và giảng viên.
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="text-gray-700">
            Đây là phần đánh giá của học viên.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTitle;
