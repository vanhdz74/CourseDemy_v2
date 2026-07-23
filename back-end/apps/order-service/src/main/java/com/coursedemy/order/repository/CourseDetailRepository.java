package com.coursedemy.order.repository;

import com.coursedemy.order.entity.CoursesDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseDetailRepository extends JpaRepository<CoursesDetailEntity, Long> {
    CoursesDetailEntity findByCourseEntity_Id(Long id);

    List<CoursesDetailEntity> findAllByCourseEntity_Id(Long id);
}
    
