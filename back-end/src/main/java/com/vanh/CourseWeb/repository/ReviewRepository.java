package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByCourseEntity_Id(Long courseId);
}
