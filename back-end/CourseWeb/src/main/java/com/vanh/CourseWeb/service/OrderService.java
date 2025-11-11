package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.entity.OrderEntity;

public interface OrderService {
    OrderEntity createOrderFromCart(OrderDTO.CheckoutCartDTO request);

    void handlePaymentSuccess(Long orderId);
}
