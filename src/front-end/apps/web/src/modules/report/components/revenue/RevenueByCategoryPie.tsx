"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CategoryRevenue = {
  category: string;
  revenue: number;
};

type Props = {
  data: CategoryRevenue[];
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow mb-10">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-gray-500">Tỷ lệ: {payload[0].payload.percent} %</p>
        <p className="text-indigo-600">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueByCategoryPie: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold">3. Tỷ lệ doanh thu theo danh mục</h2>

      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={70}
              paddingAngle={3}
              className="cursor-pointer"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={35} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByCategoryPie;
