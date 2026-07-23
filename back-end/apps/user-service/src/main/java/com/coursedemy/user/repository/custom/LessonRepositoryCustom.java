package com.coursedemy.user.repository.custom;

public interface LessonRepositoryCustom {
    Long findMaxOrderIndexByCourseId(Long courseId);
}
