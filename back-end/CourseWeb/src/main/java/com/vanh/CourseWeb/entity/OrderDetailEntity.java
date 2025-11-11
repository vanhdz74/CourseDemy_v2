package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders_detail")
public class OrderDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Double price;

    @ManyToOne
    @JoinColumn(name = "order_id", unique = true)
    private OrderEntity orderEntity;

    @ManyToOne
    @JoinColumn(name = "course_id", unique = true)
    private CourseEntity courseEntity;
}
