package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "courses")
public class CourseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "level", nullable = false)
    private Integer level;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "update_at")
    private Date updateAt;

    // Quan he
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private UserEntity user;

    @OneToOne(mappedBy = "courseEntity", cascade = CascadeType.ALL)
    private CourseImageEntity courseImageEntity;

    @OneToOne(mappedBy = "courseEntity", cascade = CascadeType.ALL)
    private CoursesDetailEntity coursesDetailEntity;
}
