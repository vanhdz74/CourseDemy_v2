package com.vanh.CourseWeb.repository;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
