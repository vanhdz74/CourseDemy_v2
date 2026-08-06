package com.coursedemy.course.repository;

import com.coursedemy.course.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseEntity, Long>,
        JpaSpecificationExecutor<CourseEntity> {
    List<CourseEntity> findByCategoryId(Long categoryId);

    CourseEntity findByTitle(String title);

    boolean existsByTitleIgnoreCase(String title);

    List<CourseEntity> findAllByIdIn(List<Long> courseIds);
}
