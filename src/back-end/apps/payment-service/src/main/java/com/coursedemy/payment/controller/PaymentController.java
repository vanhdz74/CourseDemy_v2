package com.coursedemy.payment.controller;

import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.payment.entity.CourseEntity;
import com.coursedemy.payment.entity.OrderDetailEntity;
import com.coursedemy.payment.entity.OrderEntity;
import com.coursedemy.payment.entity.UserEntity;
import com.coursedemy.payment.repository.CourseRepository;
import com.coursedemy.payment.repository.OrderDetailRepository;
import com.coursedemy.payment.repository.OrderRepository;
import com.coursedemy.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Tạo đơn hàng và lấy payment URL
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Map<String, String>>> createPayment(@RequestBody Map<String, Object> request,
                                                                          @RequestParam String provider,
                                                                          Authentication authentication,
                                                                          HttpServletRequest httpRequest) throws Exception {

        UserEntity user = (UserEntity) authentication.getPrincipal();

        Object rawCourseIds = request.get("courseIds") != null
                ? request.get("courseIds")
                : request.get("courseId");

        List<Long> courseIds = extractCourseIds(rawCourseIds);
        if (courseIds == null || courseIds.isEmpty()) {
            throw new BusinessException(ErrorCode.COURSE_ID_EMPTY);
        }

        List<Long> ids = courseIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<CourseEntity> courses = courseRepository.findAllByIdIn(ids);
        if (courses.size() != ids.size()) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND);
        }

        double totalPrice = courses.stream()
                .mapToDouble(course -> course.getPrice() == null ? 0D : course.getPrice())
                .sum();

        if ("vnpay".equalsIgnoreCase(provider) && totalPrice < 5000D) {
            throw new BusinessException(ErrorCode.INVALID_TOTAL_PRICE, "Tổng thanh toán VNPay phải từ 5,000 VND trở lên");
        }

        OrderEntity order = OrderEntity.builder()
                .totalPrice(totalPrice)
                .paymentMethod(provider)
                .status("PENDING")
                .createdAt(java.time.LocalDateTime.now())
                .userEntity(user)
                .build();
        orderRepository.save(order);

        for (CourseEntity course : courses) {
            OrderDetailEntity detail = new OrderDetailEntity();
            detail.setOrderEntity(order);
            detail.setCourseEntity(course);
            detail.setPrice(course.getPrice());
            orderDetailRepository.save(detail);
        }

        String paymentUrl = paymentService.getPaymentUrl(
                order,
                provider,
                Map.of("ipAddress", getClientIp(httpRequest))
        );

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "code", "00",
                "message", "success",
                "paymentUrl", paymentUrl
        )));
    }

    // IPN URL - update vào db thành công
    @PostMapping("/{provider}/ipn")
    public ResponseEntity<ApiResponse<Map<String, String>>> ipn(@PathVariable String provider,
                                                                @RequestParam Map<String, String> params) throws Exception {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.handleCallback(provider, params)));
    }

    @GetMapping("/{provider}/ipn")
    public ResponseEntity<Map<String, String>> ipnGet(@PathVariable String provider,
                                                      @RequestParam Map<String, String> params) throws Exception {
        return ResponseEntity.ok(paymentService.handleCallback(provider, params));
    }

    // Return URL
    @GetMapping(value = "/{provider}/return", produces = MediaType.TEXT_HTML_VALUE)
    public String paymentReturn(@PathVariable String provider,
                                @RequestParam Map<String, String> params) throws Exception {
        return paymentService.handleReturn(provider, params);
    }

    private List<Long> extractCourseIds(Object rawCourseIds) {
        if (!(rawCourseIds instanceof List<?> rawList)) {
            return List.of();
        }

        return rawList.stream()
                .map(value -> {
                    if (value instanceof Number number) {
                        return number.longValue();
                    }
                    return Long.parseLong(String.valueOf(value));
                })
                .toList();
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return normalizeVnPayIp(forwardedFor.split(",")[0].trim());
        }

        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return normalizeVnPayIp(realIp);
        }

        return normalizeVnPayIp(request.getRemoteAddr());
    }

    private String normalizeVnPayIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return "127.0.0.1";
        }

        String ip = ipAddress.trim();
        if ("::1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip) || "localhost".equalsIgnoreCase(ip)) {
            return "127.0.0.1";
        }

        if (ip.contains(":")) {
            return "127.0.0.1";
        }

        return ip;
    }
}
