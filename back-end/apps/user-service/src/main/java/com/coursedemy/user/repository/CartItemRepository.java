package com.coursedemy.user.repository;

import com.coursedemy.user.entity.CartEntity;
import com.coursedemy.user.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByCartEntity_Id(Long cartEntityId);

    CartItemEntity findByCartEntity_IdAndCourseEntity_Id(Long cardId, Long courseId);

    void deleteByCartEntity_Id(Long id);
}
