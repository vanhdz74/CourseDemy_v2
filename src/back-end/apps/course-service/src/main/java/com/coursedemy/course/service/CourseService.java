package com.coursedemy.course.service;

import com.coursedemy.course.dto.CourseDTO;
import com.coursedemy.course.dto.CourseDetailDTO;
import com.coursedemy.course.dto.RevenueDTO;
import com.coursedemy.course.dto.response.PageResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CourseService {
    PageResponse<CourseDTO> findAllHave(@RequestParam Map<String, String> params);

    List<CourseDTO> getCoursesByCategoryId(Long categoryId);

    List<CourseDTO> getCoursesByUserId(Long id);

    CourseDTO getCourseById(Long id);

    CourseDetailDTO getCourseDetailByCourseId(Long id);

    void addCourse(CourseDTO courseDTO);

    void deleteCourseById(Long id);

    void updateCourse(long id, CourseDTO courseDTO);

    void updateFullCourse(long id, JsonNode body);

    String uploadImg(Long id, MultipartFile file) throws IOException;

    Double getAverageRatingByCourseId(Long courseId);

    List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue();

    public void increaseQuantity(Long courseId);

    public void decreaseQuantity(Long courseId);
}
