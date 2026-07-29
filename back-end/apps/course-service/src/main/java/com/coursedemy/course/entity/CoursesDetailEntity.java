package com.coursedemy.course.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "courses_detail",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_course_detail_course",
                        columnNames = "course_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursesDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "content",
            columnDefinition = "TEXT"
    )
    private String content;

    @Column(
            name = "course_include",
            columnDefinition = "TEXT"
    )
    private String courseInclude;

    @Column(
            name = "request",
            columnDefinition = "TEXT"
    )
    private String request;

    @Column(
            name = "description",
            columnDefinition = "TEXT"
    )
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false,
            unique = true
    )
    private CourseEntity courseEntity;
}