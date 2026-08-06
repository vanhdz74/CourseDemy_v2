package com.coursedemy.course.repository;

import com.coursedemy.course.entity.SubLessonEntity;
import com.coursedemy.course.repository.custom.SublessonRepositoryCustom;
import com.coursedemy.course.repository.custom.impl.SubLessonRepositoryImpl;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubLessonRepository extends JpaRepository<SubLessonEntity, Long>, SublessonRepositoryCustom {
    List<SubLessonEntity> findByLessonId(Long id);

    List<SubLessonEntity> findByLessonIdOrderByOrderIndexAsc(Long lessonId);

    Optional<SubLessonEntity> findById(Long id);

    void deleteAllByLesson_Id(Long id);

    List<SubLessonEntity> findByLesson_IdIn(List<Long> lessonIds);
}
