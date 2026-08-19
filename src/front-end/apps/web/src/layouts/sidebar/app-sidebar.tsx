"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Users,
  Book,
  Library,
  UserCheck,
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
} from "@/modules/shared/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar";
import { cn } from "@/modules/shared/lib/utils";
import { useSession } from "next-auth/react";
import { useI18n } from "@/modules/shared/i18n";

const icons = {
  CalendarPlus,
  Users,
  Book,
  Library,
  UserCheck,
  LineChart,
  CreditCard,
};

const sidebarData = {
  TEACHER: [
    {
      titleKey: "sidebar.viewStudents",
      url: "/user-class",
      icon: "CalendarPlus",
    },
    {
      titleKey: "sidebar.manageCourses",
      url: "/teacher/my-courses",
      icon: "CalendarPlus",
    },
    {
      titleKey: "sidebar.revenueStats",
      url: "/teacher/revenue",
      icon: "LineChart",
    },
  ],
  ADMIN: [
    { titleKey: "sidebar.manageUsers", url: "/admin/users", icon: "Users" },
    { titleKey: "sidebar.manageCategories", url: "/admin/categories", icon: "Users" },
    { titleKey: "sidebar.manageCourses", url: "/admin/courses", icon: "Library" },
    { titleKey: "sidebar.manageStudents", url: "/user-class", icon: "UserCheck" },
    {
      titleKey: "sidebar.revenueStats",
      url: "/statistics/revenue",
      icon: "LineChart",
    },
    {
      titleKey: "sidebar.managePayments",
      url: "/admin/payment_manager",
      icon: "CreditCard",
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t } = useI18n();
  const { data: session } = useSession();
  const user = session?.user;

  const roleKey = user?.role?.toUpperCase() as keyof typeof sidebarData;
  const menuItems = sidebarData[roleKey] || [];

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="
        bg-transparent text-sidebar-foreground
        md:!inset-y-3 md:!left-3 md:!h-[calc(100svh-1.5rem)] md:!p-0
        [&_[data-sidebar=sidebar]]:rounded-2xl
        [&_[data-sidebar=sidebar]]:border
        [&_[data-sidebar=sidebar]]:border-sidebar-border
        [&_[data-sidebar=sidebar]]:bg-sidebar
        [&_[data-sidebar=sidebar]]:shadow-sm
        [--sidebar-width:250px]
        [--sidebar-width-icon:78px]
        [--sidebar-floating-gap:0px]
      "
      {...props}
    >
      {/* LOGO */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground shadow-sm group-data-[collapsible=icon]:mx-auto">
            CD
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold">
              CourseDemy
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {t("header.workspace")}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* USER */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/70 p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback>
              {user?.username?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">
              {user?.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.role}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarMenu className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              const title = t(item.titleKey);
              const selected =
                typeof window !== "undefined" &&
                localStorage.getItem("select") === title;

              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => localStorage.setItem("select", title)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        "text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        selected &&
                          "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm ring-1 ring-sidebar-primary/20 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                        "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {title}
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
