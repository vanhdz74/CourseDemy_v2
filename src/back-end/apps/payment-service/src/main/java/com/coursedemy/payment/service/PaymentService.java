package com.coursedemy.payment.service;

import com.coursedemy.payment.entity.OrderEntity;
import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.payment.payment.PaymentProvider;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {

    // Bạn có thể inject nhiều provider khác nhau
    private final PaymentProvider vnPayProvider;

    public PaymentService(PaymentProvider vnPayProvider) {
        this.vnPayProvider = vnPayProvider;
    }

    // Lấy URL thanh toán theo provider
    public String getPaymentUrl(OrderEntity order, String providerName, Map<String, String> extraParams) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.createPaymentUrl(order, extraParams);
            // case "momo": return momoProvider.createPaymentUrl(...)
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    public Map<String, String> handleCallback(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.processCallback(params);
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }

    public String handleReturn(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.handleReturn(params);
            default:
                throw new BusinessException(ErrorCode.UNSUPPORTED_PAYMENT_PROVIDER);
        }
    }
}
