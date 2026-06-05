"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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
        <div className="rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
          Đang tải...
        </div>
      </div>
    );
  }

  const title =
    typeof window !== "undefined" ? localStorage.getItem("select") : "";

  return (
    <SidebarProvider className="bg-background">
      {pathname.includes("teacher") ||
      pathname.includes("admin") ||
      pathname.includes("statistics") ||
      pathname.includes("user-class") ? (
        <div className="flex h-screen w-full gap-4 overflow-hidden bg-background p-3">
          <AppSidebar />
          <SidebarInset className="h-[calc(100svh-1.5rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[margin] duration-200 md:peer-data-[state=collapsed]:ml-4">
            <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
              <SidebarTrigger className="mr-3" />

              <div className="flex w-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    CourseDemy
                  </p>
                  <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
                    {title || "Bảng điều khiển"}
                  </h1>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/home")}
                >
                  Trang chủ
                </Button>
              </div>
            </header>

            <main className="h-[calc(100svh-5.5rem)] overflow-y-auto bg-background/65 px-4 py-6 sm:px-6 lg:px-8">
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
