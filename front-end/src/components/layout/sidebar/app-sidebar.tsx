"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Users,
  Book,
  Library,
  UserCheck,
  BarChart3,
  LineChart,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

const icons = {
  CalendarPlus,
  Users,
  Book,
  Library,
  UserCheck,
  BarChart3,
  LineChart,
  CreditCard,
};

const sidebarData = {
  TEACHER: [
    {
      title: "Xem thông tin học viên",
      url: "/user-class",
      icon: "CalendarPlus",
    },
    {
      title: "Quản lý khoá học",
      url: "/teacher/my-courses",
      icon: "CalendarPlus",
    },
    {
      title: "Thống kê doanh thu",
      url: "/teacher/revenue",
      icon: "LineChart",
    },
  ],
  ADMIN: [
    { title: "Quản lý người dùng", url: "/admin/users", icon: "Users" },
    { title: "Quản lý danh mục", url: "/admin/categories", icon: "Users" },
    { title: "Quản lý khoá học", url: "/admin/courses", icon: "Library" },
    { title: "Quản lý học viên", url: "/user-class", icon: "UserCheck" },
    // {
    //   title: "Thống kê học viên",
    //   url: "/statistics/students",
    //   icon: "BarChart3",
    // },
    {
      title: "Thống kê doanh thu",
      url: "/statistics/revenue",
      icon: "LineChart",
    },
    {
      title: "Quản lý thanh toán",
      url: "/admin/payment_manager",
      icon: "CreditCard",
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);

  const roleKey = user?.role?.toUpperCase() as keyof typeof sidebarData;
  const menuItems = sidebarData[roleKey] || [];

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r bg-background
        [--sidebar-width:250px]
        [--sidebar-width-icon:62px]
      "
      {...props}
    >
      {/* LOGO */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            CD
          </div>
          <span className="text-sm font-semibold truncate group-data-[collapsible=icon]:hidden">
            CourseDemy
          </span>
        </div>
      </SidebarHeader>

      {/* USER */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback>
              {user?.username?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">
              {user?.username}
            </span>
            <span className="text-xs text-muted-foreground">{user?.role}</span>
          </div>
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              const selected =
                typeof window !== "undefined" &&
                localStorage.getItem("select") === item.title;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => localStorage.setItem("select", item.title)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        "hover:bg-primary/10 hover:text-primary",
                        selected && "bg-primary/15 text-primary",
                        "group-data-[collapsible=icon]:justify-center"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
