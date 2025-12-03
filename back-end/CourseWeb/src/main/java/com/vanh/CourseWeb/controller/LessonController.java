package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    // POST: Thêm vào 1 lesson mới vào khoá học
    @PostMapping("/lesson/course/{courseId}")
    public ResponseEntity<?> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonDTO lessonDTO,
            Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.createLesson(courseId, lessonDTO, teacherId);
            return ResponseEntity.ok(Map.of(
                    "message", "Thêm phần mới thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE: Xoá 1 lesson theo id
    @DeleteMapping("/lesson/{id}")
    public ResponseEntity<?> deleteLessonById(@PathVariable Long id,
                                              Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.deleteLessonById(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Xoá thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Cập nhật 1 lesson
    @PutMapping("/lesson/{id}")
    public ResponseEntity<?> updateLessonById(@PathVariable Long id,
                                              @RequestBody LessonDTO lessonDTO,
                                              Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.updateLessonById(id, lessonDTO);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET: lấy sublesson theo lesson_id
    @GetMapping("/sublessons/lesson/{id}")
    public List<SubLessonDTO> getSubLessonsByLessonId(@PathVariable Long id) {
        List<SubLessonDTO> result = lessonService.getSubLessonsByLessonId(id);
        return result;
    }

    // POST: thêm sublesson mới vào lesson trống
    @PostMapping("/sublesson/lesson/{lessonId}")
    public ResponseEntity<?> createSubLesson(
            @PathVariable Long lessonId,
            @RequestBody SubLessonDTO subLessonDTO,
            Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.createSubLesson(lessonId, subLessonDTO, teacherId);
            return ResponseEntity.ok(Map.of(
                    "message", "Thêm phần mới thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
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

    // DELETE: xoá sublesson theo id
    @DeleteMapping("/sublesson/{id}")
    public ResponseEntity<?> deleteSubLessonById(@PathVariable Long id, Authentication authentication) {
        try {
            // Lấy thông tin người dùng từ token (JWT)
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.deleteSubLessonById(id, teacherId);
            return ResponseEntity.ok(Map.of("message", "Xoá bài học thành công"));
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: thêm sublesson phía trước hoặc phía sau một sublesson khác
    @PostMapping("/lesson/{lessonId}/sublesson/add-relative")
    public ResponseEntity<?> addSubLessonRelative(
            @PathVariable Long lessonId,
            @RequestParam(required = false) Long referenceSubLessonId,
            @RequestParam(defaultValue = "true") boolean insertAfter,
            @RequestBody SubLessonDTO dto,
            Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            var newSub = lessonService.addSubLessonRelative(lessonId, referenceSubLessonId, insertAfter, dto, teacherId);
            return ResponseEntity.ok(Map.of(
                    "message", "Thêm sublesson thành công"
//                    "subLessonId", newSub.getId(),
//                    "orderIndex", newSub.getOrderIndex()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Cập nhật thứ tự order_index của bài học
    @PutMapping("/lesson/reorder")
    public ResponseEntity<?> updateLessonReorder(
            @RequestBody List<Map<String, Object>> lessonReorder,
            Authentication authentication
    ) {
        try {
            UserEntity userDetails = (UserEntity) authentication.getPrincipal();
            Long teacherId = userDetails.getId();

            lessonService.updateLessonReorder(lessonReorder, teacherId);
            return ResponseEntity.ok(Map.of(
                    "message", "Thay đổi thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
