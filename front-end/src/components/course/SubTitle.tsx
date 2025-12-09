"use client";
import publicClient from "@/api/publicClient";
import { useAppSelector } from "@/redux/hooks";
import { CourseDetail } from "@/types/courseType";
import React, { useEffect, useState } from "react";

import OverviewTab from "./sub-title-tab/OverviewTab";
import QATab from "./sub-title-tab/QATab";
import ReviewsTab from "./sub-title-tab/ReviewsTab";
import { useApi } from "@/hooks/useApi";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "qa", label: "Hỏi đáp" },
  { id: "reviews", label: "Đánh giá" },
];

const SubTitle = (selectedSubLessonId: any) => {
  const course = useAppSelector((state) => state.course);
  const [activeTab, setActiveTab] = useState("overview");
  const [courseDetail, setCourseDetail] = useState<CourseDetail>();
  const getCourseDetail = async (course_id: any) => {
    const data = await publicClient.get(`/course-detail/${course_id}`);
    setCourseDetail(data.data);
  };

  useEffect(() => {
    getCourseDetail(course.courseId);
  }, [selectedSubLessonId]);

  return (
    <div className="p-4 border-t border-gray-200">
      {/* Tabs */}
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

      {/* Nội dung tab */}
      <div className="mt-4 text-center py-10">
        {activeTab === "overview" && (
          <OverviewTab courseDetail={courseDetail} />
        )}

        {activeTab === "qa" && (
          <QATab sublessonId={selectedSubLessonId.selectedSubLessonId.id} />
        )}

        {activeTab === "reviews" && <ReviewsTab courseId={courseDetail?.id} />}
      </div>
    </div>
  );
};

export default SubTitle;
