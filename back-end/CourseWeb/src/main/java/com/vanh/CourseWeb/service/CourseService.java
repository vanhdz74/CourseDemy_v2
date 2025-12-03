package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.CourseDTO;
import com.vanh.CourseWeb.dto.CourseDetailDTO;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface CourseService {
    Map<String, Object> findAllHave(@RequestParam Map<String, String> params);

    List<CourseDTO> getCoursesByCategoryId(Integer categoryId);

    List<CourseDTO> getCoursesByUserId(Long id);

    CourseDTO getCourseById(Long id);

    CourseDetailDTO getCourseDetailByCourseId(Long id);

    void addCourse(CourseDTO courseDTO);

    void deleteCourseById(Long id);

    void updateCourse(long id, CourseDTO courseDTO);

    void updateFullCourse(long id, CourseDetailDTO courseDetailDTO);

    String uploadImg(Long id, MultipartFile file) throws IOException;
}
