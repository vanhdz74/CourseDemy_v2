package com.vanh.CourseWeb.repository.custom.impl;

import com.vanh.CourseWeb.repository.SubLessonRepository;
import com.vanh.CourseWeb.repository.custom.SublessonRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class SubLessonRepositoryImpl implements SublessonRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void incrementOrderIndexes(Long lessonId, Long startIndex) {
        String jpql = """
                    UPDATE SubLessonEntity s
                    SET s.orderIndex = s.orderIndex + 1
                    WHERE s.lesson.id = :lessonId
                    AND s.orderIndex >= :startIndex
                """;

        entityManager.createQuery(jpql)
                .setParameter("lessonId", lessonId)
                .setParameter("startIndex", startIndex)
                .executeUpdate();
    }

    @Override
    public void decrementOrderIndexesAfterDelete(Long lessonId, Long orderIndex) {
        String jpql = """
                    UPDATE SubLessonEntity s
                    SET s.orderIndex = s.orderIndex - 1
                    WHERE s.lesson.id = :lessonId
                    AND s.orderIndex > :orderIndex
                """;

        entityManager.createQuery(jpql)
                .setParameter("lessonId", lessonId)
                .setParameter("orderIndex", orderIndex)
                .executeUpdate();
    }

}
