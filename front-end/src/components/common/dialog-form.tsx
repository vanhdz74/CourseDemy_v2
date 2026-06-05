"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { uploadVideo } from "@/services/courses";
import { SubLesson } from "@/types/lessonType";

type SubLessonFormValues = Partial<Pick<SubLesson, "title" | "video_url">>;

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (data: SubLessonFormValues) => void;
  defaultValues?: SubLessonFormValues;
  sublessonId?: number;
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
  const [formData, setFormData] = useState({
    title: defaultValues.title || "",
    video_file: null as File | null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData({
      title: defaultValues.title || "",
      video_file: null,
    });
  }, [defaultValues.title, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, video_file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const payload: SubLessonFormValues = {};
      const nextTitle = formData.title.trim();
      const currentTitle = defaultValues.title?.trim() || "";

      if (nextTitle && nextTitle !== currentTitle) {
        payload.title = nextTitle;
      }

      let videoUrl: string | undefined;
      if (formData.video_file && sublessonId) {
        videoUrl = await uploadVideo(sublessonId, formData.video_file);
        payload.video_url = videoUrl;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("Chưa có thay đổi để lưu.");
        return;
      }

      onSubmit(payload);
      onOpenChange(false);
    } catch {
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
