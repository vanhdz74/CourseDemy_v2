package com.coursedemy.gateway.constant;

public final class AuthResponseMessage {
    public static final String LOGIN_SUCCESS = "Đăng nhập thành công";
    public static final String REFRESH_TOKEN_SUCCESS = "Refresh token thành công";
    public static final String REGISTER_SUCCESS = "Tạo tài khoản thành công";
    public static final String SEND_OTP_SUCCESS = "OTP đã được gửi";
    public static final String VERIFY_OTP_SUCCESS = "OTP đúng. Mật khẩu mới đã được gửi về email";
    public static final String RESET_PASSWORD_SUCCESS = "Đổi mật khẩu thành công";

    private AuthResponseMessage() {
    }
}
