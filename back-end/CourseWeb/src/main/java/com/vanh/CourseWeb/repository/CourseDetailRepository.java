package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.entity.CoursesDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseDetailRepository extends JpaRepository<CoursesDetailEntity, Long> {
    CoursesDetailEntity findByCourseEntity_Id(Long id);
}
    
