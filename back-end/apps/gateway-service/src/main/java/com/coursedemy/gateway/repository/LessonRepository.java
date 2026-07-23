package com.coursedemy.gateway.repository;

import com.coursedemy.gateway.entity.LessonEntity;
import com.coursedemy.gateway.entity.SubLessonEntity;
import com.coursedemy.gateway.repository.custom.LessonRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<LessonEntity, Long>, LessonRepositoryCustom {
    List<LessonEntity> findByCourseEntity_Id(Long id);

    List<LessonEntity> findByCourseEntity_IdOrderByOrderIndexAsc(Long id);

    Long findMaxOrderIndexByCourseId(Long courseId);

    List<LessonEntity> findByCourseEntityIdAndOrderIndexGreaterThan(Long courseId, Long orderIndex);

    List<LessonEntity> findAllByCourseEntity_Id(Long id);
}
