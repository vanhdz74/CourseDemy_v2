package com.coursedemy.gateway.service;

import com.coursedemy.gateway.dto.request.UserRegisterRequest;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    AuthTokenResponse login(String email, String password);

    AuthTokenResponse refreshToken(String refreshToken);

    AuthTokenResponse createUser(UserRegisterRequest request);

    void sendOtpEmail(String email);

    void verifyOtpAndSendNewPassword(String email, String otp);

    void resetPassword(String email, String currentPassword, String newPassword, String confirmPassword);
}
