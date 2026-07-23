package com.coursedemy.gateway.repository;

import com.coursedemy.gateway.dto.UserDTO;
import com.coursedemy.gateway.entity.UserCourseEntity;
import com.coursedemy.gateway.entity.UserEntity;
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
