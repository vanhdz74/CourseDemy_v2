package com.coursedemy.user.service;

public interface MailService {
    void sendOtpEmail(String to, String otp);
    void sendNewPwEmail(String to, String newPw);
}
