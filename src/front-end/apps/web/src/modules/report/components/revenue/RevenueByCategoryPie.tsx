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
import { PieChart as PieIcon } from "lucide-react";

type CategoryRevenue = {
  category: string;
  revenue: number;
  percent?: number;
};

type Props = {
  data: CategoryRevenue[];
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-2xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-foreground">{item.name}</p>
        <p className="mt-1 font-extrabold text-primary">
          Doanh thu: {formatVND(item.value)}
        </p>
        {item.payload.percent !== undefined && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tỷ trọng: {item.payload.percent}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const RevenueByCategoryPie: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Cơ cấu theo danh mục
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tỷ lệ phân bổ doanh thu theo từng nhóm ngành
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <PieIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="w-full h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Chưa có dữ liệu danh mục
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Custom Legend */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
        {data.slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="truncate text-muted-foreground">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueByCategoryPie;

