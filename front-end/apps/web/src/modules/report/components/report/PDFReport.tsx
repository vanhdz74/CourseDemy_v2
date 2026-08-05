"use client";

import React, { useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFReportContent from "./PDFReportContent";

type Props = {
  open: boolean;
  onClose: () => void;
  summary: {
    totalRevenue: number;
    totalCourses: number;
    totalCategories: number;
  };
  revenueByMonth: any[];
  topCourses: any[];
  revenueByCategory: any[];
  dailyRevenue: any[];
  fromDate: string;
  toDate: string;
};

export default function PDFReport({ open, onClose, ...data }: Props) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const exportPDF = async () => {
    const element = document.getElementById("pdf-report");
    if (!element) return;

    try {
      setLoading(true);

      // Chụp PNG đúng kích thước DOM
      const canvas = await html2canvas(element, {
        scale: 1, // CỰC KỲ QUAN TRỌNG
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (doc) => {
          const style = doc.createElement("style");
          style.innerHTML = `
          * {
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            line-height: 1.6 !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
        `;
          doc.head.appendChild(style);
        },
      });

      const imgData = canvas.toDataURL("image/png");

      // 2. Tạo PDF đúng kích thước PNG (PX)
      const pdf = new jsPDF({
        orientation: "p",
        unit: "px", //  DÙNG PX
        format: [794, 1223], // Y HỆT DOM
        compress: false,
      });

      // 3. Vẽ ảnh KHÔNG SCALE
      pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);

      pdf.save(`bao-cao-tai-chinh-${data.fromDate}-${data.toDate}.pdf`);
    } catch (err) {
      console.error("Export PDF error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-[900px] max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg">
              Xem trước báo cáo tài chính
            </h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <div
              id="pdf-report"
              className="bg-white text-black"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
            >
              <PDFReportContent {...data} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={exportPDF} disabled={loading}>
              {loading ? "Đang tạo PDF..." : "Tải PDF"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
