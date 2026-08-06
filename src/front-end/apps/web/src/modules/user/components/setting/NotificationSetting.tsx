"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/ui/card";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Bell } from "lucide-react";
import { getNotificationSettings } from "@repo/api";

export default function NotificationsSetting() {
  const [data, setData] = useState({
    notifications: false,
    emailNotif: false,
    smsNotif: false,
  });

  useEffect(() => {
    async function fetchNotifications() {
      const json = await getNotificationSettings();
      setData(json);
    }
    fetchNotifications();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={18} /> Thông báo
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex items-center justify-between md:col-span-2">
          <div>
            <div className="font-medium">Cho phép gửi thông báo</div>
            <div className="text-sm text-muted-foreground">
              Nhận thông báo về cập nhật, khuyến mãi...
            </div>
          </div>
          <Switch
            checked={data.notifications}
            onCheckedChange={(val) =>
              setData({ ...data, notifications: Boolean(val) })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Thông báo về email</div>
          </div>
          <Switch
            checked={data.emailNotif}
            onCheckedChange={(val) =>
              setData({ ...data, emailNotif: Boolean(val) })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Tin nhắn SMS</div>
          </div>
          <Switch
            checked={data.smsNotif}
            onCheckedChange={(val) =>
              setData({ ...data, smsNotif: Boolean(val) })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
