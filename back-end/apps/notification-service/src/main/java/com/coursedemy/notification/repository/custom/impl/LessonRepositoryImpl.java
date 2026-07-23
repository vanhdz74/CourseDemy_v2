package com.coursedemy.notification.repository.custom.impl;

import com.coursedemy.notification.repository.custom.LessonRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class LessonRepositoryImpl implements LessonRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Long findMaxOrderIndexByCourseId(Long courseId) {
        String query = """
                    SELECT COALESCE(MAX(l.orderIndex), 0)
                    FROM LessonEntity l
                    WHERE l.courseEntity.id = :courseId
                """;

        return entityManager.createQuery(query, Long.class)
                .setParameter("courseId", courseId)
                .getSingleResult();
    }
}
