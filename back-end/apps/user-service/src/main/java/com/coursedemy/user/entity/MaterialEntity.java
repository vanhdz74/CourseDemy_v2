package com.coursedemy.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "materials")
public class MaterialEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "file_link")
    private String fileLink;

    @ManyToOne
    @JoinColumn(name = "sublessonEntity_id")
    private SubLessonEntity subLessonEntity;
}
