package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;
    private final CloudinaryService cloudinaryService;

    // GET: lấy ra danh sách bài học theo course_id
    @GetMapping("/lessons/course/{id}")
    public List<LessonDTO> getLessonsByCourseId(@PathVariable Long id) {
        List<LessonDTO> result = lessonService.getLessonsByCourseId(id);
        return result;
    }

    // GET
    @GetMapping("/sublessons/lesson/{id}")
    public List<SubLessonDTO> getSubLessonsByLessonId(@PathVariable Long id) {
        List<SubLessonDTO> result = lessonService.getSubLessonsByLessonId(id);
        return result;
    }

    // PUT: Update dữ liệu cho sublesson theo id
    @PutMapping("/sublesson/update/{id}")
    public ResponseEntity<?> updateSublesson(@PathVariable Long id, @RequestBody SubLessonDTO dto) {
        lessonService.updateSublessonById(id, dto);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin bài học thành công"));
    }

    // POST: Tải video chọn lên cloudinary
    @PostMapping("/upload-video/{sublesson_id}")
    public ResponseEntity<?> uploadVideo(
            @PathVariable Long sublesson_id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String newUrl = lessonService.uploadVideo(sublesson_id, file);
            return ResponseEntity.ok(Map.of("url", newUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
