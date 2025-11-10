"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (data: any) => void;
  defaultValues?: { [key: string]: any };
  sublessonId?: number; // 👈 thêm prop để biết bài nào upload
}

const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  defaultValues = {},
  sublessonId,
}: FormDialogProps) => {
  const token = useAppSelector((state) => state.auth.token);

  // Các trường trong form
  const [formData, setFormData] = useState({
    title: defaultValues.title || "",
    video_file: null as File | null,
  });

  const [uploading, setUploading] = useState(false);

  // Xử lý phần dữ liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, video_file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit dữ liệu
  const handleSubmit = async () => {
    setUploading(true);
    try {
      let videoUrl;

      // Nếu có file => upload lên BE
      if (formData.video_file && sublessonId) {
        const uploadData = new FormData();
        uploadData.append("file", formData.video_file);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload-video/${sublessonId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: uploadData,
          }
        );

        if (!res.ok) throw new Error("Upload video thất bại");

        const result = await res.json();
        videoUrl = result.url;
      }

      // Trả dữ liệu về component cha
      onSubmit({
        title: formData.title,
        video_url: videoUrl,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi upload video!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Tên bài học</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tên bài học..."
            />
          </div>

          <div>
            <Label htmlFor="video_file">Tải video từ máy</Label>
            <Input
              id="video_file"
              type="file"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Đang tải..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
