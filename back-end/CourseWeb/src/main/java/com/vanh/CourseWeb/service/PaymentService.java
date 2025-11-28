package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.payment.PaymentProvider;
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
                throw new RuntimeException("Unsupported payment provider");
        }
    }

    public Map<String, String> handleCallback(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.processCallback(params);
            default:
                throw new RuntimeException("Unsupported payment provider");
        }
    }

    public String handleReturn(String providerName, Map<String, String> params) throws Exception {
        switch (providerName.toLowerCase()) {
            case "vnpay":
                return vnPayProvider.handleReturn(params);
            default:
                throw new RuntimeException("Unsupported payment provider");
        }
    }
}
