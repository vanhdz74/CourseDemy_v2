package com.coursedemy.payment.payment;

import com.coursedemy.payment.config.payment.VnPayConfig;
import com.coursedemy.payment.entity.*;
import com.coursedemy.payment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequiredArgsConstructor
@Component
@Slf4j
public class VnPayProvider implements PaymentProvider {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CourseRepository courseRepository;
    private final UserCourseRepository userCourseRepository;

    @Override
    public String createPaymentUrl(OrderEntity order, Map<String, String> extraParams) throws Exception {
        String bankCode = extraParams != null ? extraParams.get("bankCode") : null;
        String language = extraParams != null ? extraParams.getOrDefault("language", "vn") : "vn";
        String ipAddress = extraParams != null ? extraParams.getOrDefault("ipAddress", "127.0.0.1") : "127.0.0.1";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createDate = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        Map<String, String> params = new HashMap<>();
        long amount = Math.round(order.getTotalPrice() * 100D);
        if (amount < 500000 || String.valueOf(amount).length() > 12) {
            throw new IllegalArgumentException("Invalid VNPAY amount: " + amount);
        }

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", String.valueOf(order.getId()));
        params.put("vnp_OrderInfo", "CourseDemyOrder" + order.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", normalizeLocale(language));
        params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
        params.put("vnp_IpAddr", ipAddress);

        if (bankCode != null && !bankCode.isBlank()) params.put("vnp_BankCode", bankCode);

        params.put("vnp_CreateDate", createDate.format(formatter));
        params.put("vnp_ExpireDate", createDate.plusMinutes(15).format(formatter));

        // Build hashData
        String hashData = VnPayConfig.buildHashData(params);

        // create secure hash
        String secureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        // Build URL
        String queryUrl = VnPayConfig.buildQueryUrl(params) + "&vnp_SecureHash=" + secureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        log.info(
                "VNPAY create payment orderId={}, amount={}, ip={}, returnUrl={}, url={}",
                order.getId(),
                params.get("vnp_Amount"),
                params.get("vnp_IpAddr"),
                params.get("vnp_ReturnUrl"),
                paymentUrl
        );

        return paymentUrl;
    }

    private String normalizeLocale(String language) {
        if ("en".equalsIgnoreCase(language)) {
            return "en";
        }

        return "vn";
    }

    @Override
    public Map<String, String> processCallback(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String hashData = VnPayConfig.buildHashData(fields);
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equals(receivedHash)) {
            return Map.of("RspCode", "97", "Message", "Invalid Checksum");
        }

        // Cập nhạt order
        Long orderId = Long.parseLong(params.get("vnp_TxnRef"));
        OrderEntity order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        long amount = Long.parseLong(params.get("vnp_Amount"));
        if (amount != Math.round(order.getTotalPrice() * 100)) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        order.setStatus("00".equals(params.get("vnp_ResponseCode")) ? "SUCCESS" : "FAILED");
        order.setPaymentTime(LocalDateTime.now());
        orderRepository.save(order);

        // Cập nhật vào user_course nếu thành công
        List<OrderDetailEntity> orderDetail = orderDetailRepository.findByOrderEntity_Id(order.getId());
        for (OrderDetailEntity orderDetailEntity : orderDetail) {
            UserCourseEntity userCourseEntity = new UserCourseEntity();
            userCourseEntity.setUserEntity(order.getUserEntity());
            userCourseEntity.setCourseEntity(orderDetailEntity.getCourseEntity());

            // Cập nhật số lượng học viên sau khi đăng ký thành công
            CourseEntity courseEntity = courseRepository.findById(orderDetailEntity.getCourseEntity().getId()).orElse(null);
            if (courseEntity != null) {
                courseEntity.setQuantity(courseEntity.getQuantity() + 1);
                courseRepository.save(courseEntity);
            }

            // Cập nhật giá vào order deatail
            assert courseEntity != null;
            orderDetailEntity.setPrice(courseEntity.getPrice());

            userCourseRepository.save(userCourseEntity);
        }

        return Map.of("RspCode", "00", "Message", "Confirm Success");
    }

    @Override
    public String handleReturn(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Tính lại hash
        String hashData = VnPayConfig.buildHashData(fields);
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equals(receivedHash)) {
            return "Chu ky khong hop le";
        }

        // Nếu thành công, gọi processCallback luôn
        if ("00".equals(params.get("vnp_ResponseCode"))) {
            Map<String, String> callbackResponse = processCallback(params);
            return """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <title>Thanh toán thành công</title>
                        <style>
                            body {
                                margin: 0;
                                height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: linear-gradient(135deg, #4ade80, #22c55e);
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            }
                    
                            .card {
                                background: #ffffff;
                                padding: 32px 40px;
                                border-radius: 16px;
                                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                                text-align: center;
                                max-width: 420px;
                            }
                    
                            .icon {
                                font-size: 64px;
                                margin-bottom: 16px;
                            }
                    
                            h2 {
                                margin: 0 0 12px;
                                color: #16a34a;
                            }
                    
                            p {
                                margin: 0;
                                color: #555;
                                font-size: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="icon">✅</div>
                            <h2>Giao dịch thành công</h2>
                            <p>Bạn sẽ được chuyển về trang chủ sau 5 giây...</p>
                        </div>
                    
                        <script>
                            setTimeout(function () {
                                window.location.href = "http://localhost:3000/home";
                            }, 5000);
                        </script>
                    </body>
                    </html>
                    """;

        } else {
            return "GD Khong thanh cong";
        }
    }

}
