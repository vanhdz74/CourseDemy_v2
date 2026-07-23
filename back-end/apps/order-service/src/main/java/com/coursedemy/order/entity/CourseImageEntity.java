package com.coursedemy.order.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "course_image")
public class CourseImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    // Quan he
    @OneToOne
    // Khi join phải trùng với tên cột trong db
    @JoinColumn(name = "course_id")
    private CourseEntity courseEntity;
}
