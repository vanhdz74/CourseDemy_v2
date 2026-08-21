package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    CartEntity findByUserEntity_Id(Long userId);
}
