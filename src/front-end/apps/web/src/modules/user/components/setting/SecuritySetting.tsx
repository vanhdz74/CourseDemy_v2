"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/modules/shared/components/ui/card";
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
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lock className="h-5 w-5 text-primary" /> Cài đặt bảo mật
        </CardTitle>
        <CardDescription>
          Thiết lập mật khẩu bảo mật và kích hoạt các phương thức xác thực tài khoản.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* 2FA */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">Bảo mật 2 lớp (2FA)</Label>
            <div className="text-xs text-muted-foreground">
              Yêu cầu xác nhận mã OTP trên điện thoại khi đăng nhập từ thiết bị lạ.
            </div>
          </div>
          <Switch
            checked={twoFA}
            onCheckedChange={(val) => setTwoFA(Boolean(val))}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Đổi mật khẩu */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-foreground">Thay đổi mật khẩu</Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {/* Current password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu hiện tại
              </Label>
              <div className="relative">
                <Input
                  type={showPw.current ? "text" : "password"}
                  placeholder="Mật khẩu cũ"
                  className="pr-10 bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  type={showPw.next ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  className="pr-10 bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      next: !prev.next,
                    }))
                  }
                >
                  {showPw.next ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Xác nhận mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  type={showPw.confirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="pr-10 bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
                  onChange={(e) =>
                    setResetPw((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  onClick={() =>
                    setShowPw((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPw.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleUpdatePassword}
              className="w-full md:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
