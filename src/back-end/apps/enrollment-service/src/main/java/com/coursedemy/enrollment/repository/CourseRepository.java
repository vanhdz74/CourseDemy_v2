package com.coursedemy.enrollment.repository;

import com.coursedemy.enrollment.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseEntity, Long>,
        JpaSpecificationExecutor<CourseEntity> {


    CourseEntity findByTitle(String title);

    boolean existsByTitleIgnoreCase(String title);

    List<CourseEntity> findAllByIdIn(List<Long> courseIds);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query(value = """
        INSERT INTO courses (id, title, price, level, quantity)
        VALUES (:id, :title, COALESCE(:price, 0), COALESCE(:level, 1), COALESCE(:quantity, 0))
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            price = EXCLUDED.price,
            level = EXCLUDED.level,
            quantity = EXCLUDED.quantity,
            update_at = CURRENT_TIMESTAMP
        """, nativeQuery = true)
    void upsertCourse(@org.springframework.data.repository.query.Param("id") Long id,
                      @org.springframework.data.repository.query.Param("title") String title,
                      @org.springframework.data.repository.query.Param("price") Double price,
                      @org.springframework.data.repository.query.Param("level") Integer level,
                      @org.springframework.data.repository.query.Param("quantity") Integer quantity);
}
