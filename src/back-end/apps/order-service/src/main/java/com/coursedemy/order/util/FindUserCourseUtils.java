package com.coursedemy.order.util;

import com.coursedemy.order.repository.UserCourseRepository;
import com.coursedemy.order.repository.UserRepository;

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
