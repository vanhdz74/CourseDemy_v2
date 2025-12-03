package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CourseDTO;
import com.vanh.CourseWeb.dto.CourseDetailDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // GET: Lấy danh sách courses theo các trường nhập vào
    @GetMapping("/courses/search")
    public Map<String, Object> getCoursesByKeyword(@RequestParam Map<String, String> params) {
        return courseService.findAllHave(params);
    }

    // GET: Lấy danh sách courses theo cate_id
    @GetMapping("/courses/category/{id}")
    public List<CourseDTO> getCoursesByCategoryId(@PathVariable(name = "id") Integer id) {
        return courseService.getCoursesByCategoryId(id);
    }

    // GET: Lấy danh sách khoá học theo id user (3 role)
    @GetMapping("/courses/user/{id}")
    public List<CourseDTO> getCoursesByUserId(@PathVariable(name = "id") Long id) {
        return courseService.getCoursesByUserId(id);
    }

    // GET: Lấy khoá học theo id
    @GetMapping("/course/{id}")
    public CourseDTO getCourseById(@PathVariable(name = "id") Long id) {
        return courseService.getCourseById(id);
    }

    // GET: Lấy danh sách chi tiết khoá học
    @GetMapping("/course-detail/{courseId}")
    public ResponseEntity<?> getCourseDetailByCourseId(
            @PathVariable Long courseId
    ) {
        try {
            CourseDetailDTO courseDetail = courseService.getCourseDetailByCourseId(courseId);
            return ResponseEntity.ok(courseDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Thêm khoá học
    @PostMapping("/course")
    public ResponseEntity<?> addCourse(
            @RequestBody CourseDTO courseDTO
    ) {
        try {
            courseService.addCourse(courseDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm khoá học mới thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE: Xoá khoá học theo id
    @DeleteMapping("/course/{id}")
    public ResponseEntity<?> deleteCourseById(
            @PathVariable Long id
    ) {
        try {
            courseService.deleteCourseById(id);
            return ResponseEntity.ok(Map.of("message", "Xoá khoá học thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Cập nhật khoá học
    @PutMapping("/course/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable long id,
            @RequestBody CourseDTO courseDTO
    ) {
        try {
            courseService.updateCourse(id, courseDTO);
            return ResponseEntity.ok(Map.of("message", "Cập nhật khoá học thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT: Cập nhật toàn bộ course, course-detail
    @PutMapping("/course-detail/m1/{id}")
    public ResponseEntity<?> updateFullCourse(
            @PathVariable long id,
            @RequestBody CourseDetailDTO courseDetailDTO
    ) {
        try {
            courseService.updateFullCourse(id, courseDetailDTO);
            return ResponseEntity.ok(Map.of("message", "Đã lưu thay đổi"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Cập nhật upload ảnh ngừoi dùng
    @PostMapping("/upload-course-img/{id}")
    public ResponseEntity<?> uploadImg(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String newUrl = courseService.uploadImg(id, file);
            return ResponseEntity.ok(Map.of("url", newUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload thất bại: " + e.getMessage());
        }
    }

}
