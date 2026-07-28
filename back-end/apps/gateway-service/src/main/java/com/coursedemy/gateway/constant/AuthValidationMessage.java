package com.coursedemy.gateway.constant;

public final class AuthValidationMessage {
    public static final String EMAIL_REQUIRED = "Email không được để trống";
    public static final String EMAIL_INVALID = "Email không hợp lệ";
    public static final String PASSWORD_REQUIRED = "Mật khẩu không được để trống";
    public static final String RETYPE_PASSWORD_REQUIRED = "Mật khẩu nhập lại không được để trống";
    public static final String CURRENT_PASSWORD_REQUIRED = "Mật khẩu hiện tại không được để trống";
    public static final String NEW_PASSWORD_REQUIRED = "Mật khẩu mới không được để trống";
    public static final String CONFIRM_PASSWORD_REQUIRED = "Xác nhận mật khẩu không được để trống";
    public static final String USERNAME_REQUIRED = "Tên người dùng không được để trống";
    public static final String PHONE_NUMBER_REQUIRED = "Số điện thoại không được để trống";
    public static final String ROLE_REQUIRED = "Vai trò không được để trống";
    public static final String REFRESH_TOKEN_REQUIRED = "Refresh token không được để trống";
    public static final String OTP_REQUIRED = "OTP không được để trống";

    private AuthValidationMessage() {
    }
}
