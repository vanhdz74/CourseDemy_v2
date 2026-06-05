"use client";

import OverviewTab from "@/components/course/sub-title-tab/OverviewTab";
import QATab from "@/components/course/sub-title-tab/QATab";
import ReviewsTab from "@/components/course/sub-title-tab/ReviewsTab";
import { Button } from "@/components/ui/button";
import { getCourseDetail as fetchCourseDetail } from "@/services/courses";
import { CourseDetail } from "@/types/courseType";
import { SubLesson } from "@/types/lessonType";
import { MessageSquareText, Star, TextSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

const tabs = [
  { id: "overview", label: "Tổng quan", icon: TextSearch },
  { id: "qa", label: "Hỏi đáp", icon: MessageSquareText },
  { id: "reviews", label: "Đánh giá", icon: Star },
] as const;

type TabId = (typeof tabs)[number]["id"];

const SubTitle = ({ selectedSubLesson }: { selectedSubLesson?: SubLesson }) => {
  const course = useAppSelector((state) => state.course);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [courseDetail, setCourseDetail] = useState<CourseDetail>();

  useEffect(() => {
    const loadCourseDetail = async () => {
      if (!course.courseId) return;
      setCourseDetail(await fetchCourseDetail(course.courseId));
    };

    loadCourseDetail();
  }, [course.courseId, selectedSubLesson?.id]);

  return (
    <section className="bg-background">
      <div className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.id === "qa" && !selectedSubLesson;

            return (
              <Button
                key={tab.id}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                disabled={isDisabled}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? "text-foreground" : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        {activeTab === "overview" && <OverviewTab courseDetail={courseDetail} />}
        {activeTab === "qa" && selectedSubLesson && (
          <QATab sublessonId={selectedSubLesson.id} />
        )}
        {activeTab === "reviews" && <ReviewsTab courseId={courseDetail?.id} />}
      </div>
    </section>
  );
};

export default SubTitle;
