"use client";

import React from "react";
import { User, Bell, Lock, Sun, Globe, Zap } from "lucide-react";

export default function SidebarNav({ active, onChange }: any) {
  const menu = [
    { key: "profile", label: "Hồ sơ", icon: User },
    { key: "notification", label: "Thông báo", icon: Bell },
    { key: "security", label: "Bảo mật", icon: Lock },
    { key: "appearance", label: "Giao diện", icon: Sun },
    { key: "language", label: "Ngôn ngữ", icon: Globe },
    { key: "advanced", label: "Advanced", icon: Zap },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-6 h-fit">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
          VA
        </div>
        <div>
          <div className="font-medium">Nguyễn Văn A</div>
          <div className="text-sm text-muted-foreground">Vai trò: Học viên</div>
        </div>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)} // 🔥 Khi bấm gọi lên cha
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3
                ${isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
              `}
            >
              <Icon size={16} /> {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
