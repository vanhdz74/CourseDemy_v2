"use client";

import React from "react";
import { User, Bell, Lock, Sun, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/modules/shared/i18n";

interface SidebarNavProps {
  active: string;
  onChange: (key: string) => void;
}

export default function SidebarNav({ active, onChange }: SidebarNavProps) {
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

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-6 h-fit">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
          VA
        </div>
        <div>
          <div className="font-medium">{user?.username}</div>
          <div className="text-sm text-muted-foreground">
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
              onClick={() => onChange(item.key)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3
                ${isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
              `}
            >
              <Icon size={16} /> {t(item.labelKey)}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
