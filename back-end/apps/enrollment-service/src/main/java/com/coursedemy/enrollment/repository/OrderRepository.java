package com.coursedemy.enrollment.repository;

import com.coursedemy.enrollment.dto.OrderDTO;
import com.coursedemy.enrollment.entity.OrderEntity;
import com.coursedemy.enrollment.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
