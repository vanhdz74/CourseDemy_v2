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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
        } as React.CSSProperties
      }
    >
      {pathname.includes("teacher") ||
      pathname.includes("admin") ||
      pathname.includes("user-class") ? (
        <>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-14 items-center border-b px-3">
              <SidebarTrigger className="mr-2" />
              <div className="flex justify-between w-full">
                <h1 className="font-semibold text-lg">
                  {localStorage.getItem("select")}
                </h1>

                <Button onClick={() => router.push("/home")}>Logo</Button>
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
