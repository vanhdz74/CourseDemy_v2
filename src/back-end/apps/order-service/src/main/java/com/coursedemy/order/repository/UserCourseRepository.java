package com.coursedemy.order.repository;

import com.coursedemy.order.dto.UserDTO;
import com.coursedemy.order.entity.UserCourseEntity;
import com.coursedemy.order.entity.UserEntity;
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
