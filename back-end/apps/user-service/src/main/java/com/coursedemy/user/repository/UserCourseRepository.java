package com.coursedemy.user.repository;

import com.coursedemy.user.dto.UserDTO;
import com.coursedemy.user.entity.UserCourseEntity;
import com.coursedemy.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCourseRepository extends JpaRepository<UserCourseEntity, Long> {
    List<UserCourseEntity> findByUserEntity_Id(Long id);

    boolean existsByUserEntity_IdAndCourseEntity_Id(Long userId, Long courseId);

    List<UserCourseEntity> findByCourseEntity_Id(Long courseId);

    Optional<Object> findByUserEntity_IdAndCourseEntity_Id(Long userId, Long courseId);

    void deleteByUserEntity_IdAndCourseEntity_Id(Long userId, Long courseId);
}
