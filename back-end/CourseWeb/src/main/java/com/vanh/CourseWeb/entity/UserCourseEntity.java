package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users_courses")
public class UserCourseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Column(name = "registered_at")
//    private Date registeredAt;

    @Column(name = "progress")
    private Long progress;

    // Quan hệ tới User (student)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    // Quan hệ tới Course
    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseEntity courseEntity;
}
