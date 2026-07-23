package com.coursedemy.payment.repository.custom;

public interface LessonRepositoryCustom {
    Long findMaxOrderIndexByCourseId(Long courseId);
}
