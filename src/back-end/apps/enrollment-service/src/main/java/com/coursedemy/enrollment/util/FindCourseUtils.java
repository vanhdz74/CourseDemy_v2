package com.coursedemy.enrollment.util;

import com.coursedemy.enrollment.entity.CourseEntity;
import com.coursedemy.enrollment.repository.CourseRepository;

public class FindCourseUtils {
    // Static method, tái sử dụng được ở nhiều chỗ
    public static CourseEntity getCourseOrThrow(CourseRepository courseRepository, Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));
    }
}
