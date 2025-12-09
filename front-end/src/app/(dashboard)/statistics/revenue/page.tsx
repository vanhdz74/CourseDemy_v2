"use client";

import publicClient from "@/api/publicClient";
import DailyRevenueLine from "@/components/revenue/DailyRevenueLine";
import RevenueByCategoryPie from "@/components/revenue/RevenueByCategoryPie";
import RevenueByMonth from "@/components/revenue/RevenueByMonth";
import TopCoursesRevenue from "@/components/revenue/TopCoursesRevenue";
import { useApi } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";

//=== API CALL===
const fetchDashboard = async () => {
  const body = {
    type: "dashboard",
    include: {
      revenueByMonth: true,
      topCourses: true,
      revenueByCategory: true,
      dailyRevenue: true,
    },
  };

  const res = await fetch("/api/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
};

const data1 = {
  revenueByCategory: [
    { category: "Frontend", revenue: 42000, percent: 38 },
    { category: "Backend", revenue: 32000, percent: 29 },
    { category: "Design", revenue: 18000, percent: 16 },
    { category: "DevOps", revenue: 11000, percent: 10 },
    { category: "Other", revenue: 7000, percent: 7 },
  ],

  dailyRevenue: [
    { day: "2025-11-01", revenue: 1100 },
    { day: "2025-11-02", revenue: 1250 },
    { day: "2025-11-03", revenue: 980 },
    { day: "2025-11-04", revenue: 1400 },
    { day: "2025-11-05", revenue: 1500 },
    { day: "2025-11-06", revenue: 1700 },
    { day: "2025-11-07", revenue: 1850 },
    { day: "2025-11-08", revenue: 1320 },
    { day: "2025-11-09", revenue: 1550 },
    { day: "2025-11-10", revenue: 1690 },
    { day: "2025-11-11", revenue: 1810 },
    { day: "2025-11-12", revenue: 1420 },
    { day: "2025-11-13", revenue: 1360 },
    { day: "2025-11-14", revenue: 1580 },
    { day: "2025-11-15", revenue: 1660 },
    { day: "2025-11-16", revenue: 1490 },
    { day: "2025-11-17", revenue: 1730 },
    { day: "2025-11-18", revenue: 1880 },
    { day: "2025-11-19", revenue: 1920 },
    { day: "2025-11-20", revenue: 2100 },
    { day: "2025-11-21", revenue: 1850 },
    { day: "2025-11-22", revenue: 1760 },
    { day: "2025-11-23", revenue: 1620 },
    { day: "2025-11-24", revenue: 1720 },
    { day: "2025-11-25", revenue: 1950 },
    { day: "2025-11-26", revenue: 2050 },
    { day: "2025-11-27", revenue: 2120 },
    { day: "2025-11-28", revenue: 2200 },
    { day: "2025-11-29", revenue: 2320 },
    { day: "2025-11-30", revenue: 2450 },
  ],
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function Page() {
  const { get } = useApi();
  const [data, setData] = useState<any>(null);

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

  useEffect(() => {
    getRevenueByMonth(courseId);
  }, [courseId]);

  useEffect(() => {
    setData(data1);
    getTopCourses();
    getRevenueByCategory();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-12">
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

      {/* 2. Top 5 khóa học */}
      <TopCoursesRevenue data={topCourses} />

      {/* 3. Pie Chart */}
      <RevenueByCategoryPie data={revenueByCategory} />

      {/* 4. Line Chart */}
      <DailyRevenueLine data={data.dailyRevenue} />
    </div>
  );
}
