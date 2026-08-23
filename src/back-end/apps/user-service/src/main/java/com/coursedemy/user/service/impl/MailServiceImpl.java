package com.coursedemy.user.service.impl;

import com.coursedemy.user.constant.UserMailMessage;
import com.coursedemy.user.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(UserMailMessage.OTP_EMAIL_SUBJECT);
        msg.setText(UserMailMessage.otpEmailBody(otp));
        mailSender.send(msg);
    }

    @Override
    public void sendNewPwEmail(String to, String newPw) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(UserMailMessage.NEW_PASSWORD_EMAIL_SUBJECT);
        msg.setText(UserMailMessage.newPasswordEmailBody(newPw));
        mailSender.send(msg);
    }
}
