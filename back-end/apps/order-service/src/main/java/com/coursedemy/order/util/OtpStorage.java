package com.coursedemy.order.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class OtpStorage {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // Lưu OTP với thời gian hết hạn 5 phút
    public void storeOtp(String email, String otp) {
        redisTemplate
                .opsForValue()
                .set(email, otp, Duration.ofMinutes(5));  // Lưu trong 5 phút
        if (redisTemplate == null) {
            System.out.println("redisTemplate is NULL!");
        }
    }

    // Lấy OTP
    public String getOtp(String email) {
        return redisTemplate.opsForValue().get(email);
    }

    // Xóa OTP sau khi dùng
    public void clearOtp(String email) {
        redisTemplate.delete(email);
    }
}
