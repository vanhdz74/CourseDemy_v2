"use client";

import React from "react";
import { User, Bell, Lock, Sun, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/modules/shared/i18n";
import { cn } from "@/modules/shared/lib/utils";

interface SidebarNavProps {
  className?: string;
  active: string;
  onChange: (key: string) => void;
}

export default function SidebarNav({ className, active, onChange }: SidebarNavProps) {
  const { t } = useI18n();
  const { data: session } = useSession();
  const user = session?.user;

  const menu = [
    { key: "profile", labelKey: "settings.profile", icon: User },
    { key: "notification", labelKey: "settings.notification", icon: Bell },
    { key: "security", labelKey: "settings.security", icon: Lock },
    { key: "appearance", labelKey: "settings.appearance", icon: Sun },
    { key: "advanced", labelKey: "settings.advanced", icon: Zap },
  ];

  // Lấy chữ cái đầu tiên làm Avatar
  const initial = user?.username ? user.username.trim()[0].toUpperCase() : "U";

  return (
    <div className={cn("bg-card border border-border/80 rounded-2xl p-4 shadow-sm sticky top-[calc(var(--navHeight)+16px)] h-fit transition-all duration-300", className)}>
      <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-border/40">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-base font-extrabold shadow-sm">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-foreground truncate">{user?.username}</div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {t("settings.role", { role: user?.role || "" })}
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all duration-300 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
