package com.coursedemy.payment.dto;

import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private boolean success;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private Double amount;
    private String transactionId;
    private String paymentUrl;
    private String qrCode; // Base64 data URI for QR payments
    private String message;

    // Factory methods for convenience
    public static PaymentResponse pending(PaymentMethod method, Double amount, String transactionId, String paymentUrl, String qrCode, String message) {
        return PaymentResponse.builder()
                .success(true)
                .paymentMethod(method)
                .status(PaymentStatus.PENDING)
                .amount(amount)
                .transactionId(transactionId)
                .paymentUrl(paymentUrl)
                .qrCode(qrCode)
                .message(message)
                .build();
    }

    public static PaymentResponse success(PaymentMethod method, Double amount, String transactionId, String message) {
        return PaymentResponse.builder()
                .success(true)
                .paymentMethod(method)
                .status(PaymentStatus.SUCCESS)
                .amount(amount)
                .transactionId(transactionId)
                .message(message)
                .build();
    }

    public static PaymentResponse failed(PaymentMethod method, Double amount, String transactionId, String message) {
        return PaymentResponse.builder()
                .success(false)
                .paymentMethod(method)
                .status(PaymentStatus.FAILED)
                .amount(amount)
                .transactionId(transactionId)
                .message(message)
                .build();
    }

    public static PaymentResponse error(String message) {
        return PaymentResponse.builder()
                .success(false)
                .status(PaymentStatus.FAILED)
                .message(message)
                .build();
    }

    /**
     * Convert to Map for backward compatibility with legacy IPN responses.
     */
    public java.util.Map<String, String> toMap() {
        java.util.Map<String, String> map = new HashMap<>();
        map.put("success", String.valueOf(this.success));
        map.put("paymentMethod", this.paymentMethod != null ? this.paymentMethod.name() : null);
        map.put("status", this.status != null ? this.status.name() : null);
        map.put("amount", this.amount != null ? this.amount.toString() : null);
        map.put("transactionId", this.transactionId);
        map.put("paymentUrl", this.paymentUrl);
        map.put("qrCode", this.qrCode);
        map.put("message", this.message);
        return map;
    }
}
