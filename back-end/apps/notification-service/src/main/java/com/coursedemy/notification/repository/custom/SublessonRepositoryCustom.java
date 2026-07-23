package com.coursedemy.notification.repository.custom;

public interface SublessonRepositoryCustom {
    void incrementOrderIndexes(Long courseId, Long startIndex);

    void decrementOrderIndexesAfterDelete(Long lessonId, Long orderIndex);
}
