package com.coursedemy.payment.service;

import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.*;
import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import com.coursedemy.payment.payment.PaymentGateway;
import com.coursedemy.payment.payment.PaymentProvider;
import com.coursedemy.payment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentProvider vnPayProvider;
    private final List<PaymentGateway> paymentGateways;
    private final PaymentTransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserCourseRepository userCourseRepository;
    private final CourseRepository courseRepository;

    // =========================
    // COURSE ORDER PAYMENT FLOW
    // =========================

    /**
     * Create payment details (URL or QR Code) for an existing Order.
     * Supports: vnpay, momo, qr
     */
    public Map<String, String> getPaymentDetails(OrderEntity order, String providerName, Map<String, String> extraParams) throws Exception {
        String provider = providerName.toLowerCase();
        switch (provider) {
            case "vnpay": {
                String paymentUrl = vnPayProvider.createPaymentUrl(order, extraParams);
                return Map.of(
                        "code", "00",
                        "message", "success",
                        "paymentUrl", paymentUrl,
                        "provider", "vnpay"
                );
            }
            case "momo": {
                PaymentGateway momoGateway = getGateway(PaymentMethod.MOMO);
                String txnNo = "TXN" + order.getId() + "_" + System.currentTimeMillis();

                PaymentTransaction transaction = PaymentTransaction.builder()
                        .transactionNo(txnNo)
                        .userId(order.getUserEntity().getId())
                        .amount(order.getTotalPrice())
                        .paymentMethod(PaymentMethod.MOMO)
                        .status(PaymentStatus.PENDING)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                transactionRepository.save(transaction);

                PaymentRequest req = new PaymentRequest();
                req.setAmount(order.getTotalPrice());
                req.setPaymentMethod(PaymentMethod.MOMO);
                req.setUserId(order.getUserEntity().getId());

                PaymentResponse momoResp = momoGateway.createPayment(req, transaction);
                String payUrl = momoResp.getPaymentUrl() != null ? momoResp.getPaymentUrl() : "";

                Map<String, String> result = new HashMap<>();
                result.put("code", "00");
                result.put("message", "success");
                result.put("paymentUrl", payUrl);
                result.put("transactionNo", txnNo);
                result.put("provider", "momo");
                return result;
            }
            case "qr": {
                PaymentGateway qrGateway = getGateway(PaymentMethod.QR);
                String txnNo = "TXN" + order.getId() + "_" + System.currentTimeMillis();

                PaymentTransaction transaction = PaymentTransaction.builder()
                        .transactionNo(txnNo)
                        .userId(order.getUserEntity().getId())
                        .amount(order.getTotalPrice())
                        .paymentMethod(PaymentMethod.QR)
                        .status(PaymentStatus.PENDING)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                transactionRepository.save(transaction);

                PaymentRequest req = new PaymentRequest();
                req.setAmount(order.getTotalPrice());
                req.setPaymentMethod(PaymentMethod.QR);
                req.setUserId(order.getUserEntity().getId());

                PaymentResponse qrResp = qrGateway.createPayment(req, transaction);
                String qrCode = qrResp.getQrCode() != null ? qrResp.getQrCode() : "";

                Map<String, String> result = new HashMap<>();
                result.put("code", "00");
                result.put("message", "success");
                result.put("qrCode", qrCode);
                result.put("transactionNo", txnNo);
                result.put("provider", "qr");
                return result;
            }
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    public String getPaymentUrl(OrderEntity order, String providerName, Map<String, String> extraParams) throws Exception {
        Map<String, String> details = getPaymentDetails(order, providerName, extraParams);
        return details.getOrDefault("paymentUrl", "");
    }

    /**
     * Fulfill an order upon successful payment:
     * - Update order status to SUCCESS
     * - Enroll student into user_courses
     * - Increase course student count
     * - Remove purchased items from cart
     */
    @Transactional
    public void fulfillOrder(OrderEntity order) {
        if (order == null || "SUCCESS".equals(order.getStatus())) {
            return;
        }

        order.setStatus("SUCCESS");
        order.setPaymentTime(LocalDateTime.now());
        orderRepository.save(order);

        List<OrderDetailEntity> orderDetails = orderDetailRepository.findByOrderEntity_Id(order.getId());
        for (OrderDetailEntity orderDetailEntity : orderDetails) {
            UserCourseEntity userCourseEntity = new UserCourseEntity();
            userCourseEntity.setUserEntity(order.getUserEntity());
            userCourseEntity.setCourseEntity(orderDetailEntity.getCourseEntity());

            CourseEntity courseEntity = courseRepository.findById(orderDetailEntity.getCourseEntity().getId()).orElse(null);
            if (courseEntity != null) {
                courseEntity.setQuantity(courseEntity.getQuantity() + 1);
                courseRepository.save(courseEntity);
            }

            assert courseEntity != null;
            orderDetailEntity.setPrice(courseEntity.getPrice());

            userCourseRepository.save(userCourseEntity);
        }
    }

    /**
     * Legacy callback handler for Order-based payments.
     */
    public Map<String, String> handleCallback(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.processCallback(params);
            case "momo":
                PaymentResponse momoResult = getGateway(PaymentMethod.MOMO).processCallback(params);
                if (momoResult.isSuccess()) {
                    extractAndFulfillOrder(params.get("orderId"));
                }
                return momoResult.toMap();
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    /**
     * Return URL handler for browser redirects.
     */
    public String handleReturn(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.handleReturn(params);
            case "momo":
                PaymentResponse momoResult = getGateway(PaymentMethod.MOMO).processCallback(params);
                if (momoResult.isSuccess()) {
                    extractAndFulfillOrder(params.get("orderId"));
                }
                return renderMomoResult(momoResult);
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    private void extractAndFulfillOrder(String txnRef) {
        if (txnRef == null || !txnRef.startsWith("TXN")) {
            return;
        }
        try {
            String idStr = txnRef.substring(3);
            if (idStr.contains("_")) {
                idStr = idStr.substring(0, idStr.indexOf("_"));
            }
            Long orderId = Long.parseLong(idStr);
            orderRepository.findById(orderId).ifPresent(this::fulfillOrder);
        } catch (Exception e) {
            log.error("Failed to fulfill order for txnRef {}: {}", txnRef, e.getMessage());
        }
    }

    private String renderMomoResult(PaymentResponse result) {
        boolean success = result.isSuccess();
        String title = success ? "Giao dịch thành công" : "Giao dịch không thành công";
        String color = success ? "#16a34a" : "#dc2626";
        String icon = success ? "✅" : "❌";
        String message = success ? "Thanh toán MoMo thành công" : result.getMessage();

        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <title>%s</title>
                    <style>
                        body {
                            margin: 0;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
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
                        .icon { font-size: 64px; margin-bottom: 16px; }
                        h2 { margin: 0 0 12px; color: %s; }
                        p { margin: 0; color: #555; font-size: 15px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="icon">%s</div>
                        <h2>%s</h2>
                        <p>%s</p>
                        <p style="margin-top: 8px; font-size: 13px; color: #94a3b8;">
                            Bạn sẽ được chuyển về trang chủ sau 5 giây...
                        </p>
                    </div>
                    <script>
                        setTimeout(function () {
                            window.location.href = "http://localhost:3000/home";
                        }, 5000);
                    </script>
                </body>
                </html>
                """.formatted(title, color, icon, title, message);
    }

    // =========================
    // TRANSACTION-BASED FLOW
    // =========================

    public PaymentResponse initiatePayment(PaymentRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new BusinessException("INVALID_AMOUNT", "Amount must be positive");
        }

        if (request.getPaymentMethod() == null) {
            throw new BusinessException("INVALID_PAYMENT_METHOD", "Payment method is required");
        }

        PaymentGateway gateway = getGateway(request.getPaymentMethod());

        PaymentTransaction transaction = PaymentTransaction.builder()
                .transactionNo(generateTransactionNo())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        if (request.getPaymentMethod() == PaymentMethod.QR) {
            try {
                return gateway.createPayment(request, transaction);
            } catch (Exception e) {
                throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create QR code: " + e.getMessage());
            }
        }

        try {
            return gateway.createPayment(request, transaction);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create payment: " + e.getMessage());
        }
    }

    public PaymentResponse processTransactionCallback(String providerName, Map<String, String> params) throws Exception {
        PaymentMethod method = parsePaymentMethod(providerName);
        PaymentGateway gateway = getGateway(method);
        PaymentResponse response = gateway.processCallback(params);
        if (response.isSuccess()) {
            extractAndFulfillOrder(params.get("orderId"));
        }
        return response;
    }

    @Transactional
    public PaymentResponse mockQrSuccess(String transactionNo) {
        PaymentTransaction transaction = transactionRepository.findByTransactionNo(transactionNo)
                .orElseThrow(() -> new BusinessException("TRANSACTION_NOT_FOUND", "Transaction not found"));

        if (transaction.getPaymentMethod() != PaymentMethod.QR) {
            throw new BusinessException("INVALID_OPERATION", "Only QR transactions can be mocked");
        }

        transaction.setStatus(PaymentStatus.SUCCESS);
        transaction.setPaidAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        extractAndFulfillOrder(transactionNo);

        return PaymentResponse.success(
                PaymentMethod.QR,
                transaction.getAmount(),
                transaction.getTransactionNo(),
                "Mock QR payment successful"
        );
    }

    private String generateTransactionNo() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String timestamp = now.format(formatter);

        Random random = new Random();
        int randomSuffix = 100000 + random.nextInt(900000);

        return "TXN" + timestamp + randomSuffix;
    }

    private PaymentGateway getGateway(PaymentMethod method) {
        return paymentGateways.stream()
                .filter(g -> g.getPaymentMethod() == method)
                .findFirst()
                .orElseThrow(() -> new BusinessException("UNSUPPORTED_PAYMENT_METHOD", "Payment method not supported: " + method));
    }

    private PaymentMethod parsePaymentMethod(String providerName) {
        try {
            return PaymentMethod.valueOf(providerName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("UNSUPPORTED_PAYMENT_PROVIDER", "Payment provider not supported: " + providerName);
        }
    }
}
