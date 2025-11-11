package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  CategoryRepository extends JpaRepository<CategoryEntity,Long> {
}
