package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.OrderDetailEntity;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.repository.CourseRepository;
import com.vanh.CourseWeb.repository.OrderDetailRepository;
import com.vanh.CourseWeb.repository.OrderRepository;
import com.vanh.CourseWeb.repository.UserRepository;
import com.vanh.CourseWeb.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Tạo đơn hàng và lấy payment URL
    @PostMapping("/create")
    public Map<String, String> createPayment(@RequestBody Map<String, Object> request,
                                             @RequestParam String provider) throws Exception {

        // 1. check user
        Optional<UserEntity> userEntity = userRepository.findById(Long.valueOf(request.get("userId").toString()));

        // 2.Lấy danh sách courseId
        List<Long> courseIds = (List<Long>) request.get("courseId");

        if (courseIds == null || courseIds.isEmpty()) {
            throw new RuntimeException("courseId list is empty");
        }

        // 3. Lấy các course từ DB
        List<Long> ids = courseIds.stream()
                .distinct()
                .toList();

        // Lấy course từ DB
        List<CourseEntity> courses = courseRepository.findAllByIdIn(ids);

        if (courses.isEmpty()) {
            throw new RuntimeException("No courses found");
        }

        // 4.get totalPrice
        Double totalPrice = Double.valueOf(request.get("totalPrice").toString());
        String paymentMethod = request.get("paymentMethod").toString();

        OrderEntity order = OrderEntity.builder()
                .totalPrice(totalPrice)
                .paymentMethod(paymentMethod)
                .status("PENDING")
                .createdAt(java.time.LocalDateTime.now())
                .userEntity(userEntity.orElse(null))
                .build();
        orderRepository.save(order);


        // 5. Tạo nhiều OrderDetail (1 course = 1 dòng)
        for (CourseEntity course : courses) {
            OrderDetailEntity detail = new OrderDetailEntity();
            detail.setOrderEntity(order);
            detail.setCourseEntity(course);
            orderDetailRepository.save(detail);
        }

        String paymentUrl = paymentService.getPaymentUrl(order, provider, null);

        return Map.of(
                "code", "00",
                "message", "success",
                "paymentUrl", paymentUrl);
    }

    // IPN URL - update vào db thành công
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
