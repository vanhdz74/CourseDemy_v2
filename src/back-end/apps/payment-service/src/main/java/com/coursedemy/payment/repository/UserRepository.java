package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (id, email, is_active) VALUES (:id, :email, 1) ON CONFLICT (id) DO NOTHING", nativeQuery = true)
    void insertUserIfNotExists(@Param("id") Long id, @Param("email") String email);
}
