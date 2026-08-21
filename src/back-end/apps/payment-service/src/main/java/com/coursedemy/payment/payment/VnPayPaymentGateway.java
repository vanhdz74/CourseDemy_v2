package com.coursedemy.payment.payment;

import com.coursedemy.payment.config.payment.VnPayConfig;
import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.PaymentTransaction;
import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import com.coursedemy.payment.repository.PaymentTransactionRepository;
import com.coursedemy.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * VNPay Payment Gateway for amount-based payments (Sandbox/Test environment).
 * This is separate from the legacy VnPayProvider which handles OrderEntity-based payments.
 */
@Component
@RequiredArgsConstructor
public class VnPayPaymentGateway implements PaymentGateway {

    private final PaymentTransactionRepository transactionRepository;

    // Transaction prefix for disambiguation with legacy order-based flow
    private static final String TRANSACTION_PREFIX = "TXN";

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.VNPAY;
    }

    @Override
    public PaymentResponse createPayment(PaymentRequest request, PaymentTransaction transaction) throws Exception {
        // Fail fast if VNPay credentials are not configured (empty values would
        // produce a payment URL that VNPay sandbox rejects).
        if (VnPayConfig.vnp_TmnCode == null || VnPayConfig.vnp_TmnCode.isBlank()) {
            throw new BusinessException("VNPAY_CONFIG_MISSING", "VNPAY_TMN_CODE is not configured");
        }
        if (VnPayConfig.vnp_HashSecret == null || VnPayConfig.vnp_HashSecret.isBlank()) {
            throw new BusinessException("VNPAY_CONFIG_MISSING", "VNPAY_HASH_SECRET is not configured");
        }

        String ipAddress = "127.0.0.1";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createDate = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        Map<String, String> params = new HashMap<>();

        // VNPay requires amount in VND * 100 (smallest unit)
        long amount = Math.round(request.getAmount() * 100D);
        if (amount < 500000 || String.valueOf(amount).length() > 12) {
            throw new IllegalArgumentException("Invalid VNPAY amount: " + amount + ". Minimum is 5,000 VND.");
        }

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        // Use transactionNo as the reference (prefixed with TXN for disambiguation)
        params.put("vnp_TxnRef", transaction.getTransactionNo());
        params.put("vnp_OrderInfo", "CourseDemy Payment " + transaction.getTransactionNo());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
        params.put("vnp_IpAddr", ipAddress);

        params.put("vnp_CreateDate", createDate.format(formatter));
        params.put("vnp_ExpireDate", createDate.plusMinutes(15).format(formatter));

        // Build hashData
        String hashData = VnPayConfig.buildHashData(params);

        // Create secure hash
        String secureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        // Build URL
        String queryUrl = VnPayConfig.buildQueryUrl(params) + "&vnp_SecureHash=" + secureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        return PaymentResponse.pending(
                PaymentMethod.VNPAY,
                request.getAmount(),
                transaction.getTransactionNo(),
                paymentUrl,
                null,
                "VNPay payment created successfully"
        );
    }

    @Override
    public PaymentResponse processCallback(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Verify signature
        String hashData = VnPayConfig.buildHashData(fields);
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equals(receivedHash)) {
            return PaymentResponse.error("Invalid VNPay signature");
        }

        // Get transaction reference
        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null || !txnRef.startsWith(TRANSACTION_PREFIX)) {
            // This is a legacy order-based callback, not for this gateway
            return PaymentResponse.error("Transaction not found for this gateway");
        }

        // Find transaction
        PaymentTransaction transaction = transactionRepository.findByTransactionNo(txnRef)
                .orElse(null);

        if (transaction == null) {
            return PaymentResponse.error("Transaction not found: " + txnRef);
        }

        // Check idempotency - already processed
        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentResponse.success(
                    PaymentMethod.VNPAY,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Transaction already processed"
            );
        }

        // Validate amount
        long callbackAmount = Long.parseLong(params.get("vnp_Amount"));
        long expectedAmount = Math.round(transaction.getAmount() * 100);
        if (callbackAmount != expectedAmount) {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setErrorMessage("Invalid amount in callback");
            transaction.setProviderResponseCode("04");
            transactionRepository.save(transaction);
            return PaymentResponse.failed(
                    PaymentMethod.VNPAY,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Invalid amount"
            );
        }

        // Update transaction based on response code
        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            transaction.setStatus(PaymentStatus.SUCCESS);
            transaction.setProviderTransactionId(params.get("vnp_TransactionNo"));
            transaction.setProviderResponseCode(responseCode);
            transaction.setPaidAt(LocalDateTime.now());
        } else {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setProviderResponseCode(responseCode);
            transaction.setErrorMessage(params.get("vnp_Message"));
        }
        transaction.setUpdatedAt(LocalDateTime.now());
        transaction.setCallbackPayload(params.toString());
        transactionRepository.save(transaction);

        if ("00".equals(responseCode)) {
            return PaymentResponse.success(
                    PaymentMethod.VNPAY,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Payment successful"
            );
        } else {
            return PaymentResponse.failed(
                    PaymentMethod.VNPAY,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Payment failed: " + params.get("vnp_Message")
            );
        }
    }
}
