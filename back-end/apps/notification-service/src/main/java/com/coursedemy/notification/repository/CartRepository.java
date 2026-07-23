package com.coursedemy.notification.repository;

import com.coursedemy.notification.entity.CartEntity;
import com.coursedemy.notification.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    CartEntity findByUserEntity_Id(Long userId);

    Optional<CartEntity> findByUserEntity(UserEntity userEntity);
}
