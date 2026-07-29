package com.coursedemy.course.controller;

import com.coursedemy.course.dto.CourseDTO;
import com.coursedemy.course.dto.CourseDetailDTO;
import com.coursedemy.course.dto.RevenueDTO;
import com.coursedemy.course.dto.response.ApiResponse;
import com.coursedemy.course.dto.response.PageResponse;
import com.coursedemy.course.entity.CourseEntity;
import com.coursedemy.course.service.CourseService;
import com.coursedemy.course.util.FindCourseUtils;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // GET: Lấy danh sách courses theo các trường nhập vào
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<CourseDTO>>> getCoursesByKeyword(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.findAllHave(params)));
    }

    // GET: Lấy danh sách courses theo cate_id
    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCoursesByCategoryId(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCoursesByCategoryId(id)));
    }

    // GET: Lấy danh sách khoá học theo id user (3 role)
    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCoursesByUserId(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCoursesByUserId(id)));
    }

    // GET: Lấy khoá học theo id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCourseById(id)));
    }

    // GET: Lấy danh sách chi tiết khoá học
    @GetMapping("/course-detail/{courseId}")
    public ResponseEntity<ApiResponse<CourseDetailDTO>> getCourseDetailByCourseId(
            @PathVariable Long courseId
    ) {
        CourseDetailDTO courseDetail = courseService.getCourseDetailByCourseId(courseId);
        return ResponseEntity.ok(ApiResponse.ok(courseDetail));
    }

    // POST: Thêm khoá học
    @PostMapping("/")
    public ResponseEntity<ApiResponse<Void>> addCourse(
            @RequestBody CourseDTO courseDTO
    ) {
        courseService.addCourse(courseDTO);
        return ResponseEntity.ok(ApiResponse.ok("Thêm khoá học mới thành công", null));
    }

    // DELETE: Xoá khoá học theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourseById(
            @PathVariable Long id
    ) {
        courseService.deleteCourseById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xoá khoá học thành công", null));
    }

    // PUT: Cập nhật khoá học
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateCourse(
            @PathVariable long id,
            @RequestBody CourseDTO courseDTO
    ) {
        courseService.updateCourse(id, courseDTO);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật khoá học thành công", null));
    }

    // PUT: Cập nhật toàn bộ course, course-detail
    @PutMapping("/course-detail/m1/{id}")
    public ResponseEntity<ApiResponse<Void>> updateFullCourse(
            @PathVariable long id,
            @RequestBody JsonNode body
    ) {
        courseService.updateFullCourse(id, body);
        return ResponseEntity.ok(ApiResponse.ok("Đã lưu thay đổi", null));
    }

    // POST: Cập nhật upload ảnh ngừoi dùng
    @PostMapping("/upload-course-img/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImg(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        String newUrl = courseService.uploadImg(id, file);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", newUrl)));
    }

    // GET: Lấy top 5 khoá học có doanh thu cao nhất
    @GetMapping("/revenue/top-courses")
    public ResponseEntity<ApiResponse<List<RevenueDTO.TopCourseDTO>>> getTopCoursesRevenue() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getTopCoursesRevenue()));
    }
    @PutMapping("/{courseId}/quantity/increase")
    public ResponseEntity<Void> increaseQuantity(
            @PathVariable Long courseId
    ) {

        courseService.increaseQuantity(courseId);

        return ResponseEntity.ok().build();
    }
    @PutMapping("/{courseId}/quantity/decrease")
    public ResponseEntity<Void> decreaseQuantity(
            @PathVariable Long courseId
    ) {

        courseService.decreaseQuantity(courseId);

        return ResponseEntity.ok().build();
    }


}
