"use client";

import DailyRevenueLine from "@/modules/report/components/revenue/DailyRevenueLine";
import RevenueByCategoryPie from "@/modules/report/components/revenue/RevenueByCategoryPie";
import RevenueByMonth from "@/modules/report/components/revenue/RevenueByMonth";
import TopCoursesRevenue from "@/modules/report/components/revenue/TopCoursesRevenue";
import { useApi } from "@/modules/shared/hooks/useApi";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/modules/shared/components/ui/button";
import PDFReport from "@/modules/report/components/report/PDFReport";
import DashboardSummary from "@/modules/report/components/report/CommonReport";
import { useSession } from "next-auth/react";

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

  // 2 -
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const getTopCourses = async () => {
    const url = "/revenue/top-courses";
    const data = await get(url);
    setTopCourses(data);
  };

  // 3 -
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const getRevenueByCategory = async () => {
    const url = "/revenue-categories";
    const data = await get(url);
    setRevenueByCategory(data);
  };

  // 4 -
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const getRevenueByDays = async () => {
    const url = `/revenue-by-days?fromDate=${fromDate}&toDate=${toDate}`;
    const data = await get(url);
    setDailyRevenue(data);
  };

  // summary
  const totalRevenue =
    revenueByMonth?.reduce((sum: number, item: any) => sum + item.revenue, 0) ??
    0;

  const [sl, setSL] = useState<any>(0);
  const { data: session } = useSession();
  const user = session?.user;
  const getQl = async () => {
    const data = await get(`/courses/user/${user?.id}`);
    console.log;
    setSL(data.length);
  };

  let totalCourses = sl;
  const totalCategories = revenueByCategory?.length ?? 0;

  // Xử lý hiển thị
  useEffect(() => {
    getRevenueByMonth(courseId);
  }, [courseId]);

  useEffect(() => {
    getRevenueByDays();
  }, [fromDate, toDate]);

  useEffect(() => {
    getTopCourses();
    getRevenueByCategory();
    getRevenueByDays();
    if (user?.id) getQl();
  }, [user?.id]);

  return (
    <div className="space-y-7 pb-10">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Báo cáo & Thống kê doanh thu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Phân tích số liệu tài chính chi tiết theo từng danh mục, khóa học và chu kỳ thời gian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-1.5 shadow-sm">
            <span className="text-xs font-semibold text-muted-foreground">Course ID:</span>
            <input
              type="number"
              value={courseId ?? ""}
              placeholder="Tất cả"
              onChange={(e) =>
                setCourseId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-20 bg-transparent text-xs font-bold focus:outline-none"
            />
          </div>

          <Button
            size="sm"
            onClick={() => setOpenReport(true)}
            className="rounded-xl gap-2 font-semibold shadow-sm cursor-pointer"
          >
            Xuất báo cáo PDF
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <DashboardSummary
        totalRevenue={totalRevenue}
        totalCourses={totalCourses}
        totalCategories={totalCategories}
      />

      {/* 1. Monthly Revenue Chart */}
      <RevenueByMonth data={revenueByMonth} />

      {/* 2 & 3. Top Courses & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCoursesRevenue data={topCourses} />
        <RevenueByCategoryPie data={revenueByCategory} />
      </div>

      {/* 4. Daily Revenue Line Chart with Date Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Xu hướng doanh thu theo ngày
          </h2>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm text-xs">
            <span className="text-muted-foreground pl-2 font-medium">Khoảng ngày:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent px-2 py-1 rounded-lg border border-border/60 text-xs focus:outline-none"
            />
            <span className="text-muted-foreground font-bold">→</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
              className="bg-transparent px-2 py-1 rounded-lg border border-border/60 text-xs focus:outline-none"
            />
          </div>
        </div>

        <DailyRevenueLine data={dailyRevenue} />
      </div>

      {/* REPORT PREVIEW - PDF */}
      {openReport && (
        <PDFReport
          open={openReport}
          onClose={() => setOpenReport(false)}
          summary={{
            totalRevenue,
            totalCourses,
            totalCategories,
          }}
          revenueByMonth={revenueByMonth}
          topCourses={topCourses}
          revenueByCategory={revenueByCategory}
          dailyRevenue={dailyRevenue}
          fromDate={fromDate}
          toDate={toDate}
        />
      )}
    </div>
  );
}
