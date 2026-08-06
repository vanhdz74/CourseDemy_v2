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

// format tiền
const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

// Custom Tooltip
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
      <div className="rounded-xl border border-border bg-card p-3 text-sm shadow-lg">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-primary">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueByMonth: React.FC<Props> = ({ data }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Doanh thu theo tháng
          </h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi doanh thu khóa học theo từng tháng.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Chưa có dữ liệu doanh thu
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Khi có giao dịch thành công, biểu đồ doanh thu sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              {/* Gradient */}
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.92}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.42}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tickFormatter={(value) => `${value / 1_000_000}M`}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
      )}
    </div>
  );
};

export default RevenueByMonth;
