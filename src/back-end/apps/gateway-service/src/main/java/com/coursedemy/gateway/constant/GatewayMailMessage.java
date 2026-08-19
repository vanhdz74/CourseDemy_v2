package com.coursedemy.gateway.constant;

public final class GatewayMailMessage {
    public static final String OTP_EMAIL_SUBJECT = "OTP lấy lại mật khẩu";
    public static final String NEW_PASSWORD_EMAIL_SUBJECT = "Mật khẩu mới";

    private static final String OTP_EMAIL_BODY_TEMPLATE = "Mã OTP của bạn: %s\nHiệu lực: 5 phút";
    private static final String NEW_PASSWORD_EMAIL_BODY_TEMPLATE = "Mật khẩu mới: %s\nHãy đăng nhập và đổi mật khẩu ngay";

    private GatewayMailMessage() {
    }

    public static String otpEmailBody(String otp) {
        return OTP_EMAIL_BODY_TEMPLATE.formatted(otp);
    }

    public static String newPasswordEmailBody(String newPassword) {
        return NEW_PASSWORD_EMAIL_BODY_TEMPLATE.formatted(newPassword);
    }
}
