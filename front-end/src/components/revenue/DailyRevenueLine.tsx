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
      <div className="bg-white border rounded-lg p-3 shadow">
        <p className="font-semibold">Ngày {label}</p>
        <p className="text-orange-500">
          Doanh thu: {formatVND(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const DailyRevenueLine: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">
        4. Xu hướng doanh thu hàng ngày
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} />
            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F97316"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              fill="url(#lineGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyRevenueLine;
