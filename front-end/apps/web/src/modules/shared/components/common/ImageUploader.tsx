"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";

export interface ImageUploaderProps {
  value?: string | File | null; // URL ảnh hiện tại
  onChange?: (file: File | null) => void; // Trả file ra ngoài
  label?: string; // Label hiển thị
  width?: number; // Label hiển thị
  height?: number; // Chiều cao khung preview
}

export default function ImageUploader({
  value = null,
  onChange = () => {},
  label = "Tải ảnh lên",
  width = 100,
  height = 100,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    } else {
      setPreview(value);
    }
  }, [value]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    onChange(file);
  };

  return (
    <div className="w-full">
      {/* IMAGE PREVIEW */}
      <div
        className="border rounded-md overflow-hidden bg-gray-100"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="preview"
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Chưa có ảnh
          </div>
        )}
      </div>

      {/* INPUT UPLOAD */}
      <div className="mt-3">
        <label className="font-medium">{label}</label>
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
          "
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}
