package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findAllByIdIn(List<Long> courseIds);
}
