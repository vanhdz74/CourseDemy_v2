package com.coursedemy.course.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "course_image",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_course_image_course",
                        columnNames = "course_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "image_url",
            nullable = false
    )
    private String imageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false,
            unique = true
    )
    private CourseEntity courseEntity;
}