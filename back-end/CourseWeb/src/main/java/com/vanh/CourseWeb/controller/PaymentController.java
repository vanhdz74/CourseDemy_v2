package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.repository.OrderRepository;
import com.vanh.CourseWeb.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    // Tạo đơn hàng và lấy payment URL
    @PostMapping("/create")
    public Map<String, String> createPayment(@RequestBody Map<String, Object> request,
                                             @RequestParam String provider) throws Exception {

        Double totalPrice = Double.valueOf(request.get("totalPrice").toString());
        String paymentMethod = request.get("paymentMethod").toString();

        OrderEntity order = OrderEntity.builder()
                .totalPrice(totalPrice)
                .paymentMethod(paymentMethod)
                .status("PENDING")
                .createdAt(java.time.LocalDateTime.now())
                .build();
        orderRepository.save(order);

        String paymentUrl = paymentService.getPaymentUrl(order, provider, null);

        return Map.of("code", "00", "message", "success", "paymentUrl", paymentUrl);
    }

    // IPN URL
    @PostMapping("/{provider}/ipn")
    public Map<String, String> ipn(@PathVariable String provider,
                                   @RequestParam Map<String, String> params) throws Exception {
        return paymentService.handleCallback(provider, params);
    }

    // Return URL
    @GetMapping("/{provider}/return")
    public String paymentReturn(@PathVariable String provider,
                                @RequestParam Map<String, String> params) throws Exception {
        return paymentService.handleReturn(provider, params);
    }
}
