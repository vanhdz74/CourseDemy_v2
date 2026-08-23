package com.coursedemy.user.constant;

public final class UserValidationMessage {
    public static final String EMAIL_REQUIRED = "Email không được để trống";
    public static final String PASSWORD_REQUIRED = "Mật khẩu không được để trống";
    public static final String OTP_REQUIRED = "OTP không được để trống";
    public static final String CURRENT_PASSWORD_REQUIRED = "Mật khẩu hiện tại không được để trống";
    public static final String NEW_PASSWORD_REQUIRED = "Mật khẩu mới không được để trống";
    public static final String CONFIRM_PASSWORD_REQUIRED = "Mật khẩu xác nhận không được để trống";

    private UserValidationMessage() {
    }
}
