package com.coursedemy.payment.repository;

import com.coursedemy.payment.dto.OrderDTO;
import com.coursedemy.payment.entity.OrderEntity;
import com.coursedemy.payment.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
