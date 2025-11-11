package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.SubLessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubLessonRepository extends JpaRepository<SubLessonEntity, Long> {
    List<SubLessonEntity> findByLessonId(Long id);

    Optional<SubLessonEntity> findById(Long id);
}
