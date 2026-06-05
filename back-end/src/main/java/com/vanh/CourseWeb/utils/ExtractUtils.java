package com.vanh.CourseWeb.utils;

import java.net.URI;

public class ExtractUtils {

    /**
     * Trích xuất public_id từ URL Cloudinary
     * Ví dụ:
     * https://res.cloudinary.com/demo/image/upload/v1696949213/upload_img/abc123xyz.jpg
     * → public_id = "upload_img/abc123xyz"
     */
    public static String extractPublicIdFromUrl(String url) {
        try {
            if (url == null || url.isEmpty()) return null;

            URI uri = new URI(url);
            String path = uri.getPath(); // /demo/image/upload/v1696949213/upload_img/abc123xyz.jpg
            String[] parts = path.split("/");

            // Tìm vị trí của "upload" trong đường dẫn
            int uploadIndex = -1;
            for (int i = 0; i < parts.length; i++) {
                if (parts[i].equals("upload")) {
                    uploadIndex = i;
                    break;
                }
            }

            if (uploadIndex == -1) return null;

            // Ghép tất cả phần sau "upload/vxxxx" lại thành public_id
            StringBuilder sb = new StringBuilder();
            for (int i = uploadIndex + 2; i < parts.length; i++) {
                sb.append(parts[i]);
                if (i < parts.length - 1) sb.append("/");
            }

            // Xoá phần mở rộng .jpg, .png...
            String publicId = sb.toString();
            int dotIndex = publicId.lastIndexOf('.');
            if (dotIndex != -1) {
                publicId = publicId.substring(0, dotIndex);
            }

            return publicId;

        } catch (Exception e) {
            return null;
        }
    }
}
