package com.coursedemy.course.repository;

import com.coursedemy.course.entity.CartEntity;
import com.coursedemy.course.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    CartEntity findByUserEntity_Id(Long userId);

    Optional<CartEntity> findByUserEntity(UserEntity userEntity);
}
