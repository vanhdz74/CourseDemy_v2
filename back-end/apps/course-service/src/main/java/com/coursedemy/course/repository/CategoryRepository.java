package com.coursedemy.course.repository;

import com.coursedemy.course.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;


public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    Optional<CategoryEntity> findByName(String categoryName);
    Optional<CategoryEntity> findById(Long id);
}
