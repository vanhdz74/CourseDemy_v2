package com.coursedemy.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(
        name = "users_courses",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_course",
                        columnNames = {
                                "user_id",
                                "course_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID của khóa học bên Course-Service.
     *
     * Không dùng @ManyToOne CourseEntity
     * vì CourseEntity thuộc Course-Service.
     */
    @Column(
            name = "course_id",
            nullable = false
    )
    private Long courseId;

    /**
     * Tiến độ học.
     * Ví dụ:
     * 0 -> 100
     */
    @Column(
            name = "progress",
            nullable = false
    )
    private Long progress = 0L;

    @Column(name = "registered_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date registeredAt;

    /**
     * Quan hệ User vẫn giữ.
     * Vì UserEntity và UserCourseEntity
     * cùng nằm trong User-Service.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private UserEntity userEntity;

    @PrePersist
    protected void onCreate() {

        if (progress == null) {
            progress = 0L;
        }

        if (registeredAt == null) {
            registeredAt = new Date();
        }
    }
}
