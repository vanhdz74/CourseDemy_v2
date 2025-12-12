"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

export default function ProfileSetting() {
  const { get, put, post } = useApi();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    profileName: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    role: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //  LẤY PROFILE TỪ API GIỐNG EditInfor
  useEffect(() => {
    const userObj = localStorage.getItem("user");
    if (!userObj) {
      toast.error("Không tìm thấy user!");
      return;
    }

    const { id } = JSON.parse(userObj);

    (async () => {
      try {
        const res = await get(`/user/${id}`);
        setData({
          profileName: res.username,
          email: res.email,
          avatar_url: res.avatar_url,
          phone_number: res.phone_number,
          role: res.role,
          description: res.description,
        });
      } catch (e: any) {
        toast.error(e.message || "Không tải được profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===== Chọn avatar (preview) =====
  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, avatar_url: preview }));
  };

  // ======= LƯU HỒ SƠ GIỐNG EditInfor =======
  const handleSave = async () => {
    const userObj = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userObj || !token) return;

    const { id } = JSON.parse(userObj);

    await toast.promise(
      (async () => {
        let avatarUrl = data.avatar_url;

        // Nếu có upload avatar mới
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadRes = await post(`/user/upload-avatar/${id}`, formData);
          avatarUrl = uploadRes.url;
        }

        console.log(data);

        await put(`/user/update/${id}`, {
          username: data.profileName,
          phone_number: data.phone_number,
          email: data.email,
          avatar_url: avatarUrl,
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

  if (loading) return <div>Đang tải...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={18} /> Hồ sơ
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 mx-auto mb-5">
          <Label>Avatar</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {data.avatar_url ? (
                <img
                  src={data.avatar_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">
                  VA
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label
                htmlFor="avatar"
                className="px-3 py-2 border rounded-lg cursor-pointer"
              >
                Tải ảnh lên
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setData((prev) => ({ ...prev, avatar_url: "" }))}
              >
                Xoá
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2">Họ và tên</Label>
          <Input
            value={data.profileName}
            onChange={(e) => setData({ ...data, profileName: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2">Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2">Số điện thoại</Label>
          <Input
            type="email"
            value={data.phone_number}
            onChange={(e) => setData({ ...data, phone_number: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2">Vai trò</Label>
          <Input
            type="email"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-2">Giới thiệu về bạn</Label>
          <textarea
            className="border rounded-sm w-full p-4"
            value={data.description}
            placeholder="Nhập 1 vài thông tin của bạn"
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 mt-4 flex justify-end">
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      </CardContent>
    </Card>
  );
}
