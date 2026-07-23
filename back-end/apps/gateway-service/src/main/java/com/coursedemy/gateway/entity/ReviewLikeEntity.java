package com.coursedemy.gateway.entity;

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
@Table(name = "review_likes")
public class ReviewLikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 = like, 2 = dislike
    @Column(name = "likes")
    private Integer likes;

    @Column(name = "created_at")
    private Date createdAt;

    // ================ USER ================ //
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    // ================ REVIEW ================ //
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private ReviewEntity reviewEntity;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }
}
