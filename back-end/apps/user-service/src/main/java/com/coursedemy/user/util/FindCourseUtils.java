package com.coursedemy.user.util;

import com.coursedemy.user.entity.CourseEntity;
import com.coursedemy.user.repository.CourseRepository;

public class FindCourseUtils {
    // Static method, tái sử dụng được ở nhiều chỗ
    public static CourseEntity getCourseOrThrow(CourseRepository courseRepository, Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));
    }
}
