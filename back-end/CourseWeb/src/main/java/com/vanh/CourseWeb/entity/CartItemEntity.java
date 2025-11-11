package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cart_item")
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Double price;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartEntity cartEntity;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseEntity courseEntity;
}
