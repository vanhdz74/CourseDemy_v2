package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.LessonEntity;
import com.vanh.CourseWeb.entity.SubLessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
    List<LessonEntity> findByCourseEntity_Id(Long id);
}
