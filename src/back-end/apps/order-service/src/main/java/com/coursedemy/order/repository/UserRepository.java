package com.coursedemy.order.repository;

import com.coursedemy.order.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findById(Long id);

    UserEntity findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (id, username, email, is_active) VALUES (:id, :username, :email, 1) ON CONFLICT (id) DO NOTHING", nativeQuery = true)
    void insertUserIfNotExists(@Param("id") Long id,
                               @Param("username") String username,
                               @Param("email") String email);
}
