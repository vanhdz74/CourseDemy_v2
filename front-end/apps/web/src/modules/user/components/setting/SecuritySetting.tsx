"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/ui/card";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/shared/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/modules/shared/hooks/useApi";
import { isAxiosError } from "axios";

export default function SecuritySetting() {
  const { post } = useApi();
  const [twoFA, setTwoFA] = useState(false);

  const [resetPw, setResetPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // state điều khiển hiện / ẩn mật khẩu
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const handleUpdatePassword = async () => {
    if (
      !resetPw.currentPassword ||
      !resetPw.newPassword ||
      !resetPw.confirmPassword
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await post("/reset-password", {
        currentPassword: resetPw.currentPassword,
        newPassword: resetPw.newPassword,
        confirmPassword: resetPw.confirmPassword,
      });

      toast.success(res.message || "Cập nhật mật khẩu thành công");
    } catch (error: unknown) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : "Cập nhật mật khẩu thất bại";
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock size={18} /> Bảo mật
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 2FA */}
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

        {/* Đổi mật khẩu */}
        <div className="pt-4">
          <Label className="text-sm font-medium">Thay đổi mật khẩu</Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {/* Current password */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu hiện tại
              </Label>
              <div className="relative">
                <Input
                  type={showPw.current ? "text" : "password"}
                  placeholder="Current password"
                  className="pr-10 rounded-xl focus:ring-2 focus:ring-indigo-300"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-indigo-600"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPw.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  type={showPw.next ? "text" : "password"}
                  placeholder="New password"
                  className="pr-10 rounded-xl focus:ring-2 focus:ring-indigo-300"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-indigo-600"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      next: !prev.next,
                    }))
                  }
                >
                  {showPw.next ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Nhập lại mật khẩu
              </Label>
              <div className="relative">
                <Input
                  type={showPw.confirm ? "text" : "password"}
                  placeholder="Confirm password"
                  className="pr-10 rounded-xl focus:ring-2 focus:ring-indigo-300"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-indigo-600"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPw.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpdatePassword}
            className="mt-4 w-full md:w-auto rounded-xl px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Cập nhật
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
