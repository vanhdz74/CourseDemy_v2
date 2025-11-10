"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarPlus, Users, Book } from "lucide-react";
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

// Map icon name → component
const icons = {
  CalendarPlus,
  Users,
  Book,
};

// Dữ liệu sidebar theo role
const sidebarData = {
  TEACHER: [
    {
      title: "Khoá học của tôi",
      url: "/teacher/my-courses",
      icon: "CalendarPlus",
    },
    {
      title: "Quản lý học viên",
      url: "/teacher/student-managerment",
      icon: "CalendarPlus",
    },
  ],
  ADMIN: [
    { title: "Quản lý người dùng", url: "/admin/users", icon: "Users" },
    { title: "Quản lý khoá học", url: "/admin/courses", icon: "Book" },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);

  const roleKey = user?.role?.toUpperCase() as keyof typeof sidebarData;
  const menuItems = sidebarData[roleKey] || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback>
                  {user?.username?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-semibold truncate">
                  {user?.username && `Chào, ${user.username}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Vai trò: {user?.role || "—"}
                </p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      onClick={() => {
                        localStorage.setItem("select", item.title);
                      }}
                      href={item.url}
                      className="flex items-center gap-2 font-medium"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.title}
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
