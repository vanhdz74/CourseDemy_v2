package com.coursedemy.gateway.repository;

import com.coursedemy.gateway.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByCourseEntity_Id(Long courseId);
}
