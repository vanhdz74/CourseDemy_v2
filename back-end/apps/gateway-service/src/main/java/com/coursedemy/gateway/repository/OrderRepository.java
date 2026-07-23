package com.coursedemy.gateway.repository;

import com.coursedemy.gateway.dto.OrderDTO;
import com.coursedemy.gateway.entity.OrderEntity;
import com.coursedemy.gateway.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
