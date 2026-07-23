package com.coursedemy.course.repository.custom;

public interface LessonRepositoryCustom {
    Long findMaxOrderIndexByCourseId(Long courseId);
}
