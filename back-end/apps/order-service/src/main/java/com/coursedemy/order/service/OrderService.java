package com.coursedemy.order.service;

import com.coursedemy.order.dto.OrderDTO;
import com.coursedemy.order.dto.RevenueDTO;
import com.coursedemy.order.entity.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderEntity createOrderFromCart(OrderDTO.CheckoutDTO request);

    void handlePaymentSuccess(Long orderId);

    List<OrderDTO.TransactionDTO> transaction();

    List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(Long teacherId, Long courseId, String role);
}
