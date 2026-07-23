package com.coursedemy.user.repository;

import com.coursedemy.user.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByCourseEntity_Id(Long courseId);
}
