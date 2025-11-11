package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseEntity, Long>,
        JpaSpecificationExecutor<CourseEntity> {
    List<CourseEntity> findByCategoryId(Integer categoryId);

    List<CourseEntity> findByUser_id(Long teacherId);
}
