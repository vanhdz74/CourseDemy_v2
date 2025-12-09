"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenueItem = {
  month: string;
  revenue: number;
};

type Props = {
  data: RevenueItem[];
};

// format tiền
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
        <p className="text-indigo-600">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueByMonth: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">1. Doanh thu theo tháng</h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) => `${value / 1_000_000}M`}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByMonth;
