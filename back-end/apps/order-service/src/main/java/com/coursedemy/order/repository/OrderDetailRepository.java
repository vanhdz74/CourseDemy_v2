package com.coursedemy.order.repository;

import com.coursedemy.order.entity.OrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetailEntity, Long> {
    List<OrderDetailEntity> findByOrderEntity_Id(Long orderId);
}
