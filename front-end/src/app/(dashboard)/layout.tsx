"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  if (!user?.role) {
    return (
      <div className="flex items-center justify-center h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <SidebarProvider>
      {pathname.includes("teacher") ||
      pathname.includes("admin") ||
      pathname.includes("statistics") ||
      pathname.includes("user-class") ? (
        <>
          <AppSidebar />
          <SidebarInset>
            <header className="ml-5 flex h-14 items-center border-b px-4">
              <SidebarTrigger className="mr-3" />

              <div className="flex items-center justify-between w-full">
                <h1 className="text-lg font-semibold truncate">
                  {typeof window !== "undefined"
                    ? localStorage.getItem("select")
                    : ""}
                </h1>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/home")}
                >
                  Trang chủ
                </Button>
              </div>
            </header>

            <main>{children}</main>
          </SidebarInset>
        </>
      ) : (
        <>
          <main className="w-full md:overflow-auto min-h-[100vh]">
            {children}
          </main>
        </>
      )}
    </SidebarProvider>
  );
}
