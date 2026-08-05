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
import { da } from "zod/v4/locales";

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

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white shadow-md p-3 border">
        <p className="font-semibold">{label}</p>
        <p className="text-emerald-600">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const TopCoursesRevenue: React.FC<Props> = ({ data }) => {
  console.log(data);
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">
        2. Top 5 khóa học doanh thu cao nhất
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 80, right: 30 }}
          >
            {/* Gradient */}
            <defs>
              <linearGradient
                id="topCourseGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <XAxis
              type="number"
              tickFormatter={(value) => `${value / 1_000_000}M`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              type="category"
              dataKey="course.title"
              width={150}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="revenue"
              fill="url(#topCourseGradient)"
              radius={[0, 8, 8, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCoursesRevenue;
