package com.coursedemy.gateway.repository.custom;

public interface LessonRepositoryCustom {
    Long findMaxOrderIndexByCourseId(Long courseId);
}
