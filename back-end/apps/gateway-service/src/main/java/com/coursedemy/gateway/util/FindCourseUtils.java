package com.coursedemy.gateway.util;

import com.coursedemy.gateway.entity.CourseEntity;
import com.coursedemy.gateway.repository.CourseRepository;

public class FindCourseUtils {
    // Static method, tái sử dụng được ở nhiều chỗ
    public static CourseEntity getCourseOrThrow(CourseRepository courseRepository, Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));
    }
}
