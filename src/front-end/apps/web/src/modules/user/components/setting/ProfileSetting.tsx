"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/modules/shared/components/ui/card";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { User, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { api } from "@repo/api";

export default function ProfileSetting() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    username: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    role: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //  LẤY PROFILE TỪ API GIỐNG EditInfor
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!user?.id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = (await api.users.getProfile(user.id)) as any;
        const profile = res?.data ?? res;
        setData({
          username: profile?.username || user?.username || "",
          email: profile?.email || user?.email || "",
          avatar_url: profile?.avatar_url || (user as any)?.image || "",
          phone_number: profile?.phone_number || "",
          role: profile?.role || user?.role || "",
          description: profile?.description || "",
        });
      } catch (e: unknown) {
        const statusCode = (e as any)?.statusCode || (e as any)?.status || (e as any)?.response?.status;
        if (statusCode === 401) {
          return;
        }
        // Fallback to session info on error
        setData((prev) => ({
          ...prev,
          username: user?.username || prev.username,
          email: user?.email || prev.email,
          role: user?.role || prev.role,
        }));
        const message = e instanceof Error ? e.message : "Không tải được profile";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [status, user?.id]);

  // ===== Chọn avatar (preview) =====
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, avatar_url: preview }));
  };

  // ======= LƯU HỒ SƠ GIỐNG EditInfor =======
  const handleSave = async () => {
    if (!user?.id) return;

    await toast.promise(
      (async () => {
        let avatarUrl = data.avatar_url;

        // Nếu có upload avatar mới
        if (selectedFile) {
          avatarUrl = await api.users.uploadAvatar(user.id, selectedFile);
        }

        await api.users.updateProfile(user.id, {
          username: data.username,
          phone_number: data.phone_number,
          email: data.email,
          avatar_url: avatarUrl,
          role: data.role,
          description: data.description,
        });

        setSelectedFile(null);
      })(),
      {
        loading: "Đang lưu...",
        success: "Đã cập nhật hồ sơ!",
        error: "Lỗi khi cập nhật!",
      }
    );
  };

  if (loading) return <div className="text-center py-10 text-sm text-muted-foreground">Đang tải hồ sơ...</div>;

  const initial = data.username ? data.username.trim()[0].toUpperCase() : "U";

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="h-5 w-5 text-primary" /> Hồ sơ cá nhân
        </CardTitle>
        <CardDescription>
          Cập nhật thông tin chi tiết hiển thị của bạn trên hệ thống CourseDemy.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/40">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center text-xl font-extrabold text-muted-foreground shadow-sm">
              {data.avatar_url ? (
                <img
                  src={data.avatar_url}
                  alt="Avatar người dùng"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center sm:items-start">
            <Label className="text-sm font-semibold text-foreground">Ảnh đại diện</Label>
            <p className="text-xs text-muted-foreground mb-1 text-center sm:text-left">
              Hỗ trợ PNG, JPG, GIF kích thước tối đa 2MB.
            </p>
            <div className="flex items-center gap-2">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar"
                className="inline-flex h-9 items-center justify-center rounded-full border border-border/80 bg-background/50 hover:bg-accent/80 hover:text-foreground px-4 text-xs font-semibold cursor-pointer shadow-sm transition-all duration-300 active:scale-95"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Tải ảnh lên
              </label>

              {data.avatar_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setData((prev) => ({ ...prev, avatar_url: "" }))}
                  className="h-9 rounded-full px-4 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-300 active:scale-95"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Xoá ảnh
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Input Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Họ và tên</Label>
            <Input
              value={data.username}
              className="bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Email</Label>
            <Input
              type="email"
              value={data.email}
              className="bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Số điện thoại</Label>
            <Input
              type="text"
              value={data.phone_number}
              className="bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
              onChange={(e) => setData({ ...data, phone_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Vai trò</Label>
            <Input
              type="text"
              value={data.role}
              className="bg-background border-border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/45"
              onChange={(e) => setData({ ...data, role: e.target.value })}
              disabled
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-foreground">Giới thiệu về bạn</Label>
            <textarea
              className="min-h-[100px] border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 rounded-xl w-full p-4 text-sm transition-all duration-300 placeholder:text-muted-foreground/60"
              value={data.description}
              placeholder="Nhập một vài dòng giới thiệu về bản thân bạn..."
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-4 border-t border-border/40">
          <Button onClick={handleSave} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
            Lưu thay đổi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
