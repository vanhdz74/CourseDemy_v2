package com.vanh.CourseWeb.configurations.payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VnPayConfig {

    public static String vnp_TmnCode = "MLJTH4YU";
    public static String vnp_HashSecret = "YNKU79AG9B05Q3CXQ00D43K9CR8A5J9P";
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_Returnurl = "http://localhost:8080/api/payment/vnpay/return";

    // HMAC SHA512
    public static String hmacSHA512(String key, String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] hashBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) sb.append(String.format("%02x", b & 0xff));
        return sb.toString();
    }

    // Tạo rawData để ký (CHUẨN VNPAY)
    public static String buildHashData(Map<String, String> fields) throws Exception {
        List<String> keys = new ArrayList<>(fields.keySet());
        Collections.sort(keys);

        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            String value = fields.get(key);
            if (value != null && !value.isEmpty()) {
                sb.append(key).append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                sb.append("&");
            }
        }
        sb.setLength(sb.length() - 1); // remove last '&'
        return sb.toString();
    }

    // Xây query URL (tương tự hashData nhưng không để encode dữ liệu raw)
    public static String buildQueryUrl(Map<String, String> fields) throws Exception {
        List<String> keys = new ArrayList<>(fields.keySet());
        Collections.sort(keys);

        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            String value = fields.get(key);
            if (value != null && !value.isEmpty()) {
                sb.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString()));
                sb.append("=");
                sb.append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                sb.append("&");
            }
        }
        sb.setLength(sb.length() - 1);
        return sb.toString();
    }
}
