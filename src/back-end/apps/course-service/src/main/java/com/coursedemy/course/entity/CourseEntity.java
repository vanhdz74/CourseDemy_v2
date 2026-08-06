package com.coursedemy.course.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "title",
            nullable = false
    )
    private String title;

    @Column(
            name = "description",
            columnDefinition = "TEXT"
    )
    private String description;

    /**
     * Dùng BigDecimal thay cho Double
     * để lưu tiền chính xác.
     */
    @Column(
            name = "price",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal price;

    @Column(
            name = "level",
            nullable = false
    )
    private Integer level;

    /**
     * Nếu quantity là số lượng học viên
     * đã đăng ký thì nên đổi tên thành
     * enrolledCount.
     *
     * Nếu đây là giới hạn số học viên
     * thì nên đổi thành maxStudents.
     */
    @Column(
            name = "quantity",
            nullable = false
    )
    private Integer quantity;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    /**
     * Category nằm trong Course-Service.
     *
     * Có thể dùng JPA relationship.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    /**
     * Teacher/User thuộc User-Service.
     *
     * Chỉ lưu ID.
     */
    @Column(
            name = "teacher_id",
            nullable = false
    )
    private Long teacherId;

    /**
     * Course Image.
     */
    @OneToOne(
            mappedBy = "courseEntity",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private CourseImageEntity courseImageEntity;

    /**
     * Course Detail.
     */
    @OneToOne(
            mappedBy = "courseEntity",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private CoursesDetailEntity coursesDetailEntity;


    // ==============================
    // Lifecycle
    // ==============================

    @PrePersist
    protected void onCreate() {

        Date now = new Date();

        if (price == null) {
            price = BigDecimal.ZERO;
        }

        if (level == null) {
            level = 0;
        }

        if (quantity == null) {
            quantity = 0;
        }

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = new Date();
    }
}