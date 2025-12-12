"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function SecuritySetting() {
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => {
    async function fetchSecurity() {
      const res = await fetch("/api/settings/security");
      const json = await res.json();
      setTwoFA(json.twoFA);
    }
    fetchSecurity();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock size={18} /> Bảo mật
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Bảo mật 2 lớp</div>
            <div className="text-sm text-muted-foreground">
              Tăng cường bảo mật tài khoản
            </div>
          </div>
          <Switch
            checked={twoFA}
            onCheckedChange={(val) => setTwoFA(Boolean(val))}
          />
        </div>

        <div className="pt-4">
          <Label className="text-sm font-medium">Thay đổi mật khẩu</Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu hiện tại
              </Label>
              <Input
                type="password"
                placeholder="Current password"
                className="rounded-xl focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu mới
              </Label>
              <Input
                type="password"
                placeholder="New password"
                className="rounded-xl focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Nhập lại mật khẩu
              </Label>
              <Input
                type="password"
                placeholder="Confirm password"
                className="rounded-xl focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <Button className="mt-4 w-full md:w-auto rounded-xl px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition">
            Cập nhật
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
