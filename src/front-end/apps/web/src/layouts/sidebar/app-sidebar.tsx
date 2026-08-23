"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  BookOpen,
  UserCheck,
  BarChart3,
  CreditCard,
  GraduationCap,
  Sparkles,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  LayoutDashboard,
  Users,
  FolderTree,
  BookOpen,
  UserCheck,
  BarChart3,
  CreditCard,
  GraduationCap,
  Settings,
};

const sidebarData = {
  TEACHER: [
    {
      titleKey: "sidebar.dashboard",
      url: "/teacher",
      icon: "LayoutDashboard",
      badge: "Overview",
    },
    {
      titleKey: "sidebar.manageCourses",
      url: "/teacher/my-courses",
      icon: "BookOpen",
    },
    {
      titleKey: "sidebar.viewStudents",
      url: "/user-class",
      icon: "GraduationCap",
    },
    {
      titleKey: "sidebar.revenueStats",
      url: "/teacher/revenue",
      icon: "BarChart3",
    },
  ],
  ADMIN: [
    {
      titleKey: "sidebar.dashboard",
      url: "/admin",
      icon: "LayoutDashboard",
      badge: "Live",
    },
    {
      titleKey: "sidebar.manageUsers",
      url: "/admin/users",
      icon: "Users",
    },
    {
      titleKey: "sidebar.manageCategories",
      url: "/admin/categories",
      icon: "FolderTree",
    },
    {
      titleKey: "sidebar.manageCourses",
      url: "/admin/courses",
      icon: "BookOpen",
    },
    {
      titleKey: "sidebar.manageStudents",
      url: "/user-class",
      icon: "UserCheck",
    },
    {
      titleKey: "sidebar.revenueStats",
      url: "/statistics/revenue",
      icon: "BarChart3",
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
  const pathname = usePathname();

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
        [&_[data-sidebar=sidebar]]:bg-card/95
        [&_[data-sidebar=sidebar]]:backdrop-blur-md
        [&_[data-sidebar=sidebar]]:shadow-md
        [--sidebar-width:260px]
        [--sidebar-width-icon:78px]
        [--sidebar-floating-gap:0px]
      "
      {...props}
    >
      {/* LOGO */}
      <SidebarHeader className="border-b border-border/50 px-4 py-4 group-data-[collapsible=icon]:px-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-purple-600 to-indigo-600 text-sm font-black text-white shadow-md shadow-primary/20 group-data-[collapsible=icon]:mx-auto">
            CD
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="block truncate text-base font-extrabold tracking-tight text-foreground">
                CourseDemy
              </span>
              <span className="rounded bg-primary/10 px-1 py-0.2 text-[10px] font-bold text-primary">
                PRO
              </span>
            </div>
            <span className="block truncate text-xs text-muted-foreground">
              {user?.role === "ADMIN" ? "Quản trị hệ thống" : "Không gian Giảng viên"}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* USER PILL */}
      <SidebarHeader className="border-b border-border/40 px-3 py-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Avatar className="h-9 w-9 border border-primary/20 shadow-sm">
            <AvatarImage src={user?.avatar_url || (user as any)?.image || undefined} />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs font-bold text-foreground">
              {user?.username || "Người dùng"}
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {user?.role}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* MENU ITEMS */}
      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 group-data-[collapsible=icon]:hidden">
            Menu điều hướng
          </div>
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons];
              const title = t(item.titleKey);
              
              // Dynamic pathname exact or prefix match
              const isActive =
                item.url === "/admin" || item.url === "/teacher"
                  ? pathname === item.url
                  : pathname === item.url || pathname.startsWith(item.url + "/");

              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => localStorage.setItem("select", title)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        "text-muted-foreground hover:bg-accent hover:text-foreground",
                        isActive &&
                          "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:bg-primary hover:text-primary-foreground",
                        "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                        )}
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {title}
                        </span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider group-data-[collapsible=icon]:hidden",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER SHORTCUT */}
      <SidebarFooter className="border-t border-border/40 p-3 group-data-[collapsible=icon]:hidden">
        <Link
          href="/setting"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition duration-200"
        >
          <Settings className="h-4 w-4" />
          <span>Cài đặt hệ thống</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
