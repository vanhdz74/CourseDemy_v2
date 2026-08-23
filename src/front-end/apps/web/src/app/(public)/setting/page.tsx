"use client";

import React, { useState } from "react";
import SidebarNav from "@/modules/user/components/setting/SidebarMenu";

import ProfileSetting from "@/modules/user/components/setting/ProfileSetting";
import NotificationsSetting from "@/modules/user/components/setting/NotificationSetting";
import SecuritySetting from "@/modules/user/components/setting/SecuritySetting";
import AppearanceSetting from "@/modules/user/components/setting/AppearanceSetting";
import AdvancedSetting from "@/modules/user/components/setting/AvdancedSetting";
import { useI18n } from "@/modules/shared/i18n";

export default function SettingsPage() {
  const { t } = useI18n();
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
    <div className="min-h-[80vh] py-10 text-foreground">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SidebarNav
          className="col-span-1"
          active={active}
          onChange={setActive}
        />

        <main className="col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.description")}
          </p>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
