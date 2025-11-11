package com.vanh.CourseWeb.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Upload ảnh
    public Map<String, String> uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "folder", "upload_img"
                )
        );
        return Map.of(
                "url", uploadResult.get("secure_url").toString(),
                "public_id", uploadResult.get("public_id").toString()
        );
    }

    // Upload video lên Cloudinary
    public Map<String, String> uploadVideo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống!");
        }

        if (!file.getContentType().startsWith("video/")) {
            throw new IllegalArgumentException("Chỉ được upload file video!");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "video",
                            "folder", "upload_video"
                    )
            );

            return Map.of(
                    "url", uploadResult.get("secure_url").toString(),
                    "public_id", uploadResult.get("public_id").toString()
            );
        } catch (Exception e) {
            throw new IOException("Lỗi upload video lên Cloudinary: " + e.getMessage(), e);
        }
    }


    // Xoá file theo public_id
    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
