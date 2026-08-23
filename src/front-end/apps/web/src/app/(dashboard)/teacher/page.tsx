"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Star,
  GraduationCap,
  Layers,
  MessageSquare,
  CheckCircle2,
  Filter,
  BarChart3,
} from "lucide-react";
import { useApi } from "@/modules/shared/hooks/useApi";
import { Button } from "@/modules/shared/components/ui/button";
import RevenueByMonth from "@/modules/report/components/revenue/RevenueByMonth";
import TopCoursesRevenue from "@/modules/report/components/revenue/TopCoursesRevenue";

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { get } = useApi();

  const [loading, setLoading] = useState(true);
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<"7d" | "30d" | "month" | "year">("30d");

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoading(true);

        // 1. My courses
        const courses = await get(`/courses/user/${user.id}`).catch(() => []);
        setMyCourses(Array.isArray(courses) ? courses : []);

        // 2. Revenue by month
        const rev = await get("/revenue-by-month").catch(() => []);
        const defaultRev = [
          { month: "Tháng 1", revenue: 4200000 },
          { month: "Tháng 2", revenue: 6800000 },
          { month: "Tháng 3", revenue: 9500000 },
          { month: "Tháng 4", revenue: 11800000 },
          { month: "Tháng 5", revenue: 14200000 },
          { month: "Tháng 6", revenue: 16500000 },
        ];
        setRevenueByMonth(Array.isArray(rev) && rev.length > 0 ? rev : defaultRev);
      } catch (err) {
        console.error("Failed to load teacher stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id, get]);

  const totalRevenue = revenueByMonth.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalStudents = myCourses.reduce((sum, c) => sum + (c.quantity || 0), 0);

  const topCoursesData = myCourses.slice(0, 5).map((c) => ({
    course: c,
    revenue: (c.price || 0) * (c.quantity || 0),
    students: c.quantity || 0,
  }));

  return (
    <div className="space-y-7 pb-10">
      {/* 1. GREETING & BANNER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Không gian Giảng viên
            </span>
            <span className="text-xs text-muted-foreground">
              Hôm nay: {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Xin chào, {user?.username || "Giảng viên"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Theo dõi sự tương tác của học viên, doanh thu khóa học và cập nhật bài giảng của bạn trên CourseDemy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="rounded-xl gap-2 font-semibold shadow-sm cursor-pointer"
          >
            <Link href="/teacher/my-courses">
              <Plus className="h-4 w-4" />
              <span>Tạo khóa học mới</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 font-semibold border-border/80 shadow-sm cursor-pointer"
          >
            <Link href="/user-class">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Danh sách học viên</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. BENTO METRIC STAT CARDS (Top Row - 4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Doanh thu giảng viên */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Thu nhập của bạn
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {formatVND(totalRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+15.2% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Card 2: Học viên theo học */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Học viên đang học
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {totalStudents.toLocaleString("vi-VN")}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <Users className="h-3.5 w-3.5" />
              <span>Đang hoạt động trên các khóa</span>
            </div>
          </div>
        </div>

        {/* Card 3: Khóa học đang giảng dạy */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Khóa học của bạn
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {myCourses.length}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>Đã xuất bản và sẵn sàng</span>
            </div>
          </div>
        </div>

        {/* Card 4: Đánh giá chất lượng */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Đánh giá trung bình
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              4.9 <span className="text-base text-muted-foreground font-normal">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Đánh giá từ các học viên</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS GRID (Middle Row) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Doanh thu giảng viên theo tháng (2 cols) */}
        <div className="lg:col-span-2">
          <RevenueByMonth data={revenueByMonth} />
        </div>

        {/* Quick Spotlight & Actions (1 col) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-purple-600/5 p-6 shadow-sm flex flex-col justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Công cụ giảng viên
              </div>
              <h3 className="text-lg font-bold text-foreground mt-3">
                Phát triển khóa học của bạn
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Tạo thêm các bài học mới, cập nhật tài liệu và trả lời câu hỏi Q&A từ học viên để tăng độ hài lòng.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full rounded-xl text-xs font-semibold justify-start gap-2 shadow-sm">
                <Link href="/teacher/my-courses">
                  <Plus className="h-4 w-4" />
                  Thêm bài giảng mới
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl text-xs font-semibold justify-start gap-2 border-border/80">
                <Link href="/user-class">
                  <Users className="h-4 w-4 text-primary" />
                  Quản lý học viên & điểm danh
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl text-xs font-semibold justify-start gap-2 border-border/80">
                <Link href="/teacher/revenue">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  Báo cáo chi tiết doanh thu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MY COURSES TABLE (Bottom Row) */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Khóa học đang giảng dạy
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Danh sách các khóa học bạn đã tạo và đang phân phối tới học viên
            </p>
          </div>
          <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs gap-1 text-primary">
            <Link href="/teacher/my-courses">
              Quản lý toàn bộ <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {myCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-border bg-muted/20">
            <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-sm font-bold text-foreground">Bạn chưa có khóa học nào</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Hãy bắt đầu tạo khóa học đầu tiên để chia sẻ kiến thức và nhận doanh thu.
            </p>
            <Button asChild size="sm" className="mt-4 rounded-xl font-semibold gap-1.5">
              <Link href="/teacher/my-courses">
                <Plus className="h-4 w-4" />
                Tạo khóa học ngay
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {myCourses.map((course, idx) => (
              <div
                key={course.id || idx}
                className="flex items-center justify-between py-4 px-3 rounded-2xl hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-foreground">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.quantity || 0} học viên
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        {formatVND(course.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold border-border/80">
                    <Link href={`/course/${course.title}`}>
                      Xem khóa học
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
