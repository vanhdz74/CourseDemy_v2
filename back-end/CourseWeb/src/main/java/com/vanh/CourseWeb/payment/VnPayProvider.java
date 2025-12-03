package com.vanh.CourseWeb.payment;

import com.vanh.CourseWeb.configurations.payment.VnPayConfig;
import com.vanh.CourseWeb.entity.OrderDetailEntity;
import com.vanh.CourseWeb.entity.OrderEntity;
import com.vanh.CourseWeb.entity.UserCourseEntity;
import com.vanh.CourseWeb.repository.OrderDetailRepository;
import com.vanh.CourseWeb.repository.OrderRepository;
import com.vanh.CourseWeb.repository.UserCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Component
public class VnPayProvider implements PaymentProvider {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserCourseRepository userCourseRepository;

    @Override
    public String createPaymentUrl(OrderEntity order, Map<String, String> extraParams) throws Exception {
        String bankCode = extraParams != null ? extraParams.get("bankCode") : null;
        String language = extraParams != null ? extraParams.get("language") : "vn";

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(Math.round(order.getTotalPrice() * 100)));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", String.valueOf(order.getId()));
        params.put("vnp_OrderInfo", "Thanh toan khoa hoc");
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", language);
        params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
        params.put("vnp_IpAddr", "127.0.0.1");

        if (bankCode != null) params.put("vnp_BankCode", bankCode);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        params.put("vnp_CreateDate", new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));

        // Build hashData
        String hashData = VnPayConfig.buildHashData(params);

        // create secure hash
        String secureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        // Build URL
        String queryUrl = VnPayConfig.buildQueryUrl(params) + "&vnp_SecureHash=" + secureHash;

        return VnPayConfig.vnp_PayUrl + "?" + queryUrl;
    }

    @Override
    public Map<String, String> processCallback(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String hashData = VnPayConfig.buildHashData(fields);
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equals(receivedHash)) {
            return Map.of("RspCode", "97", "Message", "Invalid Checksum");
        }

        // Cập nhạt order
        Long orderId = Long.parseLong(params.get("vnp_TxnRef"));
        OrderEntity order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        long amount = Long.parseLong(params.get("vnp_Amount"));
        if (amount != Math.round(order.getTotalPrice() * 100)) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        order.setStatus("00".equals(params.get("vnp_ResponseCode")) ? "PAID" : "FAILED");
        orderRepository.save(order);

        // Cập nhật vào user_course nếu thành công
        List<OrderDetailEntity> orderDetail = orderDetailRepository.findByOrderEntity_Id(order.getId());
        for (OrderDetailEntity orderDetailEntity : orderDetail) {
            UserCourseEntity userCourseEntity = new UserCourseEntity();
            userCourseEntity.setUserEntity(order.getUserEntity());
            userCourseEntity.setCourseEntity(orderDetailEntity.getCourseEntity());
            userCourseRepository.save(userCourseEntity);
        }

        return Map.of("RspCode", "00", "Message", "Confirm Success");
    }

    @Override
    public String handleReturn(Map<String, String> params) throws Exception {
        Map<String, String> fields = new HashMap<>(params);
        String receivedHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Tính lại hash
        String hashData = VnPayConfig.buildHashData(fields);
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData);

        if (!calculatedHash.equals(receivedHash)) {
            return "Chu ky khong hop le";
        }

        // Nếu thành công, gọi processCallback luôn
        if ("00".equals(params.get("vnp_ResponseCode"))) {
            Map<String, String> callbackResponse = processCallback(params);
            return "GD Thanh cong";
        } else {
            return "GD Khong thanh cong";
        }
    }

}
