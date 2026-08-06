package com.coursedemy.gateway.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("OTP lấy lại mật khẩu");
        msg.setText("Mã OTP của bạn: " + otp + "\nHiệu lực: 5 phút");
        mailSender.send(msg);
    }

    public void sendNewPwEmail(String to, String newPw) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Mật khẩu mới");
        msg.setText("Mật khẩu mới: " + newPw + "\nHãy đăng nhập và đổi mật khẩu ngay");
        mailSender.send(msg);
    }
}
