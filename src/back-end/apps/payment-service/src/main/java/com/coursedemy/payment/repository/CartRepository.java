package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.CartEntity;
import com.coursedemy.payment.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    CartEntity findByUserEntity_Id(Long userId);

    Optional<CartEntity> findByUserEntity(UserEntity userEntity);
}
