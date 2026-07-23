package com.coursedemy.order.repository.custom;

public interface LessonRepositoryCustom {
    Long findMaxOrderIndexByCourseId(Long courseId);
}
