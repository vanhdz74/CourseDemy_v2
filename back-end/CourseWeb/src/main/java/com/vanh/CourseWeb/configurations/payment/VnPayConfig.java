package com.vanh.CourseWeb.configurations.payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;
import java.util.stream.Collectors;

public class VnPayConfig {

    // Thông số VNPAY, thay bằng thông tin thực của bạn
    public static String vnp_TmnCode = "MLJTH4YU";
    public static String vnp_HashSecret = "YNKU79AG9B05Q3CXQ00D43K9CR8A5J9P";
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_Returnurl = "http://localhost:8080/api/payment/vnpay/return";

    // Hàm tạo HMAC SHA512
    public static String hmacSHA512(String key, String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA512");
        hmac.init(secretKey);
        byte[] hashBytes = hmac.doFinal(data.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder(2 * hashBytes.length);
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }

    // Hàm tạo hash cho tất cả fields, theo VNPAY yêu cầu
    public static String hashAllFields(Map<String, String> fields) {
        // Sắp xếp key theo ASCII
        String hashData = fields.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
        try {
            return hmacSHA512(vnp_HashSecret, hashData);
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing fields", e);
        }
    }
}
