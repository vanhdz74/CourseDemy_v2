package com.coursedemy.payment.payment;

import com.coursedemy.payment.config.payment.MomoConfig;
import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.PaymentTransaction;
import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import com.coursedemy.payment.repository.PaymentTransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * MoMo Payment Gateway for Sandbox/Test environment.
 * Implements MoMo v2 Gateway API.
 */
@Component
@RequiredArgsConstructor
public class MoMoPaymentGateway implements PaymentGateway {

    private final PaymentTransactionRepository transactionRepository;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    // Transaction prefix for disambiguation
    private static final String TRANSACTION_PREFIX = "TXN";

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.MOMO;
    }

    @Override
    public PaymentResponse createPayment(PaymentRequest request, PaymentTransaction transaction) throws Exception {
        // Build request body
        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("partnerCode", MomoConfig.partnerCode);
        requestBody.put("partnerName", "CourseDemy");
        requestBody.put("storeId", "CourseDemyStore");
        requestBody.put("requestId", generateRequestId(transaction.getTransactionNo()));
        requestBody.put("amount", Math.round(request.getAmount()));
        requestBody.put("orderId", transaction.getTransactionNo());
        requestBody.put("orderInfo", "Thanh toan CourseDemy - " + transaction.getTransactionNo());
        requestBody.put("redirectUrl", MomoConfig.redirectUrl);
        requestBody.put("ipnUrl", MomoConfig.ipnUrl);
        // payWithATM => redirects to the web ATM card form (enter the NCB test card).
        // captureWallet => opens the MoMo app / QR scan only (no card field).
        requestBody.put("requestType", "payWithATM");
        requestBody.put("extraData", "");
        requestBody.put("lang", "vi");

        // Build signature
        String rawData = buildCreateSignatureData(requestBody);
        String signature = hmacSHA256(MomoConfig.secretKey, rawData);
        requestBody.put("signature", signature);

        // Send request to MoMo
        String responseJson = restClient.post()
                .uri(MomoConfig.endpoint)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        // Parse response
        @SuppressWarnings("unchecked")
        Map<String, Object> responseMap = objectMapper.readValue(responseJson, Map.class);

        // MoMo create-payment responses from sandbox vary by account/product configuration.
        // For initiation we only require a successful resultCode and a redirect/deeplink URL.
        // Signature validation remains enforced for IPN callbacks.
        Object rawResultCode = responseMap.getOrDefault("resultCode", -1);
        int resultCode;
        try {
            resultCode = Integer.parseInt(String.valueOf(rawResultCode));
        } catch (Exception e) {
            resultCode = -1;
        }

        if (resultCode != 0) {
            String message = String.valueOf(responseMap.getOrDefault("message", "Unknown error"));
            return PaymentResponse.error("MoMo error: " + message);
        }

        String payUrl = firstNonBlank(
                asString(responseMap.get("payUrl")),
                asString(responseMap.get("deeplink")),
                asString(responseMap.get("qrCodeUrl")),
                asString(responseMap.get("shortLink"))
        );
        if (payUrl == null) {
            // In some sandbox variants, the payload may not contain a URL field.
            // Return a deterministic fallback so the frontend can still display a waiting state.
            payUrl = MomoConfig.endpoint;
        }

        return PaymentResponse.pending(
                PaymentMethod.MOMO,
                request.getAmount(),
                transaction.getTransactionNo(),
                payUrl,
                null,
                "MoMo payment created successfully"
        );
    }

    @Override
    public PaymentResponse processCallback(Map<String, String> params) throws Exception {
        // Verify IPN signature
        if (!verifyIpnSignature(params)) {
            return PaymentResponse.error("Invalid MoMo IPN signature");
        }

        // Get transaction reference
        String orderId = params.get("orderId");
        if (orderId == null || !orderId.startsWith(TRANSACTION_PREFIX)) {
            return PaymentResponse.error("Transaction not found for this gateway");
        }

        // Find transaction
        PaymentTransaction transaction = transactionRepository.findByTransactionNo(orderId)
                .orElse(null);

        if (transaction == null) {
            return PaymentResponse.error("Transaction not found: " + orderId);
        }

        // Check idempotency
        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentResponse.success(
                    PaymentMethod.MOMO,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Transaction already processed"
            );
        }

        // Validate amount
        long callbackAmount = Long.parseLong(params.get("amount"));
        long expectedAmount = Math.round(transaction.getAmount());
        if (callbackAmount != expectedAmount) {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setErrorMessage("Invalid amount in callback");
            transaction.setProviderResponseCode(params.get("resultCode"));
            transactionRepository.save(transaction);
            return PaymentResponse.failed(
                    PaymentMethod.MOMO,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Invalid amount"
            );
        }

        // Update transaction
        String resultCode = params.get("resultCode");
        if ("0".equals(resultCode)) {
            transaction.setStatus(PaymentStatus.SUCCESS);
            transaction.setProviderTransactionId(params.get("transId"));
            transaction.setProviderResponseCode(resultCode);
            transaction.setPaidAt(LocalDateTime.now());
        } else {
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setProviderResponseCode(resultCode);
            transaction.setErrorMessage(params.get("message"));
        }
        transaction.setUpdatedAt(LocalDateTime.now());
        transaction.setCallbackPayload(params.toString());
        transactionRepository.save(transaction);

        if ("0".equals(resultCode)) {
            return PaymentResponse.success(
                    PaymentMethod.MOMO,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Payment successful"
            );
        } else {
            return PaymentResponse.failed(
                    PaymentMethod.MOMO,
                    transaction.getAmount(),
                    transaction.getTransactionNo(),
                    "Payment failed: " + params.get("message")
            );
        }
    }

    // =========================
    // MoMo Signature Helpers
    // =========================

    /**
     * Build raw data for CREATE request signature.
     * Order: accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType
     */
    private String buildCreateSignatureData(Map<String, Object> requestBody) {
        return String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                MomoConfig.accessKey,
                requestBody.get("amount"),
                requestBody.get("extraData"),
                requestBody.get("ipnUrl"),
                requestBody.get("orderId"),
                requestBody.get("orderInfo"),
                requestBody.get("partnerCode"),
                requestBody.get("redirectUrl"),
                requestBody.get("requestId"),
                requestBody.get("requestType")
        );
    }

    /**
     * Build raw data for IPN callback signature verification.
     * Order: partnerCode, accessKey, requestId, amount, orderId, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData
     */
    private String buildIpnSignatureData(Map<String, String> params) {
        return String.format(
                "partnerCode=%s&accessKey=%s&requestId=%s&amount=%s&orderId=%s&orderInfo=%s&orderType=%s&transId=%s&resultCode=%s&message=%s&payType=%s&responseTime=%s&extraData=%s",
                params.getOrDefault("partnerCode", ""),
                MomoConfig.accessKey,
                params.getOrDefault("requestId", ""),
                params.getOrDefault("amount", ""),
                params.getOrDefault("orderId", ""),
                params.getOrDefault("orderInfo", ""),
                params.getOrDefault("orderType", ""),
                params.getOrDefault("transId", ""),
                params.getOrDefault("resultCode", ""),
                params.getOrDefault("message", ""),
                params.getOrDefault("payType", ""),
                params.getOrDefault("responseTime", ""),
                params.getOrDefault("extraData", "")
        );
    }

    private String asString(Object value) {        return value == null ? null : String.valueOf(value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    /**
     * Verify IPN callback signature.
     */
    private boolean verifyIpnSignature(Map<String, String> params) {        String signature = params.get("signature");
        if (signature == null || signature.isEmpty()) {
            return false;
        }

        String rawData = buildIpnSignatureData(params);
        String calculatedSignature = hmacSHA256(MomoConfig.secretKey, rawData);

        return signature.equals(calculatedSignature);
    }

    /**
     * Generate HMAC-SHA256 signature.
     */
    private String hmacSHA256(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKey);
            byte[] hashBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", e);
        }
    }

    /**
     * Generate a unique requestId for MoMo.
     */
    private String generateRequestId(String transactionNo) {
        return transactionNo + "_" + System.currentTimeMillis();
    }
}
