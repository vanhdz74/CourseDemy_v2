package com.coursedemy.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "comments")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "status")
    private Integer status;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    // ===================== USER =====================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    // ===================== SUB LESSON =====================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_lesson_id")
    private SubLessonEntity subLessonEntity;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }
}
