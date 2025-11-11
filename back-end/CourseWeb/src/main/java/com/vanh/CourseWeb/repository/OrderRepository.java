package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    
}
