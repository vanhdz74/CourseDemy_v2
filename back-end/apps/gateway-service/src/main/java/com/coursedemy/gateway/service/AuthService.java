package com.coursedemy.gateway.service;

import com.coursedemy.gateway.dto.UserDTO;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    AuthTokenResponse login(String email, String password) throws Exception;

    AuthTokenResponse refreshToken(String refreshToken) throws Exception;

    AuthTokenResponse createUser(UserDTO userDTO) throws Exception;

    void sendOtpEmail(String email);

    void verifyOtpAndSendNewPassword(String email, String otp);

    void resetPassword(String email, String curPassword, String password, String retypepassword) throws Exception;
}
