package com.coursedemy.user.repository;

import com.coursedemy.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findById(Long id);

    UserEntity findByEmail(String email);
}
