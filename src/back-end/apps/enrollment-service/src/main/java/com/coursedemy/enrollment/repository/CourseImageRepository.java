package com.coursedemy.enrollment.repository;

import com.coursedemy.enrollment.entity.CourseImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseImageRepository extends JpaRepository<CourseImageEntity, Long> {
    Optional<CourseImageEntity> findByCourseEntity_Id(long id);
}
