package com.coursedemy.course.repository;

import com.coursedemy.course.dto.OrderDTO;
import com.coursedemy.course.entity.OrderEntity;
import com.coursedemy.course.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
