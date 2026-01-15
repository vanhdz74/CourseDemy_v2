"use client";

import React, { useState } from "react";
import SidebarNav from "@/components/setting/SidebarMenu";

import ProfileSetting from "@/components/setting/ProfileSetting";
import NotificationsSetting from "@/components/setting/NotificationSetting";
import SecuritySetting from "@/components/setting/SecuritySetting";
import AppearanceSetting from "@/components/setting/AppearanceSetting";
import AdvancedSetting from "@/components/setting/AvdancedSetting";

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <ProfileSetting />;
      case "notification":
        return <NotificationsSetting />;
      case "security":
        return <SecuritySetting />;
      case "appearance":
        return <AppearanceSetting />;
      case "advanced":
        return <AdvancedSetting />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SidebarNav
          className="col-span-1"
          active={active}
          onChange={setActive}
        />

        <main className="col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Cài đặt</h1>
          <p className="text-sm text-muted-foreground">
            Tùy chỉnh cài đặt tài khoản, bảo mật và hiển thị theo ý bạn.
          </p>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
