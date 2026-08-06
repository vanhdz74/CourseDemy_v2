package com.coursedemy.order.repository;

import com.coursedemy.order.dto.OrderDTO;
import com.coursedemy.order.entity.OrderEntity;
import com.coursedemy.order.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
