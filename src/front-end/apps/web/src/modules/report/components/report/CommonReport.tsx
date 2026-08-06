"use client";

import React from "react";
import SummaryCard from "@/modules/report/components/common/summurary-card";
import { DollarSign, BookOpen, Layers } from "lucide-react";

type Props = {
  totalRevenue: number;
  totalCourses?: number;
  totalCategories?: number;
};

const DashboardSummary: React.FC<Props> = ({
  totalRevenue,
  totalCourses,
  totalCategories,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard
        title="Tổng doanh thu"
        value={`${totalRevenue.toLocaleString("vi-VN")} đ`}
        description="Doanh thu từ các khóa học"
        icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        valueClassName="text-green-600"
      />

      <SummaryCard
        title="Khóa học của bạn"
        value={totalCourses || 0}
        description="Tổng số khóa học"
        icon={<BookOpen className="h-5 w-5 text-muted-foreground" />}
      />

      {totalCategories !== undefined && (
        <>
          <SummaryCard
            title="Danh mục"
            value={totalCategories}
            description="Danh mục khóa học"
            icon={<Layers className="h-5 w-5 text-muted-foreground" />}
          />
        </>
      )}
    </div>
  );
};

export default DashboardSummary;
