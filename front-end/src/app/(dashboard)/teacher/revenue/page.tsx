"use client";

import DailyRevenueLine from "@/components/revenue/DailyRevenueLine";
import RevenueByCategoryPie from "@/components/revenue/RevenueByCategoryPie";
import RevenueByMonth from "@/components/revenue/RevenueByMonth";
import TopCoursesRevenue from "@/components/revenue/TopCoursesRevenue";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import PDFReport from "@/components/report/PDFReport";
import DashboardSummary from "@/components/report/CommonReport";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function Page() {
  const { get } = useApi();

  // báo cáo PDF open - close
  const [openReport, setOpenReport] = useState(false);

  // 1 - column chart
  const [courseId, setCourseId] = useState<number | null>(null);
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);

  const getRevenueByMonth = async (courseId?: number | null) => {
    const url = courseId
      ? `/revenue-by-month?courseId=${courseId}`
      : `/revenue-by-month`;

    const data = await get(url);
    setRevenueByMonth(data);
  };

  // summary
  const totalRevenue =
    revenueByMonth?.reduce((sum: number, item: any) => sum + item.revenue, 0) ??
    0;

  // Xử lý hiển thị
  useEffect(() => {
    getRevenueByMonth(courseId);
  }, [courseId]);

  return (
    <div className="p-6 space-y-12">
      {/* SUMMARY CARDS */}
      <DashboardSummary totalRevenue={totalRevenue} />

      {/* 1. Column Chart */}
      <div>
        <div className="mb-4 flex items-center gap-3 justify-end">
          <label className="font-medium">Lọc theo Course ID:</label>
          <input
            type="number"
            value={courseId ?? ""}
            placeholder="Nhập courseId"
            onChange={(e) =>
              setCourseId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-40 px-3 py-2 border rounded-lg"
          />
        </div>

        <RevenueByMonth data={revenueByMonth} />
      </div>
    </div>
  );
}
