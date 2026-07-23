package com.coursedemy.user.util;

import com.coursedemy.user.repository.UserCourseRepository;
import com.coursedemy.user.repository.UserRepository;

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
