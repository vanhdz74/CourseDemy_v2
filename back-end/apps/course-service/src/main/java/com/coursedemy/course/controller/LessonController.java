package com.coursedemy.course.controller;

import com.coursedemy.course.dto.LessonDTO;
import com.coursedemy.course.dto.SubLessonDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.course.entity.UserEntity;
import com.coursedemy.course.service.LessonService;
import lombok.RequiredArgsConstructor;
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

    // GET: lấy ra danh sách bài học theo course_id
    @GetMapping("/lessons/course/{id}")
    public ResponseEntity<ApiResponse<List<LessonDTO>>> getLessonsByCourseId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.getLessonsByCourseId(id)));
    }

    // POST: Thêm vào 1 lesson mới vào khoá học
    @PostMapping("/lesson/course/{courseId}")
    public ResponseEntity<ApiResponse<Void>> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonDTO lessonDTO,
            Authentication authentication
    ) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.createLesson(courseId, lessonDTO, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Thêm phần mới thành công", null));
    }

    // DELETE: Xoá 1 lesson theo id
    @DeleteMapping("/lesson/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLessonById(@PathVariable Long id,
                                                              Authentication authentication
    ) {
        lessonService.deleteLessonById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xoá thành công", null));
    }

    // PUT: Cập nhật 1 lesson
    @PutMapping("/lesson/{id}")
    public ResponseEntity<ApiResponse<Void>> updateLessonById(@PathVariable Long id,
                                                              @RequestBody LessonDTO lessonDTO,
                                                              Authentication authentication
    ) {
        lessonService.updateLessonById(id, lessonDTO);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", null));
    }

    // GET: lấy sublesson theo lesson_id
    @GetMapping("/sublessons/lesson/{id}")
    public ResponseEntity<ApiResponse<List<SubLessonDTO>>> getSubLessonsByLessonId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.getSubLessonsByLessonId(id)));
    }

    // GET: lấy thông tin một sublesson theo id
    @GetMapping("/sublesson/{id}")
    public ResponseEntity<ApiResponse<SubLessonDTO>> getSubLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.getSubLessonById(id)));
    }

    // POST: thêm sublesson mới vào lesson trống
    @PostMapping("/sublesson/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> createSubLesson(
            @PathVariable Long lessonId,
            @RequestBody SubLessonDTO subLessonDTO,
            Authentication authentication
    ) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.createSubLesson(lessonId, subLessonDTO, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Thêm phần mới thành công", null));
    }


    // PUT: Update dữ liệu cho sublesson theo id
    @PutMapping("/sublesson/update/{id}")
    public ResponseEntity<ApiResponse<Void>> updateSublesson(@PathVariable Long id, @RequestBody SubLessonDTO dto) {
        lessonService.updateSublessonById(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin bài học thành công", null));
    }

    // POST: Tải video chọn lên cloudinary
    @PostMapping("/upload-video/{sublesson_id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadVideo(
            @PathVariable Long sublesson_id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        String newUrl = lessonService.uploadVideo(sublesson_id, file);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", newUrl)));
    }

    // DELETE: xoá sublesson theo id
    @DeleteMapping("/sublesson/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubLessonById(@PathVariable Long id, Authentication authentication) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.deleteSubLessonById(id, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Xoá bài học thành công", null));
    }

    // POST: thêm sublesson phía trước hoặc phía sau một sublesson khác
    @PostMapping("/lesson/{lessonId}/sublesson/add-relative")
    public ResponseEntity<ApiResponse<Void>> addSubLessonRelative(
            @PathVariable Long lessonId,
            @RequestParam(required = false) Long referenceSubLessonId,
            @RequestParam(defaultValue = "true") boolean insertAfter,
            @RequestBody SubLessonDTO dto,
            Authentication authentication
    ) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.addSubLessonRelative(lessonId, referenceSubLessonId, insertAfter, dto, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Thêm sublesson thành công", null));
    }

    // PUT: Cập nhật thứ tự order_index của bài học
    @PutMapping("/lesson/reorder")
    public ResponseEntity<ApiResponse<Void>> updateLessonReorder(
            @RequestBody List<Map<String, Object>> lessonReorder,
            Authentication authentication
    ) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.updateLessonReorder(lessonReorder, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Thay đổi thành công", null));
    }

    // PUT: Cập nhật thứ tự order_index của bài học con
    @PutMapping("/sublesson/reorder")
    public ResponseEntity<ApiResponse<Void>> updateSubLessonReorder(
            @RequestBody List<Map<String, Object>> subLessonReorder,
            Authentication authentication
    ) {
        UserEntity userDetails = (UserEntity) authentication.getPrincipal();
        Long teacherId = userDetails.getId();
        lessonService.updateSubLessonReorder(subLessonReorder, teacherId);
        return ResponseEntity.ok(ApiResponse.ok("Thay đổi thành công", null));
    }

    // GET: Lấy nội dung khoá học (bài học lesson, sub lesson) public
    @GetMapping("/public/lessons/course/{id}")
    public ResponseEntity<ApiResponse<List<LessonDTO>>> getPublicLessons(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.getLessonsByCourseId(id)));
    }

    // GET: lấy sublesson theo lesson_id
    @GetMapping("/public/sublessons/lesson/{id}")
    public ResponseEntity<ApiResponse<List<SubLessonDTO>>> getPublicSubLessons(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lessonService.getPublicSubLessons(id)));
    }
}
