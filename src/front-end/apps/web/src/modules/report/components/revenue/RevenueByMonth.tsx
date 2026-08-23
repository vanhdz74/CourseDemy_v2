"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";

type RevenueItem = {
  month: string;
  revenue: number;
};

type Props = {
  data: RevenueItem[];
};

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

type TooltipPayload = {
  value: number;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-foreground">{label}</p>
        <p className="mt-1 font-extrabold text-primary">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueByMonth: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Doanh thu theo tháng
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Biến động dòng tiền qua các tháng trong năm
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BarChart3 className="h-4 w-4" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
          <h3 className="mt-3 text-sm font-bold text-foreground">
            Chưa có dữ liệu doanh thu
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Biểu đồ sẽ tự động cập nhật khi có học viên đăng ký khóa học.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `${value / 1_000_000}M`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RevenueByMonth;

