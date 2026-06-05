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
    <div className="p-6 space-y-12">
      {/* SUMMARY CARDS */}
      <DashboardSummary
        totalRevenue={totalRevenue}
        totalCourses={totalCourses}
        totalCategories={totalCategories}
      />

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

      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Top 5 khóa học */}
        <TopCoursesRevenue data={topCourses} />

        {/* 3. Pie Chart */}
        <RevenueByCategoryPie data={revenueByCategory} />
      </div>

      {/* 4. Line Chart */}
      <hr />
      <div className="text-right mb-4 flex justify-end items-center gap-3">
        Chọn thời gian:
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <span className="text-gray-500">→</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate} // không cho chọn ngày nhỏ hơn từ ngày
          className="px-3 py-2 border rounded-lg"
        />
      </div>
      <DailyRevenueLine data={dailyRevenue} />

      <hr />
      <div className="text-right flex justify-end items-center">
        <Button
          className="mr-2 cursor-pointer"
          onClick={() => setOpenReport(true)}
        >
          Xem trước báo cáo
        </Button>
      </div>

      {/* REPORT PREVIEW - PDF */}
      <div className={`${openReport ? "block" : "hidden"}`}>
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
      </div>
    </div>
  );
}
