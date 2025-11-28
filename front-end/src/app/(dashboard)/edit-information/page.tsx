"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/userType";

import { useApi } from "@/hooks/useApi";

export default function EditInfor() {
  const { put, get, post } = useApi();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>({
    username: "",
    email: "",
    phone_number: "",
    avatar_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // <-- file tạm
  useEffect(() => {
    const userObj = localStorage.getItem("user");
    if (!userObj) {
      setLoading(false);
      toast.error("Không tìm thấy thông tin user");
      return;
    }

    const { id } = JSON.parse(userObj);

    (async () => {
      try {
        const data = await get(`/user/${id}`);
        setUser(data);
      } catch (err: any) {
        toast.error(err.message || "Lỗi khi tải thông tin");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Chỉ chọn file, chưa upload
  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    // Hiển thị preview ảnh tạm
    const previewURL = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatar_url: previewURL }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id as keyof UserProfile;
    setUser((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userObj: any = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userObj || !token) return;
    const { id } = JSON.parse(userObj);

    await toast.promise(
      (async () => {
        let avatarUrl = user.avatar_url;

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const uploadRes = await post(`/user/upload-avatar/${id}`, formData);
          avatarUrl = uploadRes.url;
        }

        await put(`/user/update/${id}`, { ...user, avatar_url: avatarUrl });
        setEditMode(false);
        setSelectedFile(null);
      })(),
      {
        loading: "Đang cập nhật thông tin...",
        success: "Cập nhật hồ sơ thành công!",
        error: "Cập nhật thất bại!",
      }
    );
  };

  if (loading)
    return (
      <div className="mt-[100px] text-center">⏳ Đang tải thông tin...</div>
    );

  return (
    <div className="p-[var(--paddingDiv)] mt-[var(--navHeight)] mx-auto lg:w-[var(--wBodyLG)]">
      <Button
        className="mb-[10px]"
        onClick={() => setEditMode((prev) => !prev)}
      >
        {editMode ? "Xem thông tin cá nhân" : "Sửa thông tin cá nhân"}
      </Button>

      <Card className="w-full mx-auto">
        <CardContent>
          <form className="w-full p-[20px]" onSubmit={handleSave}>
            {editMode ? (
              <div className="mx-auto md:flex mt-5">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden mx-auto relative">
                  <Avatar className="cursor-pointer object-cover w-full h-full">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <label className="absolute bottom-0 bg-black/50 text-white text-xs p-1 cursor-pointer">
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="flex-1 md:ml-[50px]">
                  <div className="grid gap-2 mb-[15px]">
                    <Label htmlFor="username">Họ tên</Label>
                    <Input
                      id="username"
                      type="text"
                      value={user.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2 mb-[15px]">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2 mb-[15px]">
                    <Label htmlFor="phone_number">Số điện thoại</Label>
                    <Input
                      id="phone_number"
                      type="text"
                      value={user.phone_number || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto md:flex mt-5">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden mx-auto relative">
                  <Avatar className="object-cover w-full h-full">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 md:ml-[50px]">
                  <div className="font-bold text-red-500">{user.username}</div>
                  <div>Email: {user.email}</div>
                  <div>Số điện thoại: {user.phone_number || "Chưa có"}</div>
                </div>
              </div>
            )}
          </form>
        </CardContent>

        {editMode && (
          <CardFooter className="flex gap-2">
            <div className="flex-1"></div>
            <Button type="button" onClick={() => setEditMode(false)}>
              Huỷ
            </Button>
            <Button type="submit" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
