package com.coursedemy.payment.payment;

import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.PaymentTransaction;

import java.util.Map;

/**
 * Strategy interface for payment providers.
 * Each provider (QR, VNPAY, MOMO) implements this interface.
 */
public interface PaymentGateway {

    /**
     * Get the payment method this gateway handles.
     */
    com.coursedemy.payment.enums.PaymentMethod getPaymentMethod();

    /**
     * Create a payment and return the payment URL or QR code.
     *
     * @param request   Payment request containing amount and payment method
     * @param transaction The payment transaction entity (already created with PENDING status)
     * @return PaymentResponse with payment details
     */
    PaymentResponse createPayment(PaymentRequest request, PaymentTransaction transaction) throws Exception;

    /**
     * Process callback/IPN from the payment provider.
     * Must verify the signature before processing.
     *
     * @param params Callback parameters from the provider
     * @return PaymentResponse with updated status
     */
    PaymentResponse processCallback(Map<String, String> params) throws Exception;
}
