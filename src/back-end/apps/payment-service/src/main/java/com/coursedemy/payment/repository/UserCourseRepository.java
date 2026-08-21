package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.UserCourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCourseRepository extends JpaRepository<UserCourseEntity, Long> {
}
