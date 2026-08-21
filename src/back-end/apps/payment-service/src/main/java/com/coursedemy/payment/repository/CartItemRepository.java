package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    CartItemEntity findByCartEntity_IdAndCourseEntity_Id(Long cartId, Long courseId);
}
