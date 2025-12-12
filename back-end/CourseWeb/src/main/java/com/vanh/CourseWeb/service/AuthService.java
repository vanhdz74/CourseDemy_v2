package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AuthService {
    String login(String email, String password) throws Exception;

    UserEntity createUser(UserDTO userDTO) throws Exception;


    void sendOtpEmail(String email);

    void verifyOtpAndSendNewPassword(String email, String otp);

    void resetPassword(String email, String password, String retypepassword) throws Exception;
}
