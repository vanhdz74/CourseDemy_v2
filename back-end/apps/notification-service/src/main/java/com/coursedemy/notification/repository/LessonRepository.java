package com.coursedemy.notification.repository;

import com.coursedemy.notification.entity.LessonEntity;
import com.coursedemy.notification.entity.SubLessonEntity;
import com.coursedemy.notification.repository.custom.LessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<LessonEntity, Long>, LessonRepositoryCustom {
    List<LessonEntity> findByCourseEntity_Id(Long id);

    List<LessonEntity> findByCourseEntity_IdOrderByOrderIndexAsc(Long id);

    Long findMaxOrderIndexByCourseId(Long courseId);

    List<LessonEntity> findByCourseEntityIdAndOrderIndexGreaterThan(Long courseId, Long orderIndex);

    List<LessonEntity> findAllByCourseEntity_Id(Long id);
}
