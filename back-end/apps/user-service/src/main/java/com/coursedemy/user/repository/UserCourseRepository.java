package com.coursedemy.user.repository;

import com.coursedemy.user.entity.UserCourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCourseRepository
        extends JpaRepository<UserCourseEntity, Long> {

    /**
     * Lấy tất cả khóa học mà User đã đăng ký.
     */
    List<UserCourseEntity> findByUserEntity_Id(Long userId);

    /**
     * Kiểm tra User đã đăng ký Course chưa.
     */
    boolean existsByUserEntity_IdAndCourseId(
            Long userId,
            Long courseId
    );

    /**
     * Lấy tất cả User đã đăng ký Course.
     */
    List<UserCourseEntity> findByCourseId(
            Long courseId
    );

    /**
     * Tìm UserCourse theo User và Course.
     */
    Optional<UserCourseEntity> findByUserEntity_IdAndCourseId(
            Long userId,
            Long courseId
    );

    /**
     * Xóa User khỏi Course.
     */
    void deleteByUserEntity_IdAndCourseId(
            Long userId,
            Long courseId
    );
}