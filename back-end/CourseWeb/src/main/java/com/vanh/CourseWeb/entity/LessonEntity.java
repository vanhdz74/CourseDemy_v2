package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "lessons")
public class LessonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;

    @Column(name = "order_index")
    private Long orderIndex;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseEntity courseEntity;
}
