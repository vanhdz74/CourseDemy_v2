package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // POST: tạo đơn hàng
    @PostMapping("/checkout")
    public ResponseEntity<?> checkoutFromCart(@RequestBody OrderDTO.CheckoutDTO request) {
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

    // GET: Lấy ra thông tin trong bảng order và các khoá liên quan
    @GetMapping("/transaction")
    public ResponseEntity<?> transaction() {
        try {
            List<OrderDTO.TransactionDTO> result = orderService.transaction();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // GET: Lấy doanh thu theo tháng trong năm hiện tại
    @GetMapping("/revenue-by-month")
    public List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(
            @RequestParam(required = false) Long courseId,
            Authentication authentication
    ) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        return orderService.getRevenueByMonth(user.getId(), courseId, user.getRoleEntity().getRoleName());
    }

}
