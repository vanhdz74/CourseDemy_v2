package com.coursedemy.notification.repository;

import com.coursedemy.notification.dto.OrderDTO;
import com.coursedemy.notification.entity.OrderEntity;
import com.coursedemy.notification.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
