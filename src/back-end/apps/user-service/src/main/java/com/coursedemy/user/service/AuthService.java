package com.coursedemy.user.service;

import com.coursedemy.user.dto.request.UserRegisterRequest;
import com.coursedemy.user.dto.response.AuthTokenResponse;

public interface AuthService {
    AuthTokenResponse login(String email, String password) throws Exception;
    AuthTokenResponse refreshToken(String refreshToken) throws Exception;
    AuthTokenResponse createUser(UserRegisterRequest request) throws Exception;
    void sendOtpEmail(String email);
    void verifyOtpAndSendNewPassword(String email, String otp);
    void resetPassword(String email, String curPassword, String password, String retypePw) throws Exception;
}
