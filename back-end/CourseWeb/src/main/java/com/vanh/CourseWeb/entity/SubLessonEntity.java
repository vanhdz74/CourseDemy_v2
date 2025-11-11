package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "lessons_detail")
public class SubLessonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "duration")
    private Long duration;

    @Column(name = "order_index")
    private Long orderIndex;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private LessonEntity lesson;
}
