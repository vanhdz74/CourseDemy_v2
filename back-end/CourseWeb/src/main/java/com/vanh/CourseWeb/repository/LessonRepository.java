package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.LessonEntity;
import com.vanh.CourseWeb.entity.SubLessonEntity;
import com.vanh.CourseWeb.repository.custom.LessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<LessonEntity, Long>, LessonRepositoryCustom {
    List<LessonEntity> findByCourseEntity_Id(Long id);

    List<LessonEntity> findByCourseEntity_IdOrderByOrderIndexAsc(Long id);

    Long findMaxOrderIndexByCourseId(Long courseId);

    List<LessonEntity> findByCourseEntityIdAndOrderIndexGreaterThan(Long courseId, Long orderIndex);
}
