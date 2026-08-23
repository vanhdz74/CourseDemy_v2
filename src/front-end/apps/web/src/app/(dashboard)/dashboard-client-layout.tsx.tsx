"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { AppSidebar } from "@/layouts/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/modules/shared/components/ui/sidebar";
import { Button } from "@/modules/shared/components/ui/button";
import { ModeToggle } from "@/modules/shared/components/mode-toggle";
import { LanguageSwitcher } from "@/modules/shared/i18n/language-switcher";

export default function DashboardClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  if (!user?.role) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="rounded-2xl border border-border bg-card px-6 py-4 shadow-sm flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Đang tải không gian làm việc...</span>
        </div>
      </div>
    );
  }

  // Get Page Title based on route
  const getPageMeta = () => {
    if (pathname === "/admin" || pathname === "/teacher") {
      return { title: "Tổng quan Dashboard", subtitle: `Chào mừng trở lại, ${user.username || "bạn"}!` };
    }
    if (pathname.includes("/admin/users")) {
      return { title: "Quản lý người dùng", subtitle: "Danh sách và phân quyền tài khoản trên hệ thống" };
    }
    if (pathname.includes("/admin/categories")) {
      return { title: "Quản lý danh mục", subtitle: "Cơ cấu phân loại và chủ đề khóa học" };
    }
    if (pathname.includes("/admin/courses") || pathname.includes("/teacher/my-courses")) {
      return { title: "Quản lý khóa học", subtitle: "Nội dung, bài giảng và xuất bản khóa học" };
    }
    if (pathname.includes("/user-class")) {
      return { title: "Danh sách học viên", subtitle: "Tiến độ học tập và quản lý lớp học" };
    }
    if (pathname.includes("/statistics/revenue") || pathname.includes("/teacher/revenue")) {
      return { title: "Báo cáo doanh thu", subtitle: "Phân tích tài chính và hiệu quả kinh doanh" };
    }
    if (pathname.includes("/admin/payment_manager")) {
      return { title: "Quản lý thanh toán", subtitle: "Lịch sử giao dịch và đối soát cổng thanh toán" };
    }
    return { title: "Bảng điều khiển", subtitle: "Không gian làm việc quản trị CourseDemy" };
  };

  const meta = getPageMeta();

  return (
    <SidebarProvider className="bg-background">
      {pathname.includes("teacher") ||
      pathname.includes("admin") ||
      pathname.includes("statistics") ||
      pathname.includes("user-class") ? (
        <div className="flex h-screen w-full gap-3.5 overflow-hidden bg-muted/30 p-2.5 sm:p-3">
          <AppSidebar />
          <SidebarInset className="h-[calc(100svh-1.25rem)] sm:h-[calc(100svh-1.5rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-md transition-[margin] duration-200 md:peer-data-[state=collapsed]:ml-3">
            {/* TOP HEADER */}
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/90 px-4 sm:px-6 backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent" />

                <div className="hidden sm:flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">CourseDemy</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="truncate">{user.role}</span>
                  </div>
                  <h1 className="truncate text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {meta.title}
                  </h1>
                </div>
              </div>

              {/* RIGHT HEADER ACTIONS */}
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <ModeToggle />

                <div className="h-5 w-[1px] bg-border mx-0.5" />

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-border/80 text-xs font-semibold gap-1.5 hover:bg-accent hover:text-foreground cursor-pointer shadow-none"
                  onClick={() => router.push("/")}
                >
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Trang chủ</span>
                </Button>
              </div>
            </header>

            {/* MAIN DASHBOARD CONTENT */}
            <main className="h-[calc(100svh-5.25rem)] overflow-y-auto bg-background/90 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      ) : (
        <main className="min-h-[100vh] w-full bg-background md:overflow-auto">
          {children}
        </main>
      )}
    </SidebarProvider>
  );
}
