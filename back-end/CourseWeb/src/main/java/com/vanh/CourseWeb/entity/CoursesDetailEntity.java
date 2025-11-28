package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "courses_detail")
public class CoursesDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String content;

    @Column(name = "course_include")
    private String courseInclude;

    @Column
    private String request;

    @Column
    private String description;

    @OneToOne
    @JoinColumn(name = "course_id")
    private CourseEntity courseEntity;
}
