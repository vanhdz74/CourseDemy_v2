package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.CourseDTO;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface CourseService {
    Map<String, Object> findAllHave(@RequestParam Map<String, String> params);

    List<CourseDTO> getCoursesByCategoryId(Integer categoryId);

    List<CourseDTO> getCoursesByTeacherId(Long categoryId);

    CourseDTO getCourseById(Long id);

    List<CourseDTO> getCoursesByStudentId(Long studentId);
}
