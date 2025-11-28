package com.vanh.CourseWeb.payment;

import com.vanh.CourseWeb.entity.OrderEntity;

import java.util.Map;

public interface PaymentProvider {
    // Tạo URL thanh toán từ Order
    String createPaymentUrl(OrderEntity order, Map<String, String> extraParams) throws Exception;

    // Xử lý callback/IPN từ provider
    Map<String, String> processCallback(Map<String, String> params) throws Exception;

    // Xử lý Return URL
    String handleReturn(Map<String, String> params) throws Exception;
}
