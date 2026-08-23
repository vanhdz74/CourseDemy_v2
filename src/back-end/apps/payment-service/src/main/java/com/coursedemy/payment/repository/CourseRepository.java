package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    List<CourseEntity> findAllByIdIn(List<Long> courseIds);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO courses (id, title, price, level, quantity) VALUES (:id, :title, :price, 1, 0) ON CONFLICT (id) DO NOTHING", nativeQuery = true)
    void insertCourseIfNotExists(@Param("id") Long id, @Param("title") String title, @Param("price") Double price);

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO courses (id, title, price, level, quantity)
        VALUES (:id, :title, COALESCE(:price, 0), COALESCE(:level, 1), COALESCE(:quantity, 0))
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            price = EXCLUDED.price,
            level = EXCLUDED.level,
            quantity = EXCLUDED.quantity,
            update_at = CURRENT_TIMESTAMP
        """, nativeQuery = true)
    void upsertCourse(@Param("id") Long id,
                      @Param("title") String title,
                      @Param("price") Double price,
                      @Param("level") Integer level,
                      @Param("quantity") Integer quantity);
}
