package com.coursedemy.order.entity;

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

    @PrePersist
    protected void onCreate() {
        Date now = new Date();

        if (price == null) {
            price = 0D;
        }

        if (level == null) {
            level = 0;
        }

        if (quantity == null) {
            quantity = 0;
        }

        if (createdAt == null) {
            createdAt = now;
        }

        if (updateAt == null) {
            updateAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = new Date();
    }
}
