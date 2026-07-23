package com.coursedemy.course.util;

import com.coursedemy.course.repository.UserCourseRepository;
import com.coursedemy.course.repository.UserRepository;

public class FindUserCourseUtils {
    
    // Hàm utils bắt lỗi khi không có user trong khoá học
    public static void getUserCourseOrThrow(
            UserCourseRepository userCourseRepository,
            Long userId,
            Long courseId
    ) {
        userCourseRepository
                .findByUserEntity_IdAndCourseEntity_Id(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Người dùng không thuộc khoá học này"));
    }
}
