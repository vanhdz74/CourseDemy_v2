"use client";

import { Course } from "@repo/contracts";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Award } from "lucide-react";

type TopCourse = {
  course: Course;
  revenue: number;
};

type Props = {
  data: TopCourse[];
};

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-foreground">{label}</p>
        <p className="mt-1 font-extrabold text-emerald-600 dark:text-emerald-400">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const TopCoursesRevenue: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Top khóa học doanh thu cao
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xếp hạng theo tổng giá trị các đơn hàng thành công
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Award className="h-4 w-4" />
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Chưa có dữ liệu xếp hạng
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="topCourseGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <XAxis
                type="number"
                tickFormatter={(value) => `${value / 1_000_000}M`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />

              <YAxis
                type="category"
                dataKey="course.title"
                width={120}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="revenue"
                fill="url(#topCourseGradient)"
                radius={[0, 8, 8, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopCoursesRevenue;

