package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CourseDTO;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // GET: Lấy danh sách khoá học theo id teacher
    @GetMapping("/courses/teacher/{id}")
    public List<CourseDTO> getCoursesByTeacherId(@PathVariable(name = "id") Long id) {
        return courseService.getCoursesByTeacherId(id);
    }

    // GET: Lấy khoá học theo id
    @GetMapping("/course/{id}")
    public CourseDTO getCourseById(@PathVariable(name = "id") Long id) {
        return courseService.getCourseById(id);
    }

    // GET: Lấy danh sách các khoá học mà student đã đăng ký
    @GetMapping("/courses/student/{id}")
    public ResponseEntity<List<CourseDTO>> getCoursesByStudentId(@PathVariable Long id) {
        List<CourseDTO> courses = courseService.getCoursesByStudentId(id);
        return ResponseEntity.ok(courses);
    }
}
