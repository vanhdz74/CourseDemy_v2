package com.vanh.CourseWeb.payment;

import com.vanh.CourseWeb.configurations.payment.VnPayConfig;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.repository.OrderRepository;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class VnPayProvider implements PaymentProvider {

    private final OrderRepository orderRepository;

    public VnPayProvider(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public String createPaymentUrl(OrderEntity order, Map<String, String> extraParams) throws Exception {
        String bankCode = extraParams != null ? extraParams.get("bankCode") : null;
        String language = extraParams != null ? extraParams.get("language") : "vn";

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(order.getId());
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;

        long amount = Math.round(order.getTotalPrice() * 100);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        if (bankCode != null) vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toán khóa học");
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", language);
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return VnPayConfig.vnp_PayUrl + "?" + query.toString();
    }

    @Override
    public Map<String, String> processCallback(Map<String, String> params) throws Exception {
        Map<String, String> response = new HashMap<>();
        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String vnp_SecureHash = params.get("vnp_SecureHash");
        String signValue = VnPayConfig.hashAllFields(fields);

        if (!signValue.equals(vnp_SecureHash)) {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum");
            return response;
        }

        Long orderId = Long.parseLong(params.get("vnp_TxnRef"));
        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null || !"PENDING".equals(order.getStatus())) {
            response.put("RspCode", "01");
            response.put("Message", "Order not found or already confirmed");
            return response;
        }

        long amount = Long.parseLong(params.get("vnp_Amount"));
        if (amount != Math.round(order.getTotalPrice() * 100)) {
            response.put("RspCode", "04");
            response.put("Message", "Invalid amount");
            return response;
        }

        if ("00".equals(params.get("vnp_ResponseCode"))) order.setStatus("SUCCESS");
        else order.setStatus("FAILED");
        orderRepository.save(order);

        response.put("RspCode", "00");
        response.put("Message", "Confirm Success");
        return response;
    }

    @Override
    public String handleReturn(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String vnp_SecureHash = params.get("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String signValue = VnPayConfig.hashAllFields(fields);
        if (!signValue.equals(vnp_SecureHash)) return "Chu ky khong hop le";
        return "00".equals(params.get("vnp_ResponseCode")) ? "GD Thanh cong" : "GD Khong thanh cong";
    }
}
