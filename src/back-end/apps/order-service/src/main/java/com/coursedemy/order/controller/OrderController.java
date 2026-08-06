package com.coursedemy.order.controller;

import com.coursedemy.order.dto.OrderDTO;
import com.coursedemy.order.dto.RevenueDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.order.entity.OrderEntity;
import com.coursedemy.order.entity.UserEntity;
import com.coursedemy.order.service.OrderService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ApiResponse<Long>> checkoutFromCart(@RequestBody OrderDTO.CheckoutDTO request) {
        OrderEntity od = orderService.createOrderFromCart(request);
        return ResponseEntity.ok(ApiResponse.ok(od.getId()));
    }

    // POST: Xác nhận thanh toán thành công
    @PostMapping("/payment/success/{orderId}")
    public ResponseEntity<ApiResponse<Void>> paymentSuccess(@PathVariable Long orderId) {
        orderService.handlePaymentSuccess(orderId);
        return ResponseEntity.ok(ApiResponse.ok("Thanh toán thành công", null));
    }

    // GET: Lấy ra thông tin trong bảng order và các khoá liên quan
    @GetMapping("/transaction")
    public ResponseEntity<ApiResponse<List<OrderDTO.TransactionDTO>>> transaction() {
        List<OrderDTO.TransactionDTO> result = orderService.transaction();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // GET: Lấy doanh thu theo tháng trong năm hiện tại
    @GetMapping("/revenue-by-month")
    public ResponseEntity<ApiResponse<List<RevenueDTO.RevenueByMonthDTO>>> getRevenueByMonth(
            @RequestParam(required = false) Long courseId,
            Authentication authentication
    ) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getRevenueByMonth(user.getId(), courseId, user.getRoleEntity().getRoleName())
        ));
    }

}
