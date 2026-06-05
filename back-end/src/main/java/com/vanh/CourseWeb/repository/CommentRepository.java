package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findAllBySubLessonEntity_Id(Long sublessonId);

    List<CommentEntity> findBySubLessonEntity_IdIn(List<Long> subLessonIds);
}
