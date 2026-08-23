package com.coursedemy.user.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpStorage {

    private final RedisTemplate<String, String> redisTemplate;

    public void storeOtp(String email, String otp) {
        redisTemplate.opsForValue().set(email, otp, Duration.ofMinutes(5));
    }

    public String getOtp(String email) {
        return redisTemplate.opsForValue().get(email);
    }

    public void clearOtp(String email) {
        redisTemplate.delete(email);
    }
}
