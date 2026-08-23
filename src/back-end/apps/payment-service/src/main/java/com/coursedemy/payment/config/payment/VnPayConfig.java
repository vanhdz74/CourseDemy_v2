package com.coursedemy.payment.config.payment;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class VnPayConfig {

    public static String vnp_TmnCode;
    public static String vnp_HashSecret;
    public static String vnp_PayUrl;
    public static String vnp_Returnurl;

    @Value("${vnpay.tmn-code:87UOU6Q8}")
    public void setTmnCode(String tmnCode) {
        VnPayConfig.vnp_TmnCode = (tmnCode != null && !tmnCode.isBlank()) ? tmnCode : "87UOU6Q8";
    }

    @Value("${vnpay.hash-secret:U7378A5VYY03N3L40F5S2995K7BXZ97Y}")
    public void setHashSecret(String hashSecret) {
        VnPayConfig.vnp_HashSecret = (hashSecret != null && !hashSecret.isBlank()) ? hashSecret : "U7378A5VYY03N3L40F5S2995K7BXZ97Y";
    }

    @Value("${vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    public void setPayUrl(String payUrl) {
        VnPayConfig.vnp_PayUrl = payUrl;
    }

    @Value("${vnpay.return-url:http://localhost:8080/api/payment/vnpay/return}")
    public void setReturnUrl(String returnUrl) {
        VnPayConfig.vnp_Returnurl = returnUrl;
    }

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

    // Tạo rawData để ký (theo đúng code mẫu Java chính thức của VNPAY:
    // sắp xếp key tăng dần, giá trị URL-encode trước khi HMAC-SHA512)
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
