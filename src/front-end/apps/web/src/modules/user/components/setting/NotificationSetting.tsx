"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/modules/shared/components/ui/card";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Label } from "@/modules/shared/components/ui/label";
import { Bell } from "lucide-react";

export default function NotificationsSetting() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    notifications: false,
    emailNotif: false,
    smsNotif: false,
  });

  useEffect(() => {
    setMounted(true);
    // Tải cấu hình tĩnh từ localStorage thay vì gọi API lỗi
    const notifications = localStorage.getItem("coursedemy.notifications") === "true";
    const emailNotif = localStorage.getItem("coursedemy.email-notif") === "true";
    const bgSms = localStorage.getItem("coursedemy.sms-notif") === "true";

    setData({
      notifications,
      emailNotif,
      smsNotif: bgSms,
    });
  }, []);

  const updateSetting = (key: keyof typeof data, value: boolean) => {
    setData((prev) => ({ ...prev, [key]: value }));
    localStorage.setItem(`coursedemy.${key === "emailNotif" ? "email-notif" : key === "smsNotif" ? "sms-notif" : "notifications"}`, String(value));
  };

  if (!mounted) return null;

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bell className="h-5 w-5 text-primary" /> Thông báo
        </CardTitle>
        <CardDescription>
          Quản lý các loại thông báo bạn muốn nhận qua ứng dụng và email.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <div className="flex items-center justify-between md:col-span-2 pb-4 border-b border-border/40">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">Cho phép gửi thông báo</Label>
            <div className="text-xs text-muted-foreground max-w-md">
              Nhận thông báo đẩy trên trình duyệt về bài giảng mới, bình luận của giảng viên.
            </div>
          </div>
          <Switch
            checked={data.notifications}
            onCheckedChange={(val) => updateSetting("notifications", val)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">Thông báo qua email</Label>
            <div className="text-xs text-muted-foreground">
              Nhận thư báo cáo tiến trình học tập hàng tuần và hóa đơn thanh toán.
            </div>
          </div>
          <Switch
            checked={data.emailNotif}
            onCheckedChange={(val) => updateSetting("emailNotif", val)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">Tin nhắn SMS bảo mật</Label>
            <div className="text-xs text-muted-foreground">
              Nhận mã xác thực OTP qua SMS khi có giao dịch thanh toán hoặc đổi mật khẩu.
            </div>
          </div>
          <Switch
            checked={data.smsNotif}
            onCheckedChange={(val) => updateSetting("smsNotif", val)}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
