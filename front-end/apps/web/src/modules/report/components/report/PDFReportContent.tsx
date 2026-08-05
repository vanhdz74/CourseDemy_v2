"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function PDFReportContent({
  summary,
  dailyRevenue,
  topCourses,
  revenueByCategory,
  fromDate,
  toDate,
}: any) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // ⭐ THÊM

  useEffect(() => {
    if (!chartRef.current) return;

    // destroy chart cũ nếu tồn tại
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: dailyRevenue.map((i: any) => i.day),
        datasets: [
          {
            label: "Doanh thu",
            data: dailyRevenue.map((i: any) => i.revenue),
            borderColor: "#10B981",
            borderWidth: 2,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: false, //  RẤT QUAN TRỌNG cho PDF
        animation: false, //  PDF không cần animation
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => Number(value).toLocaleString("vi-VN") + " đ",
            },
          },
        },
      },
    });

    // 🧹 cleanup khi unmount
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [dailyRevenue]); //  nên phụ thuộc data

  const totalRevenue = React.useMemo(() => {
    return dailyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  }, [dailyRevenue]);

  return (
    <div
      className="bg-white text-black text-sm"
      style={{
        width: "794px", // A4 @96dpi
        minHeight: "1123px", // A4 @96dpi
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <h1 className="text-xl font-bold text-center mb-1">BÁO CÁO TÀI CHÍNH</h1>
      <p className="text-center mb-6">
        {fromDate || "..."} → {toDate || "..."}
      </p>
      {/* SUMMARY */}
      <h3
        className="font-semibold"
        style={{
          marginTop: "24px",
          marginBottom: "8px",
          lineHeight: "1.4",
        }}
      >
        I. Tổng quan
      </h3>
      <table className="w-full border mb-6">
        <tbody>
          <tr>
            <td className="border p-2">Tổng doanh thu</td>
            <td className="border p-2 text-right font-semibold">
              {formatVND(summary.totalRevenue)}
            </td>
          </tr>
          <tr>
            <td className="border p-2">Số khóa học</td>
            <td className="border p-2 text-right">{summary.totalCourses}</td>
          </tr>
          <tr>
            <td className="border p-2">Danh mục</td>
            <td className="border p-2 text-right">{summary.totalCategories}</td>
          </tr>
        </tbody>
      </table>

      {/* CHART */}
      <h3
        className="font-semibold"
        style={{
          marginTop: "24px",
          marginBottom: "8px",
          lineHeight: "1.4",
        }}
      >
        II. Biểu đồ doanh thu
      </h3>
      <canvas ref={chartRef} width={700} height={250} className="mb-6" />
      <h6 className="text-center">
        Biểu đồ doanh thu từ {fromDate || "..."} đến {toDate || "..."}
      </h6>
      <div className="text-right mt-4 font-semibold">
        Tổng doanh thu: {formatVND(totalRevenue)}
      </div>

      {/* TOP COURSES */}
      <h3
        className="font-semibold"
        style={{
          marginTop: "24px",
          marginBottom: "8px",
          lineHeight: "1.4",
        }}
      >
        III. Top khóa học
      </h3>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2 text-left">Khóa học</th>
            <th className="border p-2 text-right">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {topCourses.map((i: any, idx: number) => (
            <tr key={idx}>
              <td className="border p-2">{i.course?.title}</td>
              <td className="border p-2 text-right">{formatVND(i.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3
        className="font-semibold"
        style={{
          marginTop: "24px",
          marginBottom: "8px",
          lineHeight: "1.4",
        }}
      >
        IV. Doanh thu theo các danh mục
      </h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2 text-left">Danh mục</th>
            <th className="border p-2 text-right">Tỷ lệ</th>
            <th className="border p-2 text-right">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {revenueByCategory.map((i: any, idx: number) => (
            <tr key={idx}>
              <td className="border p-2">{i.category}</td>
              <td className="border p-2 text-right">{i.percent + `%`}</td>
              <td className="border p-2 text-right">{formatVND(i.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SIGNATURE */}
      <div
        className="mt-10 flex justify-end"
        style={{ pageBreakInside: "avoid" }}
      >
        <div className="text-center w-64">
          <p
            className="font-semibold"
            style={{
              marginBottom: "10px",
            }}
          >
            Người lập báo cáo
          </p>
          <p
            className="italic text-sm"
            style={{
              lineHeight: "1.4",
            }}
          >
            (Ký, ghi rõ họ tên)
          </p>

          {/* Nếu có ảnh chữ ký */}
          {/* <img src="/signature.png" className="mx-auto h-16" /> */}
        </div>
      </div>
    </div>
  );
}
