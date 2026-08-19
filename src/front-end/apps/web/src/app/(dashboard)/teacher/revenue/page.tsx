"use client";

import RevenueByMonth from "@/modules/report/components/revenue/RevenueByMonth";
import { useApi } from "@/modules/shared/hooks/useApi";
import React, { useCallback, useEffect, useState } from "react";
import DashboardSummary from "@/modules/report/components/report/CommonReport";
import { Input } from "@/modules/shared/components/ui/input";
import { AlertCircle, Filter, Loader2, WalletCards } from "lucide-react";

type RevenueByMonthItem = {
  month: string;
  revenue: number;
};

export default function Page() {
  const { get } = useApi();

  // 1 - column chart
  const [courseId, setCourseId] = useState<number | null>(null);
  const [revenueByMonth, setRevenueByMonth] = useState<RevenueByMonthItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getRevenueByMonth = useCallback(
    async (courseId?: number | null) => {
      const url = courseId
        ? `/revenue-by-month?courseId=${courseId}`
        : `/revenue-by-month`;

      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await get<RevenueByMonthItem[]>(url);
        setRevenueByMonth(Array.isArray(data) ? data : []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không tải được doanh thu";
        setErrorMessage(message);
        setRevenueByMonth([]);
      } finally {
        setIsLoading(false);
      }
    },
    [get]
  );

  // summary
  const totalRevenue =
    revenueByMonth?.reduce((sum, item) => sum + item.revenue, 0) ?? 0;

  // Xử lý hiển thị
  useEffect(() => {
    getRevenueByMonth(courseId);
  }, [courseId, getRevenueByMonth]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              <WalletCards className="h-4 w-4" />
              Revenue dashboard
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Thống kê doanh thu
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Theo dõi doanh thu theo tháng và lọc nhanh theo khóa học khi cần
              kiểm tra hiệu quả bán hàng.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Lọc theo Course ID
            </div>
            <Input
              type="number"
              value={courseId ?? ""}
              placeholder="Ví dụ: 12"
              onChange={(e) =>
                setCourseId(e.target.value ? Number(e.target.value) : null)
              }
              className="mt-3 w-full lg:w-56"
            />
          </div>
        </div>
      </section>

      <DashboardSummary totalRevenue={totalRevenue} />

      {isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải dữ liệu doanh thu...
          </div>
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Không thể tải doanh thu</p>
              <p className="mt-1 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        <RevenueByMonth data={revenueByMonth} />
      )}
    </div>
  );
}
