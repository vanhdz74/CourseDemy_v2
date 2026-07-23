package com.coursedemy.user.repository;

import com.coursedemy.user.dto.OrderDTO;
import com.coursedemy.user.entity.OrderEntity;
import com.coursedemy.user.repository.custom.OrderRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {
    OrderEntity findByIdAndStatus(Long id, String status); // Tìm đơn hàng theo id và trạng thái
}
