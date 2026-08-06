package com.coursedemy.enrollment.repository;

import com.coursedemy.enrollment.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByCourseEntity_Id(Long courseId);
}
