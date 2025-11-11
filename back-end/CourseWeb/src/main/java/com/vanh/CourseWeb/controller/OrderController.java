package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // POST: Thanh toán từ giỏ hàng
    @PostMapping("/checkout/cart")
    public ResponseEntity<?> checkoutFromCart(@RequestBody OrderDTO.CheckoutCartDTO request) {
        OrderEntity od = orderService.createOrderFromCart(request);
        return ResponseEntity.ok(od.getId());
    }

    // POST: Xác nhận thanh toán thành công
    @PostMapping("/payment/success/{orderId}")
    public ResponseEntity<?> paymentSuccess(@PathVariable Long orderId) {
        try {
            orderService.handlePaymentSuccess(orderId);
            return ResponseEntity.ok(Map.of("message", "Thanh toán thành công"));
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

}
