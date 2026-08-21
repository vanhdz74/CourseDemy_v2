package com.coursedemy.payment.service;

import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.OrderEntity;
import com.coursedemy.payment.entity.PaymentTransaction;
import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import com.coursedemy.payment.payment.PaymentGateway;
import com.coursedemy.payment.payment.PaymentProvider;
import com.coursedemy.payment.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentProvider vnPayProvider;
    private final List<PaymentGateway> paymentGateways;
    private final PaymentTransactionRepository transactionRepository;

    // =========================
    // LEGACY FLOW (Order-based)
    // =========================

    /**
     * Legacy method for course-based payment flow.
     * Creates payment URL for an existing Order.
     */
    public String getPaymentUrl(OrderEntity order, String providerName, Map<String, String> extraParams) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.createPaymentUrl(order, extraParams);
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
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
                // Route MoMo callbacks to the new gateway
                return getGateway(PaymentMethod.MOMO).processCallback(params).toMap();
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    /**
     * Legacy return URL handler.
     */
    public String handleReturn(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.handleReturn(params);
            case "momo":
                PaymentResponse momoResult = getGateway(PaymentMethod.MOMO).processCallback(params);
                return renderMomoResult(momoResult);
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    /**
     * Render a simple HTML result page after the MoMo payment redirect.
     */
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
    // NEW FLOW (Transaction-based)
    // =========================

    /**
     * Initiate a new payment transaction.
     * Creates a PaymentTransaction and delegates to the appropriate gateway.
     */
    public PaymentResponse initiatePayment(PaymentRequest request) {
        // Validate amount
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new BusinessException("INVALID_AMOUNT", "Amount must be positive");
        }

        // Validate payment method
        if (request.getPaymentMethod() == null) {
            throw new BusinessException("INVALID_PAYMENT_METHOD", "Payment method is required");
        }

        // Find the gateway
        PaymentGateway gateway = getGateway(request.getPaymentMethod());

        // Generate transaction
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

        // QR mock flow is intentionally local-only, no external gateway needed.
        if (request.getPaymentMethod() == PaymentMethod.QR) {
            return PaymentResponse.pending(
                    PaymentMethod.QR,
                    request.getAmount(),
                    transaction.getTransactionNo(),
                    null,
                    "data:image/png;base64,MOCK",
                    "QR payment created successfully"
            );
        }

        // Delegate to gateway
        try {
            return gateway.createPayment(request, transaction);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create payment: " + e.getMessage());
        }
    }

    /**
     * Process callback for transaction-based payments.
     * Routes to the appropriate gateway based on the provider.
     */
    public PaymentResponse processTransactionCallback(String providerName, Map<String, String> params) throws Exception {
        PaymentMethod method = parsePaymentMethod(providerName);
        PaymentGateway gateway = getGateway(method);
        return gateway.processCallback(params);
    }

    /**
     * Simulate QR payment success for MOCK/TEST purposes.
     * This is ONLY for QR demo flow - QR has no real callback.
     */
    public PaymentResponse mockQrSuccess(String transactionNo) {
        PaymentTransaction transaction = transactionRepository.findByTransactionNo(transactionNo)
                .orElseThrow(() -> new BusinessException("TRANSACTION_NOT_FOUND", "Transaction not found"));

        if (transaction.getPaymentMethod() != PaymentMethod.QR) {
            throw new BusinessException("INVALID_OPERATION", "Only QR transactions can be mocked");
        }

        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentResponse.success(
                    PaymentMethod.QR,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Transaction already processed"
            );
        }

        // Mark as successful
        transaction.setStatus(PaymentStatus.SUCCESS);
        transaction.setPaidAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return PaymentResponse.success(
                PaymentMethod.QR,
                transaction.getAmount(),
                transaction.getTransactionNo(),
                "Mock QR payment successful"
        );
    }

    // =========================
    // Helper Methods
    // =========================

    /**
     * Generate a unique transaction number.
     * Format: TXN{yyyyMMddHHmmssSSS}{random 6 digits}
     */
    private String generateTransactionNo() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String timestamp = now.format(formatter);

        Random random = new Random();
        int randomSuffix = 100000 + random.nextInt(900000);

        return "TXN" + timestamp + randomSuffix;
    }

    /**
     * Get the gateway for a payment method.
     */
    private PaymentGateway getGateway(PaymentMethod method) {
        return paymentGateways.stream()
                .filter(g -> g.getPaymentMethod() == method)
                .findFirst()
                .orElseThrow(() -> new BusinessException("UNSUPPORTED_PAYMENT_METHOD", "Payment method not supported"));
    }

    /**
     * Parse provider name to PaymentMethod.
     */
    private PaymentMethod parsePaymentMethod(String providerName) {
        try {
            return PaymentMethod.valueOf(providerName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("UNSUPPORTED_PAYMENT_PROVIDER", "Payment provider not supported");
        }
    }
}
