package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderEntity createOrderFromCart(OrderDTO.CheckoutDTO request);

    void handlePaymentSuccess(Long orderId);

    List<OrderDTO.TransactionDTO> transaction();

    List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(Long teacherId, Long courseId, String role);
}
