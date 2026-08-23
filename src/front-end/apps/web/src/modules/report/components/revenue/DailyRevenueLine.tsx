"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

type DailyRevenue = {
  day: string;
  revenue: number;
};

type Props = {
  data: DailyRevenue[];
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
        <p className="font-bold text-foreground">Ngày {label}</p>
        <p className="mt-1 font-extrabold text-orange-500">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const DailyRevenueLine: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Doanh thu theo ngày
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Biến động doanh thu phát sinh trong tuần
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
          <Activity className="h-4 w-4" />
        </div>
      </div>

      <div className="w-full h-[260px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Chưa có dữ liệu theo ngày
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ fill: "#F97316", r: 4 }}
                activeDot={{ r: 6, stroke: "var(--card)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DailyRevenueLine;

